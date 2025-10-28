import { CommonModule } from '@angular/common';
import { Component, Inject, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgxPaginationModule } from 'ngx-pagination';
import { LoaderComponent } from '../../loader/loader.component';
import { A11yModule } from '@angular/cdk/a11y';
import { ToastComponent } from '../../Toaster/toast/toast.component';
import { Observable } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from '../../../auth/auth.service';
import { ToastService } from '../../../auth/Toaster/toast.service';
import { RefreshPageService } from '../../../auth/Shared/refresh-page.service';
import { TestService } from '../../../auth/TestMasterService/test.service';
import { LoaderService } from '../../../Interfaces/loader.service';
import { OutLabService } from '../../../auth/OutLab/out-lab.service';

@Component({
  selector: 'app-popup-out-lab-mapping',
  standalone: true,
   imports: [MatTableModule, MatPaginatorModule, CommonModule, MatCardModule,
        MatListModule, MatIconModule, MatButtonModule, NgxDatatableModule, MatSortModule,
        MatFormFieldModule, MatInputModule, NgxPaginationModule,
        ReactiveFormsModule, LoaderComponent, A11yModule,ToastComponent ],
  templateUrl: './popup-out-lab-mapping.component.html',
  styleUrl: './popup-out-lab-mapping.component.css'
})
export class PopupOutLabMappingComponent {
   loading$!: Observable<boolean>;
    partnerId: string |any;
    clientStatus:string|any;
    seachBy:string|any;
    loggedInUserId: string |any;
    p: number = 1; // current page
    totalItems: number =0; // total number of items, for example
    itemsPerPage: number = 10; // items per page
    sortColumn = '';
    sortDirection = 'asc';
    // Filter criteria
    filterTest: string = '';
    outlabMappingForm!:FormGroup;
    labCode:any
    IsNoRecordFound=false;
    IsRecordFound=false;
    isAddHeaderVisible:boolean=false;
    isEditHeaderVisible:boolean=false;
    isVisible = false;

    constructor(public dialogRef: MatDialogRef<PopupOutLabMappingComponent>,
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
          this.labCode=data.labCode;
        }
  open(): void {
    this.isVisible = true;
  }

  close(): void {
    this.dialogRef.close();
  }
  
    ngOnInit(): void {
    this.outlabMappingForm=this.formBuilder.group({
        ddlMappingType:[''],
        testPrrofile:[''],
      });
  
       setTimeout(() => {  // 🔑 forces update in next CD cycle
      if (!this.labCode) {
        this.isAddHeaderVisible = true;
        this.isEditHeaderVisible = false;
      } else {
        this.isEditHeaderVisible = true;
        this.isAddHeaderVisible = false;
     
       // this.getOutLabDetailsbyCode(this.labCode);
      }
    });
  
    }
}
