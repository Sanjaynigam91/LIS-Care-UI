import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
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
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgxPaginationModule } from 'ngx-pagination';
import { LoaderComponent } from '../../loader/loader.component';
import { A11yModule } from '@angular/cdk/a11y';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { RouterModule } from '@angular/router';
import { finalize, Observable } from 'rxjs';
import { CenterResponse } from '../../../Interfaces/CenterMaster/CenterResponse';
import { MatDialog } from '@angular/material/dialog';
import { LoaderService } from '../../../Interfaces/loader.service';
import { ToastService } from '../../../auth/Toaster/toast.service';
import { CenterServiceService } from '../../../auth/Center/center-service.service';
import { RefreshPageService } from '../../../auth/Shared/refresh-page.service';
import { SampleaccessionService } from '../../../auth/SampleAceession/sampleaccession.service';
import moment from 'moment';
import { PendingAccessionResponse } from '../../../Interfaces/SampleAccession/pending-accession-response';
import { TestService } from '../../../auth/TestMasterService/test.service';
import { testDepartmentResponse } from '../../../Interfaces/TestMaster/testDepartmentResponse';
import { NgSelectModule } from '@ng-select/ng-select';
import { ReportingService } from '../../../auth/Reporting/reporting.service';
import { PendingPatientResponse } from '../../../Interfaces/Reporting/pending-patient-response';

@Component({
  selector: 'app-reportsentry',
  standalone: true,
    imports: [
       MatTooltipModule,
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
       NgxDaterangepickerMd // ✅ ONLY THIS
       ,
       RouterModule,
       NgSelectModule
   ],
  templateUrl: './reportsentry.component.html',
  styleUrl: './reportsentry.component.css'
})
export class ReportsentryComponent {
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
     pendingEntryForm!:FormGroup
     centerApiResponse:Observable<CenterResponse>| any;
     testDeptApiResponse: Observable<testDepartmentResponse>| any;
     pendingPatientApiResponse:Observable<PendingPatientResponse>| any;
     filteredData: any[] = []; // Data array for the table
     centerStatus:string|any;
     SeachByNameOrCode:string|any;
     reportStatus:string|any;

   constructor(
         private formBuilder: FormBuilder,
         public dialog: MatDialog,
         private loaderService: LoaderService,
         private toasterService: ToastService,
         private centerService:CenterServiceService,
         private refPageService:RefreshPageService,
         private testService:TestService,
         private reportingService:ReportingService
         )
         {
           this.loading$ = this.loaderService.loading$;
           this.partnerId= localStorage.getItem('partnerId');  
           this.loggedInUserId= localStorage.getItem('userId'); 
           this.loggedInUserName= localStorage.getItem('username');  // Get stored
           this.loggedInAsCenterUser= localStorage.getItem('centerCode');  // Get stored
           this.currentUserRoleId= localStorage.getItem('roleId');
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
             this.pendingEntryForm.get('DateRange')?.setValue({
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

   ngOnInit(): void {
      debugger;
      this.IsNoRecordFound=true;
      this.IsRecordFound=false;
        this.pendingEntryForm = this.formBuilder.group({
          DateRange: [{ startDate: moment(), endDate: moment() }],
          startDate: [''],
          endDate: [''],
          PatientName: [''],
          Barcode: [''],
          ddlCenter: [null],          // ✅ FIX HERE
          ddlDepartment: [null],
          ddlStage:[null],
          filterSampleAccession: [''],
        });

     
      this.loadAllCenterRecords();
      this.GetTestDeptData();
      this.getPendingPatients();

       // ✅ Subscribe after form initialized
    //  this.pendingAccessionForm.get('filterSampleAccession')?.valueChanges.subscribe(value => {
    //    this.filterSamplesForAccession(value);
    //   });

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
                    this.pendingEntryForm.patchValue({
                      ddlCenter: matchedCenter.centerCode
                    });

                    // ✅ Disable AFTER patching
                    this.pendingEntryForm.get('ddlCenter')?.disable();

                  } else {
                    this.centerApiResponse = response.data;

                    // ✅ Enable for admin
                    this.pendingEntryForm.get('ddlCenter')?.enable();
                  }
                }

            },
            error: (err) => {
               this.toasterService.showToast('Error while fetching centers!', 'error');
              console.error('Error while fetching centers:', err);
            }
          });
  } 
  
   GetTestDeptData(){
    debugger;
    this.testService.getTestDepartments(this.partnerId).subscribe((response:any)=>{
      debugger;
     this.testDeptApiResponse = response.data; 
     console.log(response);
    }) 
   }

    getPendingPatients() {
        debugger;
        this.loaderService.show();
         const dateRange = this.pendingEntryForm.get('DateRange')?.value;

        this.startDate = dateRange.startDate;
        this.endDate = dateRange.endDate;
        
        const barcode = this.pendingEntryForm.get('Barcode')?.value;
        const department = this.pendingEntryForm.get('ddlDepartment')?.value;
        const patientName = this.pendingEntryForm.get('PatientName')?.value;
        const centerCode = this.pendingEntryForm.get('ddlCenter')?.value;
        this.reportStatus = this.pendingEntryForm.get('ddlStage')?.value;
        if(this.reportStatus==null || this.reportStatus==''){
          this.reportStatus='Entry';
        }
        this.reportingService.RetrievePendingPatients(this.partnerId, this.startDate, this.endDate, barcode, department, patientName, centerCode, this.reportStatus)
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
                  this.pendingPatientApiResponse = response.data;
                  this.filteredData = response.data;
                  this.totalItems = this.filteredData.length;
                  this.IsRecordFound=true;
                  this.IsNoRecordFound=false;
                }
                else {
                  this.pendingPatientApiResponse = [];
                  this.filteredData = []; 
                  this.totalItems = 0;
                  this.IsRecordFound=false;
                  this.IsNoRecordFound=true;
                }

            },
            error: (err) => {
               this.toasterService.showToast('Error while fetching centers!', 'error');
              console.error('Error while fetching centers:', err);
            }
          });
  } 
  
    
}
