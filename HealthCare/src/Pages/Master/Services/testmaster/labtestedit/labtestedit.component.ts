import { CommonModule } from '@angular/common';
import {Component, Inject} from '@angular/core';
import {MatTabsModule} from '@angular/material/tabs';
import { ToastComponent } from "../../../../Toaster/toast/toast.component";
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TestService } from '../../../../../auth/TestMasterService/test.service';
import { ToastService } from '../../../../../auth/Toaster/toast.service';
import { RefreshPageService } from '../../../../../auth/Shared/refresh-page.service';
import { Observable } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { MetadataService } from '../../../../../auth/metadata.service';
import { metaTagResponse } from '../../../../../Interfaces/metaTagResponse';

@Component({
  selector: 'app-labtestedit',
  standalone: true,
  imports: [MatTabsModule, ToastComponent,CommonModule,MatIconModule,MatCheckboxModule],
  templateUrl: './labtestedit.component.html',
  styleUrl: './labtestedit.component.css'
})
export class LabtesteditComponent {

  isVisible = false;
  isSubmitVisible=false;
  isUpdateVisible=false;
  isAddHeaderVisible:boolean=false;
  isEditHeaderVisible:boolean=false;
  loading$!: Observable<boolean>;
  partnerId: string |any;
  labtestCode:string |any;
  testDepartmentResponse: Observable<metaTagResponse>| any;
  testSubDepartmentResponse: Observable<metaTagResponse>| any;
  specimenTypeResponse: Observable<metaTagResponse>| any;
  reportingStyleResponse: Observable<metaTagResponse>| any;
  reportTemplatesResponse: Observable<metaTagResponse>| any;
  metaDataService: any;

  constructor(public dialogRef: MatDialogRef<LabtesteditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,private testService:TestService
  , private toasterService: ToastService,private refPageService:RefreshPageService,
  private metaService:MetadataService){
      this.partnerId= localStorage.getItem('partnerId');
      this.labtestCode=data.labtestCode;
    }

    ngOnInit():void{
      debugger;
      this.isSubmitVisible=true;
      if(this.labtestCode!==undefined){
        this.isSubmitVisible=false;
        this.isUpdateVisible=true;
        this.isAddHeaderVisible=false;
        this.isEditHeaderVisible=true;
      }
      else{
        this.BindAllDepartment();
        this.BindAllSubDepartment();
        this.BindTestSpecimenTypes();
        this.BindAllReportingStyle();
        this.BindAllReportTemplates();
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

  BindAllDepartment(){
    debugger;
    this.metaService.LoadAllDepartments(this.partnerId).subscribe((response:any)=>{
      debugger;
     this.testDepartmentResponse = response.data; 
     console.log(response);
    }) 
   }
  
   BindAllSubDepartment(){
    debugger;
    this.metaService.LoadSubDepartments(this.partnerId).subscribe((response:any)=>{
      debugger;
     this.testSubDepartmentResponse = response.data; 
     console.log(response);
    }) 
   }

   BindTestSpecimenTypes(){
    debugger;
    this.metaService.LoadSpecimenType(this.partnerId).subscribe((response:any)=>{
      debugger;
     this.specimenTypeResponse = response.data; 
     console.log(response);
    }) 
   }

   BindAllReportingStyle(){
    debugger;
    this.metaService.LoadReportingStyle(this.partnerId).subscribe((response:any)=>{
      debugger;
     this.reportingStyleResponse = response.data; 
     console.log(response);
    }) 
   }

   BindAllReportTemplates(){
    debugger;
    this.metaService.LoadGetReportTemplates(this.partnerId).subscribe((response:any)=>{
      debugger;
     this.reportTemplatesResponse = response.data; 
     console.log(response);
    }) 
   }

}
