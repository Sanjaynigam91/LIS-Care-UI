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

  sortColumn = '';
  sortDirection = 'asc';
  // Filter criteria
  filterTerm: string = '';
  searchForm!: FormGroup;
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
    this.loaderService.show();
    /// used to get the all test department 
    this.GetTestDeptData();
    /// used to load and Serach the Test Data
    this.onTestSearch();
    this.loaderService.hide();

   }

  GetTestDeptData(){
    debugger;
    this.testService.getTestDepartments(this.partnerId).subscribe((response:any)=>{
      debugger;
     this.testDeptApiResponse = response.data; 
     console.log(response);
    }) 
   }

   onTestSearch(){
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

    this.testService.SearchTestInfo(this.testMasterSearch).subscribe((response:any)=>{
      debugger;
     if(response.status && response.statusCode==200) {
      debugger;
      this.testDataApiResponse = response.data; 
      //this.totalItems=response.data.length;
      console.log(this.testDataApiResponse);
     }
     else{
      console.log("No Record! Found");
     }
     this.loaderService.hide();
    },err=>{
      console.log(err);
      this.loaderService.hide();
    }) 
  }


}