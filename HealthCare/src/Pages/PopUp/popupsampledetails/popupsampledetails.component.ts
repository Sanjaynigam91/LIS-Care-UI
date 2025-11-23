import { Component, Inject, NgZone, ChangeDetectorRef } from '@angular/core';
import { ToastComponent } from "../../Toaster/toast/toast.component";
import { LoaderComponent } from "../../loader/loader.component";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { RefreshPageService } from '../../../auth/Shared/refresh-page.service';
import { ToastService } from '../../../auth/Toaster/toast.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { LoaderService } from '../../../Interfaces/loader.service';
import { finalize, Observable } from 'rxjs';
import { NgxPaginationModule } from "ngx-pagination";
import { MatIcon } from "@angular/material/icon";
import { CommonModule, AsyncPipe } from '@angular/common';
import { PatientService } from '../../../auth/FrontDesk/patient.service';
import { TestSampleResponse } from '../../../Interfaces/Patient/test-sample-response';

@Component({
  selector: 'app-popupsampledetails',
  standalone: true,
  imports: [
    ToastComponent,
    CommonModule,
    AsyncPipe,          // ✅ Needed for | async pipe
    MatIcon,
    ReactiveFormsModule,
    LoaderComponent,
    NgxPaginationModule
  ],
  templateUrl: './popupsampledetails.component.html',
  styleUrl: './popupsampledetails.component.css'
})
export class PopupsampledetailsComponent {
  loading$!: Observable<boolean>;
  sampleDetailsForm!: FormGroup;
  partnerId: string |any;
  loggedInUserId: string |any;
  p: number = 1;
  totalItems = 0;
  itemsPerPage = 5;
  centerCode:string|number;
  projectCode:number|any;
  IsNoRecordFound=false;
  testCode:string|any;
  testApplicable:string|any;

  testSampleApiResponse: TestSampleResponse[] = [];   // ✅ FIXED (array not observable)

  constructor(
    public dialogRef: MatDialogRef<PopupsampledetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private toasterService: ToastService,
    private refPageService: RefreshPageService,
    private formBuilder: FormBuilder,
    private loaderService: LoaderService,
    public dialog: MatDialog, 
    private zone: NgZone,
    private cd: ChangeDetectorRef,
    private patientService: PatientService
  ) {
    this.partnerId = localStorage.getItem('partnerId');
    this.loggedInUserId = localStorage.getItem('userId');
    this.centerCode = data.centerCode;
    this.projectCode = data.projectCode;

     this.loading$ = this.loaderService.loading$;   // ⭐ REQUIRED FIX
  }

   ngOnInit(): void {
    debugger;
    this.sampleDetailsForm=this.formBuilder.group({
        filterSamples:[''],
      });
  
     this.loadTestSamples();
      
  
    }
  
  close(): void {
    this.dialogRef.close();
  }


/// Load All test sample details
loadTestSamples() {
  this.loaderService.show();

  this.patientService
    .getAllSamples(
      this.partnerId,
      this.centerCode,
      this.projectCode,
      this.testCode,
      this.testApplicable
    )
    .subscribe({
      next: (response: any) => {
        if (response?.status && response?.statusCode === 200) {
          
          this.testSampleApiResponse = response.data;
          this.IsNoRecordFound = false;

          // ⏳ Wait until DOM is finished rendering
          setTimeout(() => {
            this.loaderService.hide();
          });

        } else {
          this.IsNoRecordFound = true;
          this.toasterService.showToast("No Record Found!", "error");
          this.loaderService.hide();
        }
      },

      error: () => {
        this.toasterService.showToast("Error while fetching tests!", "error");
        this.loaderService.hide();
      }
    });
}


}
