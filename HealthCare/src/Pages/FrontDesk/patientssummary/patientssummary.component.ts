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
import { LoaderComponent } from '../../loader/loader.component';
import { A11yModule } from '@angular/cdk/a11y';
import { Router } from '@angular/router';
import { finalize, Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ToastService } from '../../../auth/Toaster/toast.service';
import { LoaderService } from '../../../Interfaces/loader.service';
import { CenterServiceService } from '../../../auth/Center/center-service.service';
import { PatientService } from '../../../auth/FrontDesk/patient.service';
import { RefreshPageService } from '../../../auth/Shared/refresh-page.service';
import { CenterResponse } from '../../../Interfaces/CenterMaster/CenterResponse';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import moment, { Moment } from 'moment';


@Component({
  selector: 'app-patientssummary',
  standalone: true,
 imports: [
  MatTableModule,
  MatPaginatorModule,
  CommonModule,
  MatCardModule,
  MatListModule,
  MatIconModule,
  MatButtonModule,
  NgxDatatableModule,
  MatSortModule,
  MatFormFieldModule,
  MatInputModule,
  NgxPaginationModule,
  ReactiveFormsModule,
  LoaderComponent,
  A11yModule,
  NgxDaterangepickerMd   // ✅ ONLY THIS
],
  templateUrl: './patientssummary.component.html',
  styleUrl: './patientssummary.component.css'
})

export class PatientssummaryComponent {
 router  =  inject(Router);
    loading$!: Observable<boolean>;
    partnerId: string |any;
    empStatus:any;
    department:string|any;
    employeeName:string|any;
    loggedInUserId: string |any;
    loggedInUserName: string |any;
    p: number = 1; // current page
    totalItems: number =0; // total number of items, for example
    itemsPerPage: number = 10; // items per page
    IsNoRecordFound=false;
    IsRecordFound=false;
    sortColumn = '';
    sortDirection = 'asc';
    // Filter criteria
    filterTest: string = '';
    patientSummaryForm!:FormGroup;
    filteredData: any[] = []; // Data array for the table
    centerStatus:string|any;
    SeachByNameOrCode:string|any;
    centerApiResponse:Observable<CenterResponse>| any;
    patientSummaryResponse:Observable<CenterResponse>| any;
    barcode:string|any|null;
    startDate:Date|any|null;
    endDate:Date|any|null;
    patientName:string|any|null;
    visitId:number|any|null;
    centerCode:string|any|null;
    status:string|any|null;    
    patientCode:string|any|null; 
    dateForm!: FormGroup;
    start: Date = new Date();
    end: Date = new Date();
    displayPeriod: string = '';

     constructor(
        private formBuilder: FormBuilder,
        public dialog: MatDialog,
        private loaderService: LoaderService,
        private toasterService: ToastService,
        private centerService:CenterServiceService,
        private patientService:PatientService,
        private refPageService:RefreshPageService,
    
        )
        {
          this.loading$ = this.loaderService.loading$;
          this.partnerId= localStorage.getItem('partnerId');  
          this.loggedInUserId= localStorage.getItem('userId'); 
          this.loggedInUserName= localStorage.getItem('username');  // Get stored
        }

    ngOnInit(): void {
        this.patientSummaryForm = this.formBuilder.group({
          Barcode: [''],
          DateRange: [{ startDate: moment(), endDate: moment() }],
          startDate: [''],
          endDate: [''],
          PatientName: [''],  
          PatientCode: [''],
          ddlCenter: [''],
          ddlStatus: [''],
          filterPatientSummary: [''],
            
      });

      this.loadAllCenterRecords();
      this.loadPatientSummary();

       // ✅ Subscribe after form initialized
     this.patientSummaryForm.get('filterPatientSummary')?.valueChanges.subscribe(value => {
        this.filterPatientDetails(value);
      });

  }


      setDateRange(period: string): void {
        const now = new Date();

        switch (period) {
          case 'today':
            this.start = new Date();
            this.end = new Date();
            break;
          case 'yesterday':
            this.start = new Date(now);
            this.start.setDate(this.start.getDate() - 1);
            this.end = new Date(this.start);
            break;
          case 'last7':
            this.start = new Date(now);
            this.end = new Date(now);
            this.start.setDate(this.end.getDate() - 6);
            break;
          case 'last30':
            this.start = new Date(now);
            this.end = new Date(now);
            this.start.setDate(this.end.getDate() - 29);
            break;
          case 'thisMonth':
            this.start = new Date(now.getFullYear(), now.getMonth(), 1);
            this.end = new Date();
            break;
          case 'lastMonth':
            this.start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            this.end = new Date(now.getFullYear(), now.getMonth(), 0);
            break;
          default:
            this.start = new Date();
            this.end = new Date();
            break;
        }

        // Update the form control with Moment objects
        this.patientSummaryForm.get('DateRange')?.setValue({
          startDate: moment(this.start),
          endDate: moment(this.end)
        });

      }
      
        ranges: any = {
          Today: [moment(), moment()],
          Yesterday: [moment().subtract(1, 'day'), moment().subtract(1, 'day')],
          'Last 7 Days': [moment().subtract(6, 'day'), moment()],
          'Last 30 Days': [moment().subtract(29, 'day'), moment()],
          'This Month': [moment().startOf('month'), moment().endOf('month')],
          'Last Month': [
            moment().subtract(1, 'month').startOf('month'),
            moment().subtract(1, 'month').endOf('month')
          ]
        };


        onDateApply(event: any) {
          debugger;
          this.startDate = event.startDate.format('YYYY-MM-DD');
          this.endDate = event.endDate.format('YYYY-MM-DD');

          console.log('Start Date:', this.startDate);
          console.log('End Date:',  this.endDate);

        }

     
       
   



// Button click handler
pickLatestDate() {
  const dateRange = this.patientSummaryForm.get('DateRange')?.value;

  if (dateRange && dateRange.startDate && dateRange.endDate) {
    // These are Moment objects
    const startMoment = dateRange.startDate;
    const endMoment = dateRange.endDate;

    // Save in YYYY-MM-DD format for API
    this.startDate = startMoment.format('YYYY-MM-DD');
    this.endDate = endMoment.format('YYYY-MM-DD');

    console.log('Latest Start Date:', this.startDate);
    console.log('Latest End Date:', this.endDate);
  } else {
    // If nothing is selected, pick today
    this.startDate = moment().format('YYYY-MM-DD');
    this.endDate = moment().format('YYYY-MM-DD');
  }
}




  /// Load All Center Records
       loadAllCenterRecords() {
        debugger;
        this.loaderService.show();
      
        this.centerStatus = '';
        this.SeachByNameOrCode = '';
      
        this.centerService.getAllCenters(this.partnerId, this.centerStatus, this.SeachByNameOrCode)
          .pipe(
            finalize(() => {
              // ✅ Always hides the loader no matter what happens (success or error)
              this.loaderService.hide();
            })
          )
          .subscribe({
            next: (response: any) => {
              debugger;
              if (response?.status && response?.statusCode === 200) {
                this.centerApiResponse = response.data;
                console.log(this.centerApiResponse);
              } else {
                this.toasterService.showToast('No Record Found!', 'error');
                console.warn('No Record Found!');
              }
            },
            error: (err) => {
               this.toasterService.showToast('Error while fetching centers!', 'error');
              console.error('Error while fetching centers:', err);
            }
          });
      }

         /// Load All Center Records
       loadPatientSummary() {
        debugger;
        this.pickLatestDate();
        this.loaderService.show();
      
        this.barcode = this.patientSummaryForm.get('Barcode')?.value || null;
       const dateRange = this.patientSummaryForm.get('DateRange')?.value;

        const startDate = this.start;

        const endDate = this.end;
         
        this.patientName = this.patientSummaryForm.get('PatientName')?.value || null;
        this.patientCode = this.patientSummaryForm.get('PatientCode')?.value || null;
        this.centerCode = this.patientSummaryForm.get('ddlCenter')?.value || null;
        this.status = this.patientSummaryForm.get('ddlStatus')?.value || null;
        
        this.patientService.getPatientSummary(this.barcode, this.startDate, this.endDate, this.patientName,
         this.patientCode, this.centerCode, this.status, this.partnerId)
          .pipe(
            finalize(() => {
              // ✅ Always hides the loader no matter what happens (success or error)
              this.loaderService.hide();
            })
          )
          .subscribe({
            next: (response: any) => {
              debugger;
              if (response?.status && response?.statusCode === 200) {
                this.IsRecordFound=true;
                this.IsNoRecordFound=false;
                this.patientSummaryResponse = response.data;
                console.log(this.patientSummaryResponse);
              } else {
                 this.IsRecordFound=false;
                this.IsNoRecordFound=true;
                this.toasterService.showToast('No Record Found!', 'error');
                console.warn('No Record Found!');
              }
            },
            error: (err) => {
                this.IsRecordFound=false;
                this.IsNoRecordFound=true;
               this.toasterService.showToast('Error while fetching centers!', 'error');
              console.error('Error while fetching centers:', err);
            }
          });
      }

  ///used to filter the data from grid/table
    filterPatientDetails(searchTerm: string) {
    debugger;
      this.filteredData = this.patientSummaryResponse.filter((item: 
      { 
        woeDate: any; centerrName: any; centerCode: any; patientName: any; referredBy: any; patientCode:any;
        visitId: any; barcode: any; specimenType: any; testRequested: any; billAmount: any; receivedAmount: any; 
        registrationStatus: any; }) =>
      (item.woeDate ?? '').toString().toLowerCase().includes(searchTerm) ||
      (item.centerrName ?? '').toLowerCase().includes(searchTerm) ||
      (item.centerCode ?? '').toLowerCase().includes(searchTerm) ||
      (item.patientName ?? '').toLowerCase().includes(searchTerm) ||
      (item.referredBy ?? '').toLowerCase().includes(searchTerm) ||
      (item.patientCode ?? '').toLowerCase().includes(searchTerm) ||
      (item.visitId ?? '').toString().includes(searchTerm) ||
      (item.barcode ?? '').toLowerCase().includes(searchTerm) ||
      (item.specimenType ?? '').toLowerCase().includes(searchTerm) ||
      (item.testRequested ?? '').toLowerCase().includes(searchTerm) ||
      (item.billAmount ?? '').toString().includes(searchTerm) ||
      (item.receivedAmount ?? '').toString().includes(searchTerm) ||
      (item.registrationStatus ?? '').toLowerCase().includes(searchTerm)
    );
     debugger;
    this.patientSummaryResponse= this.filteredData;
    if(searchTerm==""){
      this.ngOnInit();
    }
  }      
    
}
