import { A11yModule } from '@angular/cdk/a11y';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgxPaginationModule } from 'ngx-pagination';
import { LoaderComponent } from '../../../loader/loader.component';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { LoaderService } from '../../../../Interfaces/loader.service';
import { EmployeeService } from '../../../../auth/EmployeeMaster/employee.service';
import { ToastService } from '../../../../auth/Toaster/toast.service';
import { BarcodeService } from '../../../../auth/BarcodeManager/barcode.service';
import { BarcodeResponse } from '../../../../Interfaces/BarcodeManager/barcode-response';

@Component({
  selector: 'app-barcode-manager',
  standalone: true,
 imports: [
      MatTableModule, MatPaginatorModule, CommonModule, MatCardModule,
      MatListModule, MatIconModule, MatButtonModule, NgxDatatableModule,
      MatSortModule, MatFormFieldModule, MatInputModule, NgxPaginationModule,
      ReactiveFormsModule, LoaderComponent, A11yModule
    ],
  templateUrl: './barcode-manager.component.html',
  styleUrl: './barcode-manager.component.css'
})
export class BarcodeManagerComponent {
    router  =  inject(Router);
    loading$!: Observable<boolean>;
    partnerId: string |any;
    empStatus:any;
    department:string|any;
    employeeName:string|any;
    loggedInUserId: string |any;
    p: number = 1; // current page
    totalItems: number =0; // total number of items, for example
    itemsPerPage: number = 10; // items per page
    IsNoRecordFound=false;
    IsRecordFound=false;
    sortColumn = '';
    sortDirection = 'asc';
    // Filter criteria
    filterTest: string = '';
    BarcodeForm!: FormGroup;
    filteredBarcodeData: any[] = []; // Data array for the table
    barcodeApiResponse:Observable<BarcodeResponse>|any;
    

   constructor(
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private loaderService: LoaderService,
    private toasterService: ToastService,
    private barcodeService:BarcodeService
  ){
      this.loading$ = this.loaderService.loading$;
      this.partnerId= localStorage.getItem('partnerId');     
    }

    ngOnInit(): void {
     this.BarcodeForm = this.formBuilder.group({
      BarcodeQuantity: [''],
      filteredBarcode: ['']
    }); 
      this.LoadAllBarcodes();

       // ✅ Subscribe after form initialized
     this.BarcodeForm.get('filteredBarcode')?.valueChanges.subscribe(value => {
        this.filterBarcodeDetails(value);
      });
    }

   /// used to load all the barcode details
    LoadAllBarcodes(){
    debugger;
    this.loaderService.show();
    this.barcodeService.getAllBarcodeDetails(this.partnerId).subscribe({
      next: (response: any) => {
        if (response?.status && response?.statusCode === 200) {
          debugger;
          this.barcodeApiResponse = response.data; 
          this.IsNoRecordFound = false;
          this.IsRecordFound=true;
          console.log(this.barcodeApiResponse);
        } else {
          this.IsNoRecordFound = true;
          this.IsRecordFound=false;
          console.warn("No Record Found!");
        }

        this.loaderService.hide();
      },
      error: (err) => {
        this.IsNoRecordFound = true;
        this.IsRecordFound = false;
        console.error("Error while fetching profiles:", err);
        this.loaderService.hide();
      }
    });
    this.loaderService.hide();
  }

  
  ///used to filter the data from grid/table
filterBarcodeDetails(term: string) {
  term = term.toLowerCase();
  
  this.filteredBarcodeData = this.barcodeApiResponse.filter((item: {
    generatedOn: any;
    sequenceStart: any;
    sequenceEnd: any;
    createdBy: any;
  }) => 
    (item.generatedOn?.toString().toLowerCase().includes(term)) ||
    (item.sequenceStart?.toString().toLowerCase().includes(term)) ||
    (item.sequenceEnd?.toString().toLowerCase().includes(term)) ||
    (item.createdBy?.toString().toLowerCase().includes(term))
  );

  this.barcodeApiResponse = this.filteredBarcodeData;

  if (term === "") {
    this.ngOnInit();
  }
}

// Used to generate barcodes in PDF format
generateBarcodes(sequenceStart: number, sequenceEnd: number) {
  debugger;
  this.loaderService.show();

  this.barcodeService.getBulkBarcodesPdf(sequenceStart, sequenceEnd).subscribe({
    next: (pdfBlob: Blob) => {
      if (pdfBlob.size > 0) {
        const fileURL = URL.createObjectURL(pdfBlob);
        window.open(fileURL, '_blank');
      } else {
        alert('No barcodes generated.');
      }
      this.loaderService.hide();
    },
    error: (err) => {
      console.error('Error generating barcodes:', err);
      alert('Error generating barcodes');
      this.loaderService.hide();
    }
  });
}


}
