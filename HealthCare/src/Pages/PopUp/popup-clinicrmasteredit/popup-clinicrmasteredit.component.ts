import { Component, Inject, NgZone } from '@angular/core';
import { ToastComponent } from '../../Toaster/toast/toast.component';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { LoaderComponent } from '../../loader/loader.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from '../../../auth/auth.service';
import { ToastService } from '../../../auth/Toaster/toast.service';
import { CenterServiceService } from '../../../auth/Center/center-service.service';
import { RefreshPageService } from '../../../auth/Shared/refresh-page.service';
import { TestService } from '../../../auth/TestMasterService/test.service';
import { LoaderService } from '../../../Interfaces/loader.service';
import { MetadataService } from '../../../auth/metadata.service';
import { CenterResponse } from '../../../Interfaces/CenterMaster/CenterResponse';
import { ClinicRequest } from '../../../Interfaces/ClinicMaster/clinic-request';
import { ClinicServiceService } from '../../../auth/ClinicMaster/clinic-service.service';
import { ClinicResponse } from '../../../Interfaces/ClinicMaster/clinic-response';

@Component({
  selector: 'app-popup-clinicrmasteredit',
  standalone: true,
  imports: [ToastComponent, CommonModule, MatIcon, ReactiveFormsModule, LoaderComponent],
  templateUrl: './popup-clinicrmasteredit.component.html',
  styleUrl: './popup-clinicrmasteredit.component.css'
})
export class PopupClinicrmastereditComponent {
loading$!: Observable<boolean>;
isAddHeaderVisible:boolean=false;
isEditHeaderVisible:boolean=false;
isVisible = false;
roleId:any;
partnerId: string |any;
loggedInUserId: string |any;
editClinicMasterForm!: FormGroup<any>;
isSubmitVisible:boolean=false;
isUpdateVisible:boolean=false;
clinicId:number|any;
centerStatus:string|any;
SeachByNameOrCode:string|any;
centerApiResponse:Observable<CenterResponse>| any;
clinicRequest:ClinicRequest={
  clinicId: 0,
  clinicCode: '',
  clinicName: '',
  clinicIncharge: '',
  emailId: '',
  mobileNumber: '',
  alterContactNumber: '',
  clinicDoctorCode: '',
  centerCode: '',
  clinicAddress: '',
  rateType: '',
  clinicStatus: false,
  createdBy: '',
  updatedBy: '',
  partnerId: ''
}
clinicApiResponse:Observable<ClinicResponse>|any;

constructor(public dialogRef: MatDialogRef<PopupClinicrmastereditComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      private toasterService: ToastService,private centerService:CenterServiceService,
      private refPageService:RefreshPageService,private formBuilder: FormBuilder,
      private testService:TestService,private loaderService: LoaderService
      ,public dialog: MatDialog,private clinicServic:ClinicServiceService
    ){
      this.partnerId= localStorage.getItem('partnerId');
      this.loggedInUserId=localStorage.getItem('userId');
      this.roleId=data.roleId;
      this.clinicId=data.clinicId;
    }

     ngOnInit(): void {
      this.editClinicMasterForm=this.formBuilder.group({
          ClinicCode:[{ value: '', disabled: true }],
          ClinicName:[''],
          ClinicIncharge:[''],
          ClinicEmailId:[''],
          ClinicMobileNumber:  [
            '',
            [
              Validators.required,
              Validators.pattern('^[6-9][0-9]{9}$') // ✅ 10-digit Indian mobile number pattern
            ]
          ],
          AlternateContactNumber:[''],
          ddlCentre:[''],
          ddlRateType:[''],
          Address:[''],
          ddlStatus:[''],
          ClinicDoctorCode:['']
        });
    
         setTimeout(() => {  // 🔑 forces update in next CD cycle
        if (!this.clinicId) {
          this.isAddHeaderVisible = true;
          this.isEditHeaderVisible = false;
          this.isSubmitVisible = true;
          this.isUpdateVisible = false;
        
        } else {
          this.isEditHeaderVisible = true;
          this.isAddHeaderVisible = false;
          this.isSubmitVisible = false;
          this.isUpdateVisible = true;
         
          this.getClinicById(this.clinicId);
        }
      this.LoadAllCentres();
      });
    
      }

open(): void {
    this.isVisible = true;
  }

  close(): void {
    this.dialogRef.close();
  }

     /// used to load all the centers based on the search criteria
    LoadAllCentres(){
    debugger;
    this.loaderService.show();
    this.centerStatus='';
    this.SeachByNameOrCode='';
    this.centerService.getAllCenters(this.partnerId,this.centerStatus,this.SeachByNameOrCode).subscribe({
      next: (response: any) => {
        debugger;
        if (response?.status && response?.statusCode === 200) {
          this.centerApiResponse = response.data; 
          console.log(this.centerApiResponse);
        } else {
          console.warn("No Record Found!");
        }

        this.loaderService.hide();
      },
      error: (err) => {
        console.error("Error while fetching profiles:", err);
        this.loaderService.hide();
      }
    });
    this.loaderService.hide();
  }

  // Used to get Clinic Details by Id
  getClinicById(clinicId:number){
    debugger;
    this.clinicServic.getClinicById(clinicId,this.partnerId).subscribe({
      next: (response: any) => {
        debugger;
        if (response?.status && response?.statusCode === 200) {
        this.clinicApiResponse = response.data; 
        const clinic = response.data[0]; // first item in array
        this.editClinicMasterForm.patchValue({
        ClinicCode: clinic.clinicCode || '',
        ClinicName: clinic.clinicName || '',
        ClinicIncharge: clinic.clinicIncharge || '',
        ClinicEmailId: clinic.emailId || '',
        ClinicMobileNumber: clinic.mobileNumber || '',
        AlternateContactNumber: clinic.alternateContactNo || '',
        ClinicDoctorCode: clinic.clinicDoctorCode||'',
        ddlCentre: clinic.centerCode ||'',
        Address: clinic.clinicAddress || '',
        ddlRateType: clinic.rateType || 0,
        ddlStatus: clinic.clinicStatus ? 'true' : 'false',
      });
          console.log(this.clinicApiResponse);
        } else {
          console.warn("No Record Found!");
        }

        this.loaderService.hide();
      },
      error: (err) => {
        console.error("Error while fetching profiles:", err);
        this.loaderService.hide();
      }
    });
    this.loaderService.hide();
  }

/// used to create new clinic details
createNewClinic(){
  debugger;
     this.loaderService.show();
    if(this.editClinicMasterForm.value.ClinicName==''){
      this.toasterService.showToast('Please enter clinic name...', 'error');
    }
     else if (this.editClinicMasterForm.value.ClinicEmailId == '') {
    this.toasterService.showToast('Please enter email address...', 'error');
    }
    else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(this.editClinicMasterForm.value.ClinicEmailId)) {
      this.toasterService.showToast('Please enter a valid email address...', 'error');
    }
    else if(this.editClinicMasterForm.value.ClinicMobileNumber==''){
      this.toasterService.showToast('Please enter mobile number...', 'error');
    }
    else if (!/^[6-9][0-9]{9}$/.test(this.editClinicMasterForm.value.ClinicMobileNumber)) {
      this.toasterService.showToast('Please enter a valid 10-digit mobile number...', 'error');
    }
    else if(this.editClinicMasterForm.value.ClinicDoctorCode==''){
      this.toasterService.showToast('Please enter clinic doctor code...', 'error');
    }
    else if(this.editClinicMasterForm.value.ddlCentre==''){
      this.toasterService.showToast('Please select the centre..', 'error');
    }
    else if(this.editClinicMasterForm.value.ddlRateType==''){
      this.toasterService.showToast('Please select the rate type..', 'error');
    }
    else{
      debugger;
      this.clinicRequest.clinicName=this.editClinicMasterForm.value.ClinicName;
      this.clinicRequest.clinicIncharge=this.editClinicMasterForm.value.ClinicIncharge;
      this.clinicRequest.emailId=this.editClinicMasterForm.value.ClinicEmailId;
      this.clinicRequest.mobileNumber=this.editClinicMasterForm.value.ClinicMobileNumber;
      this.clinicRequest.alterContactNumber=this.editClinicMasterForm.value.AlternateContactNumber;
      this.clinicRequest.clinicDoctorCode=this.editClinicMasterForm.value.ClinicDoctorCode;
      this.clinicRequest.centerCode=this.editClinicMasterForm.value.ddlCentre;
      this.clinicRequest.clinicAddress=this.editClinicMasterForm.value.Address;
      this.clinicRequest.rateType=this.editClinicMasterForm.value.ddlRateType;
      this.clinicRequest.clinicStatus = JSON.parse(this.editClinicMasterForm.value.ddlStatus.toLowerCase());
      this.clinicRequest.partnerId=this.partnerId; 
      this.clinicRequest.createdBy=this.loggedInUserId; 

    this.clinicServic.addNewClinic(this.clinicRequest)
    .subscribe({
    next: (response: any) => {
      if (response.statusCode === 200 && response.status) {
        this.refPageService.notifyRefresh(); // used to refresh the main list page
        this.toasterService.showToast(response.responseMessage, 'success');
        this.dialogRef.close();
      } else {
        this.toasterService.showToast(response.responseMessage, 'error');
      }
    },
    error: (err) => {
      // Handle backend business error even on 404
      if (err.error && err.error.responseMessage) {
        this.toasterService.showToast(err.error.responseMessage, 'error');
      } else {
        this.toasterService.showToast('Something went wrong. Please try again.', 'error');
      }
      console.error(err);
    }
  });



    }
    this.loaderService.hide();
  }

  /// used to create new clinic details
updateClinic(){
  debugger;
     this.loaderService.show();
    if(this.editClinicMasterForm.value.ClinicName==''){
      this.toasterService.showToast('Please enter clinic name...', 'error');
    }
     else if (this.editClinicMasterForm.value.ClinicEmailId == '') {
    this.toasterService.showToast('Please enter email address...', 'error');
    }
    else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(this.editClinicMasterForm.value.ClinicEmailId)) {
      this.toasterService.showToast('Please enter a valid email address...', 'error');
    }
    else if(this.editClinicMasterForm.value.ClinicMobileNumber==''){
      this.toasterService.showToast('Please enter mobile number...', 'error');
    }
    else if (!/^[6-9][0-9]{9}$/.test(this.editClinicMasterForm.value.ClinicMobileNumber)) {
      this.toasterService.showToast('Please enter a valid 10-digit mobile number...', 'error');
    }
    else if(this.editClinicMasterForm.value.ClinicDoctorCode==''){
      this.toasterService.showToast('Please enter clinic doctor code...', 'error');
    }
    else if(this.editClinicMasterForm.value.ddlCentre==''){
      this.toasterService.showToast('Please select the centre..', 'error');
    }
    else if(this.editClinicMasterForm.value.ddlRateType==''){
      this.toasterService.showToast('Please select the rate type..', 'error');
    }
    else if(this.editClinicMasterForm.value.ddlStatus==''){
      this.toasterService.showToast('Please select the status..', 'error');
    }
    else{
      debugger;
      this.clinicRequest.clinicId=this.clinicId;
      this.clinicRequest.clinicName=this.editClinicMasterForm.value.ClinicName;
      this.clinicRequest.clinicIncharge=this.editClinicMasterForm.value.ClinicIncharge;
      this.clinicRequest.emailId=this.editClinicMasterForm.value.ClinicEmailId;
      this.clinicRequest.mobileNumber=this.editClinicMasterForm.value.ClinicMobileNumber;
      this.clinicRequest.alterContactNumber=this.editClinicMasterForm.value.AlternateContactNumber;
      this.clinicRequest.clinicDoctorCode=this.editClinicMasterForm.value.ClinicDoctorCode;
      this.clinicRequest.centerCode=this.editClinicMasterForm.value.ddlCentre;
      this.clinicRequest.clinicAddress=this.editClinicMasterForm.value.Address;
      this.clinicRequest.rateType=this.editClinicMasterForm.value.ddlRateType;
      this.clinicRequest.clinicStatus = JSON.parse(this.editClinicMasterForm.value.ddlStatus.toLowerCase());
      this.clinicRequest.partnerId=this.partnerId; 
      this.clinicRequest.createdBy=this.loggedInUserId; 

    this.clinicServic.updateClinicDetails(this.clinicRequest)
    .subscribe({
    next: (response: any) => {
      if (response.statusCode === 200 && response.status) {
        this.refPageService.notifyRefresh(); // used to refresh the main list page
        this.toasterService.showToast(response.responseMessage, 'success');
        this.dialogRef.close();
      } else {
        this.toasterService.showToast(response.responseMessage, 'error');
      }
    },
    error: (err) => {
      // Handle backend business error even on 404
      if (err.error && err.error.responseMessage) {
        this.toasterService.showToast(err.error.responseMessage, 'error');
      } else {
        this.toasterService.showToast('Something went wrong. Please try again.', 'error');
      }
      console.error(err);
    }
  });



    }
    this.loaderService.hide();
  }


}
