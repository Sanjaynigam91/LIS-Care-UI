import { CommonModule } from '@angular/common';
import { Component, inject, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardActions } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ToastComponent } from '../../Toaster/toast/toast.component';
import { LoaderComponent } from '../../loader/loader.component';
import { AuthService } from '../../../auth/auth.service';
import { userdepartments } from '../../../Interfaces/userdepartments';
import { Observable } from 'rxjs';
import { userroleresponse } from '../../../Interfaces/userroleresponse';
import { lisrolerequest } from '../../../Interfaces/Role/lisrolerequest';
import { ToastService } from '../../../auth/Toaster/toast.service';
import { LisroleService } from '../../../auth/Role/lisrole.service';
import { Router } from '@angular/router';
import { LisRoleResponseModel } from '../../../Interfaces/Role/LisRoleResponseModel';
import { LISRoleUpdateRequestModel } from '../../../Interfaces/Role/LISRoleUpdateRequestModel';
import { RefreshPageService } from '../../../auth/Shared/refresh-page.service';

@Component({
  selector: 'app-addrole',
  standalone: true,
  imports: [MatIconModule,
    MatFormFieldModule, MatIconModule, MatSelectModule, FormsModule, 
    MatInputModule, ToastComponent,CommonModule],
  templateUrl: './addrole.component.html',
  styleUrl: './addrole.component.css'
})
export class AddroleComponent {
   router  =  inject(Router);
   isVisible = false;
   isSubmitVisible:boolean=false;
   isUpdateVisible:boolean=false;
   isAddHeaderVisible:boolean=false;
   isEditHeaderVisible:boolean=false;
   roleId:any;
   deptResponse:Observable<userdepartments>| any;
   roleTypeResponse:Observable<userroleresponse>| any;
   lisRoleResponse: Observable<LisRoleResponseModel>| any;
   partnerId: string |any;
   loggedInUserId: string |any;
   lisrolerequest:lisrolerequest={
     roleCode: '',
     roleName: '',
     roleType: '',
     department: '',
     roleStatus: ''
   }
   LISRoleUpdateRequestModel:LISRoleUpdateRequestModel={
     roleCode: '',
     roleName: '',
     roleType: '',
     department: '',
     roleStatus: '',
     roleId: 0
   }
   roleCode:any;
   private result: any;

    constructor(public dialogRef: MatDialogRef<AddroleComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,private authService:AuthService,
      private toasterService: ToastService,private lisRoleService:LisroleService,
      private refPageService:RefreshPageService
    ){
      this.partnerId= localStorage.getItem('partnerId');
      this.loggedInUserId=localStorage.getItem('userId');
      this.roleId=data.roleId;
    }
   
  ngOnInit():void{
    debugger;
   this.lisrolerequest={
      roleCode: '',
      roleName: '',
      roleType: '',
      department: '',
      roleStatus: ''
    }
    this.GetUserDepartments();
    this. GetRoleTypes();
    if(this.roleId>0){
      this.isSubmitVisible=false;
      this.isUpdateVisible=true;
      this.isEditHeaderVisible=true;
      this.GetRolesById(this.roleId);
    }
    else{
      this.isSubmitVisible=true;
      this.isUpdateVisible=false;
      this.isAddHeaderVisible=true;
    }
  }

  open(): void {
    this.isVisible = true;
  }

  close(): void {
    this.dialogRef.close();
  }
  GetUserDepartments(){
    debugger;
    this.authService.getAllDepartments().subscribe((response:any)=>{
      debugger;
     this.deptResponse = response.data; 
     console.log(this.deptResponse);
    })
  }
  GetRoleTypes(){
    debugger;
    this.authService.getAllRoleType().subscribe((response:any)=>{
     this.roleTypeResponse = response.data; 
     console.log(response);
    })
  }
  
  onSubmit():void{
    debugger;
     if(this.lisrolerequest.roleCode==''){
      this.toasterService.showToast('Please enter role code.', 'error');
     }
     else if(this.lisrolerequest.roleName==''){
      this.toasterService.showToast('Please enter role name.', 'error');
     }
     else if (this.lisrolerequest.department==''){
      this.toasterService.showToast('Please select department.', 'error');
     }
     else if (this.lisrolerequest.roleType==''){
      this.toasterService.showToast('Please select role type.', 'error');
     }
     else if (this.lisrolerequest.roleStatus==''){
      this.toasterService.showToast('Please select status.', 'error');
     }
     else{
      this.lisRoleService.addNewRole(this.lisrolerequest)
      .subscribe({
        next: (response: any) => {
          debugger;
          if(response.statusCode==200 && response.status){
            debugger;
            console.log(response);
             // Notify the main component
             this.refPageService.notifyRefresh(); // used to refresh the main list page
            this.toasterService.showToast('New role added successfully!', 'success');
            this.dialogRef.close();
            //this.router.navigate(['/Pages/Master/security/UserRoleMaster']);
          }
          else{
            debugger;
            console.log(response.message);
          }  
        },
        error: (err) => console.log(err)
      });  
     }
  }

  GetRolesById(roleId:any){
    debugger;
    this.lisRoleService.GetRoleInfoById(this.roleId).subscribe((response=>{
      debugger;
     if(response.status && response.statusCode==200){
      debugger;
      this.lisrolerequest.roleCode=response.data.roleCode;
      this.lisrolerequest.roleName=response.data.roleName;
      this.lisrolerequest.roleType=response.data.roleType;
      this.lisrolerequest.department=response.data.department;
      this.lisrolerequest.roleStatus=response.data.roleStatus.toLocaleLowerCase();
     }
    }))
  }

  onUpdate():void{
    debugger;
     this.LISRoleUpdateRequestModel.roleId=this.roleId;
     this.LISRoleUpdateRequestModel.roleCode=this.lisrolerequest.roleCode;
     this.LISRoleUpdateRequestModel.roleName=this.lisrolerequest.roleName;
     this.LISRoleUpdateRequestModel.department=this.lisrolerequest.department;
     this.LISRoleUpdateRequestModel.roleType=this.lisrolerequest.roleType;
     this.LISRoleUpdateRequestModel.roleStatus=this.lisrolerequest.roleStatus;
     if(this.LISRoleUpdateRequestModel.roleCode==''){
      this.toasterService.showToast('Please enter role code.', 'error');
     }
     else if(this.LISRoleUpdateRequestModel.roleName==''){
      this.toasterService.showToast('Please enter role name.', 'error');
     }
     else if (this.LISRoleUpdateRequestModel.department==''){
      this.toasterService.showToast('Please select department.', 'error');
     }
     else if (this.LISRoleUpdateRequestModel.roleType==''){
      this.toasterService.showToast('Please select role type.', 'error');
     }
     else if (this.LISRoleUpdateRequestModel.roleStatus==''){
      this.toasterService.showToast('Please select status.', 'error');
     }
     else{
      this.lisRoleService.EditRoleInfo(this.LISRoleUpdateRequestModel)
      .subscribe({
        next: (response: any) => {
          debugger;
          if(response.statusCode==200 && response.status){
            debugger;
            console.log(response);
               // Notify the main component
               this.refPageService.notifyRefresh(); // used to refresh the main list page
            this.toasterService.showToast('Role updated successfully!', 'success');
            this.dialogRef.close();
           // this.router.navigate(['/Pages/Master/security/UserRoleMaster']);
          }
          else{
            debugger;
            console.log(response.message);
          }  
        },
        error: (err) => console.log(err)
      });  
     }
  }
}
