import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
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
import { ToastComponent } from '../../../Toaster/toast/toast.component';
import { Router } from '@angular/router';
import { finalize, forkJoin, Observable } from 'rxjs';
import { ProjectResponse } from '../../../../Interfaces/Projects/project-response';
import { ProjectSpecialRateResponse } from '../../../../Interfaces/Projects/project-special-rate-response';
import { MatDialog } from '@angular/material/dialog';
import { LoaderService } from '../../../../Interfaces/loader.service';
import { ToastService } from '../../../../auth/Toaster/toast.service';
import { ProjectService } from '../../../../auth/ProjectMaster/project.service';
import * as XLSX from 'xlsx';
import { ProjectTestMappingRequest } from '../../../../Interfaces/Projects/project-test-mapping-request';

@Component({
  selector: 'app-project-spl-rates',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, CommonModule, MatCardModule,
      MatListModule, MatIconModule, MatButtonModule, NgxDatatableModule, MatSortModule,
      MatFormFieldModule, MatInputModule, NgxPaginationModule,
      ReactiveFormsModule, LoaderComponent, A11yModule,ToastComponent ],
  templateUrl: './project-spl-rates.component.html',
  styleUrl: './project-spl-rates.component.css'
})
export class ProjectSplRatesComponent {
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
    projectSpecialRateForm!:FormGroup;
    projectApiResponse:Observable<ProjectResponse>| any;
    projectCustomRateResponse: Observable<ProjectSpecialRateResponse>| any;
    optype:string=''; // To check the operation type i.e. Add or Edit 
    projectId:number|any; // to store the Project Id when we are going to featch the project rates details
    testCode:string|any; // To store the test code when we are going to edit the center details
    filterRates: any[] = []; // Data array for the table
    amountForDiscount:any;
    testAgreedRate: any;
    projectMappingRequest: ProjectTestMappingRequest={
      mappingId: 0,
      projectId: 0,
      partnerId: '',
      testCode: '',
      billRate: 0
    };

    constructor(
      private formBuilder: FormBuilder,
      public dialog: MatDialog,
      private loaderService: LoaderService,
      private toasterService: ToastService,
      private projectService:ProjectService
    ) {
      this.loading$ = this.loaderService.loading$;
      this.partnerId = localStorage.getItem('partnerId');
    }

       /// Initialize the component and load all centers
  ngOnInit(): void {
  this.IsRecordFound = false;
   this.loggedInUserId=localStorage.getItem('userId');
  // ✅ Define all form controls once here
    this.projectSpecialRateForm = this.formBuilder.group({
      ddlProjects: [''],
      ddlMappingType: [''],
      testPrrofile: [''],
      testProfileDiscount: [''],
      filterProjectRates: [''],
      testAgreedRate: this.formBuilder.array([])  // ← MUST be here
    });

  // ✅ Subscribe after form initialized
  this.projectSpecialRateForm.get('filterProjectRates')?.valueChanges.subscribe(value => {
    this.filterProjectCustomRates(value);
  });
  this.IsNoRecordFound = true;
  this.loadProjectData();

}

   /// used to load and Serach the Project Data
   loadProjectData() {
  debugger;
  this.loaderService.show(); // ✅ Show loader at start

  this.centerStatus = '';
  this.SeachByNameOrCode ='';

  this.projectService
    .getAllProjects(this.partnerId, this.centerStatus, this.SeachByNameOrCode)
    .pipe(
      finalize(() => {
        // ✅ Always hide loader once API completes (success or error)
        this.loaderService.hide();
      })
    )
    .subscribe({
      next: (response: any) => {
        debugger;
        if (response?.status && response?.statusCode === 200) {
          this.projectApiResponse = response.data;
          console.log(this.projectApiResponse);
        } else {
          console.warn('No Record Found!');
        }
      },
      error: (err) => {
        console.error('Error while fetching profiles:', err);
      },
    });
}

/// used to initilize Agreed Rate from Array
initAgreedRateFormArray() {
  const formArray = this.projectSpecialRateForm.get('testAgreedRate') as FormArray;
  formArray.clear();

  this.projectCustomRateResponse.forEach(() => {
    formArray.push(new FormControl('0.00'));  // or empty control
  });
}

/// used to search the Project Rates
onSearchProjectRates() {
   debugger;
  this.loaderService.show();

  this.centerStatus = '';
  this.SeachByNameOrCode = '';
  this.optype = this.projectSpecialRateForm.get('ddlMappingType')?.value;
  this.projectId = this.projectSpecialRateForm.get('ddlProjects')?.value;
  this.testCode = this.projectSpecialRateForm.get('testPrrofile')?.value;

  this.projectService
    .getAllProjectSpecialRates(this.optype, this.projectId, this.partnerId, this.testCode)
    .pipe(
      finalize(() => {
        // ✅ Always hides the loader (even if API fails)
        this.loaderService.hide();
      })
    )
    .subscribe({
      next: (response: any) => {
        debugger;
        if (response?.status && response?.statusCode === 200) {
          this.projectCustomRateResponse = response.data;
          this.IsNoRecordFound = false;
          this.IsRecordFound = true;
          this.initAgreedRateFormArray();

          if (this.optype === 'RetrieveMapping') {
            const agreedRateArray = this.projectSpecialRateForm.get('testAgreedRate') as FormArray;
            this.projectCustomRateResponse.forEach((item: any, index: number) => {
              const customRate = item.specialRate && item.specialRate !== '' ? parseFloat(item.specialRate) : 0;
              if (customRate > 0) {
                item.agreedRate = customRate.toFixed(2);
                agreedRateArray.at(index).setValue(item.specialRate);
              } else {
                item.agreedRate = '0.00';
                agreedRateArray.at(index).setValue(item.specialRate);
              }
            });
          }

          console.log(this.projectCustomRateResponse);
        } else {
          this.IsNoRecordFound = true;
          this.IsRecordFound = false;
          console.warn('No Record Found!');
        }
      },
      error: (err) => {
        this.IsNoRecordFound = true;
        this.IsRecordFound = false;
        console.error('Error while fetching profiles:', err);
      }
    });
}


/// used to filter the project custom rates based on the search term
filterProjectCustomRates(term: string) {
  debugger;
  const searchTerm = term ? term.toLowerCase() : '';
  
  this.filterRates = this.projectCustomRateResponse.filter((item: any) => {
    const testCode = (item.testCode || '').toString().toLowerCase();
    const testName = (item.testName || '').toString().toLowerCase();
    const mrp = (item.mrp || '').toString().toLowerCase();

    return (
      testCode.includes(searchTerm) ||
      testName.includes(searchTerm) ||
      mrp.includes(searchTerm)
    );
  });

  this.projectCustomRateResponse = this.filterRates;

  if (!term) {
    this.onSearchProjectRates();
  }
}

  /// used to export the data to excel
  exportToExcel(): void {
    debugger;
  this.optype = this.projectSpecialRateForm.get('ddlMappingType')?.value;
  this.projectId = this.projectSpecialRateForm.get('ddlProjects')?.value;
  this.testCode = this.projectSpecialRateForm.get('testPrrofile')?.value;
  this.projectService.getAllProjectSpecialRates(this.optype, this.projectId, this.partnerId, this.testCode)
  .subscribe({
    next: (response: any) => {
      debugger;
      if (response?.status && response?.statusCode === 200) {
        this.projectCustomRateResponse = response.data;
        this.IsNoRecordFound = false;
        this.IsRecordFound = true;
        console.log(this.projectCustomRateResponse);

        if (!this.projectCustomRateResponse || this.projectCustomRateResponse.length === 0) {
            alert('No data available for export. Please load the data first.');
            return;
          }

        // ✅ Auto export to Excel
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.projectCustomRateResponse);
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'CentreRates');
      XLSX.writeFile(wb, 'ProjectCustomRates.xlsx');
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

/// used to apply the test rates discounts
applyDiscount(): void {
  debugger;
  const discount = parseFloat(this.projectSpecialRateForm.value.testProfileDiscount) || 0;
  const agreedRateArray = this.projectSpecialRateForm.get('testAgreedRate') as FormArray;

  this.projectCustomRateResponse.forEach((item: any, index: number) => {
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

   this.loaderService.show();   // 🔥 Start loader

  const discount = parseFloat(this.projectSpecialRateForm.value.testProfileDiscount) || 0;

  const requests = this.projectCustomRateResponse
    .map((item: any) => {
      const mrp = item.mrp ? parseFloat(item.mrp) : 0;
      const discountedAmount = mrp - (mrp * (discount / 100));
      const agreedRate = discountedAmount.toFixed(2);

      this.projectId = this.projectSpecialRateForm.get('ddlProjects')?.value;

      // Validate
      if (this.projectId == 0 || !this.partnerId || !item.testcode) {
        const message = `Missing required data for item: ${JSON.stringify(item)}`;
        this.toasterService.showToast(message, 'error');
        return null;
      }

      this.projectMappingRequest = {
        mappingId: item.mappingId,
        projectId: this.projectId,
        partnerId: this.partnerId,
        testCode: item.testcode,
        billRate: parseFloat(agreedRate)
      };

      return this.projectService.updateProjectRatesDetails(this.projectMappingRequest);
    })
    .filter((req: null) => req !== null); // Remove null requests


  if (requests.length === 0) {
    this.loaderService.hide();  // ❌ Turn OFF loader
    this.toasterService.showToast('No valid test data found', 'error');
    return;
  }

  forkJoin(requests).subscribe({
    next: (responses) => {
      console.log('All updates complete:', responses);
      this.toasterService.showToast('All test rates updated successfully', 'success');
     this.loaderService.hide(); // 🔥 Turn OFF loader
    },
    error: (err) => {
      console.error('One or more updates failed:', err);
      this.toasterService.showToast('Some test updates failed, test mrp should not be zero', 'error');
       this.loaderService.hide();  // 🔥 Turn OFF loader even on error
    }
  });
}


}
