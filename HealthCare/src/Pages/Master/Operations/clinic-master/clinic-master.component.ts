import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { LoaderComponent } from '../../../loader/loader.component';
import { MatInputModule } from '@angular/material/input';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { A11yModule } from '@angular/cdk/a11y';
import { ToastComponent } from '../../../Toaster/toast/toast.component';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CenterResponse } from '../../../../Interfaces/CenterMaster/CenterResponse';
import { CenterServiceService } from '../../../../auth/Center/center-service.service';
import { MatDialog } from '@angular/material/dialog';
import { LoaderService } from '../../../../Interfaces/loader.service';
import { ToastService } from '../../../../auth/Toaster/toast.service';
import { ClinicResponse } from '../../../../Interfaces/ClinicMaster/clinic-response';
import { ClinicServiceService } from '../../../../auth/ClinicMaster/clinic-service.service';
import { ConfirmationDialogComponentComponent } from '../../../confirmation-dialog-component/confirmation-dialog-component.component';

@Component({
  selector: 'app-clinic-master',
  standalone: true,
 imports: [MatTableModule, MatPaginatorModule, CommonModule, MatCardModule,
    MatListModule, MatIconModule, MatButtonModule, NgxDatatableModule, MatSortModule,
    MatFormFieldModule, MatInputModule, NgxPaginationModule,
    ReactiveFormsModule, LoaderComponent, A11yModule,ToastComponent ],
  templateUrl: './clinic-master.component.html',
  styleUrl: './clinic-master.component.css'
})
export class ClinicMasterComponent {
    router  =  inject(Router);
    loading$!: Observable<boolean>;
    partnerId: string |any;
    clinicStatus:string|any;
    centerCode:string|any;
    SeachBy:string|any;
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
    ClinicMasterForm!: FormGroup;
    centerApiResponse:Observable<CenterResponse>| any;
    clinicApiResponse:Observable<ClinicResponse>|any;
    filterClinicsData: any[] = []; // Data array for the table
   

      constructor(
      private centerService: CenterServiceService,
      private formBuilder: FormBuilder,
      public dialog: MatDialog,
      private loaderService: LoaderService,
      private toasterService: ToastService,
      private clinicService:ClinicServiceService,
    ) {
      this.loading$ = this.loaderService.loading$;
      this.partnerId = localStorage.getItem('partnerId');
    }

     /// Initialize the component and load all centers
  ngOnInit(): void {
     this.ClinicMasterForm=this.formBuilder.group({
      ddlStatus:[''],
      ddlCentre:[''],
      CityInchargeCode:[''],
      filterClinics:[''],
     });

       // ✅ Subscribe after form initialized
  this.ClinicMasterForm.get('filterClinics')?.valueChanges.subscribe(value => {
    this.filterClinics(value);
  });

     this.LoadAllCentres();
     this.LoadAllClinics();

  }

      /// used to load all the centers based on the search criteria
    LoadAllCentres(){
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
          console.log(this.centerApiResponse);
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
    LoadAllClinics(){
    debugger;
    this.loaderService.show();
    const formValue = this.ClinicMasterForm.value;
    this.centerCode = formValue.ddlCentre?.trim() || '';
    this.SeachBy = formValue.CityInchargeCode?.trim() || '';
   this.clinicStatus = formValue.ddlStatus !== null &&
                    formValue.ddlStatus !== undefined &&
                    formValue.ddlStatus !== ''
  ? formValue.ddlStatus
  : false;


    this.clinicService.getAllClinics(this.partnerId,this.centerCode,this.clinicStatus,this.SeachBy).subscribe({
      next: (response: any) => {
        debugger;

        if (response?.status && response?.statusCode === 200) {
          this.clinicApiResponse = response.data; 
          this.IsNoRecordFound = false;
          this.IsRecordFound=true;
          console.log(this.clinicApiResponse);
        } else {
          this.IsNoRecordFound = true;
          this.IsRecordFound=false;
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

  onSearch(){
    this.LoadAllClinics();
  }

  /// used to filter the clinics deatils based on the search term
filterClinics(term: string) {
  debugger;
  const searchTerm = term ? term.toLowerCase() : '';
  
  this.filterClinicsData = this.clinicApiResponse.filter((item: any) => {
    const clinicCode = (item.clinicCode || '').toString().toLowerCase();
    const clinicName = (item.clinicName || '').toString().toLowerCase();
    const clinicIncharge = (item.clinicIncharge || '').toString().toLowerCase();
    const mobileNumber=(item.mobileNumber || '').toString().toLowerCase();
    const clinicAddress=(item.clinicAddress || '').toString().toLowerCase();
    const emailId=(item.emailId || '').toString().toLowerCase();

    return (
      clinicCode.includes(searchTerm) ||
      clinicName.includes(searchTerm) ||
      clinicIncharge.includes(searchTerm)||
      mobileNumber.includes(searchTerm)||
      clinicAddress.includes(searchTerm)||
      emailId.includes(searchTerm)
    );
  });

  this.clinicApiResponse = this.filterClinicsData;

  if (!term) {
    this.LoadAllClinics();
  }
}


     clinicDeleteConfirmationDialog(clinicId:any): void {
      debugger;
      const dialogRef = this.dialog.open(ConfirmationDialogComponentComponent, {
         width: 'auto',
         disableClose: true,  
        data: { message: 'Are you sure you want to delete this Clinic?',clinicId: clinicId }
      });
  
      dialogRef.afterClosed().subscribe(result => {
        debugger;
        if (result.success) {
          debugger;
          // this.centerService.deleteCenterDetails(centerCode,this.partnerId).subscribe((response:any)=>{
          //   debugger;
          //  if(response.status && response.statusCode==200){
          //   this.toasterService.showToast(response.responseMessage, 'success');
          //   this.ngOnInit();
          //  }
          //  else{
          //   this.toasterService.showToast(response.responseMessage, 'error');
          //  }
          //  console.log(response);
          // }) 
          console.log('Returned User ID:', result.userId);
          console.log('User confirmed the action.');
        } else {
          debugger;
          // User clicked 'Cancel'
          console.log('User canceled the action.');
        }
      });
    }


}
