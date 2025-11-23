import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, OnInit } from '@angular/core';
import { MatIcon, MatIconModule } from "@angular/material/icon";
import { MatFormField, MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { LoaderComponent } from "../../loader/loader.component";
import { Router } from '@angular/router';
import { finalize, Observable, pipe } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { LoaderService } from '../../../Interfaces/loader.service';
import { ToastService } from '../../../auth/Toaster/toast.service';
import { CommonModule } from '@angular/common';
import { CenterServiceService } from '../../../auth/Center/center-service.service';
import { CenterResponse } from '../../../Interfaces/CenterMaster/CenterResponse';
import { ProjectService } from '../../../auth/ProjectMaster/project.service';
import { ProjectResponse } from '../../../Interfaces/Projects/project-response';
import { sampleCollectedAtResponse } from '../../../Interfaces/SampleCollection/sampleCollectedAtResponse';
import { SampleCollectionService } from '../../../auth/SampleCollection/sample-collection.service';
import { ClientResponse } from '../../../Interfaces/ClientMaster/client-response';
import { ClientService } from '../../../auth/ClientMaster/client.service';
import { PatientService } from '../../../auth/FrontDesk/patient.service';
import { TestSampleResponse } from '../../../Interfaces/Patient/test-sample-response';
import { AfterViewInit } from '@angular/core';
import $ from 'jquery';
import 'select2';
import { ToastComponent } from "../../Toaster/toast/toast.component";
import { PopupsampledetailsComponent } from '../../PopUp/popupsampledetails/popupsampledetails.component';

@Component({
   schemas: [CUSTOM_ELEMENTS_SCHEMA],
  selector: 'app-patientregistration',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    ReactiveFormsModule,
    LoaderComponent,
    CommonModule,
    ToastComponent
],     // <-- REQUIRED
  templateUrl: './patientregistration.component.html',
  styleUrl: './patientregistration.component.css'
})
export class PatientregistrationComponent {
 $: any;
 loading$!: Observable<boolean>;
 partnerId: string |any;
 loggedInUserId: string |any;
 PatientRegistrationForm!: FormGroup<any>;
 centerStatus:string|any;
 SeachByNameOrCode:string|any;
 clientStatus:string|any;
 searchBy:string|any;
 centerCode:string|any;
 projectCode:number|any;
 testCode:string|any;
 testApplicable:string|any;
 selectedSamples: any[] = []; // Data array for the table
 totalAmount:number|any;
 balanceAmount:number|any;
 discountAmount:number|any;
 discountType:string|any;
 discountPercentage:number|any;
 grandTotalAmount:string|any;
 paidAmount:number|any;
 finalAmount:number|any;
 centerApiResponse:Observable<CenterResponse>| any;
 clientApiResponse:Observable<ClientResponse>|any;
 projectApiResponse:Observable<ProjectResponse>| any;
 sampleCollectionPlaceApiResponse:  Observable<sampleCollectedAtResponse>| any;
 testSampleApiResponse:Observable<TestSampleResponse>|any;


  constructor(
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private loaderService: LoaderService,
    private toasterService: ToastService,
    private centerService:CenterServiceService,
    private clientService:ClientService,
    private projectService:ProjectService,
    private sampleService: SampleCollectionService,
    private patientService:PatientService
    )
    {
      this.loading$ = this.loaderService.loading$;
      this.partnerId= localStorage.getItem('partnerId');  
      this.loggedInUserId= localStorage.getItem('loggedInUserId');   
    }

  ngOnInit(): void {
    this.PatientRegistrationForm = this.formBuilder.group({
      ddlTitle: [''],
      ddlGender: [''],
      PatientName: [''],
      PatientAge: [''],
      ddlAgeType: [''],
      PatientEmail: [''],
      PatientMobileNumber: [''],
      ddlCenterName: [''],
      ddlReferredDr: [''],
      ddlBillingPatientType: [''],
      ddlProject: [''],
      LabInstruction: [''],
      ReferalNumber: [''],
      ddlSampleCollectedAt: [''],
      TestProfileName: [''],
      TotalCost: [{ value: '0.00', disabled: true }],
      ddlDiscountType: [''],
      Discount: [''],
      DiscountRemarks: [''],
      GrandTotal: [{ value: '0.00', disabled: true }],
      PaidAmount: [''],
      BalancePayable: [{ value: '0.00', disabled: true }],
      selectedSamples:['']
  });

  this.loadAllCenterRecords();

  this.LoadClients();

   this.PatientRegistrationForm.get('ddlBillingPatientType')?.valueChanges.subscribe(value => { 
    if (value === 'Project') {
        this.loadProjectData();
    } else {
      // If Regular or empty → clear project dropdown
      this.PatientRegistrationForm.get('ddlProject')?.reset();
    }
  });

  this.loadSampleCollectionPlaceData();

  this.loadAllTestSamples();

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

  /// used to load and Serach the Project Data
  loadProjectData() {
    debugger;
    this.loaderService.show(); // ✅ Show loader at start

    this.centerStatus = '';
    this.SeachByNameOrCode = '';

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
            this.toasterService.showToast('No Record Found!', 'error');
            console.warn('No Record Found!');
          }
        },
        error: (err) => {
          this.toasterService.showToast('Error while fetching centers!', 'error');
          console.error('Error while fetching profiles:', err);
        },
      });
  }
  
  /// Load Sample Collection Place Data
  loadSampleCollectionPlaceData() {
    this.sampleService
  .GetSampleCollectionById(this.partnerId)
  .pipe(
    finalize(() => {
      this.loaderService.hide();  // Always runs (success or error)
    })
  )
  .subscribe(
    (response: any) => {
      debugger;
      this.sampleCollectionPlaceApiResponse = response.data;
      console.log(response);
    },
    (err) => {
      console.log(err);
    }
  );
  }

  /// used to load all the Client Records
  LoadClients() {
    this.loaderService.show();

    this.clientStatus = '';
    this.searchBy = '';

    this.centerCode =
      this.PatientRegistrationForm.get('ddlBillingPatientType')?.value === 'Center'
        ? this.PatientRegistrationForm.get('ddlCenterName')?.value
        : '';
     this.clientService
    .getAllClients(this.clientStatus, this.partnerId, this.searchBy, this.centerCode)
    .pipe(
      finalize(() => {
        // ✅ Ensures loader hides after API completes (success or error)
        this.loaderService.hide();
      })
    )
    .subscribe({
      next: (response: any) => {
        if (response?.status && response?.statusCode === 200) {
          this.clientApiResponse = response.data;
          console.log(this.clientApiResponse);
        } else {
          this.toasterService.showToast('No Record Found!', 'error');
          console.warn('No Record Found!');
        }
      },
      error: (err) => {
        this.toasterService.showToast('Error while fetching centers!', 'error');
        console.error('Error while fetching clients:', err);
      },
    });
   
  }

/// Load All test sample details
loadAllTestSamples() {
  this.loaderService.show();

  this.centerCode = this.PatientRegistrationForm.get('ddlCenterName')?.value || '';
  this.projectCode = this.PatientRegistrationForm.get('ddlProject')?.value || 0;

  this.patientService
    .getAllSamples(this.partnerId, this.centerCode, this.projectCode, this.testCode, this.testApplicable)
    .pipe(finalize(() => this.loaderService.hide()))
    .subscribe({
      next: (response: any) => {
        if (response?.status && response?.statusCode === 200) {

          // Store Data
          this.testSampleApiResponse = response.data;

        } else {
          this.toasterService.showToast("No Record Found!", "error");
        }
      },
      error: () => {
        this.toasterService.showToast("Error while fetching tests!", "error");
      }
    });
}




getSelectedSamples() {

  const selectedCode = this.PatientRegistrationForm.get('TestProfileName')?.value;

  if (!selectedCode) return;

  // Find selected object from API response
  const selectedItem = this.testSampleApiResponse.find(
    (x: { sampleCode: any }) => x.sampleCode === selectedCode
  );

  if (!selectedItem) return;

  // Prevent duplicates
  const alreadyExists = this.selectedSamples
    .some(x => x.sampleCode === selectedItem.sampleCode);

  if (alreadyExists) {
    // optional: show message
     this.toasterService.showToast("test sample already selected!", 'error');
    console.warn("Sample already added!");
    this.PatientRegistrationForm.patchValue({ TestProfileName: '' });
    return;
  }

  // Add to table array
  this.selectedSamples.push(selectedItem);
  this.updateBillingAmount();
  // Clear dropdown
  this.PatientRegistrationForm.patchValue({ TestProfileName: '' });
}


removeSample(index: number) {
  this.selectedSamples.splice(index, 1);
  if(this.selectedSamples.length>0)
  {
    this.updateBillingAmount()
      if(this.balanceAmount<0 || this.grandTotalAmount<0 || this.totalAmount<0)
      {
        this.toasterService.showToast("Final amount should not be negative. Please verify the billed, paid and discount amounts.", 'error');
      }
      else{
        this.toasterService.showToast("test sample has been removed successfully!", 'success');
      }
    
  }
  else{
     this.ngOnInit();
  }
}


updateBillingAmount() {
  debugger;
  this.totalAmount = this.selectedSamples.reduce((sum, item) => sum + (item.mrp || 0), 0);
  this.discountType= this.PatientRegistrationForm.get('ddlDiscountType')?.value;
  this.discountAmount=this.PatientRegistrationForm.get('Discount')?.value;
  this.paidAmount=this.PatientRegistrationForm.get('PaidAmount')?.value;
  this.finalAmount=0;

  if(this.discountType==''){
    this.discountAmount=0;
    this.balanceAmount=this.totalAmount-0;
    this.grandTotalAmount=this.totalAmount-0;
  }
  else if(this.discountType=='Amount')
  {   
    this.finalAmount = Number(this.paidAmount) + Number(this.discountAmount);
  }
  else {
   this.discountAmount=(Number(this.totalAmount) * Number(this.discountAmount)) / 100;
   this.finalAmount = Number(this.paidAmount) + Number(this.discountAmount);
  }

  this.balanceAmount=Number(this.totalAmount)- Number(this.finalAmount);
  this.grandTotalAmount=Number(this.totalAmount)- Number(this.finalAmount);
  
  if(this.paidAmount>0)
  {
    this.balanceAmount=this.grandTotalAmount;
  }

  if(this.balanceAmount<0 || this.grandTotalAmount<0 || this.totalAmount<0)
  {
   this.toasterService.showToast("Final amount should not be negative. Please verify the billed, paid and discount amounts.", 'error');
  }

  this.PatientRegistrationForm.patchValue({
    TotalCost: this.totalAmount,
    GrandTotal: this.grandTotalAmount,
    BalancePayable:this.balanceAmount
  });
}

ViewSampleDetails() {
  debugger;

  this.centerCode = this.PatientRegistrationForm.get('ddlCenterName')?.value || '';
  this.projectCode = this.PatientRegistrationForm.get('ddlProject')?.value || 0;

  console.log("CenterCode:", this.centerCode);
  console.log("ProjectCode:", this.projectCode);

  // if (!center || !project) {
  //   this.toasterService.showToast("Please select Center and Project", "error");
  //   return;
  // }

  this.centerCode = this.centerCode;
  this.projectCode = this.projectCode;

  const dialogRef = this.dialog.open(PopupsampledetailsComponent, {
    width: '1500px',
    maxWidth: '90vw',
    minHeight: '300px',
    disableClose: true,
    panelClass: 'large-dialog',
    data: {
      centerCode: this.centerCode,
      projectCode: this.projectCode
    },
  });

dialogRef.afterClosed().subscribe(() => {
  setTimeout(() => {
    this.ngOnInit();
  });
});

}



}
