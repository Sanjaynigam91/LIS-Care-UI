import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
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
import { forkJoin } from 'rxjs';
import { CenterRatesRequest } from '../../../../Interfaces/CenterMaster/center-rates-request';
import { ClientResponse } from '../../../../Interfaces/ClientMaster/client-response';
import { ClientService } from '../../../../auth/ClientMaster/client.service';
import { ClientCustomRateResponse } from '../../../../Interfaces/ClientMaster/client-custom-rate-response';
import { ClientRatesRequest } from '../../../../Interfaces/ClientMaster/client-rates-request';

@Component({
  selector: 'app-client-spl-rates',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, CommonModule, MatCardModule,
      MatListModule, MatIconModule, MatButtonModule, NgxDatatableModule, MatSortModule,
      MatFormFieldModule, MatInputModule, NgxPaginationModule,
      ReactiveFormsModule, LoaderComponent, A11yModule,ToastComponent ],
  templateUrl: './client-spl-rates.component.html',
  styleUrl: './client-spl-rates.component.css'
})
export class ClientSplRatesComponent {
router  =  inject(Router);
    loading$!: Observable<boolean>;
    partnerId: string |any;
    clientStatus:string|any;
    seachBy:string|any;
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
    ClientSpecialRateForm!:FormGroup;
    clientApiResponse:Observable<ClientResponse>| any;
    centerCustomRateResponse:Observable<CentreCustomRateResponse>| any; 
    clientCustomRateResponse:Observable<ClientCustomRateResponse>|any;
    optype:string=''; // To check the operation type i.e. Add or Edit 
    centerCode:string|any; // To store the center code when we are going to edit the center details
    testCode:string|any; // To store the test code when we are going to edit the center details
    filterRates: any[] = []; // Data array for the table
    amountForDiscount:any;
    clientCode:any;
    clientRateRequest:ClientRatesRequest={
      clientCode: '',
      partnerId: '',
      testCode: '',
      billRate: ''
    }

    @ViewChild('fileInput') fileInput: ElementRef<HTMLInputElement> | undefined;
    excelData: any[] = [];

  constructor(
  private centerService: CenterServiceService,
  private formBuilder: FormBuilder,
  public dialog: MatDialog,
  private loaderService: LoaderService,
  private toasterService: ToastService,
  private clientService:ClientService
) {
  this.loading$ = this.loaderService.loading$;
  this.partnerId = localStorage.getItem('partnerId');
}

   /// Initialize the component and load all centers
  ngOnInit(): void {
  this.IsRecordFound = false;
   this.loggedInUserId=localStorage.getItem('userId');
  // ✅ Define all form controls once here
  this.ClientSpecialRateForm = this.formBuilder.group({
    ddlClients: [''],
    ddlMappingType: [''],
    testPrrofile: [''],
    testProfileDiscount: [''],
    importRatesFileName: [''],
    filterCentreRates: [''], // <-- keep this here!
    testAgreedRate: this.formBuilder.array([]) // FormArray for agreed rates
  });

  // ✅ Subscribe after form initialized
  this.ClientSpecialRateForm.get('filterCentreRates')?.valueChanges.subscribe(value => {
    this.filterCenterCustomRates(value);
  });

  this.LoadAllClients();

}
/// used to initilize Agreed Rate from Array
  initAgreedRateFormArray(): void {
  const agreedRateArray = this.ClientSpecialRateForm.get('testAgreedRate') as FormArray;
  agreedRateArray.clear();

  if (Array.isArray(this.clientCustomRateResponse) && this.clientCustomRateResponse.length > 0) {
    this.clientCustomRateResponse.forEach((item: any) => {
      agreedRateArray.push(new FormControl(item.agreedRate || ''));
    });
  }
}

    /// used to load all the centers based on the search criteria
    LoadAllClients(){
    debugger;
    this.loaderService.show();
    this.clientStatus='';
    this.seachBy='';
    this.centerCode='';
    this.clientService.getAllClients(this.clientStatus,this.partnerId,this.seachBy,this.centerCode).subscribe({
      next: (response: any) => {
        debugger;

        if (response?.status && response?.statusCode === 200) {
          this.clientApiResponse = response.data; 
          this.IsNoRecordFound = false;
          console.log(this.clientApiResponse);
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
    loadAllClientCustomRate(){
    debugger;
    this.loaderService.show();
    this.optype=this.ClientSpecialRateForm.get('ddlMappingType')?.value;
    this.clientCode=this.ClientSpecialRateForm.get('ddlClients')?.value;
    this.testCode=this.ClientSpecialRateForm.get('testPrrofile')?.value;
    this.clientService.getClientCustomRate(this.optype,this.clientCode,this.partnerId,this.testCode).subscribe({
      next: (response: any) => {
        debugger;
        if (response?.status && response?.statusCode === 200) {
          this.clientCustomRateResponse = response.data;
          this.IsNoRecordFound = false;
          this.IsRecordFound=true;
          this.initAgreedRateFormArray();
          if(this.optype=='RetrieveClientConfirmedRates')
          {
            debugger;
            const agreedRateArray = this.ClientSpecialRateForm.get('testAgreedRate') as FormArray;
            this.clientCustomRateResponse.forEach((item: any, index: number) => {
             const customRate = item.customRate && item.customRate !== '' ? parseFloat(item.customRate) : 0;
              if (customRate > 0) {
               item.agreedRate = customRate.toFixed(2);
                // ✅ Update corresponding FormControl for this test
                agreedRateArray.at(index).setValue(item.agreedRate);
              } else {
                item.agreedRate = '0.00';
                agreedRateArray.at(index).setValue(item.agreedRate);
              }
            });
          }
          

          console.log(this.clientCustomRateResponse);
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
  this.optype=this.ClientSpecialRateForm.get('ddlMappingType')?.value;
  this.clientCode=this.ClientSpecialRateForm.get('ddlClients')?.value;
  this.testCode=this.ClientSpecialRateForm.get('testPrrofile')?.value;
  this.clientService.getClientCustomRate(this.optype, this.clientCode, this.partnerId, this.testCode)
  .subscribe({
    next: (response: any) => {
      debugger;
      if (response?.status && response?.statusCode === 200) {
        this.clientCustomRateResponse = response.data;
        this.IsNoRecordFound = false;
        this.IsRecordFound = true;
        console.log(this.clientCustomRateResponse);

        if (!this.clientCustomRateResponse || this.clientCustomRateResponse.length === 0) {
            alert('No data available for export. Please load the data first.');
            return;
          }

        // ✅ Auto export to Excel
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.clientCustomRateResponse);
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'ClientSpecialRates');
      XLSX.writeFile(wb, 'ClientCustomRates.xlsx');
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
  
  this.filterRates = this.clientCustomRateResponse.filter((item: any) => {
    const testCode = (item.testCode || '').toString().toLowerCase();
    const testName = (item.testName || '').toString().toLowerCase();
    const mrp = (item.mrp || '').toString().toLowerCase();

    return (
      testCode.includes(searchTerm) ||
      testName.includes(searchTerm) ||
      mrp.includes(searchTerm)
    );
  });

  this.clientCustomRateResponse = this.filterRates;

  if (!term) {
    this.loadAllClientCustomRate();
  }
}

/// used to apply the test rates discounts
applyDiscount(): void {
  debugger;
  const discount = parseFloat(this.ClientSpecialRateForm.value.testProfileDiscount) || 0;
  const agreedRateArray = this.ClientSpecialRateForm.get('testAgreedRate') as FormArray;

  this.clientCustomRateResponse.forEach((item: any, index: number) => {
    const mrp = item.mrp && item.mrp !== '' ? parseFloat(item.mrp) : 0;

    if (mrp > 0) {
      const discountedAmount = mrp - (mrp * (discount / 100));
      item.agreedRate = discountedAmount.toFixed(2);

      // ✅ Update corresponding FormControl for this test
      agreedRateArray.at(index).setValue(item.agreedRate);
    } else {
      item.agreedRate = '0.00';
      agreedRateArray.at(index).setValue(item.agreedRate);
    }
  });
}

updateAllTestRates(): void {
  debugger;
  const discount = parseFloat(this.ClientSpecialRateForm.value.testProfileDiscount) || 0;

  const requests = this.clientCustomRateResponse.map((item: any) => {
    const mrp = item.mrp ? parseFloat(item.mrp) : 0;
    const discountedAmount = mrp - (mrp * (discount / 100));
    const agreedRate = discountedAmount.toFixed(2);

    this.clientCode=this.ClientSpecialRateForm.get('ddlClients')?.value;
  // ✅ Check for missing data
    if (!this.clientCode || !this.partnerId || !item.testCode) {
      const message = `Missing required data for item: ${JSON.stringify(item)}`;
      this.toasterService.showToast(message, 'error');
      return null;
    }


    this.clientRateRequest = {
      clientCode: this.clientCode,
      partnerId: this.partnerId,
      testCode: item.testCode,
      billRate: agreedRate,
      createdBy:this.loggedInUserId,
      updatedBy:this.loggedInUserId
    };

    console.log('Sending payload:', this.clientRateRequest);
    return this.clientService.updateClientTestRate(this.clientRateRequest);
  }).filter((req: null) => req !== null); // remove any null entries

  if (requests.length === 0) {
    this.toasterService.showToast('No valid test data found', 'error');
    return;
  }

  forkJoin(requests).subscribe({
    next: (responses) => {
      console.log('✅ All updates complete:', responses);
      this.toasterService.showToast('All test rates updated successfully', 'success');
    },
    error: (err) => {
      console.error('❌ One or more updates failed:', err);
      this.toasterService.showToast('Some test updates failed,test mrp should not be zero', 'error');
    }
  });
}

 // ✅ Read Excel File
  onFileSelected(event: any) {
     const file = event.target.files[0];
    if (!file) return;
    else {
      const reader = new FileReader();
      reader.readAsBinaryString(file);
      reader.onload = (e: any) => {
        const wb = XLSX.read(e.target.result, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        this.excelData = XLSX.utils.sheet_to_json(ws);
        console.log('Excel Data:', this.excelData);
      };
    }
  }

  uploadClientRates() {
    debugger;
  if (!this.excelData || this.excelData.length === 0) {
    this.toasterService.showToast('Please select an Excel file first.', 'error');
    return;
  }

  const results: { testCode: string; status: string; message: string }[] = [];

  this.excelData.forEach((row: any) => {
    // Map Excel columns to API request
    const clientRatesRequest: ClientRatesRequest = {
      clientCode: row.clientCode?.toString().trim(),
      partnerId: this.partnerId,
      testCode: row.testCode?.toString().trim(), // Adjust according to Excel headers
      billRate: row.customRate?.toString().trim(),
      createdBy: this.loggedInUserId,
      updatedBy: this.loggedInUserId,
    };

    console.log('Sending payload:', clientRatesRequest);

    // Call API for each row
    this.clientService.ImportClientRates(clientRatesRequest).subscribe({
      next: (res: any) => {
        debugger;
        // Assuming API returns { isSuccess: boolean, errorMsg: string }
        if (res.isSuccess) {
          results.push({
            testCode: clientRatesRequest.testCode,
            status: 'Success',
            message: res.errorMsg || 'Rate updated successfully',
            
          });
        } else {
          results.push({
            testCode: clientRatesRequest.testCode,
            status: 'Failed',
            message: res.errorMsg || 'Error updating rate',
          });
        }
      },
      error: (err) => {
        results.push({
          testCode: clientRatesRequest.testCode,
          status: 'Failed',
          message: err.message || 'Server error',
        });
      },
    });
  });

  // Optionally, after all rows processed, show a summary
  setTimeout(() => {
    console.table(results); // Shows status of each row in console
    const successCount = results.filter(r => r.status === 'Success').length;
    const failCount = results.filter(r => r.status === 'Failed').length;
    this.toasterService.showToast('Import completed. Success.', 'success');
  
  }, 3000); // delay to allow all API calls to complete (simplest approach)

   // ✅ After import, reset file input
  if (this.fileInput) {
    this.fileInput.nativeElement.value = '';
  }
  this.excelData = [];
}



}
