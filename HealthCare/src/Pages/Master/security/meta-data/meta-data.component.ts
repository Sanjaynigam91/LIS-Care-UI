import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { MatTableModule, } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import {MatSort, MatSortModule, Sort} from '@angular/material/sort';
import { CommonModule } from '@angular/common';
import {MatCardModule} from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NgxPaginationModule } from 'ngx-pagination';
import { ConfirmationDialogComponentComponent } from '../../../confirmation-dialog-component/confirmation-dialog-component.component';
import { metadataresponse } from '../../../../Interfaces/metadataresponse';
import { MetadataService } from '../../../../auth/metadata.service';
import { metadatalistresponse } from '../../../../Interfaces/metadatalistresponse';
import { ToastService } from '../../../../auth/Toaster/toast.service';
import { MasterListRequest } from '../../../../Interfaces/MasterListRequest';
import { LoaderService } from '../../../../Interfaces/loader.service';
import { LoaderComponent } from "../../../loader/loader.component";
import { ToastComponent } from "../../../Toaster/toast/toast.component";
import { DesignDialogComponent } from '../../../PopUp/design-dialog/design-dialog.component';
import { RefreshPageService } from '../../../../auth/Shared/refresh-page.service';


@Component({
  selector: 'app-meta-data',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, CommonModule, MatCardModule,
    MatListModule, MatIconModule, MatButtonModule, NgxDatatableModule, MatSortModule,
    MatFormFieldModule, MatInputModule, MatSort, NgxPaginationModule,
    ReactiveFormsModule, ConfirmationDialogComponentComponent, ReactiveFormsModule, LoaderComponent, ToastComponent],
  templateUrl: './meta-data.component.html',
  styleUrl: './meta-data.component.css'
})
export class MetaDataComponent {
  router  =  inject(Router);
  p: number = 1; // current page
  items: any[] = []; // your items array
  totalItems: number = 100; // total number of items, for example
  itemsPerPage: number = 10; // items per page
  loading$!: Observable<boolean>;
  partnerId: string |any;
  category:string |any;
  loggedInUserId: string |any;
  metaTags: Observable<metadataresponse>| any;
  metaTagsList: Observable<metadatalistresponse>| any;
  isMetaDataListVisible:boolean=false;
  

  sortColumn = '';
  sortDirection = 'asc';
  // Filter criteria
  filterTerm: string = '';
  metaDataForm!: FormGroup;
  metaListForm!:FormGroup;
  filteredData: any[] = []; // Data array for the table
  masterListRequest:MasterListRequest={
    categoryCode: '',
    itemType: '',
    itemDescription: '',
    partnerId: ''
  }
  private refreshSubscription!: Subscription;
  constructor(private metaService:MetadataService,
    private formBuilder: FormBuilder,public dialog: MatDialog, 
    private toasterService: ToastService,private loaderService: LoaderService,
    private refPageService:RefreshPageService
  ) {
    this.loading$ = this.loaderService.loading$;
    this.partnerId= localStorage.getItem('partnerId');
    this.metaDataForm=this.formBuilder.group({
      filterTerm: ['']
    })
   
  }

  ngOnInit(): void{
    debugger;
    this.loaderService.show();
       // Subscribe to the refreshNeeded observable
       this.refreshSubscription = this.refPageService.refreshNeeded$.subscribe(() => {
        this.refreshData();
      });
    this.metaListForm = this.formBuilder.group({
      categoryCode: [''],
      itemType: [''],
      itemDescription: [''],
      partnerId:['']
    });

    this.isMetaDataListVisible=false;
    this.loggedInUserId=localStorage.getItem('userId');
    /// Used for to get the all meta tags from API
    this.metaService.getAllMetaTags(this.partnerId).subscribe((response:any)=>{
      debugger;
     this.metaTags = response.data; 
     this.totalItems=response.data.length;
     console.log(response);
    },err=>{
      console.log(err);
    }) 
    this.loaderService.hide();
   }

   refreshData(){
    this.metaService.getAllMetaTags(this.partnerId).subscribe((response:any)=>{
      debugger;
     this.metaTags = response.data; 
     this.totalItems=response.data.length;
     console.log(response);
    },err=>{
      console.log(err);
    }) 
   }

  sortTable(column: string) {
    debugger;
    this.sortDirection = this.sortColumn === column ? (this.sortDirection === 'asc' ? 'desc' : 'asc') : 'asc';
    this.sortColumn = column;
    this.metaTags = this.metaTags.sort((a: { [x: string]: any; }, b: { [x: string]: any; }) => {
     debugger;
      const valueA = a[column];
      const valueB = b[column];
      
      if (valueA < valueB) return this.sortDirection === 'asc' ? -1 : 1;
      if (valueA > valueB) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }


  GetTagMasterList(category:any){
  debugger;
  this.loaderService.show();
    localStorage.setItem('categoryCode', category);
    this.metaService.getAllMetaTagList(category,this.partnerId).subscribe((response:any)=>{
      debugger;
     this.metaTagsList = response.data; 
    //  this.totalItems=response.data.length;
     console.log(response);
    },err=>{
      console.log(err);
    }) 
    this.isMetaDataListVisible=true;
    this.loaderService.hide();
  }

  
  CreateMasterLst():void{
    debugger;
    this.loaderService.show();
    this.category=localStorage.getItem('categoryCode');
    if(this.metaListForm.value.itemType==''){
      this.toasterService.showToast('Please enter tag type!', 'error');
      this.loaderService.hide();
    }
    else if(this.metaListForm.value.itemDescription==''){
      this.toasterService.showToast('Please enter tag description!', 'error');
      this.loaderService.hide();
    }
    else{
      this.masterListRequest.categoryCode= this.category; 
      this.masterListRequest.itemType=this.metaListForm.value.itemType;
      this.masterListRequest.itemDescription=this.metaListForm.value.itemDescription;
      this.masterListRequest.partnerId=this.partnerId;
      this.metaService.createNewMasterLst(this.masterListRequest)
      .subscribe({
        next: (response: any) => {
          debugger;
          if(response.statusCode==200 && response.status){
            debugger;
            console.log(response);
            this.toasterService.showToast('New master list careted successfully!', 'success');
            this.GetTagMasterList(this.category)
            this.metaListForm = this.formBuilder.group({
              categoryCode: [''],
              itemType: [''],
              itemDescription: [''],
              partnerId:['']
            });
          }
          else{
            debugger;
            console.log(response.message);
          }
          
        },
        error: (err) => console.log(err)
      });
    }
   
   
  }

  AddMetaTagPopUp(): void {
    debugger;
    this.isMetaDataListVisible=false;
    this.loaderService.hide();
    this.dialog.open(DesignDialogComponent, {
      width: '5000px',// Customize width
      data: {}        // Pass data if needed
    });
  }
  
  ViewMetaTag(tagId:any): void {
    debugger;
    this.isMetaDataListVisible=false;
    this.loaderService.hide();
    this.dialog.open(DesignDialogComponent, {
      width: '5000px',// Customize width
      data: {tagId:tagId}        // Pass data if needed
    });
  }

  openConfirmationDialog(recordId:any): void {
    debugger;
    const dialogRef = this.dialog.open(ConfirmationDialogComponentComponent, {
      width: '250px',
      data: { message: 'Are you sure you want to delete this meta tag?',recordId:recordId}
    });

    dialogRef.afterClosed().subscribe(result => {
      debugger;
      this.loaderService.show();
      if (result.success) {
        debugger;
        this.metaService.DeleteByRecordId(result.recordId).subscribe((response:any)=>{
          debugger;
         if(response.status && response.statusCode==200){
          this.toasterService.showToast('Master list deleted successfully!', 'success');
          this.loaderService.hide();
          this.GetTagMasterList(this.category);
          this.metaListForm = this.formBuilder.group({
            categoryCode: [''],
            itemType: [''],
            itemDescription: [''],
            partnerId:['']
          });
         }
         else{
          this.toasterService.showToast('User deletion failed!', 'error');
         }
         console.log(response);
        }) 
        console.log('Delete action confirmed.');
        this.loaderService.hide();
      } else {
        debugger;
        // User clicked 'Cancel'
        console.log('Delete action cancled.');
        this.loaderService.hide();
      }
    });
  }
}
