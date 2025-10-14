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
import { CenterServiceService } from '../../../../auth/Center/center-service.service';
import { MatDialog } from '@angular/material/dialog';
import { LoaderService } from '../../../../Interfaces/loader.service';
import { ToastService } from '../../../../auth/Toaster/toast.service';
import { CenterResponse } from '../../../../Interfaces/CenterMaster/CenterResponse';

@Component({
  selector: 'app-centre-spl-rates',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, CommonModule, MatCardModule,
      MatListModule, MatIconModule, MatButtonModule, NgxDatatableModule, MatSortModule,
      MatFormFieldModule, MatInputModule, NgxPaginationModule,
      ReactiveFormsModule, LoaderComponent, A11yModule],
  templateUrl: './centre-spl-rates.component.html',
  styleUrl: './centre-spl-rates.component.css'
})
export class CentreSplRatesComponent {
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
    searchCentreRateForm!: FormGroup;
    CentreSpecialRateForm!:FormGroup;
    centerApiResponse:Observable<CenterResponse>| any;

      constructor(private centerService: CenterServiceService,private formBuilder: FormBuilder,
        public dialog: MatDialog,private loaderService: LoaderService,private toasterService: ToastService){
          this.loading$ = this.loaderService.loading$;
          this.partnerId= localStorage.getItem('partnerId');
          /// Started to search the tests details by using test terms
          this.searchCentreRateForm=this.formBuilder.group({
            filterCentreRates: ['']
          })
          this.searchCentreRateForm.get('filterCentreRates')?.valueChanges.subscribe(value => {
           // this.filterCenterData(value);
          });
          /// Ended to search the tests details by using test terms
        }

    ngOnInit(): void {
      this.CentreSpecialRateForm = this.formBuilder.group({
       ddlCentres: [''],
       ddlMappingType: [''],
       testPrrofile: [''],
       testProfileDiscount: [''],
       importRatesFileName: [''],
       filterCentreRates: [''],
       testAgreedRate: [''],
    });
    this.IsRecordFound=false;
    this.LoadAllCentres();

    }

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

}
