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
import { CenterResponse } from '../../../../Interfaces/CenterMaster/CenterResponse';
import { CenterServiceService } from '../../../../auth/Center/center-service.service';
import { MatDialog } from '@angular/material/dialog';
import { LoaderService } from '../../../../Interfaces/loader.service';
import { ToastService } from '../../../../auth/Toaster/toast.service';
import { ClientService } from '../../../../auth/ClientMaster/client.service';
import { ClientResponse } from '../../../../Interfaces/ClientMaster/client-response';
import { ConfirmationDialogComponentComponent } from '../../../confirmation-dialog-component/confirmation-dialog-component.component';
import { PopupClientmastereditComponent } from '../../../PopUp/popup-clientmasteredit/popup-clientmasteredit.component';

@Component({
  selector: 'app-client-master',
  standalone: true,
  imports: [
    MatTableModule, MatPaginatorModule, CommonModule, MatCardModule,
    MatListModule, MatIconModule, MatButtonModule, NgxDatatableModule,
    MatSortModule, MatFormFieldModule, MatInputModule, NgxPaginationModule,
    ReactiveFormsModule, LoaderComponent, A11yModule
  ],
  templateUrl: './client-master.component.html',
  styleUrls: ['./client-master.component.css']   // ✅ corrected
})

export class ClientMasterComponent {
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
    searchClientForm!: FormGroup;
    ClientForm!:FormGroup;
    centerApiResponse:Observable<CenterResponse>| any;
    filteredData: any[] = []; // Data array for the table
    clientStatus:string|any;
    searchBy:string|any;
    centerCode:string|any;
    clientApiResponse:Observable<ClientResponse>|any;

     constructor(private centerService: CenterServiceService,private formBuilder: FormBuilder,
       public dialog: MatDialog,private loaderService: LoaderService,private toasterService: ToastService,
       private clientService:ClientService){
         this.loading$ = this.loaderService.loading$;
         this.partnerId= localStorage.getItem('partnerId');
       }

         /// Initialize the component and load all centers
  ngOnInit(): void {
     this.ClientForm=this.formBuilder.group({
      ddlCenter:[''],
      SeachDrNameOrMobileNumber:[''],
      ddlClientStatus:[''],
     });

      this.searchClientForm = this.formBuilder.group({
      filterClients: ['']
    });

       // ✅ Subscribe after form initialized
  this.searchClientForm.get('filterClients')?.valueChanges.subscribe(value => {
   this.filterClientData(value);
  });

   this.LoadAllCentres();
   this.LoadClients();
  }

        /// used to load all the centers based on the search criteria
    LoadAllCentres(){
    this.loaderService.show();
    this.centerStatus='';
    this.SeachByNameOrCode='';
    this.centerService.getAllCenters(this.partnerId,this.centerStatus,this.SeachByNameOrCode).subscribe({
      next: (response: any) => {
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
    LoadClients(){
    this.loaderService.show();
    this.clientStatus = this.ClientForm?.value?.ddlClientStatus ?? '';
    this.searchBy = this.ClientForm?.value?.SeachDrNameOrMobileNumber ?? '';
    this.centerCode = this.ClientForm?.value?.ddlCenter ?? '';
    this.clientService.getAllClients(this.clientStatus,this.partnerId,this.searchBy,this.centerCode).subscribe({
      next: (response: any) => {
        if (response?.status && response?.statusCode === 200) {
          this.clientApiResponse = response.data; 
          this.IsNoRecordFound = false;
          this.IsRecordFound=true;
          console.log(this.clientApiResponse);
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
  debugger;
    this.LoadClients();
  }

    filterClientData(term: string) {  
    this.filteredData = this.clientApiResponse.filter((item: {
      clientType: any;clientName: any; centerName:any;speciality:any;mobileNumber:any;licenseNumber:any;
    }) => 
      item.clientType.toLowerCase().includes(term.toLowerCase()) ||
      item.clientName.toLowerCase().includes(term.toLowerCase()) ||
      item.centerName.toLowerCase().includes(term.toLowerCase()) ||
      item.speciality.toLowerCase().includes(term.toLowerCase()) ||
      (item.mobileNumber ?? '').toString().toLowerCase().includes(term.toLowerCase()) ||
      item.licenseNumber.toLowerCase().includes(term.toLowerCase()) 
     );
    this.clientApiResponse= this.filteredData;
    if(term==""){
      this.ngOnInit();
    }
  }

  // Used to delete client by Id
    clientDeleteConfirmationDialog(clientId:any): void {
        const dialogRef = this.dialog.open(ConfirmationDialogComponentComponent, {
           width: 'auto',
           disableClose: true,  
          data: { message: 'Are you sure you want to delete this client?',clientId: clientId }
        });
    
        dialogRef.afterClosed().subscribe(result => {
          if (result.success) {
            this.clientService.deleteClientDetails(clientId,this.partnerId).subscribe((response:any)=>{
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

        /// Open Add New Client Master PopUp
            
            OpenAddClientMasterPopUp(): void {
              this.dialog.open(PopupClientmastereditComponent, {
                width: '1500px',           // slightly larger than medium
                maxWidth: '90vw',         // responsive on smaller screens
                height: 'auto',           // taller than medium but not full screen
                minHeight: '400px',       // ensures minimum height
                panelClass: 'large-dialog', // optional custom CSS
                disableClose: true,  
                data: {}                  // pass data if needed
              });
      
              this.dialog.afterAllClosed.subscribe(() => {
                this.ngOnInit(); // Refresh the list after the dialog is closed
              });
      
            }
      
            // View client details
             ViewClientDetails(clientId:string){
                  debugger;
                  this.dialog.open(PopupClientmastereditComponent, {
                   width: '1500px',           // slightly larger than medium
                    maxWidth: '90vw',         // responsive on smaller screens
                    height: 'auto',            // taller than medium but not full screen
                    minHeight: '400px',       // ensures minimum height
                    panelClass: 'large-dialog', // optional custom CSS
                    disableClose: true,  
                    data: {clientId:clientId},        // Pass data if needed   
                  });
      
                this.dialog.afterAllClosed.subscribe(() => {
                this.ngOnInit(); // Refresh the list after the dialog is closed
              });
            }


}
