import { Component } from '@angular/core';
import { SampleCollectionService } from '../../../../auth/SampleCollection/sample-collection.service';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { LoaderService } from '../../../../Interfaces/loader.service';
import { sampleCollectedAtResponse } from '../../../../Interfaces/SampleCollection/sampleCollectedAtResponse';
import { Observable } from 'rxjs';
import { ToastComponent } from "../../../Toaster/toast/toast.component";
import { LoaderComponent } from "../../../loader/loader.component";
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { ConfirmationDialogComponentComponent } from '../../../confirmation-dialog-component/confirmation-dialog-component.component';

@Component({
  selector: 'app-sample-collection-place',
  standalone: true,
  imports: [ToastComponent, LoaderComponent,MatIconModule,CommonModule],
  templateUrl: './sample-collection-place.component.html',
  styleUrl: './sample-collection-place.component.css'
})
export class SampleCollectionPlaceComponent {
  loading$: any;
  partnerId: string |any;
  samplePlaceList: Observable<sampleCollectedAtResponse>| any;
  p: number = 1; // current page
  totalItems: number =0; // total number of items, for example
  itemsPerPage: number = 10; // items per page

  constructor(private sampleService: SampleCollectionService,private formBuilder: FormBuilder,
    public dialog: MatDialog,private loaderService: LoaderService){
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
          // this.metaService.DeleteByRecordId(result.recordId).subscribe((response:any)=>{
          //   debugger;
          //  if(response.status && response.statusCode==200){
          //   this.toasterService.showToast('Master list deleted successfully!', 'success');
          //   this.loaderService.hide();
          //   this.GetTagMasterList(this.category);
          //   this.metaListForm = this.formBuilder.group({
          //     categoryCode: [''],
          //     itemType: [''],
          //     itemDescription: [''],
          //     partnerId:['']
          //   });
          //  }
          //  else{
          //   this.toasterService.showToast('User deletion failed!', 'error');
          //  }
          //  console.log(response);
          // }) 
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
