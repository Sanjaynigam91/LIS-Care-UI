import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { ToastComponent } from '../../Toaster/toast/toast.component';
import { LoaderComponent } from '../../loader/loader.component';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { BehaviorSubject, debounceTime, distinctUntilChanged, finalize, Observable } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastService } from '../../../auth/Toaster/toast.service';
import { LoaderService } from '../../../Interfaces/loader.service';
import { Router } from '@angular/router';
import { SampleaccessionService } from '../../../auth/SampleAceession/sampleaccession.service';
import { SampleTypeResponse } from '../../../Interfaces/SampleAccession/sample-type-response';
import { PatientInfoResponse } from '../../../Interfaces/SampleAccession/patient-info-response';
import { SampleAccessionTestResponse } from '../../../Interfaces/SampleAccession/sample-accession-test-response';

@Component({
  selector: 'app-popup-sample-accession-confirmation',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush, // 🔥 ADD THIS
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

export class PopupSampleAccessionConfirmationComponent {

  loading$!: Observable<boolean>;
  accessionConfirmationForm!: FormGroup;

  showGotoAccession = false;
  displayAccessionDate = '';

  // ✅ ALERT STATE (ASYNC – NO NG0100)
  showSampleAlert$ = new BehaviorSubject<boolean>(false);

  partnerId!: string | null;
  loggedInUserId!: string | null;
  patientId!: string | null;
  visitId!: number | null;
  sampleType!: string | null;

  sampleTypeApiResponse: SampleTypeResponse[] = [];
  patientInfoResponse!: PatientInfoResponse;
  sampleAccessionTestResponse: SampleAccessionTestResponse[] = [];


 constructor(
  public dialogRef: MatDialogRef<PopupSampleAccessionConfirmationComponent>,
  @Inject(MAT_DIALOG_DATA) public data: any,
  private formBuilder: FormBuilder,
  private toasterService: ToastService,
  private loaderService: LoaderService,
  public dialog: MatDialog,
  private router: Router,
  private sampleAccessionService: SampleaccessionService
) {

  this.partnerId = localStorage.getItem('partnerId');
  this.loggedInUserId = localStorage.getItem('userId');
  this.patientId = data?.patientId ?? null;
  this.visitId = data?.visitId ?? null;

  // 🔥 CREATE FORM HERE (CRITICAL FIX)
  this.accessionConfirmationForm = this.formBuilder.group({
    accessionDate: [new Date()],
    lastImportedRef: [''],
    barcode: [''],
    vialType: [''],
    patientCode: [''],
    patientName: [''],
    referredBy: ['']
  });
}


  // ---------------- INIT ----------------
ngOnInit(): void {
  this.loading$ = this.loaderService.loading$;
   const date: Date =
    this.accessionConfirmationForm.get('accessionDate')?.value;
    this.sampleType = this.accessionConfirmationForm.get('vialType')?.value;

    this.displayAccessionDate = this.formatDate(date);

  if (this.visitId) {
    this.getLastImported();
  }

    this.accessionConfirmationForm
    .get('barcode')
    ?.valueChanges
    .pipe(
      debounceTime(400),          // avoids API call on every key press
      distinctUntilChanged()
    )
    .subscribe(barcode => {

      if (!barcode) {
        return;
      }


      this.getTestDetailsByVisitId(this.sampleType, barcode);
    });

}

  // ✅ CALL ONLY ONCE (IMPORTANT)
ngAfterViewInit(): void {
  if (this.visitId || this.patientId) {
    Promise.resolve().then(() => {
      this.getSampleTypeById();
    });
  }
}

formatDate(date: Date): string {
  const day = date.getDate().toString().padStart(2, '0');
  const month = date.toLocaleString('en-US', { month: 'short' });
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
}


  // ---------------- CLOSE ----------------
  close(): void {
    this.dialogRef.close();
    window.location.reload();
  }

  // ---------------- LAST IMPORTED ----------------
  getLastImported(): void {

    this.sampleAccessionService
      .getLastImported({
        woeDate: this.accessionConfirmationForm.get('accessionDate')?.value,
        partnerId: this.partnerId
      })
      .pipe(finalize(() => this.loaderService.hide()))
      .subscribe({
        next: (response: any) => {

          const lastImported =
            response?.status && response?.statusCode === 200
              ? response?.data?.lastImportedRef ?? response?.data ?? 0
              : 0;

          this.accessionConfirmationForm.patchValue({
            lastImportedRef: lastImported
          });
        },
        error: () => {
          this.accessionConfirmationForm.patchValue({
            lastImportedRef: 0
          });
        }
      });
  }

  // ---------------- SAMPLE TYPES ----------------
  getSampleTypeById(): void {

    this.loaderService.show();

    this.sampleAccessionService
      .getSampleTypeByVisitId(this.visitId, this.partnerId)
      .pipe(finalize(() => this.loaderService.hide()))
      .subscribe({
        next: (response: any) => {

          if (response?.status && response?.statusCode === 200) {
              debugger;
            this.sampleTypeApiResponse = response.data || [];

            const sampleTypes = this.sampleTypeApiResponse.map(
              (x: any) => x.sampleType
            );

            const count = sampleTypes.length;

            // CASE 1: Exactly 2
            if (count === 2) {

              const selectedType = sampleTypes[1];

              this.accessionConfirmationForm.patchValue({
                vialType: selectedType
              });
              this.getPatientInfoByVisitId(selectedType);

              this.showSampleAlert$.next(true);
            }

            // CASE 2: More than 2
            else if (count > 2) {

              const selectedType = sampleTypes[1];

              this.accessionConfirmationForm.patchValue({
                vialType: selectedType
              });

              this.getPatientInfoByVisitId(selectedType);

              // ✅ SAFE ASYNC ALERT
              this.showSampleAlert$.next(true);
            }

            // CASE 3: Only 1 
            else if (count === 1) {

            //  this.showSampleAlert$.next(true);

             const selectedType = sampleTypes[0];

              this.accessionConfirmationForm.patchValue({
                vialType: selectedType
              });

              this.getPatientInfoByVisitId(selectedType);

              setTimeout(() => {
                // this.close();
              }, 1000);
            }
          }
          else {
            this.sampleTypeApiResponse = [];
          }
        },
        error: () => {
          this.sampleTypeApiResponse = [];
          this.showSampleAlert$.next(false);
        }
      });
  }

 getPatientInfoByVisitId(sampleType:any): void {
  debugger;
  this.sampleAccessionService
    .GetPatientInfoByVisitId(this.visitId,sampleType, this.partnerId)
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
          debugger;
          this.patientInfoResponse = response.data;

            this.accessionConfirmationForm.patchValue({
              barcode: this.patientInfoResponse?.barcode ?? '',
              patientCode: this.patientInfoResponse?.patientCode ?? '',
              patientName: this.patientInfoResponse?.patientName ?? '',
              referredBy: this.patientInfoResponse?.referDoctor ?? ''
            });

           // this.getTestDetailsByVisitId(sampleType, this.patientInfoResponse?.barcode);

         // console.log(this.PendingAccessionApiResponse);
        } else {
          this.patientInfoResponse = {} as PatientInfoResponse;
          this.toasterService.showToast('No Record Found!', 'error');
        }
      },
      error: (err) => {
        this.patientInfoResponse = {} as PatientInfoResponse;
        this.toasterService.showToast(
          'Error while fetching pending collections!',
          'error'
        );
        console.error('Search error:', err);
      }
    });
}  

getTestDetailsByVisitId(sampleType: any, barcode: any): void {
  this.sampleAccessionService
    .GetTestDetailsByVisitId(barcode, sampleType, this.partnerId)
    .pipe(
      finalize(() => {
        // ✅ Always hide loader
        this.loaderService.hide();
      })
    )
    .subscribe({
      next: (response: any) => {
        if (response?.status && response?.statusCode === 200) {
          this.sampleAccessionTestResponse = response.data || [];
        } else {
          this.sampleAccessionTestResponse = [];
        }
      },
      error: (err) => {
        this.sampleAccessionTestResponse = [];
        console.error('Search error:', err);
      }
    });
}

onSpecimenChange(event: Event) {
  debugger;
  const specimen = (event.target as HTMLSelectElement).value;
  this.getLastImported();
  this.getPatientInfoByVisitId(specimen);
}

}
