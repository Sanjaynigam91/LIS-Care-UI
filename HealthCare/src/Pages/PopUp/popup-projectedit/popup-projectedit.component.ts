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

start: Date = new Date();
end: Date = new Date();

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
/// used to set date range based on selected period
setDateRange(period: string): void {
  // 🔒 Always make sure these are Date objects
  this.start = this.start instanceof Date ? this.start : new Date(this.start);
  this.end = this.end instanceof Date ? this.end : new Date(this.end);

  switch (period) {
    case 'today':
      this.start = new Date();
      this.end = new Date();
      break;

    case 'yesterday':
      this.start = new Date();
      this.start.setDate(this.start.getDate() - 1);
      this.end = new Date(this.start);
      break;

    case 'last7':
      this.start = new Date();
      this.end = new Date();
      this.start.setDate(this.end.getDate() - 6);
      break;

    case 'last30':
      this.start = new Date();
      this.end = new Date();
      this.start.setDate(this.end.getDate() - 29);
      break;

    case 'thisMonth':
      this.start = new Date(this.start.getFullYear(), this.start.getMonth(), 1);
      this.end = new Date();
      break;

    case 'lastMonth':
      const now = new Date();
      this.start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      this.end = new Date(now.getFullYear(), now.getMonth(), 0);
      break;

    default:
      // Handle undefined or empty case gracefully
      this.start = new Date();
      this.end = new Date();
      break;
  }

  // ✅ Update formatted dates
  this.validFrom = this.formatDate(this.start);
  this.validTo = this.formatDate(this.end);
  this.displayPeriod = `${this.validFrom} - ${this.validTo}`;

  // ✅ Update form control safely
  this.editProjectDetailsForm.get('ExpiryPeriods')?.setValue({
    start: this.start,
    end: this.end
  });

  // (Optional) also update ValidFrom and ValidTo controls if you want:
  this.editProjectDetailsForm.patchValue({
    ValidFrom: this.start,
    ValidTo: this.end
  });
}

//used to get project details by project Id
getProjectDetailsbyId() {
  debugger;
  this.loaderService.show();

  this.projectService.getProjectById(this.partnerId, this.projectId).subscribe({
    next: (response: any) => {
      debugger;
      if (response?.status && response?.statusCode === 200) {
        this.projectApiResponse = response.data;

        const projectData = Array.isArray(response.data)
          ? response.data[0]
          : response.data;

        // ✅ Convert API dates to Date objects
        this.start = projectData.validFrom ? new Date(projectData.validFrom) : new Date();
        this.end = projectData.validTo ? new Date(projectData.validTo) :  new Date();

        // ✅ Format for display
        this.validFrom = this.start ? this.formatDate(this.start) : '';
        this.validTo = this.end ? this.formatDate(this.end) : '';
        this.displayPeriod = `${this.validFrom} - ${this.validTo}`;

        // ✅ Patch form directly — DO NOT call setDateRange()
        this.editProjectDetailsForm.patchValue({
          ProjectName: projectData.projectName || '',
          ContactPerson: projectData.contactPerson || '',
          ContactNumber: projectData.contactNumber || '',
          EmailId: projectData.email || '',
          AlternamteEmail: projectData.alternateEmail || '',
          ReferredBy: projectData.referedBy || '',
          ExpiryPeriods: { start: this.start, end: this.end }, // ✅ proper object
          ValidFrom: this.start,
          ValidTo: this.end,
          ddlProjectStatus: projectData.projectStatus ? 'true' : 'false',
          ReceiptPrefix: projectData.receiptPrefix || '',
          ProjectAddress: projectData.projectAddress || '',
          ddlRateType: projectData.rateType || ''
        });

        console.log('✅ Loaded project details:', this.editProjectDetailsForm.value);
      } else {
        console.warn('⚠️ No Record Found!');
      }

      this.loaderService.hide();
    },
    error: (err) => {
      console.error('❌ Error while fetching project details:', err);
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
      const expiry = this.editProjectDetailsForm.value.ExpiryPeriods;
      this.projectRequest.validFrom = expiry?.start ? new Date(expiry.start) : new Date();
      this.projectRequest.validTo=expiry?.end ? new Date(expiry.end) : new Date();
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
      const expiry = this.editProjectDetailsForm.value.ExpiryPeriods;
      this.projectRequest.validFrom = expiry?.start ? new Date(expiry.start) : new Date();
      this.projectRequest.validTo=expiry?.end ? new Date(expiry.end) : new Date();
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


