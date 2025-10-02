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

@Component({
  selector: 'app-popup-analyzeredit',
  standalone: true,
    imports: [ToastComponent, CommonModule, MatIcon,ReactiveFormsModule],
  templateUrl: './popup-analyzeredit.component.html',
  styleUrl: './popup-analyzeredit.component.css'
})
export class PopupAnalyzereditComponent {
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


open(): void {
    this.isVisible = true;
  }

  close(): void {
    this.dialogRef.close();
  }


  ngOnInit(): void{
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
    if(this.data.analyzerId==0 || this.data.analyzerId==null){
      this.isAddHeaderVisible=true;
       this.isEditHeaderVisible=false;
       this.isSubmitVisible=true;
       this.isUpdateVisible=false;
       this.isAnalyzerMappingListVisible=false;
    }
    else{
      this.isEditHeaderVisible=true;
      this.isAddHeaderVisible=false;
      this.isSubmitVisible=false;
      this.isUpdateVisible=true;
      this.isAnalyzerMappingListVisible=true;
      this.viewAanalyzerDetails(this.data.analyzerId);
      this.GetAllTestDetails();
    }
    this.getAllSupplierDetails();

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

//    viewAanalyzerDetails(){
//     debugger;
//     this.loaderService.show();
//  this.analyzerService.getAnalyzersById(this.partnerId, this.data.analyzerId).subscribe({
//   next: (response: any) => {
//     if (response?.status && response?.statusCode === 200) {
//       this.analyzerApiResponse = response?.data || [];

//       // Use microtask to defer patchValue
//       Promise.resolve().then(() => {
//         this.editAnalyzerForm.patchValue({
//           AnalyzerName: response.data?.analyzerName || '',
//           AnalyzerShortCode: response.data?.analyzerCode || '',
//           EngineerContactNumber: response.data?.engineerContactNo || '',
//           WarrantyEndDate: response.data?.WarrantyEndDate || '',
//           ddlSupplierCode: response.data?.supplierCode || '',
//           AssetCode: response.data?.assetCode || '',
//           POValue: response.data?.purchaseValue || 0,
//           ddlAnalyzerStatus: response.data?.analyzerStatus || 'false',
//         });
//       });
//     }
//     this.loaderService.hide();
//   },
//   error: (err) => {
//     console.error(err);
//     this.loaderService.hide();
//   }
// });


//   }



viewAanalyzerDetails(analyzerId: any) {
  if (!analyzerId) return;

  this.loaderService.show();

  this.analyzerService.getAnalyzersById(this.partnerId, analyzerId).subscribe({
    next: (response: any) => {
      if (response?.data) {
        // Defer update to next microtask
        Promise.resolve().then(() => {
          this.editAnalyzerForm.patchValue({
            AnalyzerName: response.data.analyzerName || '',
            AnalyzerShortCode: response.data.analyzerCode || '',
            EngineerContactNumber: response.data.engineerContactNo || '',
            WarrantyEndDate: response.data.WarrantyEndDate || '',
            ddlSupplierCode: response.data.supplierCode || '',
            AssetCode: response.data.assetCode || '',
            POValue: response.data.purchaseValue || 0,
            ddlAnalyzerStatus: response.data.analyzerStatus ?? false,
          });

          this.loaderService.hide();
        });
      } else {
        this.loaderService.hide();
      }
    },
    error: () => {
      this.loaderService.hide();
    }
  });
}

}

