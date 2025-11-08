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
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ProjectResponse } from '../../../Interfaces/Projects/project-response';
import { ProjectService } from '../../../auth/ProjectMaster/project.service';
import { ProjectRequest } from '../../../Interfaces/Projects/project-request';

@Component({
  selector: 'app-popup-projectedit',
  standalone: true,
  imports: [
    ToastComponent,
    CommonModule,
    MatIcon,
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule,
    LoaderComponent
  ],
  templateUrl: './popup-projectedit.component.html',
  styleUrl: './popup-projectedit.component.css'
})
export class PopupProjecteditComponent {
loading$!: Observable<boolean>;
isAddHeaderVisible:boolean=false;
isEditHeaderVisible:boolean=false;
isVisible = false;
roleId:any;
partnerId: string |any;
loggedInUserId: string |any;
editProjectDetailsForm!: FormGroup<any>;
isSubmitVisible:boolean=false;
isUpdateVisible:boolean=false;
projectId:any;
validFrom: string = '';
validTo: string = '';
displayPeriod: string = '';
showDropdown = false;
hovered = '';
projectApiResponse:Observable<ProjectResponse>| any;
projectRequest: ProjectRequest = {
  projectId: 0,
  projectName: '',
  contactNumber: '',
  contactPerson: '',
  email: '',
  alternateEmail: '',
  projectAddress: '',
  referedBy: '',
  createdOn: new Date(), // ✅ Correct
  projectStatus: false,
  partnerId: '',
  validFrom: new Date(), // ✅ Correct
  validTo: new Date(), // ✅ Correct
  rateType: '',
  receiptPrefix: ''
}

constructor(public dialogRef: MatDialogRef<PopupProjecteditComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      private authService:AuthService,
      private toasterService: ToastService,
      private refPageService:RefreshPageService,
      private formBuilder: FormBuilder,
      private testService:TestService,
      private loaderService: LoaderService,
      private metaService:MetadataService,
      public dialog: MatDialog,
      private zone: NgZone,
      private projectService:ProjectService
    ){
      this.partnerId= localStorage.getItem('partnerId');
      this.loggedInUserId=localStorage.getItem('userId');
      this.roleId=data.roleId;
      this.projectId=data.projectId;
    }

  open(): void {
    this.isVisible = true;
  }

  close(): void {
    this.dialogRef.close();
  }

   ngOnInit(): void {
    this.editProjectDetailsForm=this.formBuilder.group({
        ProjectName:[''],
        ContactPerson:[''],
        ContactNumber:  [
          '',
          [
            Validators.required,
            Validators.pattern('^[6-9][0-9]{9}$') // ✅ 10-digit Indian mobile number pattern
          ]
        ],
        EmailId:[''],
        AlternamteEmail:[''],
        ReferredBy:[''],
        ExpiryPeriods: ['', Validators.required],
        ValidFrom: [''],
        ValidTo: [''],
        ddlProjectStatus:[''],
        ReceiptPrefix:[''],
        ProjectAddress:[''],
        ddlRateType:[''],
      });
  
       setTimeout(() => {  // 🔑 forces update in next CD cycle
      if (!this.projectId) {
        this.isAddHeaderVisible = true;
        this.isEditHeaderVisible = false;
        this.isSubmitVisible = true;
        this.isUpdateVisible = false;
      
      } else {
        this.isEditHeaderVisible = true;
        this.isAddHeaderVisible = false;
        this.isSubmitVisible = false;
        this.isUpdateVisible = true;
        this.getProjectDetailsbyId();
       
      }
    });
  
    }

/// Options for expiry periods
expiryOptions = [
  { label: 'Today', value: 'today' },
  { label: 'Yesterday', value: 'yesterday' },
  { label: 'Last 7 Days', value: 'last7' },
  { label: 'Last 30 Days', value: 'last30' },
  { label: 'This Month', value: 'thisMonth' },
  { label: 'Last Month', value: 'lastMonth' }
];

/// used to format date to dd-MM-yyyy
formatDate(date: Date): string {
  if (!date) return '';
  const d = new Date(date);
  const day = ('0' + d.getDate()).slice(-2);
  const month = ('0' + (d.getMonth() + 1)).slice(-2);
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
}

/// used to set date range based on selected period
setDateRange(period: string): void {
  let start: Date = new Date();
  let end: Date = new Date();

  switch (period) {
    case 'today':
      start = new Date();
      end = new Date();
      break;

    case 'yesterday':
      start = new Date();
      start.setDate(start.getDate() - 1);
      end = new Date(start);
      break;

    case 'last7':
      start.setDate(start.getDate() - 6);
      break;

    case 'last30':
      start.setDate(start.getDate() - 29);
      break;

    case 'thisMonth':
      start = new Date(start.getFullYear(), start.getMonth(), 1);
      end = new Date();
      break;

    case 'lastMonth':
      start = new Date(start.getFullYear(), start.getMonth() - 1, 1);
      end = new Date(start.getFullYear(), start.getMonth(), 0);
      break;
  }

  // ✅ Update formatted dates
  this.validFrom = this.formatDate(start);
  this.validTo = this.formatDate(end);
  this.displayPeriod = `${this.validFrom} - ${this.validTo}`;

  // ✅ Update form control so Angular form stays in sync
  this.editProjectDetailsForm.get('ExpiryPeriods')?.setValue(this.displayPeriod);
}

//used to get project details by project Id
getProjectDetailsbyId(){
  debugger;
  this.loaderService.show();
  this.projectService.getProjectById(this.partnerId,this.projectId,).subscribe({
      next: (response: any) => {
        debugger;
        if (response?.status && response?.statusCode === 200) {
        this.projectApiResponse = response.data;
        const projectData = Array.isArray(response.data)
        ? response.data[0]
        : response.data;
        this.validFrom=projectData.validFrom || '';
        this.validTo=projectData.validTo || '';
        
        this.setDateRange(this.editProjectDetailsForm.value.ExpiryPeriods);
        this.editProjectDetailsForm.patchValue({
        ProjectName: projectData.projectName || '',
        ContactPerson: projectData.contactPerson || '',
        ContactNumber: projectData.contactNumber || '',
        EmailId: projectData.email || '',
        AlternamteEmail: projectData.alternateEmail || '',
        ReferredBy: projectData.referedBy || '',
        ExpiryPeriods: projectData.expiryPeriods || '',
        ValidFrom: projectData.validFrom || '',
        ValidTo: projectData.validTo || '',
        ddlProjectStatus: projectData.projectStatus ? 'true' : 'false',
        ReceiptPrefix: projectData.receiptPrefix || '',
        ProjectAddress: projectData.projectAddress || '',
        ddlRateType: projectData.rateType || '',

      });
          console.log(this.projectApiResponse);
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

  /// used to create new project details
createNewProject(){
  debugger;
     this.loaderService.show();
    if(this.editProjectDetailsForm.value.ProjectName==''){
      this.toasterService.showToast('Please enter project name...', 'error');
    }
    else if(this.editProjectDetailsForm.value.ContactPerson==''){
      this.toasterService.showToast('Please enter contact person name...', 'error');
    }
    else if(this.editProjectDetailsForm.value.ContactNumber==''){
      this.toasterService.showToast('Please enter contact number...', 'error');
    }
    else if (!/^[6-9][0-9]{9}$/.test(this.editProjectDetailsForm.value.ContactNumber)) {
      this.toasterService.showToast('Please enter a valid 10-digit contact number...', 'error');
    }
     else if (this.editProjectDetailsForm.value.EmailId == '') {
    this.toasterService.showToast('Please enter email address...', 'error');
    }
    else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(this.editProjectDetailsForm.value.EmailId)) {
      this.toasterService.showToast('Please enter a valid email address...', 'error');
    }
    else if(this.editProjectDetailsForm.value.ExpiryPeriods==''){
      this.toasterService.showToast('Please provide the expiry period details...', 'error');
    }
    else if(this.editProjectDetailsForm.value.ddlProjectStatus==''){
      this.toasterService.showToast('Please select project status...', 'error');
    }
    else if(this.editProjectDetailsForm.value.ReceiptPrefix==''){
      this.toasterService.showToast('Please enter receipt prefix...', 'error');
    }
    else{
      debugger;
      this.projectRequest.partnerId=this.partnerId; 
      this.projectRequest.projectName=this.editProjectDetailsForm.value.ProjectName;
      this.projectRequest.contactNumber=this.editProjectDetailsForm.value.ContactNumber;
      this.projectRequest.contactPerson=this.editProjectDetailsForm.value.ContactPerson;
      this.projectRequest.email=this.editProjectDetailsForm.value.EmailId;
      this.projectRequest.alternateEmail=this.editProjectDetailsForm.value.AlternamteEmail;
      this.projectRequest.referedBy=this.editProjectDetailsForm.value.ReferredBy;
      this.projectRequest.validFrom = new Date(this.validFrom)
      this.projectRequest.validTo=new Date(this.validTo);
      this.projectRequest.projectStatus=JSON.parse(this.editProjectDetailsForm.value.ddlProjectStatus.toLowerCase());
      this.projectRequest.rateType=this.editProjectDetailsForm.value.ddlRateType;
      this.projectRequest.receiptPrefix=this.editProjectDetailsForm.value.ReceiptPrefix;
      this.projectRequest.projectAddress=this.editProjectDetailsForm.value.ProjectAddress;

    this.projectService.addNewProject(this.projectRequest)
    .subscribe({
    next: (response: any) => {
      if (response.statusCode === 200 && response.status) {
        debugger;
        this.refPageService.notifyRefresh(); // used to refresh the main list page
        this.toasterService.showToast(response.responseMessage, 'success');
        this.dialogRef.close();
      } else {
        this.toasterService.showToast(response.responseMessage, 'error');
      }
    },
    error: (err) => {
      debugger;
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


    /// used to create new project details
updateProject(){
  debugger;
     this.loaderService.show();
    if(this.editProjectDetailsForm.value.ProjectName==''){
      this.toasterService.showToast('Please enter project name...', 'error');
    }
    else if(this.editProjectDetailsForm.value.ContactPerson==''){
      this.toasterService.showToast('Please enter contact person name...', 'error');
    }
    else if(this.editProjectDetailsForm.value.ContactNumber==''){
      this.toasterService.showToast('Please enter contact number...', 'error');
    }
    else if (!/^[6-9][0-9]{9}$/.test(this.editProjectDetailsForm.value.ContactNumber)) {
      this.toasterService.showToast('Please enter a valid 10-digit contact number...', 'error');
    }
     else if (this.editProjectDetailsForm.value.EmailId == '') {
    this.toasterService.showToast('Please enter email address...', 'error');
    }
    else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(this.editProjectDetailsForm.value.EmailId)) {
      this.toasterService.showToast('Please enter a valid email address...', 'error');
    }
    else if(this.editProjectDetailsForm.value.ExpiryPeriods==''){
      this.toasterService.showToast('Please provide the expiry period details...', 'error');
    }
    else if(this.editProjectDetailsForm.value.ddlProjectStatus==''){
      this.toasterService.showToast('Please select project status...', 'error');
    }
    else if(this.editProjectDetailsForm.value.ReceiptPrefix==''){
      this.toasterService.showToast('Please enter receipt prefix...', 'error');
    }
    else{
      debugger;
       this.projectRequest.projectId=this.projectId; 
      this.projectRequest.partnerId=this.partnerId; 
      this.projectRequest.projectName=this.editProjectDetailsForm.value.ProjectName;
      this.projectRequest.contactNumber=this.editProjectDetailsForm.value.ContactNumber;
      this.projectRequest.contactPerson=this.editProjectDetailsForm.value.ContactPerson;
      this.projectRequest.email=this.editProjectDetailsForm.value.EmailId;
      this.projectRequest.alternateEmail=this.editProjectDetailsForm.value.AlternamteEmail;
      this.projectRequest.referedBy=this.editProjectDetailsForm.value.ReferredBy;
      this.projectRequest.validFrom = new Date(this.validFrom)
      this.projectRequest.validTo=new Date(this.validTo);
      this.projectRequest.projectStatus=JSON.parse(this.editProjectDetailsForm.value.ddlProjectStatus.toLowerCase());
      this.projectRequest.rateType=this.editProjectDetailsForm.value.ddlRateType;
      this.projectRequest.receiptPrefix=this.editProjectDetailsForm.value.ReceiptPrefix;
      this.projectRequest.projectAddress=this.editProjectDetailsForm.value.ProjectAddress;

    this.projectService.updateProjectDetails(this.projectRequest)
    .subscribe({
    next: (response: any) => {
      if (response.statusCode === 200 && response.status) {
        debugger;
        this.refPageService.notifyRefresh(); // used to refresh the main list page
        this.toasterService.showToast(response.responseMessage, 'success');
        this.dialogRef.close();
      } else {
        this.toasterService.showToast(response.responseMessage, 'error');
      }
    },
    error: (err) => {
      debugger;
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


