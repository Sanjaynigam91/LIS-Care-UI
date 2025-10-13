import { Component, Inject, NgZone } from '@angular/core';
import { ToastComponent } from '../../Toaster/toast/toast.component';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoaderComponent } from '../../loader/loader.component';
import { Observable } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from '../../../auth/auth.service';
import { ToastService } from '../../../auth/Toaster/toast.service';
import { CenterServiceService } from '../../../auth/Center/center-service.service';
import { RefreshPageService } from '../../../auth/Shared/refresh-page.service';
import { TestService } from '../../../auth/TestMasterService/test.service';
import { LoaderService } from '../../../Interfaces/loader.service';
import { MetadataService } from '../../../auth/metadata.service';
import { SalesInchargeResponse } from '../../../Interfaces/CenterMaster/SalesInchargeResponse';
import { CenterResponse } from '../../../Interfaces/CenterMaster/CenterResponse';
import { CenterRequest } from '../../../Interfaces/CenterMaster/CenterRequest';

@Component({
  selector: 'app-popup-centermasteredit',
  standalone: true,
  imports: [ToastComponent, CommonModule, MatIcon, ReactiveFormsModule, LoaderComponent],
  templateUrl: './popup-centermasteredit.component.html',
  styleUrl: './popup-centermasteredit.component.css'
})
export class PopupCentermastereditComponent {
loading$!: Observable<boolean>;
isAddHeaderVisible:boolean=false;
isEditHeaderVisible:boolean=false;
isVisible = false;
roleId:any;
partnerId: string |any;
loggedInUserId: string |any;
editCenterForm!: FormGroup<any>;
isSubmitVisible:boolean=false;
isUpdateVisible:boolean=false;
centerCode:any
salesinchargeApiResponse:Observable<SalesInchargeResponse>| any;
centerDetailsApiResponse:Observable<CenterResponse>| any;
centerRequest: CenterRequest = {
  centerCode: '',
  centerName: '',
  centerInchargeName: '',
  salesIncharge: '',
  centerAddress: '',
  pincode: '',
  mobileNumber: '',
  emailId: '',
  rateType: '',
  centerStatus: false,
  isAutoBarcode: false,
  partnerId: '',
  alternateContactNo: '',
  introducedBy: '',
  creditLimit: 0,
  createdBy: '',
  modifiedBy: ''
};
constructor(public dialogRef: MatDialogRef<PopupCentermastereditComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,private authService:AuthService,
      private toasterService: ToastService,private centerService:CenterServiceService,
      private refPageService:RefreshPageService,private formBuilder: FormBuilder,
      private testService:TestService,private loaderService: LoaderService,
      private metaService:MetadataService,public dialog: MatDialog, private zone: NgZone
    ){
      this.partnerId= localStorage.getItem('partnerId');
      this.loggedInUserId=localStorage.getItem('userId');
      this.roleId=data.roleId;
      this.centerCode=data.centerCode;
    }

open(): void {
    this.isVisible = true;
  }

  close(): void {
    this.dialogRef.close();
  }
  ngOnInit(): void {
  this.editCenterForm=this.formBuilder.group({
      CenterCode:[''],
      CenterName:[''],
      CenterIncharge:[''],
      ddlSalesIncharge:[''],
      CenterAddress:[''],
      PinCode:[''],
      CenterMobileNumber:  [
        '',
        [
          Validators.required,
          Validators.pattern('^[6-9][0-9]{9}$') // ✅ 10-digit Indian mobile number pattern
        ]
      ],
      AlternateContactNumber:[''],
      CenterEmailId:[''],
      ddlRateType:[''],
      ddlCenterStatus:[''],
      IntroducedBy:[''],
      CreditLimit:[''],
      ddlAutoBarcode:[''],
    });

     setTimeout(() => {  // 🔑 forces update in next CD cycle
    if (!this.centerCode) {
      this.isAddHeaderVisible = true;
      this.isEditHeaderVisible = false;
      this.isSubmitVisible = true;
      this.isUpdateVisible = false;
    
    } else {
      this.isEditHeaderVisible = true;
      this.isAddHeaderVisible = false;
      this.isSubmitVisible = false;
      this.isUpdateVisible = true;
     
      this.getCenterDetailsbyCode();
    }
  this.getSalesInchargeDetails();
  });

  }

  /// used to get sales incharge details
    getSalesInchargeDetails(){
    debugger;
    this.loaderService.show();
    this.centerService.getSalesInchargeDetails(this.partnerId).subscribe({
      next: (response: any) => {
        debugger;
        if (response?.status && response?.statusCode === 200) {
          this.salesinchargeApiResponse = response.data; 
          console.log(this.salesinchargeApiResponse);
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

  } 
/// used to get center details by center code
  getCenterDetailsbyCode(){
    debugger;
    this.loaderService.show();
    this.centerService.getCentersByCode(this.partnerId,this.centerCode).subscribe({
      next: (response: any) => {
        debugger;
        if (response?.status && response?.statusCode === 200) {
          this.centerDetailsApiResponse = response.data; 
          const center = response.data[0]; // first item in array
        this.editCenterForm.patchValue({
        CenterCode: center.centerCode || '',
        CenterName: center.centerName || '',
        CenterIncharge: center.centerInchargeName || '',
        ddlSalesIncharge: center.salesIncharge || '',
        CenterAddress: center.centerAddress || '',
        PinCode: center.pincode || '',
        CenterMobileNumber: center.mobileNumber || 0,
        AlternateContactNumber: center.alternateContactNo,
        CenterEmailId: center.emailId || '',
        ddlRateType: center.rateType || '',
        ddlCenterStatus: center.centerStatus ? 'true' : 'false',
        IntroducedBy: center.introducedBy || '',
        CreditLimit: center.creditLimit || 0,
        ddlAutoBarcode: center.isAutoBarcode ? 'true' : 'false',
      });
          console.log(this.centerDetailsApiResponse);
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

  } 
/// used to create new center details
createNewCenter(){
  debugger;
     this.loaderService.show();
    if(this.editCenterForm.value.CenterCode==''){
      this.toasterService.showToast('Please enter center code...', 'error');
    }
    else if(this.editCenterForm.value.CenterCode.length<4){
      this.toasterService.showToast('Center code must be at least 4 characters long...', 'error');
    } 
    else if(this.editCenterForm.value.CenterName==''){
      this.toasterService.showToast('Please enter center name...', 'error');
    }
    else if(this.editCenterForm.value.CenterIncharge==''){
      this.toasterService.showToast('Please enter center incharge name...', 'error');
    }
    else if(this.editCenterForm.value.ddlSalesIncharge==''){
      this.toasterService.showToast('Please select sales incharge...', 'error');
    }
    else if(this.editCenterForm.value.CenterAddress==''){
      this.toasterService.showToast('Please enter center address...', 'error');
    }
    else if(this.editCenterForm.value.PinCode==''){
      this.toasterService.showToast('Please enter pin code...', 'error');
    }
    else if(this.editCenterForm.value.CenterMobileNumber==''){
      this.toasterService.showToast('Please enter mobile number...', 'error');
    }
    else if (!/^[6-9][0-9]{9}$/.test(this.editCenterForm.value.CenterMobileNumber)) {
      this.toasterService.showToast('Please enter a valid 10-digit mobile number...', 'error');
    }
    else if (this.editCenterForm.value.CenterEmailId == '') {
    this.toasterService.showToast('Please enter email address...', 'error');
    }
    else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(this.editCenterForm.value.CenterEmailId)) {
      this.toasterService.showToast('Please enter a valid email address...', 'error');
    }
    else if(this.editCenterForm.value.ddlAutoBarcode==''){
      this.toasterService.showToast('Please select auto barccode...', 'error');
    }
    else{
      debugger;
      this.centerRequest.centerCode=this.editCenterForm.value.CenterCode;
      this.centerRequest.centerName=this.editCenterForm.value.CenterName;
      this.centerRequest.centerInchargeName=this.editCenterForm.value.CenterIncharge;
      this.centerRequest.salesIncharge=this.editCenterForm.value.ddlSalesIncharge;
      this.centerRequest.centerAddress=this.editCenterForm.value.CenterAddress;
      this.centerRequest.pincode=this.editCenterForm.value.PinCode;
      this.centerRequest.mobileNumber=this.editCenterForm.value.CenterMobileNumber;
      this.centerRequest.alternateContactNo=this.editCenterForm.value.AlternateContactNumber;
      this.centerRequest.emailId=this.editCenterForm.value.CenterEmailId;
      this.centerRequest.rateType=this.editCenterForm.value.ddlRateType;
      this.centerRequest.centerStatus = JSON.parse(this.editCenterForm.value.ddlCenterStatus.toLowerCase());
      this.centerRequest.introducedBy=this.editCenterForm.value.IntroducedBy; 
      this.centerRequest.creditLimit=this.editCenterForm.value.CreditLimit;
      this.centerRequest.isAutoBarcode=JSON.parse(this.editCenterForm.value.ddlAutoBarcode.toLowerCase());
      this.centerRequest.partnerId=this.partnerId; 
      this.centerRequest.createdBy=this.loggedInUserId; 
       this.centerRequest.modifiedBy=this.loggedInUserId;

    this.centerService.addNewCenter(this.centerRequest)
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

  UpdateCenter(){
  debugger;
     this.loaderService.show();
    if(this.editCenterForm.value.CenterCode==''){
      this.toasterService.showToast('Please enter center code...', 'error');
    }
    else if(this.editCenterForm.value.CenterCode.length<4){
      this.toasterService.showToast('Center code must be at least 4 characters long...', 'error');
    } 
    else if(this.editCenterForm.value.CenterName==''){
      this.toasterService.showToast('Please enter center name...', 'error');
    }
    else if(this.editCenterForm.value.CenterIncharge==''){
      this.toasterService.showToast('Please enter center incharge name...', 'error');
    }
    else if(this.editCenterForm.value.ddlSalesIncharge==''){
      this.toasterService.showToast('Please select sales incharge...', 'error');
    }
    else if(this.editCenterForm.value.CenterAddress==''){
      this.toasterService.showToast('Please enter center address...', 'error');
    }
    else if(this.editCenterForm.value.PinCode==''){
      this.toasterService.showToast('Please enter pin code...', 'error');
    }
    else if(this.editCenterForm.value.CenterMobileNumber==''){
      this.toasterService.showToast('Please enter mobile number...', 'error');
    }
    else if (!/^[6-9][0-9]{9}$/.test(this.editCenterForm.value.CenterMobileNumber)) {
      this.toasterService.showToast('Please enter a valid 10-digit mobile number...', 'error');
    }
    else if (this.editCenterForm.value.CenterEmailId == '') {
    this.toasterService.showToast('Please enter email address...', 'error');
    }
    else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(this.editCenterForm.value.CenterEmailId)) {
      this.toasterService.showToast('Please enter a valid email address...', 'error');
    }
    else if(this.editCenterForm.value.ddlAutoBarcode==''){
      this.toasterService.showToast('Please select auto barccode...', 'error');
    }
    else{
      debugger;
      this.centerRequest.centerCode=this.editCenterForm.value.CenterCode;
      this.centerRequest.centerName=this.editCenterForm.value.CenterName;
      this.centerRequest.centerInchargeName=this.editCenterForm.value.CenterIncharge;
      this.centerRequest.salesIncharge=this.editCenterForm.value.ddlSalesIncharge;
      this.centerRequest.centerAddress=this.editCenterForm.value.CenterAddress;
      this.centerRequest.pincode=this.editCenterForm.value.PinCode;
      this.centerRequest.mobileNumber=this.editCenterForm.value.CenterMobileNumber;
      this.centerRequest.alternateContactNo=this.editCenterForm.value.AlternateContactNumber;
      this.centerRequest.emailId=this.editCenterForm.value.CenterEmailId;
      this.centerRequest.rateType=this.editCenterForm.value.ddlRateType;
       this.centerRequest.centerStatus = JSON.parse(this.editCenterForm.value.ddlCenterStatus.toLowerCase());
      this.centerRequest.introducedBy=this.editCenterForm.value.IntroducedBy; 
      this.centerRequest.creditLimit=this.editCenterForm.value.CreditLimit;
      this.centerRequest.isAutoBarcode=JSON.parse(this.editCenterForm.value.ddlAutoBarcode.toLowerCase());
      this.centerRequest.partnerId=this.partnerId; 
      this.centerRequest.createdBy=this.loggedInUserId; 
      this.centerRequest.modifiedBy=this.loggedInUserId;

      this.centerService.updateCenterDetails(this.centerRequest)
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
