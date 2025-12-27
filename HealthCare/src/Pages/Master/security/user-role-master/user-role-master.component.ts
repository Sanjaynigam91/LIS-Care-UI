import { Component, ElementRef, inject,OnInit, ViewChild } from '@angular/core';
import { UserService } from '../../../../auth/UserService/user.service';
import { FormControl,FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize, Observable } from 'rxjs';
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
import { lisroleresponse } from '../../../../Interfaces/Role/lisroleresponse';
import { LisroleService } from '../../../../auth/Role/lisrole.service';
import { AddroleComponent } from '../../../PopUp/addrole/addrole.component';
import { ToastComponent } from "../../../Toaster/toast/toast.component";
import { RefreshPageService } from '../../../../auth/Shared/refresh-page.service';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-user-role-master',
  standalone: true,
  imports: [
    MatTooltipModule,MatTableModule, MatPaginatorModule, CommonModule, MatCardModule,
    MatListModule, MatIconModule, MatButtonModule, NgxDatatableModule, MatSortModule,
    MatFormFieldModule, MatInputModule, NgxPaginationModule,
    ReactiveFormsModule, LoaderComponent],
  templateUrl: './user-role-master.component.html',
  styleUrl: './user-role-master.component.css'
})
export class UserRoleMasterComponent {

  loading$!: Observable<boolean>;
  partnerId: string |any;
  loggedInUserId: string |any;
  lisRoles: Observable<lisroleresponse>| any;

  sortColumn = '';
  sortDirection = 'asc';
  // Filter criteria
  filterTerm: string = '';
  searchForm!: FormGroup;
  p: number = 1; // current page
  totalItems: number =0; // total number of items, for example
  itemsPerPage: number = 10; // items per page

  filteredData: any[] = []; // Data array for the table
  refreshSubscription: any;

  constructor(private lisRoleService:LisroleService,
    public dialog: MatDialog,private loaderService: LoaderService,
    private formBuilder: FormBuilder,private toasterService: ToastService,
    private refPageService:RefreshPageService){
      this.loading$ = this.loaderService.loading$;
      this.partnerId= localStorage.getItem('partnerId');
     
      this.searchForm=this.formBuilder.group({
        filterTerm: ['']
      })
      this.searchForm.get('filterTerm')?.valueChanges.subscribe(value => {
       this.filterRoleData(value);
      });
  }
   
  ngOnInit(): void{
    this.loggedInUserId=localStorage.getItem('userId');
       // Subscribe to the refreshNeeded observable
       this.refreshSubscription = this.refPageService.refreshNeeded$.subscribe(() => {
        this.refreshData();
      });
    this.GetAllLisRoles();
  }

  refreshData(){
    this.GetAllLisRoles();
  }


 GetAllLisRoles() {
  debugger;
  this.loaderService.show(); // ✅ Show loader before API call

  this.lisRoleService
    .getLisRoleList()
    .pipe(
      finalize(() => {
        // ✅ Always hide loader when API completes or fails
        this.loaderService.hide();
      })
    )
    .subscribe({
      next: (response: any) => {
        debugger;
        if (response?.status && response?.statusCode === 200) {
          this.lisRoles = response.data;
          this.totalItems = response.data.length;
          console.log(response);
        } else {
          console.warn('No roles found!');
          this.lisRoles = [];
          this.totalItems = 0;
        }
      },
      error: (err) => {
        console.error('Error while fetching LIS roles:', err);
      },
    });
}

  sortTable(column: string) {
    debugger;
    this.sortDirection = this.sortColumn === column ? (this.sortDirection === 'asc' ? 'desc' : 'asc') : 'asc';
    this.sortColumn = column;
    this.lisRoles = this.lisRoles.sort((a: { [x: string]: any; }, b: { [x: string]: any; }) => {
     debugger;
      const valueA = a[column];
      const valueB = b[column];
      
      if (valueA < valueB) return this.sortDirection === 'asc' ? -1 : 1;
      if (valueA > valueB) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }

  filterRoleData(term: string) {
    debugger;
    this.loaderService.show();
    this.filteredData = this.lisRoles.filter((item: {
      roleStatus: any;
      department: any;
      roleCode: any;
      roleName:any;
      roleType:any
    }) => 
      item.roleCode.toLowerCase().includes(term.toLowerCase()) ||
      item.roleName.toLowerCase().includes(term.toLowerCase()) ||
      item.roleType.toLowerCase().includes(term.toLowerCase()) ||
      item.department.toLowerCase().includes(term.toLowerCase()) ||
      item.roleStatus.toLowerCase().includes(term.toLowerCase())
    
     );
     debugger;
    this.lisRoles= this.filteredData;
    if(term==""){
      this.ngOnInit();
    }
      this.loaderService.hide();
  }

  OpenAddRolePopUp(): void {
    debugger;
    this.dialog.open(AddroleComponent, {
      width: '5000px',// Customize width
      data: {}        // Pass data if needed
    });
  }

  ViewEditRole(roleId:any): void {
    debugger;
    this.loaderService.hide();
    this.dialog.open(AddroleComponent, {
      width: '5000px',// Customize width
      data: {roleId:roleId}        // Pass data if needed
    });
  }

  openConfirmationDialog(roleId:number): void {
    debugger;
    const dialogRef = this.dialog.open(ConfirmationDialogComponentComponent, {
      width: '250px',
      data: { message: 'Are you sure you want to delete this role?',roleId: roleId }
    });

    dialogRef.afterClosed().subscribe(result => {
      debugger;
      if (result.success) {
        debugger;
        this.lisRoleService.DeleteRoleById(result.roleId).subscribe((response:any)=>{
          debugger;
         if(response.status && response.statusCode==200){
          this.toasterService.showToast('Role deleted successfully!', 'success');
          this.ngOnInit();
         }
         else{
          this.toasterService.showToast('Role deletion failed!', 'error');
         }
         console.log(response);
        }) 

        console.log('Returned Role Id:', result.roleId);
        console.log('User confirmed the action.');
      } else {
        debugger;
        // User clicked 'Cancel'
        console.log('User canceled the action.');
      }
    });
  }
}
