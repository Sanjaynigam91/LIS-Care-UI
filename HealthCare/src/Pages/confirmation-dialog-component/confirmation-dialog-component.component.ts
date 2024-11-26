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
  constructor(
    public dialogRef: MatDialogRef<ConfirmationDialogComponentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ){
    this.message = data.message;
    this.userId = data.userId;
    this.recordId=data.recordId;
    this.roleId=data.roleId
  }

  onConfirm(): void {
    this.dialogRef.close({ success: true,userId: this.data.userId,
      recordId:this.data.recordId ,roleId:this.data.roleId,
      pageId:this.data.pageId}); 
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

}
