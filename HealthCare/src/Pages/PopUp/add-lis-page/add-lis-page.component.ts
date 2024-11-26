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
import { Observable } from 'rxjs';
import { userroleresponse } from '../../../Interfaces/userroleresponse';
import { lisrolerequest } from '../../../Interfaces/Role/lisrolerequest';
import { ToastService } from '../../../auth/Toaster/toast.service';
import { LisroleService } from '../../../auth/Role/lisrole.service';
import { Router } from '@angular/router';
import { LisRoleResponseModel } from '../../../Interfaces/Role/LisRoleResponseModel';
import { LISRoleUpdateRequestModel } from '../../../Interfaces/Role/LISRoleUpdateRequestModel';
import { PageEntityModel } from '../../../Interfaces/Role/PageEntityModel';
import { LisCareCriteriaModel } from '../../../Interfaces/Role/LisCareCriteriaModel';
import { LisPageModel } from '../../../Interfaces/Role/LisPageModel';
import { LisPageRequestModel } from '../../../Interfaces/Role/LisPageRequestModel';
import { LisPageResponseModel } from '../../../Interfaces/Role/LisPageResponseModel';
import { LisPageUpdateRequestModel } from '../../../Interfaces/Role/LisPageUpdateRequestModel';
import { RefreshPageService } from '../../../auth/Shared/refresh-page.service';


@Component({
  selector: 'app-add-lis-page',
  standalone: true,
  imports: [MatIconModule, MatCardActions,
    MatFormFieldModule, MatIconModule, MatSelectModule, FormsModule, 
    MatInputModule, ToastComponent, LoaderComponent,CommonModule],
  templateUrl: './add-lis-page.component.html',
  styleUrl: './add-lis-page.component.css'
})
export class AddLisPageComponent {

  router  =  inject(Router);
  isVisible = false;
  isSubmitVisible=false;
  isUpdateVisible=false;
  isAddHeaderVisible:boolean=false;
  isEditHeaderVisible:boolean=false;
  partnerId: string |any;
  pageEntity:string|any;
  lisPageId:string |any;
  editPageId:string|any;
  lisPageEntityModel:Observable<PageEntityModel>| any;
  lisCareCriteriaModel:Observable<LisCareCriteriaModel>| any;
  lisPageModel:Observable<LisPageModel>| any;
  lisPageRequestModel:LisPageRequestModel={
    pageName: '',
    pageEntity: '',
    criteria: '',
    isActive: '',
    partnerId: ''
  }
  lisPageUpdateRequestModel:LisPageUpdateRequestModel={
    pageId: '',
    pageName: '',
    pageEntity: '',
    criteria: '',
    isActive: '',
    partnerId: ''
  }
 

  constructor(public dialogRef: MatDialogRef<AddLisPageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,private lisRoleService:LisroleService
  , private toasterService: ToastService,private refPageService:RefreshPageService){
      this.partnerId= localStorage.getItem('partnerId');
      this.lisPageId=data.pageId;
    }


  ngOnInit():void{
    debugger;
    this.editPageId= this.lisPageId;
    this.isSubmitVisible=true;
    this.getAllCriteria();
    this.getAllPageEnities(this.partnerId);
    if(this.lisPageId!==undefined){
      this.isSubmitVisible=false;
      this.isUpdateVisible=true;
      this.isAddHeaderVisible=false;
      this.isEditHeaderVisible=true;
      this.GetPageDetailsById(this.lisPageId,this.partnerId);
    }
    else{
      this.isSubmitVisible=true;
      this.isUpdateVisible=false;
      this.isAddHeaderVisible=true;
      this.isEditHeaderVisible=false;
    }
    
  }  
  open(): void {
    this.isVisible = true;
  }

  close(): void {
    this.dialogRef.close();
  }

  getAllPageEnities(partnerId:any){
    debugger;
    this.lisRoleService.getAllPageEntities(partnerId).subscribe((response:any)=>{
     debugger;
    this.lisPageEntityModel = response.data; 
    console.log(response);
   }) 
   }

   getAllCriteria(){
    debugger;
    this.lisRoleService.getAllCriteria().subscribe((response:any)=>{
     debugger;
    this.lisCareCriteriaModel = response.data; 
   
    console.log(response);
   }) 
   }

   getPagesByEntites(event: any){
    debugger;
    this.pageEntity = event.target.value;
    this.lisRoleService.getPagesByEntites(this.partnerId,this.pageEntity).subscribe((response:any)=>{
     debugger;
    this.lisPageModel = response.data; 
    console.log(response);
   }) 
   }

   onSubmit():void{
    debugger;
     if(this.lisPageRequestModel.criteria==''){
      this.toasterService.showToast('Please select criteria.', 'error');
     }
     else if(this.lisPageRequestModel.pageEntity==''){
      this.toasterService.showToast('Please select page entity.', 'error');
     }
     else if (this.lisPageRequestModel.pageName==''){
      this.toasterService.showToast('Please select pageName.', 'error');
     }
     else if (this.lisPageRequestModel.isActive==''){
      this.toasterService.showToast('Please select status.', 'error');
     }
     else{
      this.lisPageRequestModel.partnerId=this.partnerId;
      this.lisRoleService.saveLisPages(this.lisPageRequestModel)
      .subscribe({
        next: (response: any) => {
          debugger;
          if(response.statusCode==200 && response.status){
            debugger;
            console.log(response);
             // Notify the main component
            this.refPageService.notifyRefresh(); // used to refresh the main list page
            this.toasterService.showToast('New page added successfully!', 'success');
            this.dialogRef.close();
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

  GetPageDetailsById(pageId:string,partnerId:string){
    debugger;
    this.lisRoleService.getPagesById(pageId,partnerId).subscribe((response:any)=>{
     debugger;
    this.lisPageUpdateRequestModel.pageId=response.data.pageId; 
    this.lisPageUpdateRequestModel.pageName = response.data.pageName; 
    this.lisPageUpdateRequestModel.pageEntity = response.data.pageEntity; 
    this.lisPageUpdateRequestModel.criteria = response.data.criteria; 
    this.lisPageUpdateRequestModel.isActive = response.data.status; 
    this.lisPageRequestModel.pageName=this.lisPageUpdateRequestModel.pageName; 
    this.lisPageRequestModel.pageEntity =  this.lisPageUpdateRequestModel.pageEntity; 
    this.lisPageRequestModel.criteria =  this.lisPageUpdateRequestModel.criteria;
    this.lisPageRequestModel.isActive = this.lisPageUpdateRequestModel.isActive; 

    console.log(response);
   }) 
   } 

   onUpdate():void{
    debugger;
    if(this.lisPageRequestModel.criteria==''){
      this.toasterService.showToast('Please select criteria.', 'error');
     }
     else if(this.lisPageRequestModel.pageEntity==''){
      this.toasterService.showToast('Please select page entity.', 'error');
     }
     else if (this.lisPageRequestModel.pageName==''){
      this.toasterService.showToast('Please select pageName.', 'error');
     }
     else if (this.lisPageRequestModel.isActive==''){
      this.toasterService.showToast('Please select status.', 'error');
     }
     else{
      this.lisPageUpdateRequestModel.partnerId=this.partnerId;
      this.lisPageUpdateRequestModel.pageId=this.lisPageId;
      this.lisPageUpdateRequestModel.criteria=this.lisPageRequestModel.criteria;
      this.lisPageUpdateRequestModel.pageEntity=this.lisPageRequestModel.pageEntity;
      this.lisPageUpdateRequestModel.pageName=this.lisPageRequestModel.pageName;
      this.lisPageUpdateRequestModel.isActive=this.lisPageRequestModel.isActive;
      this.lisRoleService.UpdateLisPages(this.lisPageUpdateRequestModel)
      .subscribe({
        next: (response: any) => {
          debugger;
          if(response.statusCode==200 && response.status){
            debugger;
            console.log(response);
             // Notify the main component
             this.refPageService.notifyRefresh(); // used to refresh the main list page
             this.toasterService.showToast('Page Details updated successfully!', 'success');
             this.dialogRef.close();
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
