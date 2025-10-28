import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
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
import { LoaderComponent } from '../../../loader/loader.component';
import { A11yModule } from '@angular/cdk/a11y';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CenterResponse } from '../../../../Interfaces/CenterMaster/CenterResponse';
import { ClientResponse } from '../../../../Interfaces/ClientMaster/client-response';
import { CenterServiceService } from '../../../../auth/Center/center-service.service';
import { MatDialog } from '@angular/material/dialog';
import { LoaderService } from '../../../../Interfaces/loader.service';
import { ToastService } from '../../../../auth/Toaster/toast.service';
import { ClientService } from '../../../../auth/ClientMaster/client.service';
import { metadatalistresponse } from '../../../../Interfaces/metadatalistresponse';
import { EmployeeService } from '../../../../auth/EmployeeMaster/employee.service';

@Component({
  selector: 'app-employee-master',
  standalone: true,
  imports: [
      MatTableModule, MatPaginatorModule, CommonModule, MatCardModule,
      MatListModule, MatIconModule, MatButtonModule, NgxDatatableModule,
      MatSortModule, MatFormFieldModule, MatInputModule, NgxPaginationModule,
      ReactiveFormsModule, LoaderComponent, A11yModule
    ],
  templateUrl: './employee-master.component.html',
  styleUrl: './employee-master.component.css'
})
export class EmployeeMasterComponent {
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
    searchEmployeeForm!: FormGroup;
    employeeForm!:FormGroup;
    filteredData: any[] = []; // Data array for the table
    empoyeeDeptResponse:Observable<metadatalistresponse>|any;
   // clientApiResponse:Observable<ClientResponse>|any;

   constructor(private centerService: CenterServiceService,private formBuilder: FormBuilder,
          public dialog: MatDialog,private loaderService: LoaderService,private toasterService: ToastService,
          private employeeService:EmployeeService)
          {
            this.loading$ = this.loaderService.loading$;
            this.partnerId= localStorage.getItem('partnerId');
          }
  
   /// Initialize the component and load all centers
    ngOnInit(): void {
     this.employeeForm=this.formBuilder.group({
      ddlEmpStatus:[''],
      ddlDepartment:[''],
      SearchEmployee:[''],
     });

      this.searchEmployeeForm = this.formBuilder.group({
      filterEmployee: ['']
    }); 
    this.getEmpDepartments();
   // this.LoadAllEmployee();    
  }


  
         /// used to load all the centers based on the search criteria
    getEmpDepartments(){
    this.employeeService.getAllEmployeeDepartments('Employee_Department',this.partnerId).subscribe({
      next: (response: any) => {
        if (response?.status && response?.statusCode === 200) {
          this.empoyeeDeptResponse = response.data; 
          this.IsNoRecordFound = false;
          console.log(this.empoyeeDeptResponse);
        } else {
          this.IsNoRecordFound = true;
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
    this.loaderService.hide();
  }

         /// used to load all the centers based on the search criteria
    LoadAllEmployee(){
    this.loaderService.show();
    this.centerStatus='';
    this.SeachByNameOrCode='';
    // this.centerService.getAllCenters(this.partnerId,this.centerStatus,this.SeachByNameOrCode).subscribe({
    //   next: (response: any) => {
    //     if (response?.status && response?.statusCode === 200) {
    //      // this.centerApiResponse = response.data; 
    //       this.IsNoRecordFound = false;
    //       //console.log(this.centerApiResponse);
    //     } else {
    //       this.IsNoRecordFound = true;
    //       console.warn("No Record Found!");
    //     }

    //     this.loaderService.hide();
    //   },
    //   error: (err) => {
    //     this.IsNoRecordFound = true;
    //     this.IsRecordFound = false;
    //     console.error("Error while fetching profiles:", err);
    //     this.loaderService.hide();
    //   }
    // });
    this.IsNoRecordFound = true;
    this.loaderService.hide();
  }



}
