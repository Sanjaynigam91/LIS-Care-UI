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
import { AnalyzerResponse } from '../../../../Interfaces/AnalyzerMaster/AnalyzerResponse';
import { AnalyzerService } from '../../../../auth/AnalyzerService/analyzer.service';

@Component({
  selector: 'app-analyzermaster',
  standalone: true,
imports: [MatTableModule, MatPaginatorModule, CommonModule, MatCardModule,
      MatListModule, MatIconModule, MatButtonModule, NgxDatatableModule, MatSortModule,
      MatFormFieldModule, MatInputModule, NgxPaginationModule,
      ReactiveFormsModule, LoaderComponent],
  templateUrl: './analyzermaster.component.html',
  styleUrl: './analyzermaster.component.css'
})


export class AnalyzermasterComponent {
  router  =  inject(Router);

  loading$!: Observable<boolean>;
  partnerId: string |any;
  analyzerNameOrShortCode:string|any;
  analyzerStatus:string|any;
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
  searchAnalyzerForm!: FormGroup;
  AnalyzersForm!:FormGroup;
  analyzerApiResponse:Observable<AnalyzerResponse>| any;

  filteredData: any[] = []; // Data array for the table

   constructor(private analyzerService: AnalyzerService,private formBuilder: FormBuilder,
    public dialog: MatDialog,private loaderService: LoaderService,private toasterService: ToastService){
      this.loading$ = this.loaderService.loading$;
      this.partnerId= localStorage.getItem('partnerId');
      /// Started to search the tests details by using test terms
      this.searchAnalyzerForm=this.formBuilder.group({
        filterAnalyzer: ['']
      })
      this.searchAnalyzerForm.get('filterAnalyzer')?.valueChanges.subscribe(value => {
        this.filterAnalyzerData(value);
      });
      /// Ended to search the tests details by using test terms
    }

    ngOnInit(): void{
    debugger;
     this.AnalyzersForm = this.formBuilder.group({
      ddlAnalyzerStatus: [''],
      AnalyzerNameOrCode: [''],     
    });
    this.loggedInUserId=localStorage.getItem('userId');
    /// used to load and Serach the Test Data
    this.ReteriveAllAnalyzerRecords();
   }


    ReteriveAllAnalyzerRecords(){
    debugger;
    this.loaderService.show();
    this.analyzerNameOrShortCode='';
    this.analyzerStatus='';
    this.analyzerService.getAllAnalyzers(this.partnerId,this.analyzerNameOrShortCode,this.analyzerStatus).subscribe({
      next: (response: any) => {
        debugger;

        if (response?.status && response?.statusCode === 200) {
          this.analyzerApiResponse = response.data; 
          this.IsNoRecordFound = false;
          this.IsRecordFound = true;
          console.log(this.analyzerApiResponse);
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


    SearchAllAnalyzerRecords(){
    debugger;
    this.loaderService.show();
    this.analyzerStatus=this.AnalyzersForm.get('ddlAnalyzerStatus')?.value;
    this.analyzerNameOrShortCode=this.AnalyzersForm.get('AnalyzerNameOrCode')?.value;
    this.analyzerService.getAllAnalyzers(this.partnerId,this.analyzerNameOrShortCode,this.analyzerStatus).subscribe({
      next: (response: any) => {
        debugger;

        if (response?.status && response?.statusCode === 200) {
          this.analyzerApiResponse = response.data; 
          this.IsNoRecordFound = false;
          this.IsRecordFound = true;
          console.log(this.analyzerApiResponse);
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

   filterAnalyzerData(term: string) {
    debugger;
    
    this.filteredData = this.analyzerApiResponse.filter((item: {
      analyzerCode: any;analyzerName: any; supplierCode:any;assetCode:any;purchaseValue:any;
    }) => 
      item.analyzerCode.toLowerCase().includes(term.toLowerCase()) ||
      item.analyzerName.toLowerCase().includes(term.toLowerCase()) ||
      item.supplierCode.toLowerCase().includes(term.toLowerCase()) ||
      item.assetCode.toLowerCase().includes(term.toLowerCase()) ||
      (item.purchaseValue ?? '').toString().toLowerCase().includes(term.toLowerCase())  
     );
     debugger;
    this.analyzerApiResponse= this.filteredData;
    if(term==""){
      this.ngOnInit();
    }
  }

   analyzerDeleteConfirmationDialog(analyzerId:any): void {
    debugger;
    const dialogRef = this.dialog.open(ConfirmationDialogComponentComponent, {
      width: '250px',
      data: { message: 'Are you sure you want to delete this Analyzer?',analyzerId: analyzerId }
    });

    dialogRef.afterClosed().subscribe(result => {
      debugger;
      if (result.success) {
        debugger;
        // this.profileService.DeleteProfileByProfileCode(this.partnerId,result.profileCode).subscribe((response:any)=>{
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
