import { Component, inject } from '@angular/core';
import { SampleCollectionService } from '../../../../auth/SampleCollection/sample-collection.service';
import { FormBuilder, FormGroup,ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { LoaderService } from '../../../../Interfaces/loader.service';
import { sampleCollectedAtResponse } from '../../../../Interfaces/SampleCollection/sampleCollectedAtResponse';
import { Observable } from 'rxjs';
import { ToastComponent } from "../../../Toaster/toast/toast.component";
import { LoaderComponent } from "../../../loader/loader.component";
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { ConfirmationDialogComponentComponent } from '../../../confirmation-dialog-component/confirmation-dialog-component.component';
import { ToastService } from '../../../../auth/Toaster/toast.service';
import { sampleCollectedRequest } from '../../../../Interfaces/SampleCollection/sampleCollectedRequest';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sample-collection-place',
  standalone: true,
  imports: [ToastComponent, LoaderComponent,MatIconModule,CommonModule,ReactiveFormsModule],
  templateUrl: './sample-collection-place.component.html',
  styleUrl: './sample-collection-place.component.css'
})
export class SampleCollectionPlaceComponent {
  [x: string]: any;
  loading$: any;
  partnerId: string |any;
  router  =  inject(Router);
  SampleCollectionPlaceForm!: FormGroup;
  samplePlaceList: Observable<sampleCollectedAtResponse>| any;
  p: number = 1; // current page
  totalItems: number =0; // total number of items, for example
  itemsPerPage: number = 10; // items per page
  sampleColectionPlace:sampleCollectedRequest={
    partnerId:'',
    sampleColletedPlace:'',
    updatedBy:''
  }
  

  constructor(private sampleService: SampleCollectionService,private formBuilder: FormBuilder,
    public dialog: MatDialog,private loaderService: LoaderService,private toasterService: ToastService){
      this.loading$ = this.loaderService.loading$;
      this.partnerId= localStorage.getItem('partnerId');
    }

    ngOnInit(): void{
      debugger;
      this.loaderService.show();

      /// Used for to get the all user list from API
      this.sampleService.GetSampleCollectionById(this.partnerId).subscribe((response:any)=>{
        debugger;
       this.samplePlaceList = response.data; 
       this.totalItems=response.data.length;
       console.log(response);
       this.loaderService.hide();
      },err=>{
        console.log(err);
        this.loaderService.hide();
      }) 

      this.SampleCollectionPlaceForm = this.formBuilder.group({
        PlaceName: ['']
      });
  
      
     }


     onSubmit():void{
      debugger;
      if(this.SampleCollectionPlaceForm.value.PlaceName==''){
        this.toasterService.showToast('Please enter sample cpllected place name.', 'error');
      }
      else{
          this.sampleColectionPlace.sampleColletedPlace=this.SampleCollectionPlaceForm.value.PlaceName;
          this.sampleColectionPlace.partnerId=this.partnerId;
          this.sampleColectionPlace.updatedBy=this.partnerId;

          this.sampleService.saveSampeCollectedPlace(this.sampleColectionPlace)
    .subscribe({
      next: (response: any) => {
        debugger;
        if(response.statusCode==200 && response.status){
          debugger;
          console.log(response);
          this.toasterService.showToast('Sample Place has been added sucessfully ,Sample Collected Place!', 'success');
          this.ngOnInit();
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



     openConfirmationDialog(recordId:any): void {
      debugger;
      const dialogRef = this.dialog.open(ConfirmationDialogComponentComponent, {
        width: '250px',
        data: { message: 'Are you sure you want to delete this sample collection place name?',recordId:recordId}
      });
  
      dialogRef.afterClosed().subscribe(result => {
        debugger;
        this.loaderService.show();
        if (result.success) {
          debugger;
          this.sampleService.DeleteById(result.recordId,this.partnerId).subscribe((response:any)=>{
            debugger;
           if(response.status && response.statusCode==200){
            this.toasterService.showToast('Sample Collection Place has been deleted sucessfully,Sample Collected Place!', 'success');
            this.loaderService.hide();
            this.ngOnInit();
            
           }
           else{
            this.toasterService.showToast('Sample Collection Place deletion failed!', 'error');
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
