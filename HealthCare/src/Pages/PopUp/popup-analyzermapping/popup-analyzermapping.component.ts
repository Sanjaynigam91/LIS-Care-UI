import { Component, Inject, NgZone } from '@angular/core';
import { ToastComponent } from '../../Toaster/toast/toast.component';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { LoaderComponent } from '../../loader/loader.component';
import { Observable } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from '../../../auth/auth.service';
import { ToastService } from '../../../auth/Toaster/toast.service';
import { AnalyzerService } from '../../../auth/AnalyzerService/analyzer.service';
import { RefreshPageService } from '../../../auth/Shared/refresh-page.service';
import { TestService } from '../../../auth/TestMasterService/test.service';
import { LoaderService } from '../../../Interfaces/loader.service';
import { MetadataService } from '../../../auth/metadata.service';
import { testMasterSearchRequest } from '../../../Interfaces/TestMaster/testMasterSearchRequest';
import { testDataSearchResponse } from '../../../Interfaces/TestMaster/testDataSearchResponse';
import { AnalyzerTestMappingRequest } from '../../../Interfaces/AnalyzerMaster/analyzer-test-mapping-request';

@Component({
  selector: 'app-popup-analyzermapping',
  standalone: true,
  imports: [ToastComponent, CommonModule, MatIcon, ReactiveFormsModule, LoaderComponent],
  templateUrl: './popup-analyzermapping.component.html',
  styleUrl: './popup-analyzermapping.component.css'
})
export class PopupAnalyzermappingComponent {
loading$!: Observable<boolean>;
isAddHeaderVisible:boolean=false;
isEditHeaderVisible:boolean=false;
isVisible = false;
roleId:any;
partnerId: string |any;
loggedInUserId: string |any;
mappingId:any;
editAnalyzerMappingForm!: FormGroup<any>;
testDataApiResponse:Observable<testDataSearchResponse>| any;
testMasterSearch:testMasterSearchRequest={
        partnerId: '',
        testName: '',
        isActive: false,
        deptOrDiscipline: '',
        isProcessedAt: ''
      };

 analyzerMappingRequest:AnalyzerTestMappingRequest={
   mappingId: 0,
   analyzerId: 0,
   analyzerTestCode: '',
   labTestCode: '',
   status: false,
   partnerId: ''
 }     


constructor(public dialogRef: MatDialogRef<PopupAnalyzermappingComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,private authService:AuthService,
      private toasterService: ToastService,private analyzerService:AnalyzerService,
      private refPageService:RefreshPageService,private formBuilder: FormBuilder,
      private testService:TestService,private loaderService: LoaderService,
      private metaService:MetadataService,public dialog: MatDialog, private zone: NgZone
    ){
      this.partnerId= localStorage.getItem('partnerId');
      this.loggedInUserId=localStorage.getItem('userId');
      this.roleId=data.roleId;
      this.mappingId=data.mappingId;
    }

open(): void {
    this.isVisible = true;
  }

  close(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
      this.editAnalyzerMappingForm=this.formBuilder.group({
        AnalyzerTestCode:[''],
        ddlLabTestCode:[''],
        ddlStatus:[''],
        hdnAnalyzerId:0,
    });
    if(this.mappingId!=null && this.mappingId!=""){
      this.GetAllTestDetails();
      this.viewAanalyzerTestMapping(this.mappingId);
    }
  }

  GetAllTestDetails(): void {
  this.loaderService.show(); // Show loader when API starts
  this.testMasterSearch.partnerId = this.partnerId;
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
this.loaderService.hide();
}

viewAanalyzerTestMapping(mappingId: any) {
  if (!mappingId) return;

  this.loaderService.show();

  this.analyzerService.getAnalyzersTestMappingById(mappingId, this.partnerId)
  .subscribe((response: any) => {
    if (response.status && response.data?.length) {
      debugger;
      const analyzerMapping = response.data[0]; // first item in array
      this.editAnalyzerMappingForm.patchValue({
        hdnAnalyzerId: analyzerMapping.analyzerId || 0,
        AnalyzerTestCode: analyzerMapping.analyzerTestCode || '',
        ddlLabTestCode: analyzerMapping.labTestCode || '',
        ddlStatus: analyzerMapping.status ? 'true' : 'false'
      });
    }
  });
this.loaderService.hide();

}

onUpdateAnalyzerTestmapping(){
  debugger;
     this.loaderService.show();
    if(this.editAnalyzerMappingForm.value.AnalyzerTestCode==''){
      this.toasterService.showToast('Please enter analyzer test code...', 'error');
    } 
    else if(this.editAnalyzerMappingForm.value.ddlLabTestCode==''){
      this.toasterService.showToast('Please select lab test name...', 'error');
    }
    else if(this.editAnalyzerMappingForm.value.ddlStatus==''){
      this.toasterService.showToast('Please select status...', 'error');
    }
    else{
      debugger;
      this.analyzerMappingRequest.mappingId=this.mappingId;
      this.analyzerMappingRequest.analyzerId=this.editAnalyzerMappingForm.value.hdnAnalyzerId;
      this.analyzerMappingRequest.partnerId=this.partnerId;
      this.analyzerMappingRequest.analyzerTestCode=this.editAnalyzerMappingForm.value.AnalyzerTestCode;
      this.analyzerMappingRequest.status=this.editAnalyzerMappingForm.value.ddlStatus==='true'?true:false;
      this.analyzerMappingRequest.labTestCode=this.editAnalyzerMappingForm.value.ddlLabTestCode;
      
     this.analyzerService.updateAnalyzerTestMapping(this.analyzerMappingRequest)
      .subscribe({
        next: (response: any) => {
          debugger;
          if(response.statusCode==200 && response.status){
            debugger;
            console.log(response);
            this.toasterService.showToast(response.responseMessage, 'success');
            this.dialogRef.close();
            this.ngOnInit();   
             this.refPageService.notifyRefresh(); // used to refresh the main list page    
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
