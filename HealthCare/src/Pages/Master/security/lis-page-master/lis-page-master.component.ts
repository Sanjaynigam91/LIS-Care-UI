import { Component, OnDestroy, OnInit } from '@angular/core';
import { LisroleService } from '../../../../auth/Role/lisrole.service';
import { LisPageResponseModel } from '../../../../Interfaces/Role/LisPageResponseModel';
import { Observable,Subscription } from 'rxjs';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { LoaderComponent } from '../../../loader/loader.component';
import { ConfirmationDialogComponentComponent } from '../../../confirmation-dialog-component/confirmation-dialog-component.component';
import { ToastComponent } from '../../../Toaster/toast/toast.component';
import { PageEntityModel } from '../../../../Interfaces/Role/PageEntityModel';
import { LisCareCriteriaModel } from '../../../../Interfaces/Role/LisCareCriteriaModel';
import { AddLisPageComponent } from '../../../PopUp/add-lis-page/add-lis-page.component';
import { MatDialog } from '@angular/material/dialog';
import { LoaderService } from '../../../../Interfaces/loader.service';
import { RefreshPageService } from '../../../../auth/Shared/refresh-page.service';
import { LisPageSearchRequestModel } from '../../../../Interfaces/Role/LisPageSearchRequestModel';

@Component({
  selector: 'app-lis-page-master',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, CommonModule, MatCardModule,
    MatListModule, MatIconModule, MatButtonModule, NgxDatatableModule, MatSortModule,
    MatFormFieldModule, MatInputModule, MatSort, NgxPaginationModule,
    ReactiveFormsModule, LoaderComponent, ConfirmationDialogComponentComponent, ToastComponent],
  templateUrl: './lis-page-master.component.html',
  styleUrl: './lis-page-master.component.css'
})
export class LisPageMasterComponent implements OnInit, OnDestroy {
  partnerId: string |any;
  lisPageResponse:Observable<LisPageResponseModel>| any;
  p: number = 1; // current page
  totalItems: number =0; // total number of items, for example
  itemsPerPage: number = 10; // items per page
  
  sortColumn = '';
  sortDirection = 'asc';
  // Filter criteria
  filterTerm: string = '';
  searchForm!: FormGroup;
  lisPageForm!: FormGroup<any>;
  filteredData: any[] = []; // Data array for the table
  lisPageEntityModel:Observable<PageEntityModel>| any;
  lisCareCriteriaModel:Observable<LisCareCriteriaModel>| any;
  pageResponse:Observable<LisPageResponseModel>| any;
  private refreshSubscription!: Subscription;
  lisPageSearchRequestModel:LisPageSearchRequestModel={
    criteria: '',
    pageEntity: '',
    pageName: '',
    partnerId: ''
  }
  ishasDataList=false;
  isNoDataList=false;
  constructor(private lisRoleService:LisroleService,private formBuilder: FormBuilder,
    public dialog: MatDialog,private toasterService:LoaderService,
    private refPageService:RefreshPageService,private loaderService:LoaderService
  ){
    this.loaderService.hide();
    this.partnerId= localStorage.getItem('partnerId');
    this.searchForm=this.formBuilder.group({
      filterTerm: ['']
    })
    this.searchForm.get('filterTerm')?.valueChanges.subscribe(value => {
      this.filterData(value);
    });
  }
  ngOnDestroy(): void {
    // Unsubscribe to prevent memory leaks
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }

  ngOnInit():void{
    debugger;
    this.loaderService.show();
     // Subscribe to the refreshNeeded observable
     this.refreshSubscription = this.refPageService.refreshNeeded$.subscribe(() => {
      this.refreshData();
    });
    this.lisPageForm = this.formBuilder.group({
      ddlPageEntity:[''],
      ddlCriteria:[''],
      pageName:['']
    });
    this.getAllPageEnities(this.partnerId);
    this.getAllCriteria();
    this.getAllLisPages(this.partnerId);
    this.loaderService.hide();
  }

  refreshData() {
    this.getAllLisPages(this.partnerId);
  }


  getAllLisPages(partnerId:any){
   debugger;
   this.lisRoleService.getAllLisPageList(partnerId).subscribe((response:any)=>{
    debugger;
    if(response.data.length>0){
      this.lisPageResponse = response.data; 
      this.ishasDataList=true;
    }
    else{
      this.ishasDataList=false;
      this.isNoDataList=true;
    }
  
   console.log(response);
  }) 
  }

  getAllPageEnities(partnerId:any){
    debugger;
    this.lisRoleService.getAllPageEntities(partnerId).subscribe((response:any)=>{
     debugger;
    this.lisPageEntityModel = response.data; 
    console.log(response);
   }) 
   }

   getAllCriteria(){
    debugger;
    this.lisRoleService.getAllCriteria().subscribe((response:any)=>{
     debugger;
    this.lisCareCriteriaModel = response.data; 
   
    console.log(response);
   }) 
   }
   
  filterData(term: string) {
    debugger;
    this.filteredData = this.lisPageResponse.filter((item: {
      partnerId: any;
      isActive: any;
      criteria: any;
      pageEntity: any;
      pageName: any;    
    }) => 
      item.pageName.includes(term.toLowerCase()) 
      // item.pageEntity.includes(term.toLowerCase()) ||
      // item.criteria.includes(term.toLowerCase()) ||
      // item.isActive.includes(term.toLowerCase()) ||
      // item.partnerId.toLowerCase().includes(term.toLowerCase())
    
     );
     debugger;
    this.lisPageResponse= this.filteredData;
    if(term==""){
      this.ngOnInit();
    }
  }

  sortTable(column: string) {
    debugger;
    this.sortDirection = this.sortColumn === column ? (this.sortDirection === 'asc' ? 'desc' : 'asc') : 'asc';
    this.sortColumn = column;
    this.lisPageResponse = this.lisPageResponse.sort((a: { [x: string]: any; }, b: { [x: string]: any; }) => {
     debugger;
      const valueA = a[column];
      const valueB = b[column];
      
      if (valueA < valueB) return this.sortDirection === 'asc' ? -1 : 1;
      if (valueA > valueB) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }

  OpenAddPagePopUp(): void {
    debugger;
    this.dialog.open(AddLisPageComponent, {
      width: '5000px',// Customize width
      data: {}        // Pass data if needed
    });
  }


  ViewPageDetails(pageId:string){
    debugger;
    this.dialog.open(AddLisPageComponent, {
      width: '5000px',// Customize width
      data: {pageId:pageId}        // Pass data if needed
    });
  }

  openConfirmationDialog(pageId:string): void {
    debugger;
    const dialogRef = this.dialog.open(ConfirmationDialogComponentComponent, {
      width: '250px',
      data: { message: 'Are you sure you want to delete this page?',pageId: pageId }
    });

    dialogRef.afterClosed().subscribe(result => {
      debugger;
      if (result.success) {
        debugger;
        this.lisRoleService.DeletePageByPageId(result.pageId).subscribe((response:any)=>{
          debugger;
         if(response.status && response.statusCode==200){
          this.getAllLisPages(this.partnerId);
          this.toasterService.showToast('Page deleted successfully!', 'success');
         }
         else{
          this.toasterService.showToast('Page deletion failed!', 'error');
         }
         console.log(response);
        }) 
        console.log('Returned Page ID:', result.pageId);
        console.log('Page Deletion confirmed the action.');
      } else {
        debugger;
        // User clicked 'Cancel'
        console.log('Page Deletion canceled the action.');
      }
    });
  }   
  
  onSearch(){
    debugger;
    this.loaderService.show();
    this.lisPageSearchRequestModel.partnerId=this.partnerId;
    this.lisPageSearchRequestModel.criteria=this.lisPageForm.value.ddlCriteria;
    this.lisPageSearchRequestModel.pageEntity=this.lisPageForm.value.ddlPageEntity;
    this.lisPageSearchRequestModel.pageName=this.lisPageForm.value.pageName;
    this.lisRoleService.SearchLisPages(this.lisPageSearchRequestModel).subscribe((response:any)=>{
      debugger;
     if(response.status && response.statusCode==200) {
      debugger;
      if(response.data.length>0){
        this.ishasDataList=true;
        this.isNoDataList=false;
        this.lisPageResponse = response.data; 
        this.totalItems=response.data.length;
      }
      else{
        this.ishasDataList=false;
        this.isNoDataList=true;
      }
      console.log(response);
     }
     else{
      console.log("No Record! Found");
     }
     this.loaderService.hide();
    },err=>{
      console.log(err);
      this.loaderService.hide();
    }) 
  }
}
