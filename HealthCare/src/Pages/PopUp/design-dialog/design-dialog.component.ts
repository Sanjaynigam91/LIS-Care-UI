import { Component, Inject, inject } from '@angular/core';
import { AdduserComponent } from "../../Master/security/adduser/adduser.component";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatCardActions } from '@angular/material/card';
import { signal} from '@angular/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import { MetadataService } from '../../../auth/metadata.service';
import { FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import { metaTagRequest } from '../../../Interfaces/metaTagRequest';
import { ToastService } from '../../../auth/Toaster/toast.service';
import { ToastComponent } from "../../Toaster/toast/toast.component";
import { LoaderComponent } from "../../loader/loader.component";
import { LoaderService } from '../../../Interfaces/loader.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { metaTagRequestModel } from '../../../Interfaces/metaTagRequestModel';
import { RefreshPageService } from '../../../auth/Shared/refresh-page.service';

@Component({
  selector: 'app-design-dialog',
  standalone: true,
  imports: [MatIconModule, MatCardActions,
    MatFormFieldModule, MatInputModule, MatSelectModule, FormsModule, 
    MatInputModule, ToastComponent, LoaderComponent,CommonModule],
  templateUrl: './design-dialog.component.html',
  styleUrl: './design-dialog.component.css'
})
export class DesignDialogComponent {
  router  =  inject(Router);
  protected readonly value = signal('');
  metaTagForm!:FormGroup;
  metaTagRequest:metaTagRequest={
    partnerId: '',
    tagCode: '',
    tagDescription: '',
    tagStatus: ''
  }
  metaTagRequestModel:metaTagRequestModel={
    tagId: 0,
    partnerId: '',
    tagCode: '',
    tagDescription: '',
    tagStatus: ''
  }
  loading$: any;
  partnerId: string |any;
  loggedInUserId: string |any;
  tagId:any;
  isSubmitVisible:boolean=false;
  isUpdateVisible:boolean=false;
  isAddHeaderVisible:boolean=false;
  isEditHeadrVisible:boolean=false;
  constructor(public dialogRef: MatDialogRef<DesignDialogComponent>,
    private metaService:MetadataService, private formBuilder: FormBuilder,
    private toasterService: ToastService,private loaderService: LoaderService,
    @Inject(MAT_DIALOG_DATA) public data: any,private refPageService:RefreshPageService){
      this.loading$ = this.loaderService.loading$;
      this.partnerId= localStorage.getItem('partnerId');
      this.loggedInUserId=localStorage.getItem('userId');
      this.tagId=data.tagId;
    }
  
  protected onInput(event: Event) {
    this.value.set((event.target as HTMLInputElement).value);
  }

  ngOnInit(): void{
    debugger;
    if(this.tagId>0){
      this.isUpdateVisible=true;
      this.isEditHeadrVisible=true;
      this.GetMetaTagById(this.tagId);
    }
    else{
      this.isSubmitVisible=true;
      this.isAddHeaderVisible=true;
    }
  }

  onClose(): void {
    this.dialogRef.close();
     this.loaderService.hide();
  }

  onSubmit():void{
    debugger;
    this.metaTagRequest.partnerId=this.partnerId;
     if(this.metaTagRequest.tagCode==''){
      this.toasterService.showToast('Please enter tag code.', 'error');
     }
     else if(this.metaTagRequest.tagDescription==''){
      this.toasterService.showToast('Please enter tag description.', 'error');
     }
     else if (this.metaTagRequest.tagStatus==''){
      this.toasterService.showToast('Please select status.', 'error');
     }
     else{
      this.metaService.createNewMetaTag(this.metaTagRequest)
      .subscribe({
        next: (response: any) => {
          debugger;
          if(response.statusCode==200 && response.status){
            debugger;
            console.log(response);
            // Notify the main component
            this.refPageService.notifyRefresh(); // used to refresh the main list page
            this.toasterService.showToast('Meta tag created successfully!', 'success');
            this.dialogRef.close();
           // this.router.navigate(['/Pages/Master/security/MetaData']);
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

  GetMetaTagById(tagId:any){
    debugger;
    this.loaderService.show();
    this.metaService.getMetaTagById(tagId).subscribe((response=>{
      debugger;
     if(response.status && response.statusCode==200){
      debugger;
      this.metaTagRequest.partnerId=response.data.partnerId;
      this.metaTagRequest.tagCode=response.data.tagCode;
      this.metaTagRequest.tagDescription=response.data.tagDescription;
      this.metaTagRequest.tagStatus=response.data.metaStatus.toLocaleLowerCase();
       this.loaderService.hide();
     }
    }))
  }

  onUpdate():void{
    debugger;
    this.metaTagRequestModel.tagId=this.tagId;
    this.metaTagRequestModel.partnerId=this.partnerId;
    this.metaTagRequestModel.tagDescription=this.metaTagRequest.tagDescription;
    this.metaTagRequestModel.tagStatus=this.metaTagRequest.tagStatus;
     if(this.metaTagRequestModel.tagDescription==''){
      this.toasterService.showToast('Please enter tag description.', 'error');
     }
     else if (this.metaTagRequestModel.tagStatus==''){
      this.toasterService.showToast('Please select status.', 'error');
     }
     else{
      this.metaService.updateMetaTag(this.metaTagRequestModel)
      .subscribe({
        next: (response: any) => {
          debugger;
          if(response.statusCode==200 && response.status){
            debugger;
            console.log(response);
             // Notify the main component
             this.refPageService.notifyRefresh(); // used to refresh the main list page
            this.toasterService.showToast('Meta tag updated successfully!', 'success');
            this.dialogRef.close();
            //this.router.navigate(['/Pages/Master/security/MetaData']);
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
