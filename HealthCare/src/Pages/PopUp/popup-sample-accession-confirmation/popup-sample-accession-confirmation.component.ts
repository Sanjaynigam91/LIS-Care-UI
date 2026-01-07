import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit,
  AfterViewInit
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import {
  BehaviorSubject,
  debounceTime,
  distinctUntilChanged,
  finalize,
  Observable
} from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { ToastComponent } from '../../Toaster/toast/toast.component';
import { LoaderComponent } from '../../loader/loader.component';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';

import { ToastService } from '../../../auth/Toaster/toast.service';
import { LoaderService } from '../../../Interfaces/loader.service';
import { SampleaccessionService } from '../../../auth/SampleAceession/sampleaccession.service';

import { SampleTypeResponse } from '../../../Interfaces/SampleAccession/sample-type-response';
import { PatientInfoResponse } from '../../../Interfaces/SampleAccession/patient-info-response';
import { SampleAccessionTestResponse } from '../../../Interfaces/SampleAccession/sample-accession-test-response';
import { AcceptSampleRequest } from '../../../Interfaces/accept-sample-request';

@Component({
  selector: 'app-popup-sample-accession-confirmation',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIcon,
    ToastComponent,
    LoaderComponent,
    NgxDaterangepickerMd
  ],
  templateUrl: './popup-sample-accession-confirmation.component.html',
  styleUrl: './popup-sample-accession-confirmation.component.css'
})
export class PopupSampleAccessionConfirmationComponent
  implements OnInit, AfterViewInit {

  // ---------------- STATE ----------------
  loading$!: Observable<boolean>;
  accessionConfirmationForm!: FormGroup;

  showSampleAlert$ = new BehaviorSubject<boolean>(false);

  partnerId!: string | null;
  loggedInUserId!: string | null;
  visitId!: number | null;

  displayAccessionDate = '';

  sampleTypeApiResponse: SampleTypeResponse[] = [];
  patientInfoResponse!: PatientInfoResponse;
  sampleAccessionTestResponse: SampleAccessionTestResponse[] = [];

  currentSampleIndex = 0;

  acceptSampleRequest: AcceptSampleRequest = {
    woeDate: new Date(),
    barcode: '',
    patientSpecimenId: 0,
    patientCode: '',
    specimenType: '',
    createdBy: '',
    partnerId: '',
    visitId: 0
  };

  constructor(
    public dialogRef: MatDialogRef<PopupSampleAccessionConfirmationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private toast: ToastService,
    private loader: LoaderService,
    private sampleService: SampleaccessionService
  ) {
    this.partnerId = localStorage.getItem('partnerId');
    this.loggedInUserId = localStorage.getItem('userId');
    this.visitId = data?.visitId ?? null;

    // ✅ CREATE FORM ONCE
    this.accessionConfirmationForm = this.fb.group({
      accessionDate: [new Date()],
      lastImportedRef: [''],
      barcode: [''],
      vialType: [''],
      patientCode: [''],
      patientName: [''],
      referredBy: [''],
      hdnPatientSpecimenId: ['']
    });
  }

  // ---------------- INIT ----------------
  ngOnInit(): void {
    this.loading$ = this.loader.loading$;

    // accession date display
    const date = this.accessionConfirmationForm.get('accessionDate')?.value;
    this.displayAccessionDate = this.formatDate(date);

    this.accessionConfirmationForm
      .get('accessionDate')
      ?.valueChanges
      .subscribe(d => this.displayAccessionDate = this.formatDate(d));

    // barcode listener
    this.accessionConfirmationForm
      .get('barcode')
      ?.valueChanges
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe(barcode => {
        const vialType =
          this.accessionConfirmationForm.get('vialType')?.value;

        if (barcode && vialType) {
          this.getTestDetailsByVisitId(vialType, barcode);
        }
      });
  }

  // ---------------- LOAD SAMPLE TYPES ONCE ----------------
  ngAfterViewInit(): void {
    if (this.visitId) {
      this.getSampleTypeById();
    }
  }

  // ---------------- DATE FORMAT ----------------
  formatDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = date.toLocaleString('en-US', { month: 'short' });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  }

  // ---------------- SAMPLE TYPES ----------------
  getSampleTypeById(): void {

    this.loader.show();

    this.sampleService
      .getSampleTypeByVisitId(this.visitId, this.partnerId)
      .pipe(finalize(() => this.loader.hide()))
      .subscribe({
        next: (res: any) => {
          if (res?.status && res?.statusCode === 200) {

            this.sampleTypeApiResponse = res.data || [];
            this.currentSampleIndex = 0;

            if (!this.sampleTypeApiResponse.length) return;

            const firstSample =
              this.sampleTypeApiResponse[0].sampleType;

            this.accessionConfirmationForm.patchValue({
              vialType: firstSample
            });

            this.getPatientInfoByVisitId(firstSample);
            this.showSampleAlert$.next(true);
          }
        },
        error: () => {
          this.sampleTypeApiResponse = [];
        }
      });
  }

  // ---------------- PATIENT INFO ----------------
  getPatientInfoByVisitId(sampleType: string): void {

    this.sampleService
      .GetPatientInfoByVisitId(this.visitId, sampleType, this.partnerId)
      .pipe(finalize(() => this.loader.hide()))
      .subscribe({
        next: (res: any) => {
          if (res?.status && res?.statusCode === 200) {

            this.patientInfoResponse = res.data;

            this.accessionConfirmationForm.patchValue({
              barcode: this.patientInfoResponse?.barcode ?? '',
              patientCode: this.patientInfoResponse?.patientCode ?? '',
              patientName: this.patientInfoResponse?.patientName ?? '',
              referredBy: this.patientInfoResponse?.referDoctor ?? '',
              hdnPatientSpecimenId: this.patientInfoResponse?.sampleId ?? ''
            });

          } else {
            this.toast.showToast('No record found', 'error');
          }
        }
      });
  }

  // ---------------- TEST DETAILS ----------------
  getTestDetailsByVisitId(sampleType: string, barcode: string): void {

    this.sampleService
      .GetTestDetailsByVisitId(barcode, sampleType, this.partnerId)
      .pipe(finalize(() => this.loader.hide()))
      .subscribe({
        next: (res: any) => {
          this.sampleAccessionTestResponse =
            res?.status && res?.statusCode === 200 ? res.data : [];
        },
        error: () => {
          this.sampleAccessionTestResponse = [];
        }
      });
  }

  // ---------------- DROPDOWN CHANGE ----------------
  onSpecimenChange(event: Event): void {

    const specimen = (event.target as HTMLSelectElement).value;
    if (!specimen) return;

    this.currentSampleIndex =
      this.sampleTypeApiResponse.findIndex(x => x.sampleType === specimen);

    this.getPatientInfoByVisitId(specimen);
  }

  // ---------------- PRINT BARCODE ----------------
  printBarcodeBySampleType(): void {

    const visitId = this.visitId;
    const sampleType =
      this.accessionConfirmationForm.get('vialType')?.value;
    const partnerId = this.partnerId;

    if (!visitId || !sampleType || !partnerId) {
      this.toast.showToast('Sample type not selected', 'error');
      return;
    }

    this.sampleService.printBarcode(visitId, sampleType, partnerId)
      .subscribe({
        next: (blob: Blob) => {
          const fileURL = URL.createObjectURL(blob);
          window.open(fileURL, '_blank');
        },
        error: () => {
          this.toast.showToast('Error printing barcode', 'error');
        }
      });
  }

  // ---------------- ACCEPT SAMPLE ----------------
  acceptSampleByBarcode(): void {

    this.acceptSampleRequest = {
      ...this.acceptSampleRequest,
      barcode: this.accessionConfirmationForm.get('barcode')?.value,
      patientSpecimenId: this.accessionConfirmationForm.get('hdnPatientSpecimenId')?.value,
      patientCode: this.accessionConfirmationForm.get('patientCode')?.value,
      specimenType: this.accessionConfirmationForm.get('vialType')?.value,
      createdBy: this.loggedInUserId,
      partnerId: this.partnerId,
      visitId: this.visitId
    };

    this.sampleService.acceptSampleByBarcode(this.acceptSampleRequest)
      .subscribe({
        next: (res: any) => {

          if (!res?.status) {
            this.toast.showToast('Unexpected response', 'error');
            return;
          }

          this.toast.showToast('Sample accepted successfully!', 'success');

          const total = this.sampleTypeApiResponse.length;

          // ✅ Only one sample
          if (total === 1) {
            this.dialogRef.close(true);
            return;
          }

          // ✅ Move to next
          this.currentSampleIndex++;

          if (this.currentSampleIndex < total) {

            const nextSample =
              this.sampleTypeApiResponse[this.currentSampleIndex].sampleType;

            Promise.resolve().then(() => {
              this.accessionConfirmationForm.patchValue({
                vialType: nextSample
              });
            });

            this.getPatientInfoByVisitId(nextSample);
            this.showSampleAlert$.next(true);

          } else {
            this.dialogRef.close(true);
          }
        },
        error: () => {
          this.toast.showToast('Error while accepting sample', 'error');
        }
      });
  }

  // ---------------- CLOSE ----------------
  close(): void {
    this.dialogRef.close();
  }
}
