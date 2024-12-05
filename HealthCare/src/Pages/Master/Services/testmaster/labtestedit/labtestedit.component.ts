import { CommonModule } from '@angular/common';
import {Component, Inject} from '@angular/core';
import {MatTabsModule} from '@angular/material/tabs';
import { ToastComponent } from "../../../../Toaster/toast/toast.component";
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TestService } from '../../../../../auth/TestMasterService/test.service';
import { ToastService } from '../../../../../auth/Toaster/toast.service';
import { RefreshPageService } from '../../../../../auth/Shared/refresh-page.service';
import { Observable } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-labtestedit',
  standalone: true,
  imports: [MatTabsModule, ToastComponent,CommonModule,MatIconModule],
  templateUrl: './labtestedit.component.html',
  styleUrl: './labtestedit.component.css'
})
export class LabtesteditComponent {

  isVisible = false;
  isSubmitVisible=false;
  isUpdateVisible=false;
  isAddHeaderVisible:boolean=false;
  isEditHeaderVisible:boolean=false;
  loading$!: Observable<boolean>;
  partnerId: string |any;
  labtestCode:string |any;

  constructor(public dialogRef: MatDialogRef<LabtesteditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,private testService:TestService
  , private toasterService: ToastService,private refPageService:RefreshPageService){
      this.partnerId= localStorage.getItem('partnerId');
      this.labtestCode=data.labtestCode;
    }


    ngOnInit():void{
      debugger;
      // this.editPageId= this.lisPageId;
      this.isSubmitVisible=true;
      // this.getAllCriteria();
      // this.getAllPageEnities(this.partnerId);
      if(this.labtestCode!==undefined){
        this.isSubmitVisible=false;
        this.isUpdateVisible=true;
        this.isAddHeaderVisible=false;
        this.isEditHeaderVisible=true;
       // this.GetPageDetailsById(this.lisPageId,this.partnerId);
      }
      else{
        this.isSubmitVisible=true;
        this.isUpdateVisible=false;
        this.isAddHeaderVisible=true;
        this.isEditHeaderVisible=false;
      }
      
    }  

  open(): void {
    this.isVisible = true;
  }

  close(): void {
    this.dialogRef.close();
  }

}
