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
import { centerRateResponse } from '../../../../../Interfaces/TestMaster/centerRateResponse';
import { testMasterRequest } from '../../../../../Interfaces/TestMaster/testMasterRequest';
import { referralRangesRequest } from '../../../../../Interfaces/TestMaster/referralRangesRequest';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponentComponent } from '../../../../confirmation-dialog-component/confirmation-dialog-component.component';


@Component({
  selector: 'app-labtestedit',
  standalone: true,
  imports: [MatTabsModule, ToastComponent, CommonModule,
    ReactiveFormsModule, LoaderComponent, MatIconModule, MatCheckboxModule,
    NgxPaginationModule, FormsModule],
  templateUrl: './labtestedit.component.html',
  styleUrl: './labtestedit.component.css'
})
export class LabtesteditComponent {
  [x: string]: any;

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
  specialValueForm!: FormGroup<any>;
  specialValueResponse:Observable<specialValueResponse>|any;
  centerRateResponse:Observable<centerRateResponse>|any;
  p: number = 1; // current page
  totalItems: number =0; // total number of items, for example
  itemsPerPage: number = 7; // items per page

  p1: number = 1; // current page
  totalItems1: number =0; // total number of items, for example
  itemsPerPage1: number = 7; // items per page
  IsNoRecordFound=false;
  IsRecordFound=false;
  loggedInUserId:any;
  isDisabled=false;
// Used for add/edit the test details
  testMasterRequest:testMasterRequest={
    partnerId: '',
    testCode: '',
    testName: '',
    department: '',
    subDepartment: '',
    methodology: '',
    specimenType: '',
    referenceUnits: '',
    reportingStyle: '',
    reportTemplateName: '',
    reportingDecimals: 0,
    isOutlab: false,
    printSequence: 0,
    isReserved: '',
    testShortName: '',
    patientRate: 0,
    clientRate: 0,
    labRate: 0,
    status: false,
    analyzerName: '',
    isAutomated: false,
    isCalculated: false,
    labTestCode: '',
    testApplicable: '',
    isLMP: false,
    isNABLApplicable: false,
    referalRangeComments: '',
    updatedBy: ''
  }
  
  // Used for add/edit the referral range details
referralRangesRequest: referralRangesRequest = {
  opType: '',
  referralId: 0,
  testCode: '',
  lowRange: 0,
  highRange: 0,
  normalRange: '',
  ageFrom: 0,
  ageTo: 0,
  gender: '',
  isPregnant: false,
  lowCriticalValue: 0,
  highCriticalValue: 0,
  partnerId: '',
  updatedBy: ''
};

specialValueRequest = {
  partnerId: '',
  opType: '', 
  testCode: '',
  recordId: 0,
  allowedValue: '',
  testName: '',
  isAbnormal: false,
};


  constructor(public dialogRef: MatDialogRef<LabtesteditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,private testService:TestService,private formBuilder: FormBuilder,
    private toasterService: ToastService,private refPageService:RefreshPageService,
    private metaService:MetadataService,private loaderService: LoaderService,public dialog: MatDialog,private fb: FormBuilder){
      this.loading$ = this.loaderService.loading$;
      this.partnerId= localStorage.getItem('partnerId');
      this.loggedInUserId=localStorage.getItem('userId');
      this.labtestCode=data.testCode;
     
    }

    ngOnInit():void{
      debugger;
      this.IsNoRecordFound=true;
      this.IsRecordFound=false;
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

      this.editTestForm.get('testCode')?.disable();

        this.referralRangeForm = this.fb.group({
        hdnReferralId: [0],
        ddlGender: [''],
        LowValue: [0],
        HighValue: [0],
        FromDays: [0],
        ToDays: [0],
        CriticalLowValue: [0],
        CriticalHighValue: [0],
        ReferralRangesGroup: ['']
      });
      if(this.labtestCode!==undefined){
        this.loadTestDetails(this.labtestCode);
        this.loadReferralRangeValues(this.labtestCode);
        this.loadSpecialValues(this.labtestCode);
        // this.loadCenterRates(this.labtestCode); need to implement later
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

      this.specialValueForm = this.fb.group({
        partnerId: [''],
        opType: [''],
        testCode: [''],
        recordId: [0],
        allowedValues: [''],
        testName: [''],
        isAbnormal: [false],
        EditedValue: ['']
        })
      
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
        this.referralRangesRequest.referralId=response.data.referralId;
        this.referralRangeForm.value.HighValue=response.data.highRange;
        this.referralRangeForm.patchValue({
          hdnReferralId:response.data.referralId,
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

  loadSpecialValues(testCode: any) {
  debugger;
  this.testService.GetSpecialValueByTestCode(this.partnerId, testCode)
    .subscribe((response: any) => {
      debugger;
      if (response?.status && response?.statusCode === 200 && Array.isArray(response.data)) {
        this.IsNoRecordFound = false;
        this.IsRecordFound = true;

        this.specialValueResponse = response.data;

        // Example: take the first record
        const record = response.data[0];

        if (record) {
          this.specialValueRequest.recordId = record.recordId;
          this.specialValueRequest.testName = record.testName;
          this.specialValueForm.patchValue({
            partnerId: record.partnerId,
            testCode: record.testCode,
            recordId: record.recordId,
            allowedValues: record.allowedValue,   // note: in JSON it is "allowedValue" not "allowedValues"
            testName: record.testName,
            isAbnormal: record.isAbnormal
          });
        }
      } else {
        this.IsNoRecordFound = true;
        this.IsRecordFound = false;
      }

      console.log(response);
    });
}


   loadCenterRates(testCode:any){
    debugger;
    this.testService.GetCenterRtaesByTestCode(this.partnerId,testCode).subscribe((response:any)=>{
      debugger;
     this.centerRateResponse = response.data; 
     console.log(response);
    }) 
   }


   onSubmit():void{
    debugger;
    this.loaderService.show();
    if(this.editTestForm.value.testName==''){
      this.toasterService.showToast('Please enter test description...', 'error');
    }   
    else if(this.editTestForm.value.ddlTestDepartment==''){
      this.toasterService.showToast('Please choose test department.', 'error');
    }
    else if(this.editTestForm.value.ddlSubDepartment==''){
      this.toasterService.showToast('Please choose sub department.', 'error');
    }
    else if(this.editTestForm.value.ddlSpecimenType==''){
      this.toasterService.showToast('Please choose specimen type', 'error');
    }
  else {
    debugger;
      this.testMasterRequest.partnerId=this.partnerId;
      this.testMasterRequest.testCode=''
      this.testMasterRequest.testName=this.editTestForm.value.testName;
        this.testMasterRequest.department=this.editTestForm.value.ddlTestDepartment;
      this.testMasterRequest.subDepartment=this.editTestForm.value.ddlSubDepartment;
      this.testMasterRequest.methodology=this.editTestForm.value.Methodology;
      this.testMasterRequest.specimenType=this.editTestForm.value.ddlSpecimenType;
      this.testMasterRequest.referenceUnits=this.editTestForm.value.ReferenceUnit;
      this.testMasterRequest.reportingStyle=this.editTestForm.value.ddlReportingStyle;
      this.testMasterRequest.reportTemplateName=this.editTestForm.value.ddlReportTemplate;
      this.testMasterRequest.reportingDecimals=this.editTestForm.value.ReportingDecimals;
      if(this.editTestForm.value.ddlProcessedAt=="True"){
        this.testMasterRequest.isOutlab=true;
      }
      else{
        this.testMasterRequest.isOutlab=false;
     }
      this.testMasterRequest.printSequence=this.editTestForm.value.PrintSequence;
      this.testMasterRequest.isReserved=this.editTestForm.value.ddlTestEntryRestricted;
      this.testMasterRequest.testShortName=this.editTestForm.value.ShortName;
      this.testMasterRequest.patientRate=this.editTestForm.value.PatinetRate;
      this.testMasterRequest.clientRate=this.editTestForm.value.ClientRate;
      this.testMasterRequest.labRate=this.editTestForm.value.LabRate;
      if(this.editTestForm.value.ddlTestStatus=="Active"){
          this.testMasterRequest.status=true;
      }
      else{
        this.testMasterRequest.status=false;
      }
      this.testMasterRequest.analyzerName=this.editTestForm.value.DefaultValue;
      if(this.editTestForm.value.ddlIsAutomated=="Yes"){
        this.testMasterRequest.isAutomated=true;
      }
      else{
        this.testMasterRequest.isAutomated=false;
      }
      if(this.editTestForm.value.ddlIsCalculated=="Yes"){
        this.testMasterRequest.isCalculated=true;
      }
      else{
        this.testMasterRequest.isCalculated=false;
      }
      this.testMasterRequest.labTestCode=this.editTestForm.value.LabTestCode;
      this.testMasterRequest.testApplicable=this.editTestForm.value.ddlTestApplicable;
      if(this.editTestForm.value.ddlIsLMP=="True"){
        this.testMasterRequest.isLMP=true;
      }
      else{
        this.testMasterRequest.isLMP=false;
      }
      if(this.editTestForm.value.ddlIsNABLApplicable=="Yes"){
        this.testMasterRequest.isNABLApplicable=true;
      }
      else{
        this.testMasterRequest.isNABLApplicable=false;
      }    
      this.testMasterRequest.referalRangeComments=this.editTestForm.value.ReferralRangesComments;
      this.testMasterRequest.updatedBy=this.loggedInUserId;
  
      this.testService.saveTestDetails(this.testMasterRequest)
      .subscribe({
        next: (response: any) => {
          debugger;
          if(response.statusCode==200 && response.status){
            debugger;
            console.log(response);
            this.refPageService.notifyRefresh(); // used to refresh the main list page
            this.toasterService.showToast('Test details created successfully!', 'success');
            this.dialogRef.close();
            this.ngOnInit();       
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

   onEditTest():void{
    debugger;
    this.loaderService.show();
    if(this.editTestForm.value.testName==''){
      this.toasterService.showToast('Please enter test description...', 'error');
    }   
    else if(this.editTestForm.value.ddlTestDepartment==''){
      this.toasterService.showToast('Please choose test department.', 'error');
    }
    else if(this.editTestForm.value.ddlSubDepartment==''){
      this.toasterService.showToast('Please choose sub department.', 'error');
    }
    else if(this.editTestForm.value.ddlSpecimenType==''){
      this.toasterService.showToast('Please choose specimen type', 'error');
    }
  else {
    debugger;
      this.testMasterRequest.partnerId=this.partnerId;
      this.testMasterRequest.testCode=this.labtestCode;
      this.testMasterRequest.testName=this.editTestForm.value.testName;
      this.testMasterRequest.department=this.editTestForm.value.ddlTestDepartment;
      this.testMasterRequest.subDepartment=this.editTestForm.value.ddlSubDepartment;
      this.testMasterRequest.methodology=this.editTestForm.value.Methodology;
      this.testMasterRequest.specimenType=this.editTestForm.value.ddlSpecimenType;
      this.testMasterRequest.referenceUnits=this.editTestForm.value.ReferenceUnit;
      this.testMasterRequest.reportingStyle=this.editTestForm.value.ddlReportingStyle;
      this.testMasterRequest.reportTemplateName=this.editTestForm.value.ddlReportTemplate;
      this.testMasterRequest.reportingDecimals=this.editTestForm.value.ReportingDecimals;
      if(this.editTestForm.value.ddlProcessedAt=="True"){
        this.testMasterRequest.isOutlab=true;
      }
      else{
        this.testMasterRequest.isOutlab=false;
     }
      this.testMasterRequest.printSequence=this.editTestForm.value.PrintSequence;
      this.testMasterRequest.isReserved=this.editTestForm.value.ddlTestEntryRestricted;
      this.testMasterRequest.testShortName=this.editTestForm.value.ShortName;
      this.testMasterRequest.patientRate=this.editTestForm.value.PatinetRate;
      this.testMasterRequest.clientRate=this.editTestForm.value.ClientRate;
      this.testMasterRequest.labRate=this.editTestForm.value.LabRate;
      if(this.editTestForm.value.ddlTestStatus=="Active"){
          this.testMasterRequest.status=true;
      }
      else{
        this.testMasterRequest.status=false;
      }
      this.testMasterRequest.analyzerName=this.editTestForm.value.DefaultValue;
      if(this.editTestForm.value.ddlIsAutomated=="Yes"){
        this.testMasterRequest.isAutomated=true;
      }
      else{
        this.testMasterRequest.isAutomated=false;
      }
      if(this.editTestForm.value.ddlIsCalculated=="Yes"){
        this.testMasterRequest.isCalculated=true;
      }
      else{
        this.testMasterRequest.isCalculated=false;
      }
      this.testMasterRequest.labTestCode=this.editTestForm.value.LabTestCode;
      this.testMasterRequest.testApplicable=this.editTestForm.value.ddlTestApplicable;
      if(this.editTestForm.value.ddlIsLMP=="True"){
        this.testMasterRequest.isLMP=true;
      }
      else{
        this.testMasterRequest.isLMP=false;
      }
      if(this.editTestForm.value.ddlIsNABLApplicable=="Yes"){
        this.testMasterRequest.isNABLApplicable=true;
      }
      else{
        this.testMasterRequest.isNABLApplicable=false;
      }    
      this.testMasterRequest.referalRangeComments=this.editTestForm.value.ReferralRangesComments;
      this.testMasterRequest.updatedBy=this.loggedInUserId;
  
      this.testService.editTestDetails(this.testMasterRequest)
      .subscribe({
        next: (response: any) => {
          debugger;
          if(response.statusCode==200 && response.status){
            debugger;
            console.log(response);
            this.toasterService.showToast('Test details updated successfully!', 'success');
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

    onAddReferralRange():void{
      debugger;
    this.loaderService.show();
    if(this.referralRangeForm.value.ddlGender=='' || this.referralRangeForm.value.ddlGender==null){
      this.toasterService.showToast('Please choose gender...', 'error');
    }   
    else if(this.referralRangeForm.value.LowValue==0){
      this.toasterService.showToast('Please enter the low range value.', 'error');
    }
    else if(this.referralRangeForm.value.HighValue==0){
      this.toasterService.showToast('Please enter the high range value.', 'error');
    }
    else if(this.referralRangeForm.value.CriticalLowValue==0){
      this.toasterService.showToast('Please enter the low Critical Value', 'error');
    }
    else if(this.referralRangeForm.value.CriticalHighValue==0){
      this.toasterService.showToast('Please enter the high Critical Value', 'error');
    }
  else {
    debugger;
      this.referralRangesRequest.partnerId=this.partnerId;
      this.referralRangesRequest.testCode=this.labtestCode;
      this.referralRangesRequest.gender=this.referralRangeForm.value.ddlGender;
      this.referralRangesRequest.lowRange=this.referralRangeForm.value.LowValue;
      this.referralRangesRequest.highRange=this.referralRangeForm.value.HighValue;
      this.referralRangesRequest.ageFrom=this.referralRangeForm.value.FromDays;
      this.referralRangesRequest.ageTo=this.referralRangeForm.value.ToDays;
      this.referralRangesRequest.lowCriticalValue=this.referralRangeForm.value.CriticalLowValue;
      this.referralRangesRequest.highCriticalValue=this.referralRangeForm.value.CriticalHighValue;
      this.referralRangesRequest.normalRange=this.referralRangeForm.value.ReferralRangesGroup;
      if(this.referralRangesRequest.referralId>0){
        this.referralRangesRequest.opType='Update';
      }
      else{
          this.referralRangesRequest.opType='Insert';
      }
      this.referralRangesRequest.updatedBy=this.loggedInUserId;
      this.referralRangesRequest.isPregnant=false;
  
      this.testService.saveUpdateReferralRanges(this.referralRangesRequest)
      .subscribe({
        next: (response: any) => {
          debugger;
          if(response.statusCode==200 && response.status){
            debugger;
            console.log(response);
           // this.refPageService.notifyRefresh(); // used to refresh the main list page
            this.toasterService.showToast(response.responseMessage, 'success');
            this.dialogRef.close();
            this.ngOnInit();       
          }
          else{
            debugger;
            console.log(response.responseMessage);
          }
          
        },
        error: (err) => console.log(err)
      });   
    }
    this.loaderService.hide();
    }

     NormalRangeDeleteConfirmationDialog(referralId:number): void {
        debugger;
        const dialogRef = this.dialog.open(ConfirmationDialogComponentComponent, {
          width: '250px',
          data: { message: 'Are you sure you want to delete this normal range?',referralId: referralId }
        });
    
        dialogRef.afterClosed().subscribe(result => {
          debugger;
          if (result.success) {
            debugger;
            this.testService.DeleteNormalRangeById(referralId).subscribe((response:any)=>{
              debugger;
             if(response.status && response.statusCode==200){
              this.toasterService.showToast(response.responseMessage, 'success');
              this.ngOnInit();
             }
             else{
              this.toasterService.showToast(response.responseMessage, 'error');
             }
             console.log(response);
            }) 
            console.log('Returned referralId:', result.referralId);
            console.log('User confirmed the action.');
          } else {
            debugger;
            // User clicked 'Cancel'
            console.log('User canceled the action.');
          }
        });
      }

  onSaveUpdateSpecialValues():void{
      debugger;
    this.loaderService.show();
      debugger;
      this.specialValueRequest.partnerId=this.partnerId;
      this.specialValueRequest.testCode=this.labtestCode;
      if(this.specialValueRequest.recordId>0)
      {
          this.specialValueRequest.opType='Update';
      }
        else{
          this.specialValueRequest.opType='Insert';
        }
      this.specialValueRequest.allowedValue=this.specialValueForm.value.EditedValue;      
      this.specialValueRequest.isAbnormal=this.specialValueForm.value.isAbnormal;
 
      this.testService.saveUpdateSpecialValues(this.specialValueRequest)
      .subscribe({
        next: (response: any) => {
          debugger;
          if(response.statusCode==200 && response.status){
            debugger;
            console.log(response);
           // this.refPageService.notifyRefresh(); // used to refresh the main list page
            this.toasterService.showToast(response.responseMessage, 'success');
            this.dialogRef.close();
            this.ngOnInit();       
          }
          else{
            debugger;
            console.log(response.responseMessage);
          }
          
        },
        error: (err) => console.log(err)
      });   

    this.loaderService.hide();
  
  }

   SpecialValueDeleteConfirmationDialog(recordId:number,partnerId:string): void {
        debugger;
        const dialogRef = this.dialog.open(ConfirmationDialogComponentComponent, {
          width: '250px',
          data: { message: 'Are you sure you want to delete this special value?',recordId: recordId,partnerId:partnerId }
        });
    
        dialogRef.afterClosed().subscribe(result => {
          debugger;
          if (result.success) {
            debugger;
            this.testService.deleteSpecialValueById(recordId,partnerId).subscribe((response:any)=>{
              debugger;
             if(response.status && response.statusCode==200){
              this.toasterService.showToast(response.responseMessage, 'success');
              this.ngOnInit();
             }
             else{
              this.toasterService.showToast(response.responseMessage, 'error');
             }
             console.log(response);
            }) 
            console.log('Returned referralId:', result.referralId);
            console.log('User confirmed the action.');
          } else {
            debugger;
            // User clicked 'Cancel'
            console.log('User canceled the action.');
          }
        });
      }
}
