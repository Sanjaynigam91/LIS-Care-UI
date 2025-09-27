import { Component, Inject, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatGridListModule, MatGridTile } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../../auth/UserService/user.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LoaderService } from '../../../../Interfaces/loader.service';
import { Observable } from 'rxjs';
import { AuthService } from '../../../../auth/auth.service';
import { rolesApiResponse } from '../../../../Interfaces/rolesApiResponse';
import { userroleresponse } from '../../../../Interfaces/userroleresponse';
import { userdepartments } from '../../../../Interfaces/userdepartments';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginApiResponse } from '../../../../Interfaces/login-api-response';
import { ToastComponent } from "../../../Toaster/toast/toast.component";
import { ToastService } from '../../../../auth/Toaster/toast.service';
import { PartnerUserRequest } from '../../../../Interfaces/PartnerUserRequest';
import { ConfirmationDialogComponentComponent } from '../../../confirmation-dialog-component/confirmation-dialog-component.component';
import { LoaderComponent } from "../../../loader/loader.component";


@Component({
  selector: 'app-adduser',
  standalone: true,
  imports: [MatButtonModule, MatTableModule, MatPaginatorModule, MatCardModule,
    MatListModule, MatGridListModule, MatGridTile, MatIconModule, CommonModule,
    ReactiveFormsModule, ToastComponent, ConfirmationDialogComponentComponent, LoaderComponent],
  templateUrl: './adduser.component.html',
  styleUrl: './adduser.component.css'
})
export class AdduserComponent {

  title = 'Add/Edit User';
  router  =  inject(Router);
  isSaveVisible:boolean=false;
  isUpdateVisible:boolean=false;
  isAddHeaderVisible:boolean=false;
  isEditHeaderVisible:boolean=false;
  loading$!: Observable<boolean>;
  partnerId: string |any;
  rolesApiResponse: Observable<rolesApiResponse>| any;
  userTypeResponse:Observable<userroleresponse>| any;
  userDeptResponse:Observable<userdepartments>| any;
  users: Observable<LoginApiResponse>| any; // used for getuser list
  userId: any;
  loggedInUserId:any;
  editUserForm!: FormGroup<any>;
  firstName!:FormGroup<any>;
  fileBase64: string | ArrayBuffer | null = null;
  partnerUserRequest:PartnerUserRequest={
    firstName: '',
    lastName: '',
    email: '',
    mobileNumber: '',
    password: '',
    departmentId: 0,
    roleId: 0,
    userStatus: '',
    partnerId: '',
    userLogo: '',
    createdById: '',
    userId: 0,
    modifiedById: ''
  }

  constructor(public dialogRef: MatDialogRef<AdduserComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
    private authService:AuthService,private userService: UserService,private formBuilder: FormBuilder,
    public dialog: MatDialog,private loaderService: LoaderService,private route: ActivatedRoute,
    private toasterService: ToastService) {
    this.loading$ = this.loaderService.loading$;
    this.partnerId= localStorage.getItem('partnerId');
    this.loggedInUserId=localStorage.getItem('userId');
    this.userId=this.data.userId;

  }
 // Page load method
  ngOnInit(): void{
    debugger;
    this.editUserForm = this.formBuilder.group({
      firstName: [''],
      lastName: [''],
      email:[''],
      mobileNumber:[''],
      password:[''],
      ddlDepartmentId:[''],
      ddlUserAssignRole:[''],
      ddlUserStatus:[''],
    });

    if(this.userId!==undefined){
      debugger;
      // load the user data by Id into add user in edit mode
      this.isSaveVisible=false;
      this.isUpdateVisible=true; 
      this.isUpdateVisible=true;
      this.isAddHeaderVisible=false;
      this.isEditHeaderVisible=true;
    }
    else{
      debugger;
      this.isSaveVisible=true;
      this.isUpdateVisible=false; 
      this.isUpdateVisible=false;
      this.isAddHeaderVisible=true;
      this.isEditHeaderVisible=false;
      this.editUserForm.patchValue({      
        ddlDepartmentId:"0",
        ddlUserAssignRole:"0"      
      })
    }  

    this.loaderService.hide();
    this.route.paramMap.subscribe(params => {
      debugger;
     // this.userId = params.get('userId');
      console.log(params);
    });
     // Bind data into User Department dropdown
     this. GetUserDepartments();
     // Bind data into Assign User role dropdown
    this.GetUserRoles();
    this.GetUserDataById();
     
     this.loaderService.hide(); 
  }
  BackScreen(){
    debugger;
    this.router.navigate(['/Pages/Master/security/UserMaster']);
  }
  
  GetUserRoles(){
    this.authService.getAllRoles().subscribe((response:any)=>{
      debugger;
     this.rolesApiResponse = response.data; 
     console.log(response);
    })
  }

  GetUserTypes(){
    this.authService.getAllRoleType().subscribe((response:any)=>{
     this.userTypeResponse = response.data; 
     console.log(response);
    })
  }

  GetUserDepartments(){
    debugger;
    this.authService.getAllDepartments().subscribe((response:any)=>{
      debugger;
     this.userDeptResponse = response.data; 
     console.log(this.userDeptResponse);
    })
  }

  GetUserDataById(){
    debugger;
    this.loaderService.show();
    this.userService.GetUserInfoById(this.userId).subscribe((response=>{
      debugger;
     if(response.status && response.statusCode==200){
      this.editUserForm.patchValue({
      firstName: response.data.firstName,
      lastName: response.data.lastName,
      email:response.data.email,
      mobileNumber:response.data.mobileNumber,
      password:response.data.password,
      ddlDepartmentId:response.data.departmentId,
      ddlUserAssignRole:response.data.roleId,
      ddlUserStatus:response.data.userStatus,
      })
      debugger;
      this.fileBase64=response.data.userLogo;
      console.log(this.fileBase64);
       console.log(this.editUserForm);
       this.loaderService.hide();
     }
    }))
  }

  onFileChange(event: Event): void {
    debugger;
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      debugger;
      const file = input.files[0];
      this.convertFileToBase64(file);
    } 
  }
  private convertFileToBase64(file: File): void {
    debugger;
    const reader = new FileReader();

    reader.onloadend = () => {
      debugger;
      this.fileBase64 = reader.result;
      console.log(this.fileBase64);
    };

    reader.readAsDataURL(file); // This will give a base64 encoded string
  }

 onSubmit():void{
  debugger;
  this.loaderService.show();
  if(this.editUserForm.value.firstName==''){
    this.toasterService.showToast('Please enter first name.', 'error');
  }
  else if(this.editUserForm.value.lastName==''){
    this.toasterService.showToast('Please enter last name.', 'error');
  }
  else if(this.editUserForm.value.email==''){
    this.toasterService.showToast('Please enter email.', 'error');
  }
  else if(this.editUserForm.value.mobileNumber==''){
    this.toasterService.showToast('Please enter mobile number.', 'error');
  }
  else if(this.editUserForm.value.password==''){
    this.toasterService.showToast('Please enter password.', 'error');
  }
  else if(this.editUserForm.value.ddlDepartmentId=='0'){
    this.toasterService.showToast('Please choose the department.', 'error');
  }
  else if(this.editUserForm.value.ddlUserAssignRole=='0'){
    this.toasterService.showToast('Please choose the assign role.', 'error');
  }
  else if(this.editUserForm.value.ddlUserStatus==''){
    this.toasterService.showToast('Please choose the user status.', 'error');
  }
  else if(this.fileBase64==null){
    this.toasterService.showToast('Please upload the user logo.', 'error');
  }
else {
  debugger;
    this.partnerUserRequest.firstName=this.editUserForm.value.firstName;
    this.partnerUserRequest.lastName=this.editUserForm.value.lastName;
    this.partnerUserRequest.email=this.editUserForm.value.email;
    this.partnerUserRequest.mobileNumber=this.editUserForm.value.mobileNumber;
    this.partnerUserRequest.password=this.editUserForm.value.password;
    this.partnerUserRequest.departmentId=this.editUserForm.value.ddlDepartmentId;
    this.partnerUserRequest.roleId=this.editUserForm.value.ddlUserAssignRole;
    this.partnerUserRequest.userStatus=this.editUserForm.value.ddlUserStatus;
    this.partnerUserRequest.partnerId=this.partnerId;
    this.partnerUserRequest.userLogo=this.fileBase64;
    this.partnerUserRequest.createdById=this.loggedInUserId;

    this.userService.saveUserInfo(this.partnerUserRequest)
    .subscribe({
      next: (response: any) => {
        debugger;
        if(response.statusCode==200 && response.status){
          debugger;
          console.log(response);
          this.toasterService.showToast('User data inserted successfully!', 'success');
          this.router.navigate(['/Pages/Master/security/UserMaster']);
        }
        else{
          debugger;
          console.log(response.message);
        }
        
      },
      error: (err) => console.log(err)
    });   
  }
  this.loaderService.hide();
 }

 onUpdateSubmit():void{
  debugger;
  this.loaderService.show();
  this.partnerUserRequest.userId=this.userId;
  this.partnerUserRequest.firstName=this.editUserForm.value.firstName;
  this.partnerUserRequest.lastName=this.editUserForm.value.lastName;
  this.partnerUserRequest.email=this.editUserForm.value.email;
  this.partnerUserRequest.mobileNumber=this.editUserForm.value.mobileNumber;
  this.partnerUserRequest.password=this.editUserForm.value.password;
  this.partnerUserRequest.departmentId=this.editUserForm.value.ddlDepartmentId;
  this.partnerUserRequest.roleId=this.editUserForm.value.ddlUserAssignRole;
  this.partnerUserRequest.userStatus=this.editUserForm.value.ddlUserStatus;
  this.partnerUserRequest.partnerId=this.partnerId;
  this.partnerUserRequest.userLogo=this.fileBase64;
  this.partnerUserRequest.modifiedById=this.loggedInUserId;
  if(this.editUserForm.value.firstName==''){
    this.toasterService.showToast('Please enter first name.', 'error');
  }
  else if(this.editUserForm.value.lastName==''){
    this.toasterService.showToast('Please enter last name.', 'error');
  }
  else if(this.editUserForm.value.email==''){
    this.toasterService.showToast('Please enter email.', 'error');
  }
  else if(this.editUserForm.value.mobileNumber==''){
    this.toasterService.showToast('Please enter mobile number.', 'error');
  }
  else if(this.editUserForm.value.password==''){
    this.toasterService.showToast('Please enter password.', 'error');
  }
  else if(this.editUserForm.value.ddlDepartmentId=='0'){
    this.toasterService.showToast('Please choose the department.', 'error');
  }
  else if(this.editUserForm.value.ddlUserAssignRole=='0'){
    this.toasterService.showToast('Please choose the assign role.', 'error');
  }
  else if(this.editUserForm.value.ddlUserStatus==''){
    this.toasterService.showToast('Please choose the user status.', 'error');
  }
  else if(this.fileBase64==null){
    this.toasterService.showToast('Please upload the user logo.', 'error');
  }
  else if(this.editUserForm.valid){
    debugger;
    this.userService.EditUserInfo(this.partnerUserRequest)
    .subscribe({
      next: (response: any) => {
        debugger;
        if(response.statusCode==200 && response.status){
          debugger;
          console.log(response);
          this.toasterService.showToast('User data updated successfully!', 'success');
          this.router.navigate(['/Pages/Master/security/UserMaster']);
        }
        else{
          debugger;
          console.log(response.message);
        }
        
      },
      error: (err) => console.log(err)
    });  
  }
  this.loaderService.hide();
 }

   close(): void {
    this.dialogRef.close();
  }
}
