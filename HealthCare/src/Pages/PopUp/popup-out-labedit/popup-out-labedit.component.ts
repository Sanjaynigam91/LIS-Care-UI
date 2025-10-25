import { Component, Inject, NgZone } from '@angular/core';
import { ToastComponent } from '../../Toaster/toast/toast.component';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoaderComponent } from '../../loader/loader.component';
import { Observable } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from '../../../auth/auth.service';
import { ToastService } from '../../../auth/Toaster/toast.service';
import { RefreshPageService } from '../../../auth/Shared/refresh-page.service';
import { TestService } from '../../../auth/TestMasterService/test.service';
import { LoaderService } from '../../../Interfaces/loader.service';
import { OutLabService } from '../../../auth/OutLab/out-lab.service';


@Component({
  selector: 'app-popup-out-labedit',
  standalone: true,
   imports: [ToastComponent, CommonModule, MatIcon, ReactiveFormsModule, LoaderComponent],
  templateUrl: './popup-out-labedit.component.html',
  styleUrl: './popup-out-labedit.component.css'
})
export class PopupOutLabeditComponent {
loading$!: Observable<boolean>;
isAddHeaderVisible:boolean=false;
isEditHeaderVisible:boolean=false;
isVisible = false;
roleId:any;
partnerId: string |any;
loggedInUserId: string |any;
editOutLabForm!: FormGroup<any>;
isSubmitVisible:boolean=false;
isUpdateVisible:boolean=false;
labCode:any

constructor(public dialogRef: MatDialogRef<PopupOutLabeditComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      private authService:AuthService,
      private toasterService: ToastService,
      private refPageService:RefreshPageService,
      private formBuilder: FormBuilder,
      private testService:TestService,
      private loaderService: LoaderService,
      public dialog: MatDialog, 
      private zone: NgZone,
      private outlabService:OutLabService
    ){
      this.partnerId= localStorage.getItem('partnerId');
      this.loggedInUserId=localStorage.getItem('userId');
      this.roleId=data.roleId;
      this.labCode=data.labCode;
    }

open(): void {
    this.isVisible = true;
  }

  close(): void {
    this.dialogRef.close();
  }

   ngOnInit(): void {
  this.editOutLabForm=this.formBuilder.group({
      LabCode:[''],
      LabName:[''],
      ContactPerson:[''],
      MobileNumber:  [
        '',
        [
          Validators.required,
          Validators.pattern('^[6-9][0-9]{9}$') // ✅ 10-digit Indian mobile number pattern
        ]
      ],
      EmailId:[''],
      IntroducedBy:[''],
      ddlLabStatus:[''],
    });

     setTimeout(() => {  // 🔑 forces update in next CD cycle
    if (!this.labCode) {
      this.isAddHeaderVisible = true;
      this.isEditHeaderVisible = false;
      this.isSubmitVisible = true;
      this.isUpdateVisible = false;
    
    } else {
      this.isEditHeaderVisible = true;
      this.isAddHeaderVisible = false;
      this.isSubmitVisible = false;
      this.isUpdateVisible = true;
     
    //  this.getCenterDetailsbyCode();
    }
//  this.getSalesInchargeDetails();
  });

  }
  


}
