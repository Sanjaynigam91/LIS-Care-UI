import { Component, inject } from '@angular/core';
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

@Component({
  selector: 'app-patientregistration',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    ReactiveFormsModule,
    LoaderComponent,
    CommonModule 
],     // <-- REQUIRED
  templateUrl: './patientregistration.component.html',
  styleUrl: './patientregistration.component.css'
})
export class PatientregistrationComponent {
 loading$!: Observable<boolean>;
 partnerId: string |any;
 loggedInUserId: string |any;
 PatientRegistrationForm!: FormGroup<any>;
 centerStatus:string|any;
 SeachByNameOrCode:string|any;
 clientStatus:string|any;
 searchBy:string|any;
 centerCode:string|any;
 centerApiResponse:Observable<CenterResponse>| any;
 clientApiResponse:Observable<ClientResponse>|any;
 projectApiResponse:Observable<ProjectResponse>| any;
 sampleCollectionPlaceApiResponse:  Observable<sampleCollectedAtResponse>| any;

  constructor(
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private loaderService: LoaderService,
    private toasterService: ToastService,
    private centerService:CenterServiceService,
    private clientService:ClientService,
    private projectService:ProjectService,
    private sampleService: SampleCollectionService
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



}
