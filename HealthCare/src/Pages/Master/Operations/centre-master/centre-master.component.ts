import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
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

@Component({
  selector: 'app-centre-master',
  standalone: true,
imports: [MatTableModule, MatPaginatorModule, CommonModule, MatCardModule,
    MatListModule, MatIconModule, MatButtonModule, NgxDatatableModule, MatSortModule,
    MatFormFieldModule, MatInputModule, NgxPaginationModule,
    ReactiveFormsModule, LoaderComponent, A11yModule],
  templateUrl: './centre-master.component.html',
  styleUrl: './centre-master.component.css'
})
export class CentreMasterComponent {
  router  =  inject(Router);
    loading$!: Observable<boolean>;
    partnerId: string |any;
    centerStatus:string|any;
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
    searchCenterForm!: FormGroup;
    CenterDetailsForm!:FormGroup;
    centerApiResponse:Observable<CenterResponse>| any;
    filteredData: any[] = []; // Data array for the table

  constructor(private centerService: CenterServiceService,private formBuilder: FormBuilder,
    public dialog: MatDialog,private loaderService: LoaderService,private toasterService: ToastService){
      this.loading$ = this.loaderService.loading$;
      this.partnerId= localStorage.getItem('partnerId');
      /// Started to search the tests details by using test terms
      this.searchCenterForm=this.formBuilder.group({
        filterCenters: ['']
      })
      this.searchCenterForm.get('filterCenters')?.valueChanges.subscribe(value => {
        this.filterCenterData(value);
      });
      /// Ended to search the tests details by using test terms
    }


    ngOnInit(): void{
    debugger;
     this.CenterDetailsForm = this.formBuilder.group({
      ddlCenterStatus: [''],
      SeachByNameOrCode: [''],     
    });
    this.loggedInUserId=localStorage.getItem('userId');
    /// used to load and Serach the Test Data
    this.ReteriveAllCenterRecords();
   }


  ReteriveAllCenterRecords(){
    debugger;
    this.loaderService.show();
    this.centerStatus='';
    this.SeachByNameOrCode='';
    this.centerService.getAllCenters(this.partnerId,this.centerStatus,this.SeachByNameOrCode).subscribe({
      next: (response: any) => {
        debugger;

        if (response?.status && response?.statusCode === 200) {
          this.centerApiResponse = response.data; 
          this.IsNoRecordFound = false;
          this.IsRecordFound = true;
          console.log(this.centerApiResponse);
        } else {
          this.IsNoRecordFound = true;
          this.IsRecordFound = false;
          console.warn("No Record Found!");
        }

        this.loaderService.hide();
      },
      error: (err) => {
        this.IsNoRecordFound = true;
        this.IsRecordFound = false;
        console.error("Error while fetching profiles:", err);
        this.loaderService.hide();
      }
    });

  }

   filterCenterData(term: string) {
    debugger;
    
    this.filteredData = this.centerApiResponse.filter((item: {
      centerCode: any;centerName: any; centerInchargeName:any;mobileNumber:any;centerAddress:any;emailId:any;
    }) => 
      item.centerCode.toLowerCase().includes(term.toLowerCase()) ||
      item.centerName.toLowerCase().includes(term.toLowerCase()) ||
      item.centerInchargeName.toLowerCase().includes(term.toLowerCase()) ||
      item.mobileNumber.toLowerCase().includes(term.toLowerCase()) ||
      (item.centerAddress ?? '').toString().toLowerCase().includes(term.toLowerCase()) ||
      item.emailId.toLowerCase().includes(term.toLowerCase()) 
     );
     debugger;
    this.centerApiResponse= this.filteredData;
    if(term==""){
      this.ngOnInit();
    }
  }

    SearchAllCenterRecords(){
    debugger;
    this.loaderService.show();
    this.centerStatus=this.CenterDetailsForm.get('ddlCenterStatus')?.value;
    this.SeachByNameOrCode=this.CenterDetailsForm.get('SeachByNameOrCode')?.value;
    this.centerService.getAllCenters(this.partnerId,this.centerStatus,this.SeachByNameOrCode).subscribe({
      next: (response: any) => {
        debugger;

        if (response?.status && response?.statusCode === 200) {
          this.centerApiResponse = response.data; 
          this.IsNoRecordFound = false;
          this.IsRecordFound = true;
          console.log(this.centerApiResponse);
        } else {
          this.IsNoRecordFound = true;
          this.IsRecordFound = false;
          console.warn("No Record Found!");
        }

        this.loaderService.hide();
      },
      error: (err) => {
        this.IsNoRecordFound = true;
        this.IsRecordFound = false;
        console.error("Error while fetching profiles:", err);
        this.loaderService.hide();
      }
    });

  } 

     centerDeleteConfirmationDialog(centerCode:any): void {
      debugger;
      const dialogRef = this.dialog.open(ConfirmationDialogComponentComponent, {
         width: 'auto',
         disableClose: true,  
        data: { message: 'Are you sure you want to delete this Center?',centerCode: centerCode }
      });
  
      dialogRef.afterClosed().subscribe(result => {
        debugger;
        if (result.success) {
          debugger;
          this.centerService.deleteCenterDetails(centerCode,this.partnerId).subscribe((response:any)=>{
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

     /// Open Add New Center Master PopUp
      
      OpenAddCenterMasterPopUp(): void {
        this.dialog.open(PopupCentermastereditComponent, {
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

      // View center details
       ViewCenterDetails(centerCode:string){
            debugger;
            this.dialog.open(PopupCentermastereditComponent, {
             width: '1500px',           // slightly larger than medium
              maxWidth: '90vw',         // responsive on smaller screens
              height: 'auto',            // taller than medium but not full screen
              minHeight: '400px',       // ensures minimum height
              panelClass: 'large-dialog', // optional custom CSS
              disableClose: true,  
              data: {centerCode:centerCode},        // Pass data if needed   
            });

          this.dialog.afterAllClosed.subscribe(() => {
          this.ngOnInit(); // Refresh the list after the dialog is closed
        });
      }

}
