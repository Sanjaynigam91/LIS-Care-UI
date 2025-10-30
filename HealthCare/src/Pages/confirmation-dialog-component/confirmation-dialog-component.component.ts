import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmation-dialog-component',
  standalone: true,
  imports: [CommonModule,MatDialogContent,MatDialogActions],
  templateUrl: './confirmation-dialog-component.component.html',
  styleUrl: './confirmation-dialog-component.component.css'
})

export class ConfirmationDialogComponentComponent {
  message!: string;
  userId:any; // used for delete user data
  recordId:any; //used for delete master tag list
  roleId:any;// used for delete role
  pageId:any;//Used to delete the Page
  testCode:any;// used to delete test from test master page
  referralId:any;// used to delete referral range from test master page
  partnerId:any;// used to delete referral range from test master page
  profileCode:any;// used to delete profile from profile master page
  mappingId:any;// used to delete mapped test from profile master edit page
  analyzerId:any;// used to delete analyzer from analyzer master page
  centerCode:any;// used to delete center from center master page
  clinicId:any;// used to delete clinic from clinic master page
  clientId:any;// used to delete client from client master page 
  labCode:any;// used to dlete outlab from out lab master page
  empId:any;//used to delete employee from employee master page

  constructor(
    public dialogRef: MatDialogRef<ConfirmationDialogComponentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ){
    this.message = data.message;
    this.userId = data.userId;
    this.recordId=data.recordId;
    this.roleId=data.roleId;
    this.testCode=data.testCode;
    this.referralId=data.referralId;
    this.partnerId=data.partnerId;
    this.profileCode=data.profileCode;
    this.analyzerId=data.analyzerId;
    this.mappingId=data.mappingId;
    this.centerCode=data.centerCode
    this.clinicId=data.clinicId;
    this.clientId=data.clientId;
    this.labCode=data.labCode;
    this.empId=data.empId;
  }

  onConfirm(): void {
    this.dialogRef.close({ success: true,userId: this.data.userId,
      recordId:this.data.recordId ,roleId:this.data.roleId,
      pageId:this.data.pageId,testCode:this.testCode,profileCode:this.profileCode}); 
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

}
