import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
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
import { A11yModule } from '@angular/cdk/a11y';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CenterServiceService } from '../../../../auth/Center/center-service.service';
import { MatDialog } from '@angular/material/dialog';
import { LoaderService } from '../../../../Interfaces/loader.service';
import { ToastService } from '../../../../auth/Toaster/toast.service';
import { CenterResponse } from '../../../../Interfaces/CenterMaster/CenterResponse';
import { CentreCustomRateResponse } from '../../../../Interfaces/CenterMaster/CentreCustomRateResponse';
import * as XLSX from 'xlsx';
import { ToastComponent } from "../../../Toaster/toast/toast.component";


@Component({
  selector: 'app-centre-spl-rates',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, CommonModule, MatCardModule,
    MatListModule, MatIconModule, MatButtonModule, NgxDatatableModule, MatSortModule,
    MatFormFieldModule, MatInputModule, NgxPaginationModule,
    ReactiveFormsModule, LoaderComponent, A11yModule,ToastComponent ],
  templateUrl: './centre-spl-rates.component.html',
  styleUrl: './centre-spl-rates.component.css'
})
export class CentreSplRatesComponent {
    router  =  inject(Router);
    loading$!: Observable<boolean>;
    partnerId: string |any;
    centerStatus:string|any;
    SeachByNameOrCode:string|any;
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
    searchCentreRateForm!: FormGroup;
    CentreSpecialRateForm!:FormGroup;
    centerApiResponse:Observable<CenterResponse>| any;
    centerCustomRateResponse:Observable<CentreCustomRateResponse>| any; 
    optype:string=''; // To check the operation type i.e. Add or Edit 
    centerCode:string|any; // To store the center code when we are going to edit the center details
    testCode:string|any; // To store the test code when we are going to edit the center details
    filterRates: any[] = []; // Data array for the table
    amountForDiscount:any;

      constructor(private centerService: CenterServiceService,private formBuilder: FormBuilder,
        public dialog: MatDialog,private loaderService: LoaderService,private toasterService: ToastService){
          this.loading$ = this.loaderService.loading$;
          this.partnerId= localStorage.getItem('partnerId');
          /// Started to search the tests details by using test terms
             this.CentreSpecialRateForm = this.formBuilder.group({
              ddlCentres: [''],
              ddlMappingType: [''],
              testPrrofile: [''],
              testProfileDiscount: [''],
              importRatesFileName: [''],
              filterCentreRates: [''],
              testAgreedRate: [''],
              rates: this.formBuilder.array([]),
            });
         
          this.CentreSpecialRateForm.get('filterCentreRates')?.valueChanges.subscribe(value => {
           this.filterCenterCustomRates(value);
          });
          /// Ended to search the tests details by using test terms
        }

   /// Initialize the component and load all centers
    ngOnInit(): void {
    this.IsRecordFound=false;
    this.LoadAllCentres();

    }

    /// used to load all the centers based on the search criteria
    LoadAllCentres(){
    debugger;
    this.loaderService.show();
    this.centerStatus='';
    this.SeachByNameOrCode='';
    this.centerService.getAllCenters(this.partnerId,this.centerStatus,this.SeachByNameOrCode).subscribe({
      next: (response: any) => {
        debugger;

        if (response?.status && response?.statusCode === 200) {
          this.centerApiResponse = response.data; 
          this.IsNoRecordFound = false;
          console.log(this.centerApiResponse);
        } else {
          this.IsNoRecordFound = true;
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

/// used to load all the center special rates based on the search criteria
    loadAllCentresCustomRate(){
    debugger;
    this.loaderService.show();
    this.centerStatus='';
    this.SeachByNameOrCode='';
    this.optype=this.CentreSpecialRateForm.get('ddlMappingType')?.value;
    this.centerCode=this.CentreSpecialRateForm.get('ddlCentres')?.value;
    this.testCode=this.CentreSpecialRateForm.get('testPrrofile')?.value;
    this.centerService.getCentreCustomRate(this.optype,this.centerCode,this.partnerId,this.testCode).subscribe({
      next: (response: any) => {
        debugger;
        if (response?.status && response?.statusCode === 200) {
          this.centerCustomRateResponse = response.data;
          this.IsNoRecordFound = false;
          this.IsRecordFound=true;
          console.log(this.centerCustomRateResponse);
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


  /// used to export the data to excel
  exportToExcel(): void {
    debugger;
  this.optype=this.CentreSpecialRateForm.get('ddlMappingType')?.value;
  this.centerCode=this.CentreSpecialRateForm.get('ddlCentres')?.value;
  this.testCode=this.CentreSpecialRateForm.get('testPrrofile')?.value;
  this.centerService.getCentreCustomRate(this.optype, this.centerCode, this.partnerId, this.testCode)
  .subscribe({
    next: (response: any) => {
      debugger;
      if (response?.status && response?.statusCode === 200) {
        this.centerCustomRateResponse = response.data;
        this.IsNoRecordFound = false;
        this.IsRecordFound = true;
        console.log(this.centerCustomRateResponse);

        if (!this.centerCustomRateResponse || this.centerCustomRateResponse.length === 0) {
            alert('No data available for export. Please load the data first.');
            return;
          }

        // ✅ Auto export to Excel
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.centerCustomRateResponse);
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'CentreRates');
      XLSX.writeFile(wb, 'CentreCustomRates.xlsx');
      } else {
        this.IsNoRecordFound = true;
        this.IsRecordFound = false;
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

}

/// used to filter the center custom rates based on the search term
filterCenterCustomRates(term: string) {
  debugger;
  const searchTerm = term ? term.toLowerCase() : '';
  
  this.filterRates = this.centerCustomRateResponse.filter((item: any) => {
    const testCode = (item.testCode || '').toString().toLowerCase();
    const testName = (item.testName || '').toString().toLowerCase();
    const mrp = (item.mrp || '').toString().toLowerCase();

    return (
      testCode.includes(searchTerm) ||
      testName.includes(searchTerm) ||
      mrp.includes(searchTerm)
    );
  });

  this.centerCustomRateResponse = this.filterRates;

  if (!term) {
    this.loadAllCentresCustomRate();
  }
}

}
