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

@Component({
  selector: 'app-popup-analyzeredit',
  standalone: true,
    imports: [ToastComponent, CommonModule, MatIcon,ReactiveFormsModule],
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



}

