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
import { RefreshPageService } from '../../../auth/Shared/refresh-page.service';
import { TestService } from '../../../auth/TestMasterService/test.service';
import { LoaderService } from '../../../Interfaces/loader.service';
import { OutLabService } from '../../../auth/OutLab/out-lab.service';
import { OutLabResponse } from '../../../Interfaces/OutLab/out-lab-response';
import { OutLabRequest } from '../../../Interfaces/OutLab/out-lab-request';


@Component({
  selector: 'app-popup-out-labedit',
  standalone: true,
   imports: [ToastComponent, CommonModule, MatIcon, ReactiveFormsModule, LoaderComponent],
  templateUrl: './popup-out-labedit.component.html',
  styleUrl: './popup-out-labedit.component.css'
})
export class PopupOutLabeditComponent {
loading$!: Observable<boolean>;
isAddHeaderVisible:boolean=false;
isEditHeaderVisible:boolean=false;
isVisible = false;
roleId:any;
partnerId: string |any;
loggedInUserId: string |any;
editOutLabForm!: FormGroup<any>;
isSubmitVisible:boolean=false;
isUpdateVisible:boolean=false;
labCode:any
outLabApiResponse:Observable<OutLabResponse>| any;
outLabRequest:OutLabRequest={
  labCode: '',
  labName: '',
  contactPerson: '',
  mobileNumber: '',
  email: '',
  introducedBy: '',
  labStatus: false,
  partnerId: ''
}

constructor(public dialogRef: MatDialogRef<PopupOutLabeditComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      private authService:AuthService,
      private toasterService: ToastService,
      private refPageService:RefreshPageService,
      private formBuilder: FormBuilder,
      private testService:TestService,
      private loaderService: LoaderService,
      public dialog: MatDialog, 
      private zone: NgZone,
      private outlabService:OutLabService
    ){
      this.partnerId= localStorage.getItem('partnerId');
      this.loggedInUserId=localStorage.getItem('userId');
      this.roleId=data.roleId;
      this.labCode=data.labCode;
    }

open(): void {
    this.isVisible = true;
  }

  close(): void {
    this.dialogRef.close();
  }

   ngOnInit(): void {
  this.editOutLabForm=this.formBuilder.group({
      LabCode:[{ value: '', disabled: true }],
      LabName:[''],
      ContactPerson:[''],
      MobileNumber:  [
        '',
        [
          Validators.required,
          Validators.pattern('^[6-9][0-9]{9}$') // ✅ 10-digit Indian mobile number pattern
        ]
      ],
      EmailId:[''],
      IntroducedBy:[''],
      ddlLabStatus:[''],
    });

     setTimeout(() => {  // 🔑 forces update in next CD cycle
    if (!this.labCode) {
      this.isAddHeaderVisible = true;
      this.isEditHeaderVisible = false;
      this.isSubmitVisible = true;
      this.isUpdateVisible = false;
    
    } else {
      this.isEditHeaderVisible = true;
      this.isAddHeaderVisible = false;
      this.isSubmitVisible = false;
      this.isUpdateVisible = true;
     
      this.getOutLabDetailsbyCode(this.labCode);
    }
  });

  }
  
  /// used to get out lab details by lab code
  getOutLabDetailsbyCode(labCode:any){
    debugger;
    this.loaderService.show();
    this.outlabService.getOutLabByLabCode(labCode,this.partnerId).subscribe({
      next: (response: any) => {
        debugger;
        if (response?.status && response?.statusCode === 200) {
          this.outLabApiResponse = response.data; 
          const outLabData = response.data[0]; // first item in array
        this.editOutLabForm.patchValue({
        LabCode: outLabData.labCode || '',
        LabName: outLabData.labName || '',
        ContactPerson: outLabData.contactPerson || '',
        MobileNumber: outLabData.mobileNumber || '',
        EmailId: outLabData.email || '',
        IntroducedBy: outLabData.introducedBy || '',
        ddlLabStatus: outLabData.labStatus ? 'true' : 'false',
       
      });
          console.log(this.outLabApiResponse);
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

  /// used to create new out lab details
createNewOutLab(){
  debugger;
     this.loaderService.show();
    if(this.editOutLabForm.value.LabName==''){
      this.toasterService.showToast('Please enter lab name...', 'error');
    }
    else if(this.editOutLabForm.value.MobileNumber==''){
      this.toasterService.showToast('Please enter mobile number...', 'error');
    }
    else if (!/^[6-9][0-9]{9}$/.test(this.editOutLabForm.value.MobileNumber)) {
      this.toasterService.showToast('Please enter a valid 10-digit mobile number...', 'error');
    }
    else if (this.editOutLabForm.value.EmailId == '') {
    this.toasterService.showToast('Please enter email address...', 'error');
    }
    else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(this.editOutLabForm.value.EmailId)) {
      this.toasterService.showToast('Please enter a valid email address...', 'error');
    }
    else if(this.editOutLabForm.value.ddlLabStatus==''){
      this.toasterService.showToast('Please select lab status...', 'error');
    }
    else{
      debugger;
      this.outLabRequest.partnerId=this.partnerId; 
      this.outLabRequest.labName=this.editOutLabForm.value.LabName;
      this.outLabRequest.contactPerson=this.editOutLabForm.value.ContactPerson;
      this.outLabRequest.mobileNumber=this.editOutLabForm.value.MobileNumber;
      this.outLabRequest.email=this.editOutLabForm.value.EmailId;
      this.outLabRequest.introducedBy=this.editOutLabForm.value.IntroducedBy;
      this.outLabRequest.labStatus = JSON.parse(this.editOutLabForm.value.ddlLabStatus.toLowerCase());

    this.outlabService.addNewOutLab(this.outLabRequest)
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

    /// used to create new out lab details
updateOutLab(){
  debugger;
     this.loaderService.show();
    if(this.editOutLabForm.value.LabName==''){
      this.toasterService.showToast('Please enter lab name...', 'error');
    }
    else if(this.editOutLabForm.value.MobileNumber==''){
      this.toasterService.showToast('Please enter mobile number...', 'error');
    }
    else if (!/^[6-9][0-9]{9}$/.test(this.editOutLabForm.value.MobileNumber)) {
      this.toasterService.showToast('Please enter a valid 10-digit mobile number...', 'error');
    }
    else if (this.editOutLabForm.value.EmailId == '') {
    this.toasterService.showToast('Please enter email address...', 'error');
    }
    else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(this.editOutLabForm.value.EmailId)) {
      this.toasterService.showToast('Please enter a valid email address...', 'error');
    }
    else if(this.editOutLabForm.value.ddlLabStatus==''){
      this.toasterService.showToast('Please select lab status...', 'error');
    }
    else{
      debugger;
      this.outLabRequest.labCode=this.labCode;
      this.outLabRequest.partnerId=this.partnerId; 
      this.outLabRequest.labName=this.editOutLabForm.value.LabName;
      this.outLabRequest.contactPerson=this.editOutLabForm.value.ContactPerson;
      this.outLabRequest.mobileNumber=this.editOutLabForm.value.MobileNumber;
      this.outLabRequest.email=this.editOutLabForm.value.EmailId;
      this.outLabRequest.introducedBy=this.editOutLabForm.value.IntroducedBy;
      this.outLabRequest.labStatus = JSON.parse(this.editOutLabForm.value.ddlLabStatus.toLowerCase());

    this.outlabService.updateOutLabDetails(this.outLabRequest)
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
