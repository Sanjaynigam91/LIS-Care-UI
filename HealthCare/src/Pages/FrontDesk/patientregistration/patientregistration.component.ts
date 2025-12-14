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
import { ValidationService } from '../../../auth/validation.service';
import { PatientRequest } from '../../../Interfaces/Patient/patient-request';
import { RefreshPageService } from '../../../auth/Shared/refresh-page.service';
import { PatientTestRequest } from '../../../Interfaces/Patient/patient-test-request';
import { forkJoin } from 'rxjs';


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
 loggedInUserName:string|any;
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
 patientRequest:PatientRequest={
   isAddPatient: false,
   patientCode: '',
   title: '',
   gender: '',
   patientName: '',
   age: 0,
   ageType: '',
   emailId: '',
   mobileNumber: '',
   centerCode: '',
   referredDoctor: '',
   referredLab: '',
   isProject: false,
   projectId: 0,
   labInstruction: '',
   referalNumber: '',
   sampleCollectedAt: '',
   isPregnant: false,
   pregnancyWeeks: 0,
   paymentType: '',
   totalOriginalAmount: 0,
   billAmount: 0,
   receivedAmount: 0,
   balanceAmount: 0,
   discountAmount: 0,
   agreedRatesBilling: 0,
   discountStatus: '',
   discountRemarks: '',
   patientType: '',
   enteredBy: '',
   nationality: '',
   clinicalHistory: '',
   clinicalRemarks: '',
   isPercentage: false,
   invoiceReceiptNo: '',
   isReportUploaded: false,
   partnerId: '',
   createdBy: '',
   updatedBy: ''
 }

 testSampleRequest: PatientTestRequest={
   patientId: '',
   testCode: '',
   isProfile: false,
   specimenType: '',
   partnerId: '',
   originalPrice: 0,
   price: 0
 }

  constructor(
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private loaderService: LoaderService,
    private toasterService: ToastService,
    private centerService:CenterServiceService,
    private clientService:ClientService,
    private projectService:ProjectService,
    private sampleService: SampleCollectionService,
    private patientService:PatientService,
    private validateService:ValidationService,
    private refPageService:RefreshPageService,

    )
    {
      this.loading$ = this.loaderService.loading$;
      this.partnerId= localStorage.getItem('partnerId');  
      this.loggedInUserId= localStorage.getItem('userId'); 
      this.loggedInUserName= localStorage.getItem('username');  // Get stored
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
  this.PatientRegistrationForm.patchValue({ SelectedTest: '' });
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
  else if(this.discountType=="false")
  {   
    this.finalAmount = Number(this.paidAmount) + Number(this.discountAmount);
  }
  else {
   this.discountAmount=(Number(this.totalAmount) * Number(this.discountAmount)) / 100;
   this.finalAmount = Number(this.paidAmount) + Number(this.discountAmount);
  }
 
  if(this.paidAmount>0)
  {
    this.balanceAmount=this.totalAmount-this.finalAmount;
  }
  else
  {
   this.balanceAmount=Number(this.totalAmount)- Number(this.finalAmount);
   this.grandTotalAmount=Number(this.totalAmount)- Number(this.finalAmount);
  
  }

  if(this.balanceAmount<0 || this.grandTotalAmount<0 || this.totalAmount<0)
  {
   this.toasterService.showToast("Final amount should not be negative. Please verify the billed, paid and discount amounts.", 'error');
  }

  this.PatientRegistrationForm.patchValue({
    TotalCost: this.totalAmount,
    GrandTotal: this.grandTotalAmount,
    BalancePayable:this.balanceAmount,
    discountAmount:this.discountAmount
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


savePatientDetails() {
  debugger;

  const result = this.validateService.isValidPatientRecord(this.PatientRegistrationForm);

  if (!result.isValid) {
    this.toasterService.showToast(result.message, 'error');
    return;
  }

  if (this.selectedSamples.length === 0) {
    this.toasterService.showToast("No tests are selected. Please select atleast one.", "error");
    return;
  }

  // ----------------------------
  // Prepare Patient Request Body
  // ----------------------------
  const patientCode = this.validateService.generatePatientCode(this.loggedInUserName, this.centerCode);

     this.patientRequest.isAddPatient= true;
     this.patientRequest.patientCode= patientCode,
     this.patientRequest.title= this.PatientRegistrationForm.get('ddlTitle')?.value;
     this.patientRequest.gender= this.PatientRegistrationForm.get('ddlGender')?.value;
     this.patientRequest.patientName= this.PatientRegistrationForm.get('PatientName')?.value;
     this.patientRequest.age= this.PatientRegistrationForm.get('PatientAge')?.value;
     this.patientRequest.ageType= this.PatientRegistrationForm.get('ddlAgeType')?.value;
     this.patientRequest.emailId= this.PatientRegistrationForm.get('PatientEmail')?.value;
     this.patientRequest.mobileNumber= this.PatientRegistrationForm.get('PatientMobileNumber')?.value;
     this.patientRequest.centerCode= this.PatientRegistrationForm.get('ddlCenterName')?.value;
     this.patientRequest.referredDoctor= this.PatientRegistrationForm.get('ddlReferredDr')?.value;
     this.patientRequest.patientType= this.PatientRegistrationForm.get('ddlBillingPatientType')?.value;
     if(this.PatientRegistrationForm.get('ddlBillingPatientType')?.value==='Project')
     {
      this.patientRequest.isProject= true;
      this.patientRequest.projectId= this.PatientRegistrationForm.get('ddlProject')?.value;
     }
     else{
      this.patientRequest.isProject= false;
      this.patientRequest.projectId= 0;
     }
     this.patientRequest.labInstruction= this.PatientRegistrationForm.get('LabInstruction')?.value;
     this.patientRequest.referredLab= this.PatientRegistrationForm.get('ReferalNumber')?.value;
     this.patientRequest.sampleCollectedAt= this.PatientRegistrationForm.get('ddlSampleCollectedAt')?.value;
     this.patientRequest.totalOriginalAmount= this.totalAmount;
     this.patientRequest.agreedRatesBilling= this.totalAmount;
     this.patientRequest.isPercentage =this.PatientRegistrationForm.get('ddlDiscountType')?.value? true:false;
     this.patientRequest.discountAmount= this.discountAmount;
     this.patientRequest.discountRemarks= this.PatientRegistrationForm.get('DiscountRemarks')?.value;
     this.patientRequest.billAmount= this.grandTotalAmount;
     this.patientRequest.receivedAmount= this.paidAmount;
     this.patientRequest.balanceAmount= this.balanceAmount;
     this.patientRequest. enteredBy= this.loggedInUserId;
     this.patientRequest.createdBy= this.loggedInUserId;
     this.patientRequest.updatedBy= this.loggedInUserId;
     this.patientRequest.partnerId= this.partnerId;


  // ----------------------------
  // Save Patient Master
  // ----------------------------
  this.patientService.addUpdatePatientInformation(this.patientRequest).subscribe({
    next: (response: any) => {
      debugger;

      if (!(response.statusCode === 200 && response.status)) {
        this.toasterService.showToast(response.responseMessage, 'error');
        return;
      }
        
      const dataString = response.data;

        const result: any = {};

        dataString.split(",").forEach((pair: string) => {
          const parts = pair.split(":");
          if (parts.length === 2) {
            const key = parts[0].trim();
            const value = parts[1].trim();
            result[key] = value;
          }
        });
      const patientId = result.PatientId;

      if (!patientId) {
        this.toasterService.showToast("Unable to get patientId.", "error");
        return;
      }

      // ----------------------------
      // Build all test save requests
      // ----------------------------
      const testRequests = this.selectedSamples.map(sample => {
        const testRequest = {
          patientId: patientId,
          testCode: sample.sampleCode,
          isProfile: sample.isProfile,
          specimenType: sample.sampleType || '',
          partnerId: this.partnerId,
          originalPrice: sample.mrp,
          price: sample.labRate
        };

        return this.patientService.addPatientTestDetails(testRequest);
      });

      // ----------------------------
      // Call all test APIs in parallel
      // ----------------------------
      forkJoin(testRequests).subscribe({
        next: (results: any[]) => {
          console.log("All test details saved:", results);
          if(results.every(res => res.statusCode === 200 && res.status)) {

            this.toasterService.showToast(response.responseMessage, 'success');
          }
          this.refPageService.notifyRefresh();
         
        },
        error: (err) => {
          console.error(err);
          this.toasterService.showToast("Error saving test details", "error");
        }
      });

    },
    error: (err) => {
      if (err.error?.responseMessage) {
        this.toasterService.showToast(err.error.responseMessage, 'error');
      } else {
        this.toasterService.showToast('Something went wrong. Please try again.', 'error');
      }
      console.error(err);
    }
  });
}




}

