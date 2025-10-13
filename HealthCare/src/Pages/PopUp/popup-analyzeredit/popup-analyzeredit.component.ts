import { ChangeDetectorRef, Component, Inject, NgZone } from '@angular/core';
import { ToastComponent } from '../../Toaster/toast/toast.component';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from '../../../auth/auth.service';
import { ToastService } from '../../../auth/Toaster/toast.service';
import { RefreshPageService } from '../../../auth/Shared/refresh-page.service';
import { TestService } from '../../../auth/TestMasterService/test.service';
import { LoaderService } from '../../../Interfaces/loader.service';
import { MetadataService } from '../../../auth/metadata.service';
import { testDataSearchResponse } from '../../../Interfaces/TestMaster/testDataSearchResponse';
import { Observable } from 'rxjs';
import { testMasterSearchRequest } from '../../../Interfaces/TestMaster/testMasterSearchRequest';
import { AnalyzerService } from '../../../auth/AnalyzerService/analyzer.service';
import { SupplierResponse } from '../../../Interfaces/AnalyzerMaster/SupplierResponse';
import { AnalyzerResponse } from '../../../Interfaces/AnalyzerMaster/AnalyzerResponse';
import { AnalyzerApiResponse } from '../../../Interfaces/AnalyzerMaster/AnalyzerApiResponse';
import { LoaderComponent } from "../../loader/loader.component";
import { AnalyzerMapping } from '../../../Interfaces/AnalyzerMaster/AnalyzerMappingResponse';
import { AnalyzerRequest } from '../../../Interfaces/AnalyzerMaster/AnalyzerRequest';
import { PopupAnalyzermappingComponent } from '../popup-analyzermapping/popup-analyzermapping.component';
import { ConfirmationDialogComponentComponent } from '../../confirmation-dialog-component/confirmation-dialog-component.component';
import { AnalyzerTestMappingRequest } from '../../../Interfaces/AnalyzerMaster/analyzer-test-mapping-request';

@Component({
  selector: 'app-popup-analyzeredit',
  standalone: true,
    imports: [ToastComponent, CommonModule, MatIcon, ReactiveFormsModule, LoaderComponent],
  templateUrl: './popup-analyzeredit.component.html',
  styleUrl: './popup-analyzeredit.component.css'
})
export class PopupAnalyzereditComponent {
loading$!: Observable<boolean>;
isAddHeaderVisible:boolean=false;
isEditHeaderVisible:boolean=false;
isVisible = false;
roleId:any;
partnerId: string |any;
loggedInUserId: string |any;
editAnalyzerForm!: FormGroup<any>;
isSubmitVisible:boolean=false;
isUpdateVisible:boolean=false;
isAnalyzerMappingListVisible:boolean=false;
analyzerId:any;
testDataApiResponse:Observable<testDataSearchResponse>| any;
testMasterSearch:testMasterSearchRequest={
        partnerId: '',
        testName: '',
        isActive: false,
        deptOrDiscipline: '',
        isProcessedAt: ''
      };
supplierApiResponse:Observable<SupplierResponse>| any;
analyzerApiResponse:Observable<AnalyzerResponse>| any;
analyzerMappingResponse:Observable<AnalyzerMapping>| any;
analyzerRequest:AnalyzerRequest={
  analyzerId: 0,
  analyzerName: '',
  analyzerShortCode: '',
  status: '',
  supplierCode: '',
  engineerContactNo: '',
  assetCode: '',
  partnerId: ''
}

 analyzerMappingRequest:AnalyzerTestMappingRequest={
   mappingId: 0,
   analyzerId: 0,
   analyzerTestCode: '',
   labTestCode: '',
   status: false,
   partnerId: ''
 } 


constructor(public dialogRef: MatDialogRef<PopupAnalyzereditComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,private authService:AuthService,
      private toasterService: ToastService,private analyzerService:AnalyzerService,
      private refPageService:RefreshPageService,private formBuilder: FormBuilder,
      private testService:TestService,private loaderService: LoaderService,
      private metaService:MetadataService,public dialog: MatDialog, private zone: NgZone
    ){
      this.partnerId= localStorage.getItem('partnerId');
      this.loggedInUserId=localStorage.getItem('userId');
      this.roleId=data.roleId;
      this.analyzerId=data.analyzerId;
    }

  ngAfterViewInit() {
  setTimeout(() => this.isVisible = true);
}

open(): void {
    this.isVisible = true;
  }

  close(): void {
    this.dialogRef.close();
  }

ngOnInit(): void {
    this.editAnalyzerForm=this.formBuilder.group({
      AnalyzerName:[''],
      AnalyzerShortCode:[''],
      EngineerContactNumber:[''],
      WarrantyEndDate:[''],
      ddlSupplierCode:[''],
      AssetCode:[''],
      POValue:[''],
      ddlAnalyzerStatus:[''],
      AnalyzerTestCode:[''],
      ddlTestName:[''],
      ddlStatus:[''],
    });

  setTimeout(() => {  // 🔑 forces update in next CD cycle
    if (!this.data.analyzerId) {
      this.isAddHeaderVisible = true;
      this.isEditHeaderVisible = false;
      this.isSubmitVisible = true;
      this.isUpdateVisible = false;
      this.isAnalyzerMappingListVisible = false;
    } else {
      this.isEditHeaderVisible = true;
      this.isAddHeaderVisible = false;
      this.isSubmitVisible = false;
      this.isUpdateVisible = true;
      this.isAnalyzerMappingListVisible = true;

      this.viewAanalyzerDetails(this.data.analyzerId);
      this.viewAanalyzerMappings(this.data.analyzerId);
      this.GetAllTestDetails();
    }
    this.getAllSupplierDetails();
  });
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

   getAllSupplierDetails(){
    debugger;
    this.loaderService.show();
    this.analyzerService.getAllSuppliers(this.partnerId).subscribe({
      next: (response: any) => {
        debugger;
        if (response?.status && response?.statusCode === 200) {
          this.supplierApiResponse = response.data; 
          console.log(this.supplierApiResponse);
        } else {
          console.warn("No Record Found!");
        }

        this.loaderService.hide();
      },
      error: (err) => {
        console.error("Error while fetching profiles:", err);
        this.loaderService.hide();
      }
    });

  } 
viewAanalyzerDetails(analyzerId: any) {
  if (!analyzerId) return;

  this.loaderService.show();

  this.analyzerService.getAnalyzersById(this.partnerId, analyzerId)
  .subscribe((response: any) => {
    if (response.status && response.data?.length) {
      debugger;
      const analyzer = response.data[0]; // first item in array
      this.editAnalyzerForm.patchValue({
        AnalyzerName: analyzer.analyzerName || '',
        AnalyzerShortCode: analyzer.analyzerCode || '',
        EngineerContactNumber: analyzer.engineerContactNo || '',
        WarrantyEndDate: analyzer.warrantyEndDate || '',
        ddlSupplierCode: analyzer.supplierCode || '',
        AssetCode: analyzer.assetCode || '',
        POValue: analyzer.purchaseValue || 0,
        ddlAnalyzerStatus: analyzer.analyzerStatus ? 'true' : 'false'
      });
    }
  });
this.loaderService.hide();

}


viewAanalyzerMappings(analyzerId: any) {
  if (!analyzerId) return;
  debugger;
  this.loaderService.show();

  this.analyzerService.getAnalyzersTestMappings(this.partnerId, analyzerId)
  .subscribe((response: any) => {
    if (response.status && response.data?.length) {
      debugger;
      this.analyzerMappingResponse = response.data; 
    }
  });
this.loaderService.hide();

}


onSaveAnalyzer(){
  debugger;
     this.loaderService.show();
    if(this.editAnalyzerForm.value.AnalyzerName==''){
      this.toasterService.showToast('Please enter analyzer name...', 'error');
    } 
    else if(this.editAnalyzerForm.value.ddlSupplierCode==''){
      this.toasterService.showToast('Please select supplier code...', 'error');
    }
    else{
      debugger;
      this.analyzerRequest.analyzerId=0;
      this.analyzerRequest.analyzerName=this.editAnalyzerForm.value.AnalyzerName;
      this.analyzerRequest.partnerId=this.partnerId;
      this.analyzerRequest.analyzerShortCode=this.editAnalyzerForm.value.AnalyzerShortCode;
      this.analyzerRequest.status=this.editAnalyzerForm.value.ddlAnalyzerStatus;
      this.analyzerRequest.supplierCode=this.editAnalyzerForm.value.ddlSupplierCode;
      this.analyzerRequest.purchasedValue=this.editAnalyzerForm.value.POValue;
      
      const warrantyDateStr = this.editAnalyzerForm.value.WarrantyEndDate;
      this.analyzerRequest.warrantyEndDate = warrantyDateStr
      ? this.parseYyyyMMdd(warrantyDateStr)?.toISOString()
      : null;

      this.analyzerRequest.engineerContactNo=this.editAnalyzerForm.value.EngineerContactNumber;
      this.analyzerRequest.assetCode=this.editAnalyzerForm.value.AssetCode;
      
     this.analyzerService.addAnalyzerDetails(this.analyzerRequest)
      .subscribe({
        next: (response: any) => {
          debugger;
          if(response.statusCode==200 && response.status){
            debugger;
            console.log(response);
            this.refPageService.notifyRefresh(); // used to refresh the main list page
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

  
onUpdateAnalyzer(){
  debugger;
     this.loaderService.show();
    if(this.editAnalyzerForm.value.AnalyzerName==''){
      this.toasterService.showToast('Please enter analyzer name...', 'error');
    } 
    else if(this.editAnalyzerForm.value.ddlSupplierCode==''){
      this.toasterService.showToast('Please select supplier code...', 'error');
    }
    else{
      debugger;
      this.analyzerRequest.analyzerId=this.analyzerId;
      this.analyzerRequest.analyzerName=this.editAnalyzerForm.value.AnalyzerName;
      this.analyzerRequest.partnerId=this.partnerId;
      this.analyzerRequest.analyzerShortCode=this.editAnalyzerForm.value.AnalyzerShortCode;
      this.analyzerRequest.status=this.editAnalyzerForm.value.ddlAnalyzerStatus;
      this.analyzerRequest.supplierCode=this.editAnalyzerForm.value.ddlSupplierCode;
      this.analyzerRequest.purchasedValue=this.editAnalyzerForm.value.POValue;
      
      const warrantyDateStr = this.editAnalyzerForm.value.WarrantyEndDate;
      this.analyzerRequest.warrantyEndDate = warrantyDateStr
    ? this.parseYyyyMMdd(warrantyDateStr)?.toISOString()
    : null;
      this.analyzerRequest.engineerContactNo=this.editAnalyzerForm.value.EngineerContactNumber;
      this.analyzerRequest.assetCode=this.editAnalyzerForm.value.AssetCode;
      
     this.analyzerService.updateAnalyzerDetails(this.analyzerRequest)
      .subscribe({
        next: (response: any) => {
          debugger;
          if(response.statusCode==200 && response.status){
            debugger;
            console.log(response);
            this.refPageService.notifyRefresh(); // used to refresh the main list page
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

 parseYyyyMMdd(dateStr: string): Date | null {
  debugger;
  if (!dateStr || dateStr.length !== 8) return null;

  const year = parseInt(dateStr.substring(0, 4), 10);
  const month = parseInt(dateStr.substring(4, 6), 10) - 1; // JS months are 0-based
  const day = parseInt(dateStr.substring(6, 8), 10);

  return new Date(year, month, day);
}

   ViewAnalyzerMapping(mappingId:string){
      debugger;
      this.dialog.open(PopupAnalyzermappingComponent, {
        width: '1385px',           // slightly larger than medium
        maxWidth: '90vw',         // responsive on smaller screens
        height: '50vh',            // taller than medium but not full screen
        minHeight: '400px',       // ensures minimum height
        panelClass: 'large-dialog', // optional custom CSS
        disableClose: true,  
        data: {mappingId:mappingId},        // Pass data if needed
         
      });

       this.dialog.afterAllClosed.subscribe(() => {
        debugger;
        this.ngOnInit(); // Refresh the list after the dialog is closed
        });

    }

       analyzerMappingDeleteConfirmationDialog(mappingId:any): void {
        debugger;
        const dialogRef = this.dialog.open(ConfirmationDialogComponentComponent, {
          width: 'auto',
          disableClose: true,  
          data: { message: 'Are you sure you want to delete this analyzer test mapping?',mappingId: mappingId }
        });
    
        dialogRef.afterClosed().subscribe(result => {
          debugger;
          if (result.success) {
            debugger;
            this.analyzerService.deleteAnalyzerTestMapping(mappingId,this.partnerId).subscribe((response:any)=>{
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

  onMapAnalyzerTest(){
  debugger;
     this.loaderService.show();
    if(this.editAnalyzerForm.value.AnalyzerTestCode==''){
      this.toasterService.showToast('Please enter analyzer test code...', 'error');
    } 
    else if(this.editAnalyzerForm.value.ddlTestName==''){
      this.toasterService.showToast('Please select test name...', 'error');
    }
    else if(this.editAnalyzerForm.value.ddlStatus==''){
      this.toasterService.showToast('Please select status...', 'error');
    }
    else{
      debugger;
      this.analyzerMappingRequest.mappingId=0;
      this.analyzerMappingRequest.analyzerId=this.analyzerId;
      this.analyzerMappingRequest.partnerId=this.partnerId;
      this.analyzerMappingRequest.analyzerTestCode=this.editAnalyzerForm.value.AnalyzerTestCode;
      this.analyzerMappingRequest.status=this.editAnalyzerForm.value.ddlStatus==='true'?true:false;
      this.analyzerMappingRequest.labTestCode=this.editAnalyzerForm.value.ddlTestName;
      
     this.analyzerService.saveAnalyzerTestMapping(this.analyzerMappingRequest)
      .subscribe({
        next: (response: any) => {
          debugger;
          if(response.statusCode==200 && response.status){
            debugger;
            console.log(response);
            this.refPageService.notifyRefresh(); // used to refresh the main list page
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

