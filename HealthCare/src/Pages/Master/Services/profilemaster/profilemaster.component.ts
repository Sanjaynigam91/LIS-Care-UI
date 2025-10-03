import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
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
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ToastService } from '../../../../auth/Toaster/toast.service';
import { LoaderService } from '../../../../Interfaces/loader.service';
import { ViewChild } from '@angular/core';
import { ProfileService } from '../../../../auth/ProfileMasterService/profile.service';
import { ProfileResponse } from '../../../../Interfaces/ProfileMaster/ProfileResponse';
import { PopupProfilemastereditComponent } from '../../../PopUp/popup-profilemasteredit/popup-profilemasteredit.component';


@Component({
  selector: 'app-profilemaster',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, CommonModule, MatCardModule,
      MatListModule, MatIconModule, MatButtonModule, NgxDatatableModule, MatSortModule,
      MatFormFieldModule, MatInputModule, MatSort, NgxPaginationModule,
      ReactiveFormsModule, LoaderComponent, ConfirmationDialogComponentComponent, ToastComponent],
  templateUrl: './profilemaster.component.html',
  styleUrl: './profilemaster.component.css'
})
export class ProfilemasterComponent {
//[x: string]: any;
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
  searchProfileForm!: FormGroup;
  globalRoleForm!:FormGroup

  filteredData: any[] = []; // Data array for the table
  searchProfileData: any[] = []; // Data array for the table

   profileMasterForm!: FormGroup;
   profileApiResponse:Observable<ProfileResponse>| any;

 @ViewChild('hdnUserId')
  hdnUserId!: ElementRef<HTMLInputElement>;
  constructor(private profileService: ProfileService,private formBuilder: FormBuilder,
  public dialog: MatDialog,private loaderService: LoaderService,private toasterService: ToastService){
    this.loading$ = this.loaderService.loading$;
    this.partnerId= localStorage.getItem('partnerId');
    /// Started to search the tests details by using test terms
    this.searchProfileForm=this.formBuilder.group({
      filterProfile: ['']
    })
    this.searchProfileForm.get('filterProfile')?.valueChanges.subscribe(value => {
      this.filterProfileData(value);
    });
    /// Ended to search the tests details by using test terms
  }

ngOnInit(): void{
    debugger;
 this.profileMasterForm = this.formBuilder.group({
      ddlProfileStatus: [''],
      ProfileNameOrCode: [''],     
    });


    this.loggedInUserId=localStorage.getItem('userId');
    /// used to load and Serach the Test Data
    this.ReteriveProfileRecords();
   }

    ReteriveProfileRecords(){
    debugger;
    this.loaderService.show();

    this.profileService.getAllProfiles(this.partnerId).subscribe({
      next: (response: any) => {
        debugger;

        if (response?.status && response?.statusCode === 200) {
          this.profileApiResponse = response.data; 
          this.IsNoRecordFound = false;
          this.IsRecordFound = true;
          console.log(this.profileApiResponse);
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

   filterProfileData(term: string) {
    debugger;
    
    this.filteredData = this.profileApiResponse.filter((item: {
      profileCode: any;profileName: any; sampleTypes:any;mrp:any;b2CRates:any;
      labrates:any;profileStatus:any;
    }) => 
      item.profileCode.toLowerCase().includes(term.toLowerCase()) ||
      item.profileName.toLowerCase().includes(term.toLowerCase()) ||
      item.sampleTypes.toLowerCase().includes(term.toLowerCase()) ||
      (item.mrp ?? '').toString().toLowerCase().includes(term.toLowerCase()) ||
      (item.b2CRates ?? '').toString().toLowerCase().includes(term.toLowerCase()) ||
      (item.labrates ?? '').toString().toLowerCase().includes(term.toLowerCase()) ||
      (item.profileStatus ?? '').toString().toLowerCase().includes(term.toLowerCase())      
     );
     debugger;
    this.profileApiResponse= this.filteredData;
    if(term==""){
      this.ngOnInit();
    }
  }


SearchProfileDetails() {
  debugger;
  this.loaderService.show();
  // get values from form
  const statusSearch = (this.profileMasterForm.value.ddlProfileStatus ?? '').toLowerCase();
  const nameOrCodeSearch = (this.profileMasterForm.value.ProfileNameOrCode ?? '').toLowerCase();

  this.searchProfileData = this.profileApiResponse.filter((item: {
    profileCode: any;
    profileName: any;
    profileStatus: any;
  }) => {
    return (
      // Profile Status filter (dropdown) → only apply if selected
      (statusSearch === '' || (item.profileStatus ?? '').toString().toLowerCase() === statusSearch) &&

      // Profile Name/Code filter → check against both
      (nameOrCodeSearch === '' ||
        (item.profileCode ?? '').toString().toLowerCase().includes(nameOrCodeSearch) ||
        (item.profileName ?? '').toString().toLowerCase().includes(nameOrCodeSearch))
    );
  });

  debugger;

  this.profileApiResponse = this.searchProfileData;

  // if all filters empty → reset list
  if (!statusSearch && !nameOrCodeSearch) {
    this.ngOnInit();
  }
  this.loaderService.hide();
}

 profileDeleteConfirmationDialog(profileCode:any): void {
    debugger;
    const dialogRef = this.dialog.open(ConfirmationDialogComponentComponent, {
      width: '250px',
      data: { message: 'Are you sure you want to delete this profile?',profileCode: profileCode }
    });

    dialogRef.afterClosed().subscribe(result => {
      debugger;
      if (result.success) {
        debugger;
        this.profileService.DeleteProfileByProfileCode(this.partnerId,result.profileCode).subscribe((response:any)=>{
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

/// Open Add New Profile Page

OpenAddProfilePopUp(): void {
  this.dialog.open(PopupProfilemastereditComponent, {
    width: '1500px',           // slightly larger than medium
    maxWidth: '90vw',         // responsive on smaller screens
    height: 'auto',            // taller than medium but not full screen
    minHeight: '400px',       // ensures minimum height
    panelClass: 'large-dialog', // optional custom CSS
    disableClose: true,  
    data: {}                  // pass data if needed
  });
}

 ViewProfileDetails(profileCode:string){
    debugger;
    this.dialog.open(PopupProfilemastereditComponent, {
     width: '1500px',           // slightly larger than medium
      maxWidth: '90vw',         // responsive on smaller screens
      height: '98vh',           // taller than medium but not full screen
      minHeight: '400px',       // ensures minimum height
      panelClass: 'large-dialog', // optional custom CSS
      disableClose: true,  
      data: {profileCode:profileCode,profileApiResponse:this.profileApiResponse}        // Pass data if needed
    });
  }



}




