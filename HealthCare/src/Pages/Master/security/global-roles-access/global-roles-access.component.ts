import { Component } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { SelectionModel } from '@angular/cdk/collections';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { UserService } from '../../../../auth/UserService/user.service';
import { userroleresponse } from '../../../../Interfaces/userroleresponse';
import { Observable } from 'rxjs';
import { LisroleService } from '../../../../auth/Role/lisrole.service';
import { lisRolNameResponse } from '../../../../Interfaces/Role/lisRolNameResponse';
import { LoaderService } from '../../../../Interfaces/loader.service';
import { LoaderComponent } from "../../../loader/loader.component";
import { PageHeaderResponseModel } from '../../../../Interfaces/Role/PageHeaderResponseModel';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { PageHeaderRequestModel } from '../../../../Interfaces/Role/PageHeaderRequestModel';
import { ToastService } from '../../../../auth/Toaster/toast.service';
import { RefreshPageService } from '../../../../auth/Shared/refresh-page.service';
import { ToastComponent } from "../../../Toaster/toast/toast.component";

@Component({
  selector: 'app-global-roles-access',
  standalone: true,
  imports: [MatTableModule,
    MatCheckboxModule,
    MatButtonModule, ReactiveFormsModule,
    CommonModule, MatIconModule, LoaderComponent, NgxPaginationModule, ToastComponent],
  templateUrl: './global-roles-access.component.html',
  styleUrl: './global-roles-access.component.css'
})
export class GlobalRolesAccessComponent {
  displayedColumns: string[] = ['select1', 'select2', 'name', 'age'];
  displayedPageColumns: string[] = ['pageName', 'read', 'write', 'approve','specialRights'];
  readSelection: any[] = [];
  writeSelection: any[] = [];
  approveSelection: any[] = [];
  specialRightsSelection: any[] = [];
  partnerId: string |any;
  userTypeResponse: Observable<userroleresponse>| any; // user for get user type
  lisRolNameResponse:Observable<lisRolNameResponse>| any;
  roleType:any;
  loading$!: Observable<boolean>;
  pageHeaderResponse:Observable<PageHeaderResponseModel>| any;

  p: number = 1; // current page
  totalItems: number =0; // total number of items, for example
  itemsPerPage: number = 10; // items per page
  
  sortColumn = '';
  sortDirection = 'asc';
  // Filter criteria
  filterTerm: string = '';
  searchForm!: FormGroup;

  filteredData: any[] = []; // Data array for the table
  globalRoleForm!: FormGroup<any>
  isReadChecked:boolean=false;
  roleId!: any;
  ishasDataList=false;
  isNoDataList=false;
  pageHeaderRequestModel:PageHeaderRequestModel={
    menuId: '',
    roleId: undefined,
    visibility: false,
    isReadEnabled: false,
    isWriteEnabled: false,
    isApproveEnabled: false,
    isSpecialPermssion: false,
    partnerId: ''
  }
  selectedRows:any[] = []; 

  constructor(private userService: UserService,private lisRoleService:LisroleService,
    private loaderService: LoaderService,private formBuilder: FormBuilder,
    private toasterService:ToastService,private refPageService:RefreshPageService
  ){
    this.loading$ = this.loaderService.loading$;
    this.partnerId= localStorage.getItem('partnerId');
    this.searchForm=this.formBuilder.group({
      filterTerm: ['']
    })
    this.searchForm.get('filterTerm')?.valueChanges.subscribe(value => {
      this.filterData(value);
    });
  }

  ngOnInit():void{
    debugger;
    this. GetUserTypeData();
   // this.GetAllPageHeaders(0,this.partnerId);
   this.isNoDataList=true;
   this.ishasDataList=false;
    this.globalRoleForm = this.formBuilder.group({
      ddlUserType: [''],
      ddlUserRole: ['']
    })
  }

  readToggle(event: any): void {
    if (event.checked) {
      this.readSelection = [...this.pageHeaderResponse];
    } else {
      this.readSelection = [];
    }
  }

  onSelectRead(element: any, event: any): void {
    debugger;
    this.pageHeaderRequestModel.menuId=element.navigationId;
    this.pageHeaderRequestModel.isReadEnabled=event.checked;
    if (event.checked) {
      this.readSelection.push(element);    
    } else {
      this.readSelection = this.readSelection.filter(e => e !== element);
    }
  }

  writeToggle(event: any): void {
    if (event.checked) {
      this.writeSelection = [...this.pageHeaderResponse];
    } else {
      this.writeSelection = [];
    }
  }

  onSelectWrite(element: any, event: any): void {
    debugger;
    this.pageHeaderRequestModel.menuId=element.navigationId;
    this.pageHeaderRequestModel.isWriteEnabled=event.checked;
    if (event.checked) {
      this.writeSelection.push(element);
    } else {
      this.writeSelection = this.writeSelection.filter(e => e !== element);
    }
  }

  approveToggle(event: any): void {
    if (event.checked) {
      this.approveSelection = [...this.pageHeaderResponse];
    } else {
      this.approveSelection = [];
    }
  }

  onSelectApprove(element: any, event: any): void {
    this.pageHeaderRequestModel.menuId=element.navigationId;
    this.pageHeaderRequestModel.isApproveEnabled=event.checked;
    if (event.checked) {
      this.approveSelection.push(element);
    } else {
      this.approveSelection = this.approveSelection.filter(e => e !== element);
    }
  }

  SpecialRightsToggle(event: any): void {
    if (event.checked) {
      this.specialRightsSelection = [...this.pageHeaderResponse];
    } else {
      this.specialRightsSelection = [];
    }
  }

  onSelectSpecialRights(element: any, event: any): void {
    this.pageHeaderRequestModel.menuId=element.navigationId;
    this.pageHeaderRequestModel.isSpecialPermssion=event.checked;
    if (event.checked) {
      this.specialRightsSelection.push(element);
    } else {
      this.specialRightsSelection = this.specialRightsSelection.filter(e => e !== element);
    }
  }

  GetUserTypeData(){
    debugger;
    this.loaderService.show();
    this.userService.getUsersType().subscribe((response:any)=>{
      debugger;
     this.userTypeResponse = response.data; 
     this.totalItems=response.data.length;
     console.log(response);
    }) 
    this.loaderService.hide();
   }

   GetUserRoleByRoleType(event: any){
    debugger;
    this.loaderService.show();
    this.roleType = event.target.value;
    if(this.roleType!=""){
      this.lisRoleService.GetRoleNameByRoleType(this.roleType).subscribe((response:any)=>{
        debugger;
       this.lisRolNameResponse = response.data; 
       console.log(response);
      }) 
    }
    else{
      debugger;
      this.GetUserTypeData();
    }
    this.loaderService.hide();
   }
   
   GetAllPageHeaders(roleId:any,partnerId:string){
    debugger;
    this.loaderService.show();
    this.lisRoleService.getAllPageHeadersList(roleId,partnerId).subscribe((response:any)=>{
      debugger;
      if(response.status && response.statusCode==200){
        this.pageHeaderResponse = response.data;  
      }
    
     console.log(response);
    }) 
    this.loaderService.hide();

   }

   filterData(term: string) {
    debugger;
    this.filteredData = this.pageHeaderResponse.filter((item: {
      messageHeader: any
    }) => 
      item.messageHeader.toLowerCase().includes(term.toLowerCase())
     );
     debugger;
    this.pageHeaderResponse= this.filteredData;
    if(term==""){
      this.ngOnInit();
    }
  }

  SerachPermissionByRoles(){
    debugger;
    this.roleId=this.globalRoleForm.value.ddlUserRole; 
    if(this.roleId==""){
      this.roleId=0;
      this.isNoDataList=true;
      this.ishasDataList=false;
    }
    else{
      this.isNoDataList=false;
      this.ishasDataList=true;
    }
    this.GetAllPageHeaders(this.roleId,this.partnerId);
  }
  

  AllowPagePermissions(){
    debugger;
    this.pageHeaderRequestModel.partnerId=this.partnerId;
    this.pageHeaderRequestModel.roleId=this.globalRoleForm.value.ddlUserRole;
    this.pageHeaderRequestModel.visibility=true;
    if(this.pageHeaderRequestModel.roleId==""){
      this.toasterService.showToast('Plaese select user type and role!', 'error');
    }
   else if(this.pageHeaderRequestModel!=null)
    {
      this.lisRoleService.AllowPermisiion(this.pageHeaderRequestModel)
      .subscribe({
        next: (response: any) => {
          debugger;
          if(response.statusCode==200 && response.status){
            debugger;
            console.log(response);
             // Notify the main component
            this.refPageService.notifyRefresh(); // used to refresh the main list page
            this.toasterService.showToast('Permssion allowed successfully!', 'success');
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



