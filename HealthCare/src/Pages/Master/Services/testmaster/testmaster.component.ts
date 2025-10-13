import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgxPaginationModule } from 'ngx-pagination';
import { LoaderComponent } from '../../../loader/loader.component';
import { ConfirmationDialogComponentComponent } from '../../../confirmation-dialog-component/confirmation-dialog-component.component';
import { ToastComponent } from '../../../Toaster/toast/toast.component';
import { MatDialog } from '@angular/material/dialog';
import { LoaderService } from '../../../../Interfaces/loader.service';
import { ToastService } from '../../../../auth/Toaster/toast.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { testDepartmentResponse } from '../../../../Interfaces/TestMaster/testDepartmentResponse';
import { testDataSearchResponse } from '../../../../Interfaces/TestMaster/testDataSearchResponse';
import { testMasterSearchRequest } from '../../../../Interfaces/TestMaster/testMasterSearchRequest';
import { TestService } from '../../../../auth/TestMasterService/test.service';
import { LabtesteditComponent } from './labtestedit/labtestedit.component';



@Component({
  selector: 'app-testmaster',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, CommonModule, MatCardModule,
    MatListModule, MatIconModule, MatButtonModule, NgxDatatableModule, MatSortModule,
    MatFormFieldModule, MatInputModule, MatSort, NgxPaginationModule,
    ReactiveFormsModule, LoaderComponent, ConfirmationDialogComponentComponent, ToastComponent],
  templateUrl: './testmaster.component.html',
  styleUrl: './testmaster.component.css'
})
export class TestmasterComponent {

  [x: string]: any;
  router  =  inject(Router);

  loading$!: Observable<boolean>;
  partnerId: string |any;
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
  searchTestForm!: FormGroup;
  globalRoleForm!:FormGroup

  filteredData: any[] = []; // Data array for the table


  testMasterForm!: FormGroup;
  testDeptApiResponse: Observable<testDepartmentResponse>| any;
  testDataApiResponse:Observable<testDataSearchResponse>| any;
  testMasterSearch:testMasterSearchRequest={
    partnerId: '',
    testName: '',
    isActive: false,
    deptOrDiscipline: '',
    isProcessedAt: ''
  }

  @ViewChild('hdnUserId')
  hdnUserId!: ElementRef<HTMLInputElement>;
  constructor(private testService: TestService,private formBuilder: FormBuilder,
  public dialog: MatDialog,private loaderService: LoaderService,private toasterService: ToastService){
    this.loading$ = this.loaderService.loading$;
    this.partnerId= localStorage.getItem('partnerId');
    /// Started to search the tests details by using test terms
    this.searchTestForm=this.formBuilder.group({
      filterTest: ['']
    })
    this.searchTestForm.get('filterTest')?.valueChanges.subscribe(value => {
      this.filterTestData(value);
    });
    /// Ended to search the tests details by using test terms
  }

  ngOnInit(): void{
    debugger;

    this.testMasterForm = this.formBuilder.group({
      ddlTestStatus: [''],
      ddlDeptOrDescipline: [''],
      ddlOutLab: [''],
      TestNameOrCode: [''],
    });

    this.loggedInUserId=localStorage.getItem('userId');
    /// used to get the all test department 
    this.GetTestDeptData();
    /// used to load and Serach the Test Data
    this.ReteriveTestRecords();

   }

  GetTestDeptData(){
    debugger;
    this.testService.getTestDepartments(this.partnerId).subscribe((response:any)=>{
      debugger;
     this.testDeptApiResponse = response.data; 
     console.log(response);
    }) 
   }

   ReteriveTestRecords(){
    debugger;
    this.loaderService.show();
    this.testMasterSearch.partnerId=this.partnerId;
    this.testMasterSearch.deptOrDiscipline=this.testMasterForm.value.ddlDeptOrDescipline;
    if(this.testMasterForm.value.ddlTestStatus==""){
      this.testMasterSearch.isActive=false;
    }
    else{
      this.testMasterSearch.isActive=this.testMasterForm.value.ddlTestStatus;
    }
    this.testMasterSearch.isProcessedAt=this.testMasterForm.value.ddlOutLab;
    this.testMasterSearch.testName=this.testMasterForm.value.TestNameOrCode;

    this.testService.BindTestInfo(this.testMasterSearch).subscribe((response:any)=>{
      debugger;
     if(response.status && response.statusCode==200) {
      debugger;
      this.testDataApiResponse = response.data; 
      this.IsNoRecordFound=false;
      this.IsRecordFound=true;
      console.log(this.testDataApiResponse);
     }
     else{
      this.IsNoRecordFound=true;
       this.IsRecordFound=false;
      console.log("No Record! Found");
      this.loaderService.hide();
     }
     this.loaderService.hide();
    },err=>{
      this.IsNoRecordFound=true;
       this.IsRecordFound=false;
      console.log(err);
      this.loaderService.hide();
    }) 
  }


  onSearchClick(){
    debugger;
    this.loaderService.show();
    this.testMasterSearch.partnerId=this.partnerId;
    this.testMasterSearch.deptOrDiscipline=this.testMasterForm.value.ddlDeptOrDescipline;
    if(this.testMasterForm.value.ddlTestStatus==""){
      this.testMasterSearch.isActive=true;
    }
    else if(this.testMasterForm.value.ddlTestStatus=="false"){
      this.testMasterSearch.isActive=false;
    }
    else{
      this.testMasterSearch.isActive=true;
    }
    this.testMasterSearch.isProcessedAt=this.testMasterForm.value.ddlOutLab;
    this.testMasterSearch.testName=this.testMasterForm.value.TestNameOrCode;

this.testService.SearchTests(this.testMasterSearch).subscribe(
  (response: any) => {
    debugger;
    if (response && response.status && response.statusCode === 200) {
      // Success case
      this.testDataApiResponse = response.data || [];
      this.totalItems = this.testDataApiResponse.length;
      this.IsNoRecordFound=false;
       this.IsRecordFound=true;
      console.log("Total records:", this.totalItems);
      console.log(this.testDataApiResponse);
    } else {
      // API returned a valid response but with no records
      this.testDataApiResponse = [];
      this.totalItems = 0;
      console.log(response.responseMessage || "No Record Found!");
      this.IsNoRecordFound=true;
      this.IsRecordFound=false;
    }
    
    this.loaderService.hide();
  },
  (err: any) => {
    debugger;
    console.error("HTTP Error:", err);
    // Handle backend's custom error structure
    if (err.error && err.error.statusCode) {
      this.testDataApiResponse = [];
      this.totalItems = 0;
      console.log(err.error.responseMessage || "Error fetching records");
      this.IsNoRecordFound=true;
       this.IsRecordFound=false;
    }

    this.loaderService.hide();
  }
);


  }

  filterTestData(term: string) {
    debugger;
    this.filteredData = this.testDataApiResponse.filter((item: {
      testCode: any;testName: any; specimenType:any;referenceUnits:any;discipline:any;
      reportTemplateTame:any
    }) => 
      item.testCode.toLowerCase().includes(term.toLowerCase()) ||
      item.testName.toLowerCase().includes(term.toLowerCase()) ||
      item.specimenType.toLowerCase().includes(term.toLowerCase()) ||
      item.referenceUnits.toLowerCase().includes(term.toLowerCase()) ||
      item.discipline.toLowerCase().includes(term.toLowerCase()) ||
      item.reportTemplateTame.toLowerCase().includes(term.toLowerCase())
         
     );
     debugger;
    this.testDataApiResponse= this.filteredData;
    if(term==""){
      this.ngOnInit();
    }
  }

  testDeleteConfirmationDialog(testCode:any): void {
    debugger;
    const dialogRef = this.dialog.open(ConfirmationDialogComponentComponent, {
      width: 'auto',
      disableClose: true,
      data: { message: 'Are you sure you want to delete this test?',testCode: testCode }
    });

    dialogRef.afterClosed().subscribe(result => {
      debugger;
      if (result.success) {
        debugger;
        this.testService.DeleteTestByTestCode(this.partnerId,result.testCode).subscribe((response:any)=>{
          debugger;
         if(response.status && response.statusCode==200){
          this.toasterService.showToast('Test data Deleted Successfully ,Test Master!', 'success');
          this.ngOnInit();
         }
         else{
          this.toasterService.showToast('Test deletion failed!', 'error');
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

  /// Open Add New Profile Page
  
  OpenAddNewTest(): void {
    this.dialog.open(LabtesteditComponent, {
      width: '1500px',           // slightly larger than medium
      maxWidth: '90vw',         // responsive on smaller screens
      height: '87vh',           // taller than medium but not full screen
      minHeight: '400px',       // ensures minimum height
      panelClass: 'large-dialog', // optional custom CSS
      disableClose: true,  
      data: {}                  // pass data if needed
    });

   this.dialog.afterAllClosed.subscribe(() => {
          this.ngOnInit(); // Refresh the list after the dialog is closed
        });
  }

  /// View the Test Details
  ViewTestDetails(testCode:string){
    debugger;
       this.dialog.open(LabtesteditComponent, {
         width: '1500px',           // slightly larger than medium
          maxWidth: '90vw',         // responsive on smaller screens
          height: '98vh',           // taller than medium but not full screen
          minHeight: '400px',       // ensures minimum height
          panelClass: 'large-dialog', // optional custom CSS
          disableClose: true,  
          data: {testCode:testCode}        // Pass data if needed
        });

      this.dialog.afterAllClosed.subscribe(() => {
          this.ngOnInit(); // Refresh the list after the dialog is closed
        });
  }

}