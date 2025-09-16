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
  searchTestForm!: FormGroup;
  globalRoleForm!:FormGroup

  filteredData: any[] = []; // Data array for the table

   profileMasterForm!: FormGroup;
   searchProfileForm!: FormGroup;
   profileApiResponse:Observable<ProfileResponse>| any;

 @ViewChild('hdnUserId')
  hdnUserId!: ElementRef<HTMLInputElement>;
  constructor(private profileService: ProfileService,private formBuilder: FormBuilder,
  public dialog: MatDialog,private loaderService: LoaderService,private toasterService: ToastService){
    this.loading$ = this.loaderService.loading$;
    this.partnerId= localStorage.getItem('partnerId');
    /// Started to search the tests details by using test terms
    this.searchTestForm=this.formBuilder.group({
      filterTest: ['']
    })
    this.searchTestForm.get('filterTest')?.valueChanges.subscribe(value => {
      //this.filterTestData(value);
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
  
}




