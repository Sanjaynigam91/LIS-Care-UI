import { Component, Inject, NgZone } from '@angular/core';
import { ToastComponent } from '../../Toaster/toast/toast.component';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { LoaderComponent } from '../../loader/loader.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from '../../../auth/auth.service';
import { ToastService } from '../../../auth/Toaster/toast.service';
import { CenterServiceService } from '../../../auth/Center/center-service.service';
import { RefreshPageService } from '../../../auth/Shared/refresh-page.service';
import { TestService } from '../../../auth/TestMasterService/test.service';
import { LoaderService } from '../../../Interfaces/loader.service';
import { MetadataService } from '../../../auth/metadata.service';
import { CenterResponse } from '../../../Interfaces/CenterMaster/CenterResponse';

@Component({
  selector: 'app-popup-clinicrmasteredit',
  standalone: true,
  imports: [ToastComponent, CommonModule, MatIcon, ReactiveFormsModule, LoaderComponent],
  templateUrl: './popup-clinicrmasteredit.component.html',
  styleUrl: './popup-clinicrmasteredit.component.css'
})
export class PopupClinicrmastereditComponent {
loading$!: Observable<boolean>;
isAddHeaderVisible:boolean=false;
isEditHeaderVisible:boolean=false;
isVisible = false;
roleId:any;
partnerId: string |any;
loggedInUserId: string |any;
editClinicMasterForm!: FormGroup<any>;
isSubmitVisible:boolean=false;
isUpdateVisible:boolean=false;
clinicId:number|any;
centerStatus:string|any;
SeachByNameOrCode:string|any;
centerApiResponse:Observable<CenterResponse>| any;

constructor(public dialogRef: MatDialogRef<PopupClinicrmastereditComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,private authService:AuthService,
      private toasterService: ToastService,private centerService:CenterServiceService,
      private refPageService:RefreshPageService,private formBuilder: FormBuilder,
      private testService:TestService,private loaderService: LoaderService,
      private metaService:MetadataService,public dialog: MatDialog, private zone: NgZone
    ){
      this.partnerId= localStorage.getItem('partnerId');
      this.loggedInUserId=localStorage.getItem('userId');
      this.roleId=data.roleId;
      this.clinicId=data.clinicId;
    }

     ngOnInit(): void {
      this.editClinicMasterForm=this.formBuilder.group({
          ClinicCode:[{ value: '', disabled: true }],
          ClinicName:[''],
          ClinicIncharge:[''],
          ClinicEmailId:[''],
          ClinicMobileNumber:  [
            '',
            [
              Validators.required,
              Validators.pattern('^[6-9][0-9]{9}$') // ✅ 10-digit Indian mobile number pattern
            ]
          ],
          AlternateContactNumber:[''],
          ddlCentre:[''],
          ddlRateType:[''],
          Address:[''],
          ddlStatus:[''],
        });
    
         setTimeout(() => {  // 🔑 forces update in next CD cycle
        if (!this.clinicId) {
          this.isAddHeaderVisible = true;
          this.isEditHeaderVisible = false;
          this.isSubmitVisible = true;
          this.isUpdateVisible = false;
        
        } else {
          this.isEditHeaderVisible = true;
          this.isAddHeaderVisible = false;
          this.isSubmitVisible = false;
          this.isUpdateVisible = true;
         
       //   this.getCenterDetailsbyCode();
        }
      this.LoadAllCentres();
      });
    
      }

open(): void {
    this.isVisible = true;
  }

  close(): void {
    this.dialogRef.close();
  }

     /// used to load all the centers based on the search criteria
    LoadAllCentres(){
    debugger;
    this.loaderService.show();
    this.centerStatus='';
    this.SeachByNameOrCode='';
    this.centerService.getAllCenters(this.partnerId,this.centerStatus,this.SeachByNameOrCode).subscribe({
      next: (response: any) => {
        debugger;
        if (response?.status && response?.statusCode === 200) {
          this.centerApiResponse = response.data; 
          console.log(this.centerApiResponse);
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
    this.loaderService.hide();
  }


}
