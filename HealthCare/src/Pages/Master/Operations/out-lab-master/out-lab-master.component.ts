import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { finalize, Observable } from 'rxjs';
import { CenterResponse } from '../../../../Interfaces/CenterMaster/CenterResponse';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NgxPaginationModule } from 'ngx-pagination';
import { LoaderComponent } from '../../../loader/loader.component';
import { CenterServiceService } from '../../../../auth/Center/center-service.service';
import { MatDialog } from '@angular/material/dialog';
import { LoaderService } from '../../../../Interfaces/loader.service';
import { ToastService } from '../../../../auth/Toaster/toast.service';
import { ConfirmationDialogComponentComponent } from '../../../confirmation-dialog-component/confirmation-dialog-component.component';
import { PopupCentermastereditComponent } from '../../../PopUp/popup-centermasteredit/popup-centermasteredit.component';
import { A11yModule } from "@angular/cdk/a11y";
import { OutLabService } from '../../../../auth/OutLab/out-lab.service';
import { OutLabResponse } from '../../../../Interfaces/OutLab/out-lab-response';
import { PopupOutLabeditComponent } from '../../../PopUp/popup-out-labedit/popup-out-labedit.component';
import { PopupOutLabMappingComponent } from '../../../PopUp/popup-out-lab-mapping/popup-out-lab-mapping.component';


@Component({
  selector: 'app-out-lab-master',
  standalone: true,
imports: [MatTableModule, MatPaginatorModule, CommonModule, MatCardModule,
    MatListModule, MatIconModule, MatButtonModule, NgxDatatableModule, MatSortModule,
    MatFormFieldModule, MatInputModule, NgxPaginationModule,
    ReactiveFormsModule, LoaderComponent, A11yModule],
  templateUrl: './out-lab-master.component.html',
  styleUrl: './out-lab-master.component.css'
})
export class OutLabMasterComponent {
 router  =  inject(Router);
    loading$!: Observable<boolean>;
    partnerId: string |any;
    outlabStatus:string|any;
    SeachByNameOrCode:string|any;
    loggedInUserId: string |any;
    p: number = 1; // current page
    totalItems: number =0; // total number of items, for example
    itemsPerPage: number = 10; // items per page
    IsNoRecordFound=false;
    IsRecordFound=false;
    sortColumn = '';
    sortDirection = 'asc';
    // Filter criteria
    filterTest: string = '';
    searchOutlabForm!: FormGroup;
    outlabForm!:FormGroup;
    outLabApiResponse:Observable<OutLabResponse>| any;
    filteredData: any[] = []; // Data array for the table

    constructor(private centerService: CenterServiceService,private formBuilder: FormBuilder,
      public dialog: MatDialog,private loaderService: LoaderService,private toasterService: ToastService,
      private outLabService:OutLabService){
      this.loading$ = this.loaderService.loading$;
      this.partnerId= localStorage.getItem('partnerId');
      /// Started to search the tests details by using test terms
      this.searchOutlabForm=this.formBuilder.group({
        filterOutlabs: ['']
      })
      this.searchOutlabForm.get('filterOutlabs')?.valueChanges.subscribe(value => {
        this.filterOutLabData(value);
      });
      /// Ended to search the tests details by using test terms
    }

    ngOnInit(): void{
     this.outlabForm = this.formBuilder.group({
      ddllabStatus: [''],
      SeachByNameOrCode: [''],     
    });
    this.loggedInUserId=localStorage.getItem('userId');
    /// used to load and Serach the out labs Data
   this.ReteriveAllOutLabRecords();
   }

 ReteriveAllOutLabRecords() {
  this.loaderService.show();

  this.outlabStatus = '';
  this.SeachByNameOrCode = '';

  this.outLabService
    .getAllOutlabs(this.outlabStatus, this.SeachByNameOrCode, this.SeachByNameOrCode, this.partnerId)
    .pipe(
      finalize(() => {
        // ✅ Always hide loader after success or error
        this.loaderService.hide();
      })
    )
    .subscribe({
      next: (response: any) => {
        if (response?.status && response?.statusCode === 200) {
          this.outLabApiResponse = response.data;
          this.IsNoRecordFound = false;
          this.IsRecordFound = true;
          console.log(this.outLabApiResponse);
        } else {
          this.IsNoRecordFound = true;
          this.IsRecordFound = false;
          console.warn('No Record Found!');
        }
      },
      error: (err) => {
        this.IsNoRecordFound = true;
        this.IsRecordFound = false;
        console.error('Error while fetching profiles:', err);
      },
    });
}
  /// used to saerch all out labs
SearchAllOutLabs() {
  this.loaderService.show();

  this.outlabStatus = this.outlabForm.get('ddllabStatus')?.value;
  this.SeachByNameOrCode = this.outlabForm.get('SeachByNameOrCode')?.value;

  this.outLabService
    .getAllOutlabs(this.outlabStatus, this.SeachByNameOrCode, this.SeachByNameOrCode, this.partnerId)
    .pipe(
      finalize(() => {
        // ✅ Always hide loader after success or error
        this.loaderService.hide();
      })
    )
    .subscribe({
      next: (response: any) => {
        if (response?.status && response?.statusCode === 200) {
          this.outLabApiResponse = response.data;
          this.IsNoRecordFound = false;
          this.IsRecordFound = true;
          console.log(this.outLabApiResponse);
        } else {
          this.IsNoRecordFound = true;
          this.IsRecordFound = false;
          console.warn('No Record Found!');
        }
      },
      error: (err) => {
        this.IsNoRecordFound = true;
        this.IsRecordFound = false;
        console.error('Error while fetching profiles:', err);
      },
    });
}

   filterOutLabData(term: string) {
    debugger;
    
    this.filteredData = this.outLabApiResponse.filter((item: {
      labCode: any;labName: any; contactPerson:any;mobileNumber:any;email:any;
    }) => 
      item.labCode.toLowerCase().includes(term.toLowerCase()) ||
      item.labName.toLowerCase().includes(term.toLowerCase()) ||
      item.contactPerson.toLowerCase().includes(term.toLowerCase()) ||
      item.mobileNumber.toLowerCase().includes(term.toLowerCase()) ||
      item.email.toLowerCase().includes(term.toLowerCase()) 
     );
     debugger;
    this.outLabApiResponse= this.filteredData;
    if(term==""){
      this.ngOnInit();
    }
  }

  /// Used to dlete Out Lab details
    outLabDeleteConfirmationDialog(labCode:any): void {
      debugger;
      const dialogRef = this.dialog.open(ConfirmationDialogComponentComponent, {
         width: 'auto',
         disableClose: true,  
        data: { message: 'Are you sure you want to delete this out lab?',labCode: labCode }
      });
  
      dialogRef.afterClosed().subscribe(result => {
        debugger;
        if (result.success) {
          debugger;
          this.outLabService.deleteOutLabDetails(labCode,this.partnerId).subscribe((response:any)=>{
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

      /// Open Add New out lab Master PopUp
                OpenOutLabMasterPopUp(): void {
                  this.dialog.open(PopupOutLabeditComponent, {
                    width: '1500px',           // slightly larger than medium
                    maxWidth: '90vw',         // responsive on smaller screens
                    height: 'auto',           // taller than medium but not full screen
                    minHeight: '400px',       // ensures minimum height
                    panelClass: 'large-dialog', // optional custom CSS
                    disableClose: true,  
                    data: {}                  // pass data if needed
                  });
          
                  this.dialog.afterAllClosed.subscribe(() => {
                    this.ngOnInit(); // Refresh the list after the dialog is closed
                  });
          
                }
          
                // View out lab details
                 ViewOutLabDetails(labCode:any){
                      debugger;
                      this.dialog.open(PopupOutLabeditComponent, {
                       width: '1500px',           // slightly larger than medium
                        maxWidth: '90vw',         // responsive on smaller screens
                        height: 'auto',            // taller than medium but not full screen
                        minHeight: '400px',       // ensures minimum height
                        panelClass: 'large-dialog', // optional custom CSS
                        disableClose: true,  
                        data: {labCode:labCode},        // Pass data if needed   
                      });
          
                    this.dialog.afterAllClosed.subscribe(() => {
                    this.ngOnInit(); // Refresh the list after the dialog is closed
                  });
                }

              // View out lab mapping details
                 ViewOutLabMapping(labCode:any){
                      debugger;
                      this.dialog.open(PopupOutLabMappingComponent, {
                       width: '1500px',           // slightly larger than medium
                        maxWidth: '90vw',         // responsive on smaller screens
                        height: 'auto',            // taller than medium but not full screen
                        minHeight: '350px',       // ensures minimum height
                        panelClass: 'large-dialog', // optional custom CSS
                        disableClose: true,  
                        data: {labCode:labCode},        // Pass data if needed   
                      });
          
                    this.dialog.afterAllClosed.subscribe(() => {
                    this.ngOnInit(); // Refresh the list after the dialog is closed
                  });
                }     



}
