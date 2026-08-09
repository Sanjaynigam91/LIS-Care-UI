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
import { Router, RouterLink, RouterModule } from '@angular/router';
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
import { PatientResponse } from '../../../Interfaces/Patient/patient-response';
import { ConfirmationDialogComponentComponent } from '../../confirmation-dialog-component/confirmation-dialog-component.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SampleRejectionService } from '../../../auth/Rejection/sample-rejection.service';
import { RejectedSampleResponse } from '../../../Interfaces/Patient/rejected-sample-response';

@Component({
  selector: 'app-rejectionsummary',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    NgxDatatableModule,
    NgxPaginationModule,
    LoaderComponent,
    A11yModule,

    RouterModule,
    NgxDaterangepickerMd,
    MatTooltipModule
  ],
  templateUrl: './rejectionsummary.component.html',
  styleUrl: './rejectionsummary.component.css'
})
export class RejectionsummaryComponent {
router  =  inject(Router);
    loading$!: Observable<boolean>;
    partnerId: string |any;
    empStatus:any;
    department:string|any;
    employeeName:string|any;
    loggedInUserId: string |any;
    loggedInUserName: string |any;
    loggedInAsCenterUser:string|any;
    currentUserRoleId:any;
    p: number = 1; // current page
    totalItems: number =0; // total number of items, for example
    itemsPerPage: number = 10; // items per page
    IsNoRecordFound=false;
    IsRecordFound=false;
    IsDeleteVisible=false;
    sortColumn = '';
    sortDirection = 'asc';
    // Filter criteria
    filterTest: string = '';
    rejectionSummaryForm!:FormGroup;
    filteredData: any[] = []; // Data array for the table
    centerStatus:string|any;
    SeachByNameOrCode:string|any;
    centerApiResponse:Observable<CenterResponse>| any;
    rejectionSummaryResponse:Observable<RejectedSampleResponse>| any;
    barcode:string|any|null;
    startDate:Date|any|null;
    endDate:Date|any|null;
    patientNameOrCode:string|any|null;
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
        private rejectionService:SampleRejectionService
        )
        {
          this.loading$ = this.loaderService.loading$;
          this.partnerId= localStorage.getItem('partnerId');  
          this.loggedInUserId= localStorage.getItem('userId'); 
          this.loggedInUserName= localStorage.getItem('username');  // Get stored
          this.loggedInAsCenterUser= localStorage.getItem('centerCode');  // Get stored
          this.currentUserRoleId= localStorage.getItem('roleId');
        }

    ngOnInit(): void {
        this.rejectionSummaryForm = this.formBuilder.group({
          Barcode: [''],
          DateRange: [{ startDate: moment(), endDate: moment() }],
          startDate: [''],
          endDate: [''],
          PatientNameOrCode: [''],  
          PatientCode: [''],
          ddlCenter: [''],
          ddlStatus: [''],
          filterPatientSummary: [''],
            
      });

      if(this.currentUserRoleId==2){
        this.IsDeleteVisible=true;
      }
      else{
        this.IsDeleteVisible=false;
      }

      this.loadAllCenterRecords();
      this.loadRejectionSummary();

       // ✅ Subscribe after form initialized
     this.rejectionSummaryForm.get('filterPatientSummary')?.valueChanges.subscribe(value => {
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
        this.rejectionSummaryForm.get('DateRange')?.setValue({
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
  const dateRange = this.rejectionSummaryForm.get('DateRange')?.value;

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

                  const matchedCenter = response.data.find(
                    (center: { centerCode: string }) =>
                      center.centerCode === this.loggedInAsCenterUser
                  );

                  if (matchedCenter) {
                    this.centerApiResponse = [matchedCenter];

                    // ✅ Patch value FIRST
                    this.rejectionSummaryForm.patchValue({
                      ddlCenter: matchedCenter.centerCode
                    });

                    // ✅ Disable AFTER patching
                    this.rejectionSummaryForm.get('ddlCenter')?.disable();

                  } else {
                    this.centerApiResponse = response.data;

                    // ✅ Enable for admin
                    this.rejectionSummaryForm.get('ddlCenter')?.enable();
                  }
                }

            },
            error: (err) => {
               this.toasterService.showToast('Error while fetching centers!', 'error');
              console.error('Error while fetching centers:', err);
            }
          });
      }

         /// Load All Center Records
       loadRejectionSummary() {
        debugger;
        this.pickLatestDate();
        this.loaderService.show();
      
        this.barcode = this.rejectionSummaryForm.get('Barcode')?.value || null;
       const dateRange = this.rejectionSummaryForm.get('DateRange')?.value;

        const startDate = this.start;

        const endDate = this.end;
         
        this.patientNameOrCode = this.rejectionSummaryForm.get('PatientNameOrCode')?.value || null;
        if(this.loggedInAsCenterUser)
        {
          this.centerCode=this.loggedInAsCenterUser;
        }
        else
        {
        this.centerCode = this.rejectionSummaryForm.get('ddlCenter')?.value || null;
        }
        this.status = this.rejectionSummaryForm.get('ddlStatus')?.value || null;
        this.rejectionService.getRejectionSummary(this.partnerId,this.barcode, this.startDate, this.endDate, this.patientNameOrCode, this.centerCode)
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
                this.rejectionSummaryResponse = response.data;
                console.log(this.rejectionSummaryResponse);
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
      
formatRejectedDate(date: string): string {
  if (!date || date.length !== 8) {
    return '';
  }

  const year = date.substring(0, 4);
  const month = date.substring(4, 6);
  const day = date.substring(6, 8);

  const dateObj = new Date(
    Number(year),
    Number(month) - 1,
    Number(day)
  );

  return dateObj.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
}
      
  ///used to filter the data from grid/table
    filterPatientDetails(searchTerm: string) {
    debugger;
      this.filteredData = this.rejectionSummaryResponse.filter((item: 
      { 
        rejectedDate: any; patientCode: any; patientName: any; barcode: any;
        centerName: any; centerCode: any; referredDoctor: any; testName: any; rejectionReasons: any;  }) =>
      (item.rejectedDate ?? '').toString().toLowerCase().includes(searchTerm) ||
      (item.patientCode ?? '').toLowerCase().includes(searchTerm) ||
      (item.patientName ?? '').toLowerCase().includes(searchTerm) ||
      (item.barcode ?? '').toLowerCase().includes(searchTerm) ||
      (item.centerName ?? '').toLowerCase().includes(searchTerm) ||
      (item.centerCode ?? '').toString().includes(searchTerm) ||
      (item.referredDoctor ?? '').toLowerCase().includes(searchTerm) ||
      (item.testName ?? '').toLowerCase().includes(searchTerm) ||
      (item.rejectionReasons ?? '').toString().includes(searchTerm) 
    );
     debugger;
    this.rejectionSummaryResponse= this.filteredData;
    if(searchTerm==""){
      this.ngOnInit();
    }
  }    
}
