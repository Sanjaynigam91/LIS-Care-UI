import { ChangeDetectorRef, Component, Inject, inject } from '@angular/core';
import { ToastComponent } from "../../Toaster/toast/toast.component";
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
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
    roleId:any;
    partnerId: string |any;
    loggedInUserId: string |any;
    editTestProfileForm!: FormGroup<any>;
    ProfileMappingListForm!: FormGroup<any>;
    profileCode:any;
    reportTemplatesResponse: Observable<metaTagResponse>| any;
    profileApiResponse?:Observable<ProfileResponse>| any;
    selectedProfile?: Profile;

     testMasterSearch:testMasterSearchRequest={
        partnerId: '',
        testName: '',
        isActive: false,
        deptOrDiscipline: '',
        isProcessedAt: ''
      }
    testDataApiResponse:Observable<testDataSearchResponse>| any;

constructor(public dialogRef: MatDialogRef<PopupProfilemastereditComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,private authService:AuthService,
      private toasterService: ToastService,private profileService:ProfileService,
      private refPageService:RefreshPageService,private formBuilder: FormBuilder,
      private testService:TestService,private loaderService: LoaderService,
      private metaService:MetadataService
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
        ddlTemplateName: [''],
        GroupHeader: [''],
      });
  
 this.editTestProfileForm.get('profileCode')?.disable();
    if(this.profileCode!==undefined){
        
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
      if (response?.data) {
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
            ddlAvailableForAll: response.data?.isAvailableForAll?.toString() || 'false',
            profileFooter: response.data?.normalRangeFooter || '',
            ddlProcessedAt: response.data?.isProfileOutLab?.toString() || 'false' ,
            ddlTestApplicable: response.data?.testApplicable?.toString() || '',
            ddlIsLMP: response.data?.isLMP || 'false',
            ddlIsNABLApplicable: response.data?.isNABLApplicable || 'false'
          });
        });
      }
      this.loaderService.hide();
    });
  }
}

}
