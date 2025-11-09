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
import { finalize, Observable } from 'rxjs';
import { CenterResponse } from '../../../../Interfaces/CenterMaster/CenterResponse';
import { ClientResponse } from '../../../../Interfaces/ClientMaster/client-response';
import { CenterServiceService } from '../../../../auth/Center/center-service.service';
import { MatDialog } from '@angular/material/dialog';
import { LoaderService } from '../../../../Interfaces/loader.service';
import { ToastService } from '../../../../auth/Toaster/toast.service';
import { ClientService } from '../../../../auth/ClientMaster/client.service';
import { metadatalistresponse } from '../../../../Interfaces/metadatalistresponse';
import { EmployeeService } from '../../../../auth/EmployeeMaster/employee.service';
import { EmployeeResponse } from '../../../../Interfaces/Employee/employee-response';
import { ConfirmationDialogComponentComponent } from '../../../confirmation-dialog-component/confirmation-dialog-component.component';
import { PopupEmployeeeditComponent } from '../../../PopUp/popup-employeeedit/popup-employeeedit.component';

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
    empStatus:any;
    department:string|any;
    employeeName:string|any;
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
    employeeApiResponse:Observable<EmployeeResponse>|any;

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
    this.LoadAllEmployee();   

     // ✅ Subscribe after form initialized
     this.searchEmployeeForm.get('filterEmployee')?.valueChanges.subscribe(value => {
        this.filterEmployee(value);
      });
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

         /// used to load all the employee based on the search criteria
 LoadAllEmployee() {
  debugger;
  this.loaderService.show();

  this.empStatus = this.employeeForm.value.ddlEmpStatus;
  this.department = this.employeeForm.value.ddlDepartment;
  this.employeeName = this.employeeForm.value.SearchEmployee;

  this.employeeService
    .getAllEmployeeDetails(this.empStatus, this.department, this.employeeName, this.partnerId)
    .pipe(
      finalize(() => {
        // ✅ Hide loader once API completes (success or error)
        this.loaderService.hide();
      })
    )
    .subscribe({
      next: (response: any) => {
        if (response?.status && response?.statusCode === 200) {
          debugger;
          this.employeeApiResponse = response.data;
          this.IsNoRecordFound = false;
          this.IsRecordFound = true;
          console.log(this.employeeApiResponse);
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

  /// used to search employee based on selection criteria
  onSearch(){
    this.LoadAllEmployee();
  }

  ///used to filter the data from grid/table
    filterEmployee(term: string) {
    debugger;
    this.filteredData = this.employeeApiResponse.filter((item: {
      employeeId: any;employeeName: any; mobileNumber:any;emailId:any;department:any;designation:any;
    }) => 
      item.employeeId.toLowerCase().includes(term.toLowerCase()) ||
      item.employeeName.toLowerCase().includes(term.toLowerCase()) ||
      item.mobileNumber.toLowerCase().includes(term.toLowerCase()) ||
      item.emailId.toLowerCase().includes(term.toLowerCase()) ||
      (item.department ?? '').toString().toLowerCase().includes(term.toLowerCase()) ||
      item.designation.toLowerCase().includes(term.toLowerCase()) 
     );
     debugger;
    this.employeeApiResponse= this.filteredData;
    if(term==""){
      this.ngOnInit();
    }
  }

  ///delete the employee by emplyee Id after confirmation  
   employeeDeleteConfirmationDialog(empId:any): void {
        debugger;
        const dialogRef = this.dialog.open(ConfirmationDialogComponentComponent, {
           width: 'auto',
           disableClose: true,  
          data: { message: 'Are you sure you want to delete this employee?',empId: empId }
        });
    
        dialogRef.afterClosed().subscribe(result => {
          debugger;
          if (result.success) {
            debugger;
            this.employeeService.deleteEmployeeDetails(empId,this.partnerId).subscribe((response:any)=>{
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

      /// Open Add New employee PopUp
            
            OpenAddEmployeePopUp(): void {
              this.dialog.open(PopupEmployeeeditComponent, {
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
      
            // View employee details
             ViewCenterDetails(empId:string){
                  debugger;
                  this.dialog.open(PopupEmployeeeditComponent, {
                   width: '1500px',           // slightly larger than medium
                    maxWidth: '90vw',         // responsive on smaller screens
                    height: 'auto',            // taller than medium but not full screen
                    minHeight: '400px',       // ensures minimum height
                    panelClass: 'large-dialog', // optional custom CSS
                    disableClose: true,  
                    data: {empId:empId},        // Pass data if needed   
                  });
      
                this.dialog.afterAllClosed.subscribe(() => {
                this.ngOnInit(); // Refresh the list after the dialog is closed
              });
            }



}
