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
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { testDataResponse } from '../../../../../Interfaces/TestMaster/testDataResponse';
import { LoaderService } from '../../../../../Interfaces/loader.service';
import { LoaderComponent } from "../../../../loader/loader.component";
import { specialValueResponse } from '../../../../../Interfaces/TestMaster/specialValueResponse';
import { MatPaginatorModule } from '@angular/material/paginator';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-labtestedit',
  standalone: true,
  imports: [MatTabsModule, ToastComponent,CommonModule,
    ReactiveFormsModule, LoaderComponent,MatIconModule,MatCheckboxModule
    ,NgxPaginationModule],
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
  testDataResponse:Observable<testDataResponse>|any;
  editTestForm!: FormGroup<any>;
  referralRangeForm!: FormGroup<any>;
  specialValueResponse:Observable<specialValueResponse>|any;
  p: number = 1; // current page
  totalItems: number =0; // total number of items, for example
  itemsPerPage: number = 10; // items per page

  constructor(public dialogRef: MatDialogRef<LabtesteditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,private testService:TestService,private formBuilder: FormBuilder,
    private toasterService: ToastService,private refPageService:RefreshPageService,
    private metaService:MetadataService,private loaderService: LoaderService){
      this.loading$ = this.loaderService.loading$;
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

      this.referralRangeForm = this.formBuilder.group({
        ddlGender:[''],
        LowValue:[''],
        HighValue:[''],
        FromDays:[''],
        ToDays:[''],
        CriticalLowValue:[''],
        CriticalHighValue:[''],
        ReferralRangesGroup:['']
      });
      if(this.labtestCode!==undefined){
        this.loadTestDetails(this.labtestCode);
        this.loadReferralRangeValues(this.labtestCode);
        this.loadSpecialValues(this.labtestCode);
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
        this.editTestForm.patchValue({      
          ddlTestDepartment:"",
          ddlSubDepartment:"",
          ddlSpecimenType:"",
          ddlReportingStyle:"",
          ddlReportTemplate:"",
          ddlProcessedAt:"",
          ddlTestEntryRestricted:"",
          ddlTestStatus:"",
          ddlIsAutomated:"",
          ddlIsCalculated:"",
          ddlTestApplicable:"",
          ddlIsLMP:"",
          ddlIsNABLApplicable:"",      
        });
        this.referralRangeForm.patchValue({
          ddlGender:"",
        }) 

       
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
        let isReserved=response.data.isReserved;
        if(isReserved){isReserved="Y";}else{isReserved="N";}
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

   loadReferralRangeValues(testCode:any){
    debugger;
    this.loaderService.show();
    this.testService.GetReferralRangeByTestCode(this.partnerId,testCode).subscribe((response:any)=>{
      debugger;
      if(response.status && response.statusCode==200){
        debugger;
        this.referralRangeForm.patchValue({
          ddlGender:response.data.gender,
          LowValue:response.data.lowRange,
          HighValue:response.data.highRange,
          FromDays:response.data.ageFrom,
          ToDays:response.data.ageTo,
          CriticalLowValue:response.data.lowCriticalValue,
          CriticalHighValue:response.data.highCriticalValue,
          ReferralRangesGroup:response.data.normalRange,   
        })
      }
      console.log(this.editTestForm);
     console.log(response);
    }) 
    this.loaderService.hide();
   }

   loadSpecialValues(testCode:any){
    debugger;
    this.testService.GetSpecialValueByTestCode(this.partnerId,testCode).subscribe((response:any)=>{
      debugger;
     this.specialValueResponse = response.data; 
     console.log(response);
    }) 
   }

}
