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
    
    this.pendingCollectionForm = this.fb.group({
      specimens: this.fb.array([]),
      DateRange: [{ startDate: moment(), endDate: moment() }],
      Barcode:['']
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
    const barcode=this.pendingCollectionForm.get('Barcode')?.value;
    this.sampleCollectionService
      .GetRequsetedTestForCollection(patientId,barcode)
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
          this.requestedTestApiResponse = [];
          this.toasterService.showToast(
            'Error while fetching pending collections!',
            'error'
          );
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

         
}
