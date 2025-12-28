import {
  Component,
  Inject,
  NgZone,
  OnInit,
  AfterViewInit,
  ChangeDetectorRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { finalize, Observable } from 'rxjs';

import { ToastComponent } from '../../Toaster/toast/toast.component';
import { LoaderComponent } from '../../loader/loader.component';
import { ToastService } from '../../../auth/Toaster/toast.service';
import { LoaderService } from '../../../Interfaces/loader.service';
import { SampleCollectionService } from '../../../auth/SampleCollection/sample-collection.service';
import { RequestedTest, SamplePendingCollectionResponse } from '../../../Interfaces/SampleCollection/sample-pending-collection-response';
import { MatFormField } from "@angular/material/form-field";
import moment from 'moment';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { SampleRequest } from '../../../Interfaces/SampleCollection/sample-request';

@Component({
  selector: 'app-popuppendingcollection',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIcon,
    ToastComponent,
    LoaderComponent,
    NgxDaterangepickerMd, // ✅ REQUIRED
],
  templateUrl: './popuppendingcollection.component.html',
  styleUrls: ['./popuppendingcollection.component.css']
})
export class PopuppendingcollectionComponent
  implements OnInit, AfterViewInit {
[x: string]: any;

  loading$!: Observable<boolean>;

  pendingCollectionForm!: FormGroup;

  samplePendingCollectionResponse: SamplePendingCollectionResponse[] = [];
  requestedTestApiResponse:RequestedTest[]=[];

  isAddHeaderVisible = false;
  isEditHeaderVisible = false;
  isSubmitVisible = false;
  isUpdateVisible = false;
  showGotoAccession: boolean = false;  // or false
  showConfirmCollection:boolean=false;
  partnerId!: string | null;
  loggedInUserId!: string | null;
  patientId!: string | null;
  referedDoctor: any;
  registeredDate: string | number | Date | undefined;
  start: Date = new Date();
  end: Date = new Date();
  startDate:Date|any|null;
  endDate:Date|any|null;
  dateRangeLabel:Date|any|null;
  sampleRequest:SampleRequest={
    barcode: '',
    collectionTime: new Date(),
    collectedBy: '',
    specimenType: '',
    patientId: ''
  }
  selectedSample!: SamplePendingCollectionResponse;
  isComingFromError:boolean=false;
  barcode:string|undefined;

  constructor(
    public dialogRef: MatDialogRef<PopuppendingcollectionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private toasterService: ToastService,
    private loaderService: LoaderService,
    private sampleCollectionService: SampleCollectionService,
    private cdr: ChangeDetectorRef,
    public dialog: MatDialog,
    private zone: NgZone
  ) {
    this.partnerId = localStorage.getItem('partnerId');
    this.loggedInUserId = localStorage.getItem('userId');
    this.patientId = data?.patientId ?? null;
  }

  // ---------------- INIT ----------------
  ngOnInit(): void {
    this.loading$ = this.loaderService.loading$;
    this.showGotoAccession=false;
    this.showConfirmCollection=true;
    this.pendingCollectionForm = this.fb.group({
      specimens: this.fb.array([]),
      DateRange: [{ startDate: moment(), endDate: moment() }],
      Barcode:[''],
      IsSpecimenCollected:['']
    });

    if (this.patientId) {
      this.getSamplesforCollection(this.patientId);
      this.getRequestedTestforCollection(this.patientId);
    }
  }

  // ---------------- FIX NG0100 HERE ----------------
  ngAfterViewInit(): void {
    Promise.resolve().then(() => {
      if (this.patientId) {
        this.isEditHeaderVisible = true;
        this.isUpdateVisible = true;
      } else {
        this.isAddHeaderVisible = true;
        this.isSubmitVisible = true;
      }
      this.cdr.detectChanges();
    });
  }

  close(): void {
    this.dialogRef.close();
    window.location.reload();
  }

  // ---------- FormArray Getter ----------
  get specimens(): FormArray {
    return this.pendingCollectionForm.get('specimens') as FormArray;
  }

  // ---------- Build Form ----------
  buildSpecimenForm(): void {
    this.specimens.clear();

    if (!this.samplePendingCollectionResponse?.length) {
      return;
    }

    this.samplePendingCollectionResponse.forEach(item => {
      this.specimens.push(
        this.fb.group({
          barcode: [item.barcode || ''],
          sampleCollectionTime: [item.sampleCollectionTime],
          isSpecimenCollected: [item.isSpecimenCollected]
        })
      );
    });
  }

  // ---------- API Call ----------
  getSamplesforCollection(patientId: string): void {
    this.loaderService.show();

    this.sampleCollectionService
      .GetPendingSampleForCollectionById(patientId)
      .pipe(finalize(() => this.loaderService.hide()))
      .subscribe({
        next: (response: any) => {
          if (response?.status && response.statusCode === 200) {
            debugger;
            this.samplePendingCollectionResponse = response.data ?? [];
            if (this.samplePendingCollectionResponse.length > 0) {
                const firstRecord = this.samplePendingCollectionResponse[0];

                this.referedDoctor = firstRecord.referedDoctor;
                this.registeredDate = firstRecord.registeredDate;
             }
             this.cdr.detectChanges(); // ✅ FORCE UI UPDATE
            this.buildSpecimenForm();

          } else {
            this.samplePendingCollectionResponse = [];
            this.toasterService.showToast('No Record Found!', 'error');
          }
        },
        error: err => {
          this.samplePendingCollectionResponse = [];
          this.toasterService.showToast(
            'Error while fetching pending collections!',
            'error'
          );
          console.error(err);
        }
      });
  }
// ---------- API Call ----------
  getRequestedTestforCollection(patientId: string): void {
    debugger;
    this.loaderService.show();
    if(!this.isComingFromError)
    {
      this.barcode=this.pendingCollectionForm.get('Barcode')?.value;
      this.pendingCollectionForm.get('Barcode')?.setValue(this.barcode);

    }
    else{
      this.barcode='';
    }
    
    const IsSpecimenCollected=this.pendingCollectionForm.get('IsSpecimenCollected')?.value;
    this.sampleCollectionService
      .GetRequsetedTestForCollection(patientId,this.barcode)
      .pipe(finalize(() => this.loaderService.hide()))
      .subscribe({
        next: (response: any) => {
          if (response?.status && response.statusCode === 200) {
            debugger;
            this.requestedTestApiResponse = response.data ?? [];
            this.cdr.detectChanges(); // ✅ FORCE UI UPDATE
            this.buildSpecimenForm();

          } else {
            this.requestedTestApiResponse = [];
            this.toasterService.showToast('No Record Found!', 'error');
          }
        },
        error: err => {
          debugger;
          this.requestedTestApiResponse = [];
          // this.toasterService.showToast(
          //   'No sample found against this barcode.',
          //   'error'
          // );
          this.isComingFromError=true;
          this.getRequestedTestforCollection(patientId);
          console.error(err);
        }
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
         this.pendingCollectionForm.get('DateRange')?.setValue({
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

onSpecimenChecked(event: Event, sample: SamplePendingCollectionResponse) {
  debugger;
  const isChecked = (event.target as HTMLInputElement).checked;

  if (isChecked) {
    debugger;
    this.selectSample(sample);
  } else {
    this.selectedSample = undefined!;
  }
}

selectSample(sample: SamplePendingCollectionResponse) {
  debugger;
  this.selectedSample = sample;
}

updateEmployee() {
debugger;
  // 🔴 VALIDATION FIRST (NO LOADER YET)
  if (!this.samplePendingCollectionResponse) {
    return;
  }

  if (!this.pendingCollectionForm.value.Barcode) {
    this.toasterService.showToast('Please enter barcode...', 'error');
    return;
  }

  if (!this.pendingCollectionForm.value.IsSpecimenCollected) {
    this.toasterService.showToast('Please select the status...', 'error');
    return;
  }

  // ✅ NOW show loader (only when API will be called)
  this.loaderService.show();

  this.sampleRequest.barcode =
  this.pendingCollectionForm.get('Barcode')?.value;

    const dateRange = this.pendingCollectionForm.get('DateRange')?.value;

    this.sampleRequest.collectionTime = dateRange?.startDate
      ? new Date(dateRange.startDate)
      : new Date();
  this.sampleRequest.collectedBy = this.loggedInUserId;
  this.sampleRequest.specimenType = this.selectedSample.sampleType;
  this.sampleRequest.patientId = this.patientId;

  this.sampleCollectionService
    .updateSampleCollectionStatus(this.sampleRequest)
    .pipe(
      finalize(() => {
        // 🔥 ALWAYS hides loader (success / error / exception)
        this.loaderService.hide();
      })
    )
    .subscribe({
      next: (response: any) => {
        if (response.statusCode === 200 && response.status) {
          debugger;
          this.toasterService.showToast(response.responseMessage, 'success');
         this.ngOnInit();
        } else {
          this.toasterService.showToast(response.responseMessage, 'error');
        }
      },
      error: (err) => {
        if (err.error?.responseMessage) {
          this.toasterService.showToast(err.error.responseMessage, 'error');
        } else {
          this.toasterService.showToast(
            'Something went wrong. Please try again.',
            'error'
          );
        }
        console.error(err);
      }
    });
}
        
}
