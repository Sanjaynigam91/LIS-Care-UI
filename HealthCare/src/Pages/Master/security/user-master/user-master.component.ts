import { Component, ElementRef, inject,OnInit, ViewChild } from '@angular/core';
import { UserService } from '../../../../auth/UserService/user.service';
import { FormControl,FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { LoginApiResponse } from '../../../../Interfaces/login-api-response';
import { Router } from '@angular/router';
import { MatTableModule, } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import {MatSort, MatSortModule, Sort} from '@angular/material/sort';
import { CommonModule } from '@angular/common';
import {MatCardModule} from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { DesignDialogComponent } from '../../../PopUp/design-dialog/design-dialog.component';
import {MatButtonModule} from '@angular/material/button';
import { userroleresponse } from '../../../../Interfaces/userroleresponse';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NgxPaginationModule } from 'ngx-pagination';
import { LoaderComponent } from "../../../loader/loader.component"; 
import { LoaderService } from '../../../../Interfaces/loader.service';
import { UserRequest } from '../../../../Interfaces/UserRequest';
import { ConfirmationDialogComponentComponent } from '../../../confirmation-dialog-component/confirmation-dialog-component.component';
import { ToastService } from '../../../../auth/Toaster/toast.service';
import { ToastComponent } from "../../../Toaster/toast/toast.component";



@Component({
  selector: 'app-user-master',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, CommonModule, MatCardModule,
    MatListModule, MatIconModule, MatButtonModule, NgxDatatableModule, MatSortModule,
    MatFormFieldModule, MatInputModule, MatSort, NgxPaginationModule,
    ReactiveFormsModule, LoaderComponent, ConfirmationDialogComponentComponent, ToastComponent],
  templateUrl: './user-master.component.html',
  styleUrl: './user-master.component.css'
})
export class UserMasterComponent {
  [x: string]: any;
  router  =  inject(Router);

  loading$!: Observable<boolean>;
  users: Observable<LoginApiResponse>| any; // used for getuser list
  userTypeResponse: Observable<userroleresponse>| any; // user for get user type
  userRequest: UserRequest = {
    partnerId: '',
    userStatus: '',
    roleType: '',
    email: ''
  };
  partnerId: string |any;
  loggedInUserId: string |any;
  p: number = 1; // current page
  totalItems: number =0; // total number of items, for example
  itemsPerPage: number = 10; // items per page
  
  sortColumn = '';
  sortDirection = 'asc';
  // Filter criteria
  filterTerm: string = '';
  searchForm!: FormGroup;
  globalRoleForm!:FormGroup

  filteredData: any[] = []; // Data array for the table

  userStatus:any;
  userType:any;
  email:any;
  hdnViewUserId!: number;

  @ViewChild('hdnUserId')
  hdnUserId!: ElementRef<HTMLInputElement>;
  constructor(private userService: UserService,private formBuilder: FormBuilder,
  public dialog: MatDialog,private loaderService: LoaderService,private toasterService: ToastService){
    this.loading$ = this.loaderService.loading$;
    this.partnerId= localStorage.getItem('partnerId');
   
    this.searchForm=this.formBuilder.group({
      filterTerm: ['']
    })
    this.searchForm.get('filterTerm')?.valueChanges.subscribe(value => {
      this.filterData(value);
    });
  }




  ngOnInit(): void{
    debugger;
    this.loggedInUserId=localStorage.getItem('userId');
    this.loaderService.show();
    /// used to get the all user type 
    this.GetUserTypeData();
    /// Used for to get the all user list from API
    this.userService.getUsersList(this.partnerId).subscribe((response:any)=>{
      debugger;
     this.users = response.data; 
     this.totalItems=response.data.length;
     console.log(response);
     this.loaderService.hide();
    },err=>{
      console.log(err);
      this.loaderService.hide();
    }) 
   }

   filterData(term: string) {
    debugger;
    this.filteredData = this.users.filter((item: {
       fullName: any;email: any; roleName:any;roleType:any;mobileNumber:any
    }) => 
      item.fullName.toLowerCase().includes(term.toLowerCase()) ||
      item.email.toLowerCase().includes(term.toLowerCase()) ||
      item.roleName.toLowerCase().includes(term.toLowerCase()) ||
      item.roleType.toLowerCase().includes(term.toLowerCase()) ||
      item.mobileNumber.toLowerCase().includes(term.toLowerCase())
    
     );
     debugger;
    this.users= this.filteredData;
    if(term==""){
      this.ngOnInit();
    }
  }

   GetUserTypeData(){
    debugger;
    this.userService.getUsersType().subscribe((response:any)=>{
      debugger;
     this.userTypeResponse = response.data; 
     console.log(response);
    }) 
   }
   

   sortTable(column: string) {
    debugger;
    this.sortDirection = this.sortColumn === column ? (this.sortDirection === 'asc' ? 'desc' : 'asc') : 'asc';
    this.sortColumn = column;
    this.users = this.users.sort((a: { [x: string]: any; }, b: { [x: string]: any; }) => {
     debugger;
      const valueA = a[column];
      const valueB = b[column];
      
      if (valueA < valueB) return this.sortDirection === 'asc' ? -1 : 1;
      if (valueA > valueB) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }

  public userForm = new FormGroup({
    ddlUserStatus: new FormControl('', [Validators.required]),
    ddlUserType: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
  })

  onSearch(){
    debugger;
    this.loaderService.show();
    this.userStatus=this.userForm.value.ddlUserStatus;
    this.userType=this.userForm.value.ddlUserType;
    this.email=this.userForm.value.email;
    this.userRequest.partnerId= this.partnerId;
    this.userRequest.userStatus= this.userStatus;
    this.userRequest.roleType= this.userType;
    this.userRequest.email= this.email;

    this.userService.SearchUserInfo(this.userRequest).subscribe({
    next: (response) => {
      if (response?.status && response?.statusCode === 200 && Array.isArray(response.data)) {
        this.users = response.data;
        this.totalItems = response.data.length;
        this.loaderService.hide();
      } else {
        console.warn("No data found", response);
        this.loaderService.hide();
      }
    },
    error: (err) => {
      console.error("API call failed", err);
      this.loaderService.hide();
    }
  });
  }

  redirectToAddUser(){
    debugger;
    this.router.navigate(['Pages/Master/security/addUser',0]);
  }

  ViewUsers(userdId:number){
    debugger;
    // this.router.navigate(['/edit', userId]);
    this.router.navigate(['Pages/Master/security/addUser',userdId]);
  }

  DeleteUser(userdId:number){
    debugger;
   // this.router.navigate(['/addUser']);
  }

  openConfirmationDialog(userId:number): void {
    debugger;
    const dialogRef = this.dialog.open(ConfirmationDialogComponentComponent, {
      width: '250px',
      data: { message: 'Are you sure you want to delete this user?',userId: userId }
    });

    dialogRef.afterClosed().subscribe(result => {
      debugger;
      if (result.success) {
        debugger;

        this.userService.DeleteById(result.userId,this.loggedInUserId).subscribe((response:any)=>{
          debugger;
         if(response.status && response.statusCode==200){
          this.toasterService.showToast('User deleted successfully!', 'success');
          this.ngOnInit();
         }
         else{
          this.toasterService.showToast('User deletion failed!', 'error');
         }
         console.log(response);
        }) 
        console.log('Returned User ID:', result.userId);
        console.log('User confirmed the action.');
      } else {
        debugger;
        // User clicked 'Cancel'
        console.log('User canceled the action.');
      }
    });
  }
}
