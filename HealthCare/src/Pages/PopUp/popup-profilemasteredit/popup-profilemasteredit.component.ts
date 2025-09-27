import { ChangeDetectorRef, Component, Inject, inject } from '@angular/core';
import { ToastComponent } from "../../Toaster/toast/toast.component";
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from '../../../auth/auth.service';
import { ToastService } from '../../../auth/Toaster/toast.service';
import { ProfileService } from '../../../auth/ProfileMasterService/profile.service';
import { RefreshPageService } from '../../../auth/Shared/refresh-page.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule, MatIcon } from '@angular/material/icon';
import { TestService } from '../../../auth/TestMasterService/test.service';
import { testMasterSearchRequest } from '../../../Interfaces/TestMaster/testMasterSearchRequest';
import { LoaderService } from '../../../Interfaces/loader.service';
import { Observable } from 'rxjs';
import { testDataSearchResponse } from '../../../Interfaces/TestMaster/testDataSearchResponse';
import { MetadataService } from '../../../auth/metadata.service';
import { metaTagResponse } from '../../../Interfaces/metaTagResponse';
import { Profile, ProfileResponse } from '../../../Interfaces/ProfileMaster/ProfileResponse';
import { ProfileTestMappingResponse } from '../../../Interfaces/ProfileMaster/ProfileTestMappingResponse';
import { ConfirmationDialogComponentComponent } from '../../confirmation-dialog-component/confirmation-dialog-component.component';
import { ProfileRequest } from '../../../Interfaces/ProfileMaster/ProfileRequest ';
import { TestMappingRequest } from '../../../Interfaces/ProfileMaster/TestMappingRequest';

@Component({
  selector: 'app-popup-profilemasteredit',
  standalone: true,
  imports: [ToastComponent, CommonModule, MatIcon,ReactiveFormsModule],
  templateUrl: './popup-profilemasteredit.component.html',
  styleUrl: './popup-profilemasteredit.component.css'
})
export class PopupProfilemastereditComponent {
    router  =  inject(Router);
    isVisible = false;
    isSubmitVisible:boolean=false;
    isUpdateVisible:boolean=false;
    isAddHeaderVisible:boolean=false;
    isEditHeaderVisible:boolean=false;
    isProfileMappingListVisible:boolean=false;
    isUpdateMappingtVisible:boolean=false;
    roleId:any;
    partnerId: string |any;
    loggedInUserId: string |any;
    editTestProfileForm!: FormGroup<any>;
    ProfileMappingListForm!: FormGroup<any>;
    profileCode:any;
    reportTemplatesResponse: Observable<metaTagResponse>| any;
    profileApiResponse?:Observable<ProfileResponse>| any;
    selectedProfile?: Profile;
    profileTestMappingResponse?:Observable<ProfileTestMappingResponse>| any;

     testMasterSearch:testMasterSearchRequest={
        partnerId: '',
        testName: '',
        isActive: false,
        deptOrDiscipline: '',
        isProcessedAt: ''
      }
    testDataApiResponse:Observable<testDataSearchResponse>| any;
    ProfileRequest:ProfileRequest={
      profileName: '',
      partnerId: '',
      patientRate: 0,
      clientRate: 0,
      labRate: 0,
      profileStatus: false,
      testShortName: '',
      printSequence: 0,
      sampleTypes: '',
      isAvailableForAll: false,
      labTestCode: '',
      isProfileOutLab: false,
      testApplicable: '',
      isLMP: false,
      isNABApplicable: false,
      profileFooter: '',
      profileCode: ''
    }

    mappingRequest:TestMappingRequest={
      profileCode: '',
      testCode: '',
      partnerId: '',
      sectionName: '',
      printOrder: 0,
      reportTemplateName: '',
      groupHeader: ''
    }

constructor(public dialogRef: MatDialogRef<PopupProfilemastereditComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,private authService:AuthService,
      private toasterService: ToastService,private profileService:ProfileService,
      private refPageService:RefreshPageService,private formBuilder: FormBuilder,
      private testService:TestService,private loaderService: LoaderService,
      private metaService:MetadataService,public dialog: MatDialog
    ){
      this.partnerId= localStorage.getItem('partnerId');
      this.loggedInUserId=localStorage.getItem('userId');
      this.roleId=data.roleId;
      this.profileCode=data.profileCode;
      this.profileApiResponse=data.profileApiResponse;
    }


open(): void {
    this.isVisible = true;
  }

  close(): void {
    this.dialogRef.close();
  }

ngOnInit():void{
  if(this.profileCode!==undefined){
    this.isProfileMappingListVisible=true;  
  }
  else{
    this.isProfileMappingListVisible=false;
  }

this.editTestProfileForm = this.formBuilder.group({
        profileCode: [''],
        profileName: [''],
        patientRate: [''],
        clientRate: [''],
        labRate: [''],
        ddlProfileStatus: [''],
        profileShortName: [''],
        printSequence: [''],
        sampleTypes: [''],
        ddlAvailableForAll: [''],
        labTestCode: [''],
        ddlProcessedAt: [''],
        ddlTestApplicable: [''],
        ddlIsLMP: [''],
        ddlIsNABLApplicable: [''],
        profileFooter: [''],
        ddlTestName: [''],
        ProfileSectionName: [''],
        printOrder: [''],
        reportTemplateName: [''],
        GroupHeader: [''],
        ddlTemplateName: [''], 
      });
  
 this.editTestProfileForm.get('profileCode')?.disable();
    if(this.profileCode!==undefined){
        
        this.isSubmitVisible=false;
        this.isUpdateVisible=true;
        this.isAddHeaderVisible=false;
        this.isEditHeaderVisible=true;
         this.isUpdateMappingtVisible=true;
      }
      else{
        this.isSubmitVisible=true;
        this.isUpdateVisible=false;
        this.isAddHeaderVisible=true;
        this.isEditHeaderVisible=false;
        this.isUpdateMappingtVisible=false;
      }

 this.GetAllTestDetails();
 this.BindAllReportTemplates();
 this.ViewProfileDetails(this.profileCode);
 }

GetAllTestDetails(): void {
  this.testMasterSearch.partnerId = this.partnerId;
  this.loaderService.show(); // Show loader when API starts

  this.testService.BindTestInfo(this.testMasterSearch).subscribe({
    next: (response: any) => {
      if (response?.status && response?.statusCode === 200) {
        this.testDataApiResponse = response.data || [];
        console.log("Test Data:", this.testDataApiResponse);
      } else {
        console.warn("API returned error response:", response);
      }
    },
    error: (err) => {
      console.error("API Error:", err);
    },
    complete: () => {
      this.loaderService.hide(); // Hide loader once request completes
    }
  });

}

  BindAllReportTemplates(){
    debugger;
    this.metaService.LoadGetReportTemplates(this.partnerId).subscribe((response:any)=>{
      debugger;
     this.reportTemplatesResponse = response.data; 
     console.log(response);
    }) 
   }

ViewProfileDetails(profileCode: string) {
  if (profileCode) {
    this.loaderService.show();
    this.profileService.getProfileByProfileCode(this.partnerId, profileCode).subscribe((response: any) => {      
    this.profileService.getProfileMappedTests(profileCode,this.partnerId).subscribe((res: any) => {
      if (response?.data || res?.data) {
       this.profileTestMappingResponse = res.data || [];
        setTimeout(() => {
          this.editTestProfileForm.patchValue({
            profileCode: response.data?.profileCode || '',
            profileName: response.data?.profileName || '',
            patientRate: response.data?.mrp || 0,
            clientRate: response.data?.b2CRates || 0,
            labRate: response.data?.labrates || 0,
            ddlProfileStatus: response.data?.profileStatus || 'false',
            profileShortName: response.data?.testShortName || '',
            printSequence: response.data?.printSequence || 0,
            sampleTypes: response.data?.sampleTypes || '',
            ddlAvailableForAll: response.data?.isAvailableForAll|| 'false',
            labTestCode: response.data?.labTestCodes || '',
            profileFooter: response.data?.normalRangeFooter || '',
            ddlProcessedAt: response.data?.isProfileOutLab?.toString() || 'false' ,
            ddlTestApplicable: response.data?.testApplicable?.toString() || '',
            ddlIsLMP: response.data?.isLMP || 'false',
            ddlIsNABLApplicable: response.data?.isNABLApplicable || 'false',
            ddlTestName: res.data?.testCode || '',
            ProfileSectionName: res.data?.sectionName || '',
            printOrder: res.data?.printOrder || 0,
            ddlTemplateName: res.data?.reportTemplateName || '',
            GroupHeader: res.data?.groupHeader || ''
          });
        });
      }    
    })
      this.loaderService.hide();
    });
  }
}


mappedTestDeleteConfirmationDialog(mappingId:any): void {
    debugger;
    const dialogRef = this.dialog.open(ConfirmationDialogComponentComponent, {
      width: '250px',
      data: { message: 'Are you sure you want to delete this test from profile?',mappingId: mappingId }
    });

    dialogRef.afterClosed().subscribe(result => {
      debugger;
      if (result.success) {
        debugger;
        this.profileService.DeleteMappedTest(mappingId,this.partnerId).subscribe((response:any)=>{
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
        console.log('Returned User ID:', result.userId);
        console.log('User confirmed the action.');
      } else {
        debugger;
        // User clicked 'Cancel'
        console.log('User canceled the action.');
      }
    });
  }


  onSaveProfile(){
     this.loaderService.show();
    if(this.editTestProfileForm.value.profileName==''){
      this.toasterService.showToast('Please enter profile name...', 'error');
    } 
    else{
      debugger;
      this.ProfileRequest.profileCode='';
      this.ProfileRequest.profileName=this.editTestProfileForm.value.profileName;
      this.ProfileRequest.partnerId=this.partnerId;
      this.ProfileRequest.patientRate=this.editTestProfileForm.value.patientRate;
      this.ProfileRequest.clientRate=this.editTestProfileForm.value.clientRate;
      this.ProfileRequest.labRate=this.editTestProfileForm.value.labRate;
      this.ProfileRequest.profileStatus=this.editTestProfileForm.value.ddlProfileStatus==='true'?true:false;
      this.ProfileRequest.testShortName=this.editTestProfileForm.value.profileShortName;
      this.ProfileRequest.printSequence=this.editTestProfileForm.value.printSequence;
      this.ProfileRequest.sampleTypes=this.editTestProfileForm.value.sampleTypes;
      this.ProfileRequest.isAvailableForAll=this.editTestProfileForm.value.ddlAvailableForAll==='true'?true:false;
      this.ProfileRequest.labTestCode=this.editTestProfileForm.value.labTestCode;
      this.ProfileRequest.isProfileOutLab=this.editTestProfileForm.value.ddlProcessedAt==='true'?true:false;
      this.ProfileRequest.testApplicable=this.editTestProfileForm.value.ddlTestApplicable;
      this.ProfileRequest.isLMP=this.editTestProfileForm.value.ddlIsLMP==='true'?true:false;
      this.ProfileRequest.isNABApplicable=this.editTestProfileForm.value.ddlIsNABLApplicable==='true'?true:false;
      this.ProfileRequest.profileFooter=this.editTestProfileForm.value.profileFooter;
     this.profileService.saveProfileDetails(this.ProfileRequest)
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

  onUpdateProfile(){
    debugger;
     this.loaderService.show();
    if(this.editTestProfileForm.value.profileName==''){
      this.toasterService.showToast('Please enter profile name...', 'error');
    } 
    else{
      debugger;
      this.ProfileRequest.profileCode=this.profileCode;
      this.ProfileRequest.profileName=this.editTestProfileForm.value.profileName;
      this.ProfileRequest.partnerId=this.partnerId;
      this.ProfileRequest.patientRate=this.editTestProfileForm.value.patientRate;
      this.ProfileRequest.clientRate=this.editTestProfileForm.value.clientRate;
      this.ProfileRequest.labRate=this.editTestProfileForm.value.labRate;
      this.ProfileRequest.profileStatus=this.editTestProfileForm.value.ddlProfileStatus==='true'?true:false;
      this.ProfileRequest.testShortName=this.editTestProfileForm.value.profileShortName;
      this.ProfileRequest.printSequence=this.editTestProfileForm.value.printSequence;
      this.ProfileRequest.sampleTypes=this.editTestProfileForm.value.sampleTypes;
      this.ProfileRequest.isAvailableForAll=this.editTestProfileForm.value.ddlAvailableForAll==='true'?true:false;
      this.ProfileRequest.labTestCode=this.editTestProfileForm.value.labTestCode;
      this.ProfileRequest.isProfileOutLab=this.editTestProfileForm.value.ddlProcessedAt==='true'?true:false;
      this.ProfileRequest.testApplicable=this.editTestProfileForm.value.ddlTestApplicable;
      this.ProfileRequest.isLMP=this.editTestProfileForm.value.ddlIsLMP==='true'?true:false;
      this.ProfileRequest.isNABApplicable=this.editTestProfileForm.value.ddlIsNABLApplicable==='true'?true:false;
      this.ProfileRequest.profileFooter=this.editTestProfileForm.value.profileFooter;
     this.profileService.editProfileDetails(this.ProfileRequest)
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

   saveTestMapping(){
    debugger;
     this.loaderService.show();
    if(this.editTestProfileForm.value.ddlTestName==''){
      this.toasterService.showToast('Please select test name...', 'error');
    }
    else if(this.editTestProfileForm.value.ProfileSectionName==''){
      this.toasterService.showToast('Please enter section name...', 'error');
    } 
    else if(this.editTestProfileForm.value.printOrder==0 || this.editTestProfileForm.value.printOrder==''){
      this.toasterService.showToast('Please enter print order...', 'error');
    }
    else if(this.editTestProfileForm.value.ddlTemplateName==''){
      this.toasterService.showToast('Please select report template...', 'error');
    }
    else if(this.editTestProfileForm.value.GroupHeader==''){
      this.toasterService.showToast('Please enter group header...', 'error');
    }
    else{
      debugger;
      this.mappingRequest.profileCode=this.profileCode;
      this.mappingRequest.partnerId=this.partnerId;
      this.mappingRequest.testCode=this.editTestProfileForm.value.ddlTestName;
      this.mappingRequest.sectionName=this.editTestProfileForm.value.ProfileSectionName;
      this.mappingRequest.printOrder=this.editTestProfileForm.value.printOrder; 
      this.mappingRequest.reportTemplateName=this.editTestProfileForm.value.ddlTemplateName;
      this.mappingRequest.groupHeader=this.editTestProfileForm.value.GroupHeader;
     
     this.profileService.saveTestmappingDetails(this.mappingRequest)
      .subscribe({
        next: (response: any) => {
          debugger;
          if(response.statusCode==200 && response.status){
            debugger;
            console.log(response);
           // this.refPageService.notifyRefresh(); // used to refresh the main list page
            this.toasterService.showToast(response.responseMessage, 'success');
           // this.dialogRef.close();
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

}
