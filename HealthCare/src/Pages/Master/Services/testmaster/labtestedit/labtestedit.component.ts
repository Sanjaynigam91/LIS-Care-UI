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
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { LoaderService } from '../../../../../Interfaces/loader.service';

@Component({
  selector: 'app-labtestedit',
  standalone: true,
  imports: [MatTabsModule, ToastComponent,CommonModule,MatIconModule,MatCheckboxModule,
    ReactiveFormsModule
  ],
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
  editTestForm!: FormGroup<any>;


  constructor(public dialogRef: MatDialogRef<LabtesteditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,private testService:TestService
  , private toasterService: ToastService,private refPageService:RefreshPageService,
    private metaService:MetadataService,private formBuilder: FormBuilder,
    private loaderService: LoaderService){
      this.partnerId= localStorage.getItem('partnerId');
      this.labtestCode=data.testCode;
    }

    ngOnInit():void{
      debugger;
      this.editTestForm = this.formBuilder.group({
        testCode: [''],
        testName:[''],
        ddlTestDepartment:[''],
        ddlSubDepartment:[''],
        Methodology:[''],
        ddlSpecimenType:[''],
        ReferenceUnit:[''],
        ddlReportingStyle:[''],
        ddlReportTemplate:[''],
        ReportingDecimals:[''],
        ddlProcessedAt:[''],
        PrintSequence:[''],
        ddlTestEntryRestricted:[''],
        ShortName:[''],
        PatinetRate:[''],
        ClientRate:[''],
        LabRate:[''],
        ddlTestStatus:[''],
        DefaultValue:[''],
        ddlIsAutomated:[''],
        ddlIsCalculated:[''],
        LabTestCode:[''],
        ddlTestApplicable:[''],
        ddlIsLMP:[''],
        ddlIsNABLApplicable:[''],
        ReferralRangesComments:['']
      });

      if(this.labtestCode!==undefined){
        this.loadTestDetails(this.labtestCode);
        this.isSubmitVisible=false;
        this.isUpdateVisible=true;
        this.isAddHeaderVisible=false;
        this.isEditHeaderVisible=true;
      }
      else{
        this.isSubmitVisible=true;
        this.isUpdateVisible=false;
        this.isAddHeaderVisible=true;
        this.isEditHeaderVisible=false;
      }
      
        this.BindAllDepartment();
        this.BindAllSubDepartment();
        this.BindTestSpecimenTypes();
        this.BindAllReportingStyle();
        this.BindAllReportTemplates();
      
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

   loadTestDetails(testCode:any){
    debugger;
    this.loaderService.show();
    this.testService.GetTestDetailsByTestCode(this.partnerId,testCode).subscribe((response:any)=>{
      debugger;
      if(response.status && response.statusCode==200){
        debugger;
        let isOutLab=response.data.isOutlab;
        if(isOutLab){isOutLab="True";}else{isOutLab="False";}
        let testStatus=response.data.isActive;
        if(testStatus){testStatus="Active";}else{testStatus="InActive";}
        let IsAutoMated=response.data.isAutomated;
        if(IsAutoMated){IsAutoMated="Yes";}else{IsAutoMated="No";}
        let isCalculated=response.data.isCalculated;
        if(isCalculated){isCalculated="Yes";}else{isCalculated="No";}
        let isLMP=response.data.isLMP;
        if(isLMP){isLMP="True";}else{isLMP="False";}
        let isNABLApplicable=response.data.isNABLApplicable;
        if(isNABLApplicable){isNABLApplicable="Yes";}else{isNABLApplicable="No";}

        this.editTestForm.patchValue({
          testCode:response.data.testCode,
          testName:response.data.testName,
          ddlTestDepartment:response.data.discipline,
          ddlSubDepartment:response.data.subDiscipline,
          Methodology:response.data.methodology,
          ddlSpecimenType:response.data.specimenType,
          ReferenceUnit:response.data.referenceUnits,
          ddlReportingStyle:response.data.reportingStyle,
          ddlReportTemplate:response.data.reportTemplateName,
          ReportingDecimals:response.data.reportingDecimals,
          ddlProcessedAt:isOutLab,
          PrintSequence:response.data.reportPrintOrder,
          ddlTestEntryRestricted:response.data.isReserved,
          ShortName:response.data.testShortName,
          PatinetRate:response.data.mrp,
          ClientRate:response.data.b2CRates,
          LabRate:response.data.labRates,
          ddlTestStatus:testStatus,
          DefaultValue:response.data.analyzerName,
          ddlIsAutomated:IsAutoMated,
          ddlIsCalculated:isCalculated,
          LabTestCode:response.data.labTestCode,
          ddlTestApplicable:response.data.testApplicable,
          ddlIsLMP:isLMP,
          ddlIsNABLApplicable:isNABLApplicable,
          ReferralRangesComments:response.data.normalRangeFooter,
        })
      }
      console.log(this.editTestForm);
     console.log(response);
    }) 
    this.loaderService.hide();
   }



}
