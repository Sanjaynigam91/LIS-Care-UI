import { Component, Inject, NgZone } from '@angular/core';
import { ToastComponent } from '../../Toaster/toast/toast.component';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoaderComponent } from '../../loader/loader.component';
import { Observable } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from '../../../auth/auth.service';
import { ToastService } from '../../../auth/Toaster/toast.service';
import { RefreshPageService } from '../../../auth/Shared/refresh-page.service';
import { TestService } from '../../../auth/TestMasterService/test.service';
import { LoaderService } from '../../../Interfaces/loader.service';
import { MetadataService } from '../../../auth/metadata.service';
import { EmployeeService } from '../../../auth/EmployeeMaster/employee.service';
import { metadatalistresponse } from '../../../Interfaces/metadatalistresponse';
import { EmployeeResponse } from '../../../Interfaces/Employee/employee-response';
import { EmployeeRequest } from '../../../Interfaces/Employee/employee-request';

@Component({
  selector: 'app-popup-employeeedit',
  standalone: true,
  imports: [ToastComponent, CommonModule, MatIcon, ReactiveFormsModule, LoaderComponent],
  templateUrl: './popup-employeeedit.component.html',
  styleUrl: './popup-employeeedit.component.css'
})
export class PopupEmployeeeditComponent {
loading$!: Observable<boolean>;
isAddHeaderVisible:boolean=false;
isEditHeaderVisible:boolean=false;
isVisible = false;
roleId:any;
partnerId: string |any;
loggedInUserId: string |any;
employeEditForm!: FormGroup<any>;
isSubmitVisible:boolean=false;
isUpdateVisible:boolean=false;
employeeId:any
fileBase64: string | ArrayBuffer | null = null;
empoyeeDeptResponse:Observable<metadatalistresponse>|any;
empoyeeDeginationResponse:Observable<metadatalistresponse>|any;
employeeApiResponse:Observable<EmployeeResponse>|any;
employeeRequest:EmployeeRequest={
  employeeId: '',
  employeeName: '',
  emailId: '',
  dateOfJoining: '' as unknown as Date,
  contactNumber: '',
  mobileNumber: '',
  department: '',
  designation: '',
  qualification: '',
  recordStatus: false,
  address: '',
  isPathology: false,
  signatureImage: '',
  partnerId: '',
  createdBy: ''
}

constructor(public dialogRef: MatDialogRef<PopupEmployeeeditComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      private toasterService: ToastService,
      private refPageService:RefreshPageService,
      private formBuilder: FormBuilder,
      private testService:TestService,
      private loaderService: LoaderService,
      private metaService:MetadataService,
      public dialog: MatDialog, 
      private zone: NgZone,
      private employeeService:EmployeeService
    ){
      this.partnerId= localStorage.getItem('partnerId');
      this.loggedInUserId=localStorage.getItem('userId');
      this.roleId=data.roleId;
      this.employeeId=data.empId;
    }


 ngOnInit(): void {
  this.employeEditForm=this.formBuilder.group({
      EmployeeId:[{ value: '', disabled: true }],
      EmployeeName:[''],
      EmailId:[''],
      DateOfJoining:[''],
      ContactNumber:[''],
      MobileNumber:  [
        '',
        [
          Validators.required,
          Validators.pattern('^[6-9][0-9]{9}$') // ✅ 10-digit Indian mobile number pattern
        ]
      ],
      ddlDepartment:[''],
      ddlDesignation:[''],
      Qualification:[''],
      ddlEmpStatus:[''],
      Address:[''],
      ddlPathology:[''],
      SignatureName:[''],
    });

     setTimeout(() => {  // 🔑 forces update in next CD cycle
    if (!this.employeeId) {
        debugger;
      this.isAddHeaderVisible = true;
      this.isEditHeaderVisible = false;
      this.isSubmitVisible = true;
      this.isUpdateVisible = false;
    
    } else {
        debugger;
      this.isEditHeaderVisible = true;
      this.isAddHeaderVisible = false;
      this.isSubmitVisible = false;
      this.isUpdateVisible = true;
     
      this.getEmployeebyEmpId();
     
    }
      this.getEmpDepartments();
      this.getEmpDesignation();
  });

  }


open(): void {
    this.isVisible = true;
  }

  close(): void {
    this.dialogRef.close();
  }

   onFileChange(event: Event): void {
    debugger;
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      const file = input.files[0];
      this.convertFileToBase64(file);
    } 
  }

   private convertFileToBase64(file: File): void {
    const reader = new FileReader();

    reader.onloadend = () => {
      this.fileBase64 = reader.result;
      console.log(this.fileBase64);
    };

    reader.readAsDataURL(file); // This will give a base64 encoded string
  }

       /// used to load all the centers based on the search criteria
    getEmpDepartments(){
    this.employeeService.getAllEmployeeDepartments('Employee_Department',this.partnerId).subscribe({
      next: (response: any) => {
        if (response?.status && response?.statusCode === 200) {
          this.empoyeeDeptResponse = response.data; 
          console.log(this.empoyeeDeptResponse);
        } else {
          console.warn("No Record Found!");
        }

        this.loaderService.hide();
      },
      error: (err) => {
        console.error("Error while fetching profiles:", err);
        this.loaderService.hide();
      }
    });
    this.loaderService.hide();
  }

      /// used to load all the centers based on the search criteria
    getEmpDesignation(){
    this.employeeService.getAllEmployeeDepartments('EMPLOYEE_DESIGNATION',this.partnerId).subscribe({
      next: (response: any) => {
        if (response?.status && response?.statusCode === 200) {
          this.empoyeeDeginationResponse = response.data; 
          console.log(this.empoyeeDeginationResponse);
        } else {
          console.warn("No Record Found!");
        }

        this.loaderService.hide();
      },
      error: (err) => {
        console.error("Error while fetching profiles:", err);
        this.loaderService.hide();
      }
    });
    this.loaderService.hide();
  }

  /// used to get center details by center code
  getEmployeebyEmpId(){
    this.loaderService.show();
    this.employeeService.getEmployeeById(this.employeeId,this.partnerId).subscribe({
      next: (response: any) => {
        if (response?.status && response?.statusCode === 200) {
          this.employeeApiResponse = response.data; 
          const employeeData = response.data[0]; // first item in array
          // Convert 'dd-MM-yyyy' -> 'yyyy-MM-dd' before binding
        const parts = employeeData.dateOfJoining.split('-'); // ['dd', 'MM', 'yyyy']
        const formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`; // 'yyyy-MM-dd'
        this.employeEditForm.patchValue({
        EmployeeId: employeeData.employeeId || '',
        EmployeeName: employeeData.employeeName || '',
        EmailId: employeeData.emailId || '',
        DateOfJoining: formattedDate || '',
        ContactNumber: employeeData.contactNumber || '',
        MobileNumber: employeeData.mobileNumber || '',
        ddlDepartment: employeeData.department || 0,
        ddlDesignation: employeeData.designation,
        Qualification: employeeData.qualification || '',
        ddlEmpStatus: employeeData.recordStatus || '',
        Address: employeeData.address || '',
        ddlPathology: employeeData.isPathology || '',
        fileBase64: employeeData.signatureImage || ''
      });
          console.log(this.employeeApiResponse);
        } else {
          console.warn("No Record Found!");
        }

        this.loaderService.hide();
      },
      error: (err) => {
        console.error("Error while fetching profiles:", err);
        this.loaderService.hide();
      }
    });

  } 

  /// used to create new employee details
createNewEmployee(){
     this.loaderService.show();
    if(this.employeEditForm.value.EmployeeName==''){
      this.toasterService.showToast('Please enter employee...', 'error');
    }
    else if (this.employeEditForm.value.EmailId == '') {
    this.toasterService.showToast('Please enter email address...', 'error');
    }
    else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(this.employeEditForm.value.EmailId)) {
      this.toasterService.showToast('Please enter a valid email address...', 'error');
    }
    else if(this.employeEditForm.value.DateOfJoining==''){
      this.toasterService.showToast('Please select date of joining...', 'error');
    }
    else if(this.employeEditForm.value.MobileNumber==''){
      this.toasterService.showToast('Please enter mobile number...', 'error');
    }
    else if (!/^[6-9][0-9]{9}$/.test(this.employeEditForm.value.MobileNumber)) {
      this.toasterService.showToast('Please enter a valid 10-digit mobile number...', 'error');
    }
    else if(this.employeEditForm.value.ddlDepartment==''){
      this.toasterService.showToast('Please select employee department...', 'error');
    }
    else if(this.employeEditForm.value.ddlDesignation==''){
      this.toasterService.showToast('Please select employee designation...', 'error');
    }
    else if(this.employeEditForm.value.ddlEmpStatus==''){
      this.toasterService.showToast('Please select employee status...', 'error');
    }
    
    else{
      this.employeeRequest.employeeName=this.employeEditForm.value.EmployeeName;
      this.employeeRequest.emailId=this.employeEditForm.value.EmailId;
      this.employeeRequest.dateOfJoining=this.employeEditForm.value.DateOfJoining;
      this.employeeRequest.contactNumber=this.employeEditForm.value.ContactNumber;
      this.employeeRequest.mobileNumber=this.employeEditForm.value.MobileNumber;
      this.employeeRequest.department=this.employeEditForm.value.ddlDepartment;
      this.employeeRequest.designation=this.employeEditForm.value.ddlDesignation;
      this.employeeRequest.qualification=this.employeEditForm.value.Qualification;
      this.employeeRequest.recordStatus=JSON.parse(this.employeEditForm.value.ddlEmpStatus.toLowerCase());
      this.employeeRequest.address=this.employeEditForm.value.Address;
      this.employeeRequest.isPathology = JSON.parse(this.employeEditForm.value.ddlPathology.toLowerCase());
      this.employeeRequest.signatureImage=''; 
      this.employeeRequest.partnerId=this.partnerId; 
      this.employeeRequest.createdBy=this.loggedInUserId; 

    this.employeeService.addNewEmployee(this.employeeRequest)
    .subscribe({
    next: (response: any) => {
      if (response.statusCode === 200 && response.status) {
        this.refPageService.notifyRefresh(); // used to refresh the main list page
        this.toasterService.showToast(response.responseMessage, 'success');
        this.dialogRef.close();
      } else {
        this.toasterService.showToast(response.responseMessage, 'error');
      }
    },
    error: (err) => {
      // Handle backend business error even on 404
      if (err.error && err.error.responseMessage) {
        this.toasterService.showToast(err.error.responseMessage, 'error');
      } else {
        this.toasterService.showToast('Something went wrong. Please try again.', 'error');
      }
      console.error(err);
    }
  });



    }
    this.loaderService.hide();
  }


  /// used to update employee details
  updateEmployee(){
     this.loaderService.show();
    if(this.employeEditForm.value.EmployeeName==''){
      this.toasterService.showToast('Please enter employee...', 'error');
    }
    else if (this.employeEditForm.value.EmailId == '') {
    this.toasterService.showToast('Please enter email address...', 'error');
    }
    else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(this.employeEditForm.value.EmailId)) {
      this.toasterService.showToast('Please enter a valid email address...', 'error');
    }
    else if(this.employeEditForm.value.DateOfJoining==''){
      this.toasterService.showToast('Please select date of joining...', 'error');
    }
    else if(this.employeEditForm.value.MobileNumber==''){
      this.toasterService.showToast('Please enter mobile number...', 'error');
    }
    else if (!/^[6-9][0-9]{9}$/.test(this.employeEditForm.value.MobileNumber)) {
      this.toasterService.showToast('Please enter a valid 10-digit mobile number...', 'error');
    }
    else if(this.employeEditForm.value.ddlDepartment==''){
      this.toasterService.showToast('Please select employee department...', 'error');
    }
    else if(this.employeEditForm.value.ddlDesignation==''){
      this.toasterService.showToast('Please select employee designation...', 'error');
    }
    else if(this.employeEditForm.value.ddlEmpStatus==''){
      this.toasterService.showToast('Please select employee status...', 'error');
    }
    else{
      this.employeeRequest.employeeId=this.employeeId;
      this.employeeRequest.employeeName=this.employeEditForm.value.EmployeeName;
      this.employeeRequest.emailId=this.employeEditForm.value.EmailId;
      this.employeeRequest.dateOfJoining=this.employeEditForm.value.DateOfJoining;
      this.employeeRequest.contactNumber=this.employeEditForm.value.ContactNumber;
      this.employeeRequest.mobileNumber=this.employeEditForm.value.MobileNumber;
      this.employeeRequest.department=this.employeEditForm.value.ddlDepartment;
      this.employeeRequest.designation=this.employeEditForm.value.ddlDesignation;
      this.employeeRequest.qualification=this.employeEditForm.value.Qualification;
      this.employeeRequest.recordStatus=this.employeEditForm.value.ddlEmpStatus;
      this.employeeRequest.address=this.employeEditForm.value.Address;
      this.employeeRequest.isPathology = this.employeEditForm.value.ddlPathology;
      this.employeeRequest.signatureImage=''; 
      this.employeeRequest.partnerId=this.partnerId; 
      this.employeeRequest.createdBy=this.loggedInUserId; 

    this.employeeService.updateEmployeeDetails(this.employeeRequest)
    .subscribe({
    next: (response: any) => {
      if (response.statusCode === 200 && response.status) {
        this.refPageService.notifyRefresh(); // used to refresh the main list page
        this.toasterService.showToast(response.responseMessage, 'success');
        this.dialogRef.close();
      } else {
        this.toasterService.showToast(response.responseMessage, 'error');
      }
    },
    error: (err) => {
      // Handle backend business error even on 404
      if (err.error && err.error.responseMessage) {
        this.toasterService.showToast(err.error.responseMessage, 'error');
      } else {
        this.toasterService.showToast('Something went wrong. Please try again.', 'error');
      }
      console.error(err);
    }
  });



    }
    this.loaderService.hide();
  }



}
