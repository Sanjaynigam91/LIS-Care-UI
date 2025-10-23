import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastService } from '../../../auth/Toaster/toast.service';
import { CenterServiceService } from '../../../auth/Center/center-service.service';
import { RefreshPageService } from '../../../auth/Shared/refresh-page.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TestService } from '../../../auth/TestMasterService/test.service';
import { LoaderService } from '../../../Interfaces/loader.service';
import { ClinicServiceService } from '../../../auth/ClinicMaster/clinic-service.service';
import { Observable } from 'rxjs';
import { ToastComponent } from '../../Toaster/toast/toast.component';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { LoaderComponent } from '../../loader/loader.component';
import { CenterResponse } from '../../../Interfaces/CenterMaster/CenterResponse';
import { ClientRequest } from '../../../Interfaces/ClientMaster/client-request';
import { ClientService } from '../../../auth/ClientMaster/client.service';
import { ClientResponse } from '../../../Interfaces/ClientMaster/client-response';

@Component({
  selector: 'app-popup-clientmasteredit',
  standalone: true,
   imports: [ToastComponent, CommonModule, MatIcon, ReactiveFormsModule, LoaderComponent],
  templateUrl: './popup-clientmasteredit.component.html',
  styleUrl: './popup-clientmasteredit.component.css'
})
export class PopupClientmastereditComponent {
loading$!: Observable<boolean>;
isAddHeaderVisible:boolean=false;
isEditHeaderVisible:boolean=false;
isVisible = false;
roleId:any;
partnerId: string |any;
loggedInUserId: string |any;
editClientMasterForm!: FormGroup<any>;
isSubmitVisible:boolean=false;
isUpdateVisible:boolean=false;
clientId:string|any;
centerStatus:string|any;
SeachByNameOrCode:string|any;
centerApiResponse:Observable<CenterResponse>| any;
clientRequest: ClientRequest = {
  clientId: null,   // ✅ null, not empty string
  partnerId: '',
  clientCode: '',
  clientName: '',
  speciality: '',
  licenseNumber: '',
  clientType: '',
  emailId: '',
  mobileNumber: '',
  address: '',
  centreCode: '',
  clientStatus: false
};

clientApiResponse:Observable<ClientResponse>|any;

constructor(public dialogRef: MatDialogRef<PopupClientmastereditComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      private toasterService: ToastService,private centerService:CenterServiceService,
      private refPageService:RefreshPageService,private formBuilder: FormBuilder,
      private testService:TestService,private loaderService: LoaderService
      ,public dialog: MatDialog,private clientService:ClientService
    ){
      this.partnerId= localStorage.getItem('partnerId');
      this.loggedInUserId=localStorage.getItem('userId');
      this.roleId=data.roleId;
      this.clientId=data.clientId;
    }

     ngOnInit(): void {
          this.editClientMasterForm=this.formBuilder.group({
              ClientName:[''],
              Speciality:[''],
              RegistrationNumber:[''],
              ddlClientType:[''],
              EmailId:[''],
              MobileNumber:  [
                '',
                [
                  Validators.required,
                  Validators.pattern('^[6-9][0-9]{9}$') // ✅ 10-digit Indian mobile number pattern
                ]
              ], 
              Address:[''],          
              ddlCentre:[''],
              ddlStatus:[''],
            });
        
             setTimeout(() => {  // 🔑 forces update in next CD cycle
            if (!this.clientId) {
              this.isAddHeaderVisible = true;
              this.isEditHeaderVisible = false;
              this.isSubmitVisible = true;
              this.isUpdateVisible = false;
            
            } else {
              this.isEditHeaderVisible = true;
              this.isAddHeaderVisible = false;
              this.isSubmitVisible = false;
              this.isUpdateVisible = true;
             
             this.getClientDetailsbyId(this.clientId);
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

  /// used to create new client details
createNewClient(){
  debugger;
     this.loaderService.show();
    if(this.editClientMasterForm.value.ClientName==''){
      this.toasterService.showToast('Please enter client name...', 'error');
    }
    else if(this.editClientMasterForm.value.Speciality==''){
      this.toasterService.showToast('Please enter speciality...', 'error');
    }
    else if(this.editClientMasterForm.value.RegistrationNumber==''){
      this.toasterService.showToast('Please enter registration or license number...', 'error');
    }
    else if(this.editClientMasterForm.value.ddlSalesIncharge==''){
      this.toasterService.showToast('Please select sales incharge...', 'error');
    }
    else if(this.editClientMasterForm.value.ddlClientType==''){
      this.toasterService.showToast('Please select client type...', 'error');
    }
    else if (this.editClientMasterForm.value.EmailId == '') {
    this.toasterService.showToast('Please enter email address...', 'error');
    }
    else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(this.editClientMasterForm.value.EmailId)) {
      this.toasterService.showToast('Please enter a valid email address...', 'error');
    }
    else if(this.editClientMasterForm.value.MobileNumber==''){
      this.toasterService.showToast('Please enter mobile number...', 'error');
    }
    else if (!/^[6-9][0-9]{9}$/.test(this.editClientMasterForm.value.MobileNumber)) {
      this.toasterService.showToast('Please enter a valid 10-digit mobile number...', 'error');
    }
    else if(this.editClientMasterForm.value.Address==''){
      this.toasterService.showToast('Please enter client address...', 'error');
    }
    else if(this.editClientMasterForm.value.ddlCentre=='')
    {
      this.toasterService.showToast('Please select center name...', 'error');
    }
    else if(this.editClientMasterForm.value.ddlStatus=='')
    {
      this.toasterService.showToast('Please select client status...', 'error');
    }
    else{
      debugger;
      this.clientRequest.partnerId=this.partnerId; 
      this.clientRequest.clientName=this.editClientMasterForm.value.ClientName;
      this.clientRequest.speciality=this.editClientMasterForm.value.Speciality;
      this.clientRequest.licenseNumber=this.editClientMasterForm.value.RegistrationNumber;
      this.clientRequest.clientType=this.editClientMasterForm.value.ddlClientType;
      this.clientRequest.emailId=this.editClientMasterForm.value.EmailId;
      this.clientRequest.mobileNumber=this.editClientMasterForm.value.MobileNumber;
      this.clientRequest.address=this.editClientMasterForm.value.Address;
      this.clientRequest.centreCode=this.editClientMasterForm.value.ddlCentre;
      this.clientRequest.clientStatus = JSON.parse(this.editClientMasterForm.value.ddlStatus.toLowerCase());
      
    this.clientService.addNewClient(this.clientRequest)
    .subscribe({
    next: (response: any) => {
      if (response.statusCode === 200 && response.status) {
        debugger;
        this.refPageService.notifyRefresh(); // used to refresh the main list page
        this.toasterService.showToast(response.responseMessage, 'success');
        this.dialogRef.close();
      } else {
        this.toasterService.showToast(response.responseMessage, 'error');
      }
    },
    error: (err) => {
      debugger;
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


    /// used to update client details
updateClient(){
  debugger;
     this.loaderService.show();
    if(this.editClientMasterForm.value.ClientName==''){
      this.toasterService.showToast('Please enter client name...', 'error');
    }
    else if(this.editClientMasterForm.value.Speciality==''){
      this.toasterService.showToast('Please enter speciality...', 'error');
    }
    else if(this.editClientMasterForm.value.RegistrationNumber==''){
      this.toasterService.showToast('Please enter registration or license number...', 'error');
    }
    else if(this.editClientMasterForm.value.ddlSalesIncharge==''){
      this.toasterService.showToast('Please select sales incharge...', 'error');
    }
    else if(this.editClientMasterForm.value.ddlClientType==''){
      this.toasterService.showToast('Please select client type...', 'error');
    }
    else if (this.editClientMasterForm.value.EmailId == '') {
    this.toasterService.showToast('Please enter email address...', 'error');
    }
    else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(this.editClientMasterForm.value.EmailId)) {
      this.toasterService.showToast('Please enter a valid email address...', 'error');
    }
    else if(this.editClientMasterForm.value.MobileNumber==''){
      this.toasterService.showToast('Please enter mobile number...', 'error');
    }
    else if (!/^[6-9][0-9]{9}$/.test(this.editClientMasterForm.value.MobileNumber)) {
      this.toasterService.showToast('Please enter a valid 10-digit mobile number...', 'error');
    }
    else if(this.editClientMasterForm.value.Address==''){
      this.toasterService.showToast('Please enter client address...', 'error');
    }
    else if(this.editClientMasterForm.value.ddlCentre=='')
    {
      this.toasterService.showToast('Please select center name...', 'error');
    }
    else if(this.editClientMasterForm.value.ddlStatus=='')
    {
      this.toasterService.showToast('Please select client status...', 'error');
    }
    else{
      debugger;
      this.clientRequest.partnerId=this.partnerId; 
      this.clientRequest.clientId=this.clientId; 
      this.clientRequest.clientName=this.editClientMasterForm.value.ClientName;
      this.clientRequest.speciality=this.editClientMasterForm.value.Speciality;
      this.clientRequest.licenseNumber=this.editClientMasterForm.value.RegistrationNumber;
      this.clientRequest.clientType=this.editClientMasterForm.value.ddlClientType;
      this.clientRequest.emailId=this.editClientMasterForm.value.EmailId;
      this.clientRequest.mobileNumber=this.editClientMasterForm.value.MobileNumber;
      this.clientRequest.address=this.editClientMasterForm.value.Address;
      this.clientRequest.centreCode=this.editClientMasterForm.value.ddlCentre;
      this.clientRequest.clientStatus = JSON.parse(this.editClientMasterForm.value.ddlStatus.toLowerCase());
      
    this.clientService.updateClientDetails(this.clientRequest)
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

  /// used to get center details by center code
  getClientDetailsbyId(clientId:any){
    debugger;
    this.loaderService.show();
    this.clientService.getClientById(clientId,this.partnerId).subscribe({
      next: (response: any) => {
        debugger;
        if (response?.status && response?.statusCode === 200) {
        this.clientApiResponse = response.data; 
        const client = response.data[0]; // first item in array
        this.editClientMasterForm.patchValue({
        ClientName: client.clientName || '',
        Speciality: client.speciality || '',
        RegistrationNumber: client.licenseNumber || '',
        ddlClientType: client.clientType || '',
        EmailId: client.emailId || '',
        MobileNumber: client.mobileNumber || '',
        Address: client.address || '',
        ddlCentre: client.centerCode,
        ddlStatus: client.clientStatus ? 'true' : 'false',
      });
          console.log(this.clientApiResponse);
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


}
