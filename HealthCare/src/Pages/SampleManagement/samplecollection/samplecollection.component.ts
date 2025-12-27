import { A11yModule } from '@angular/cdk/a11y';
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
import { RouterModule, RouterLink } from '@angular/router';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { NgxPaginationModule } from 'ngx-pagination';
import { LoaderComponent } from '../../loader/loader.component';
import { CenterResponse } from '../../../Interfaces/CenterMaster/CenterResponse';
import { finalize, Observable } from 'rxjs';
import { SampleCollectionResponse } from '../../../Interfaces/SampleCollection/sample-collection-response';
import { MatDialog } from '@angular/material/dialog';
import { LoaderService } from '../../../Interfaces/loader.service';
import { ToastService } from '../../../auth/Toaster/toast.service';
import { CenterServiceService } from '../../../auth/Center/center-service.service';
import { RefreshPageService } from '../../../auth/Shared/refresh-page.service';
import { SampleCollectionService } from '../../../auth/SampleCollection/sample-collection.service';
import moment from 'moment';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PopuppendingcollectionComponent } from '../../PopUp/popuppendingcollection/popuppendingcollection.component';

@Component({
  selector: 'app-samplecollection',
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
    RouterModule
],
  templateUrl: './samplecollection.component.html',
  styleUrl: './samplecollection.component.css'
})
export class SamplecollectionComponent {
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
     SampleCollectionForm!:FormGroup;
     filteredData: any[] = []; // Data array for the table
     centerStatus:string|any;
     SeachByNameOrCode:string|any;
     centerApiResponse:Observable<CenterResponse>| any;
     searchPatientApiResponse:Observable<SampleCollectionResponse>| any;
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
         private refPageService:RefreshPageService,
         private sampleCollectionService:SampleCollectionService
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
        this.SampleCollectionForm = this.formBuilder.group({
          DateRange: [{ startDate: moment(), endDate: moment() }],
          startDate: [''],
          endDate: [''],
          PatientName: [''],
          PatientCode: [''],
          ddlCenter: [''],
          filterSampleCollection: [''],
        });

      if(this.currentUserRoleId==2){
        this.IsDeleteVisible=true;
      }
      else{
        this.IsDeleteVisible=false;
      }

      this.loadAllCenterRecords();
      this.searchPatientForPendingCollection();

       // ✅ Subscribe after form initialized
     this.SampleCollectionForm.get('filterSampleCollection')?.valueChanges.subscribe(value => {
       this.filterPatientForCollection(value);
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
        this.SampleCollectionForm.get('DateRange')?.setValue({
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
                    this.SampleCollectionForm.patchValue({
                      ddlCenter: matchedCenter.centerCode
                    });

                    // ✅ Disable AFTER patching
                    this.SampleCollectionForm.get('ddlCenter')?.disable();

                  } else {
                    this.centerApiResponse = response.data;

                    // ✅ Enable for admin
                    this.SampleCollectionForm.get('ddlCenter')?.enable();
                  }
                }

            },
            error: (err) => {
               this.toasterService.showToast('Error while fetching centers!', 'error');
              console.error('Error while fetching centers:', err);
            }
          });
      }

      /// Load All patient for sample collection
 searchPatientForPendingCollection(): void {
  debugger;

  this.pickLatestDate();
  this.loaderService.show();
  const dateRange = this.SampleCollectionForm.get('DateRange')?.value;

  this.startDate = dateRange.startDate;
  this.endDate = dateRange.endDate;

  // ✅ Get form values safely
  this.patientName =
    this.SampleCollectionForm.get('PatientName')?.value || null;

  this.patientCode =
    this.SampleCollectionForm.get('PatientCode')?.value || null;

  // ✅ Center code logic
  this.centerCode = this.loggedInAsCenterUser
    ? this.loggedInAsCenterUser
    : this.SampleCollectionForm.get('ddlCenter')?.value || null;

  this.sampleCollectionService
    .searchPatientsForSampleCollection({
      startDate: this.startDate,
      endDate: this.endDate,
      patientCode: this.patientCode,
      centerCode: this.centerCode,
      patientName: this.patientName,
      partnerId: this.partnerId
    })
    .pipe(
      finalize(() => {
        // ✅ Always hide loader
        this.loaderService.hide();
      })
    )
    .subscribe({
      next: (response: any) => {
        debugger;

        if (response?.status && response?.statusCode === 200) {
          this.IsRecordFound = true;
          this.IsNoRecordFound = false;
          this.searchPatientApiResponse = response.data ?? [];
          console.log(this.searchPatientApiResponse);
        } else {
          this.IsRecordFound = false;
          this.IsNoRecordFound = true;
          this.searchPatientApiResponse = [];
          this.toasterService.showToast('No Record Found!', 'error');
        }
      },
      error: (err) => {
        this.IsRecordFound = false;
        this.IsNoRecordFound = true;
        this.searchPatientApiResponse = [];
        this.toasterService.showToast(
          'Error while fetching pending collections!',
          'error'
        );
        console.error('Search error:', err);
      }
    });
}

  pickLatestDate() {
    const dateRange = this.SampleCollectionForm.get('DateRange')?.value;

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
 ///used to filter the data from grid/table
    filterPatientForCollection(searchTerm: string) {
    debugger;
      this.filteredData = this.searchPatientApiResponse.filter((item:
      {
        woeDate: any; patientCode:any; patientName: any; referDoctor: any;
        visitId: any; mobileNumber: any;
      }) =>
      (item.woeDate ?? '').toString().toLowerCase().includes(searchTerm) ||
      (item.patientCode ?? '').toLowerCase().includes(searchTerm) ||
      (item.patientName ?? '').toLowerCase().includes(searchTerm) ||
      (item.referDoctor ?? '').toLowerCase().includes(searchTerm) ||
      (item.visitId ?? '').toString().includes(searchTerm) ||
      (item.mobileNumber ?? '').toString().includes(searchTerm)
    );
     debugger;
    this.searchPatientApiResponse= this.filteredData;
    if(searchTerm==""){
      this.ngOnInit();
    }
  }
  // open the pending collection dialog
    pendingSampleCollectionDetails(patientId:any){
       debugger;
       this.dialog.open(PopuppendingcollectionComponent, {
        width: '1500px',           // slightly larger than medium
        maxWidth: '90vw',         // responsive on smaller screens
        height: 'auto',            // taller than medium but not full screen
        minHeight: '400px',       // ensures minimum height
        panelClass: 'large-dialog', // optional custom CSS
        disableClose: true,
        data: { patientId: patientId },        // Pass data if needed
            
      });
      
       this.dialog.afterAllClosed.subscribe(() => {
       this.ngOnInit(); // Refresh the list after the dialog is closed
      });
    }  
}