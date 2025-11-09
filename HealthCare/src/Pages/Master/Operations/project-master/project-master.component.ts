import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
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
import { finalize, Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { LoaderService } from '../../../../Interfaces/loader.service';
import { ToastService } from '../../../../auth/Toaster/toast.service';
import { ProjectResponse } from '../../../../Interfaces/Projects/project-response';
import { ProjectService } from '../../../../auth/ProjectMaster/project.service';
import { ConfirmationDialogComponentComponent } from '../../../confirmation-dialog-component/confirmation-dialog-component.component';
import { PopupProjecteditComponent } from '../../../PopUp/popup-projectedit/popup-projectedit.component';

@Component({
  selector: 'app-project-master',
  standalone: true,
 imports: [MatTableModule, MatPaginatorModule, CommonModule, MatCardModule,
     MatListModule, MatIconModule, MatButtonModule, NgxDatatableModule, MatSortModule,
     MatFormFieldModule, MatInputModule, NgxPaginationModule,
     ReactiveFormsModule, LoaderComponent, A11yModule],
  templateUrl: './project-master.component.html',
  styleUrl: './project-master.component.css'
})
export class ProjectMasterComponent {
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
    searchProjectForm!: FormGroup;
    ProjectForm!:FormGroup;
    projectApiResponse:Observable<ProjectResponse>| any;
    filteredData: any[] = []; // Data array for the table


  constructor(private formBuilder: FormBuilder,
    public dialog: MatDialog,private loaderService: LoaderService,
    private toasterService: ToastService,
    private projectService:ProjectService){
      this.loading$ = this.loaderService.loading$;
      this.partnerId= localStorage.getItem('partnerId');
      /// Started to search the tests details by using test terms
      this.searchProjectForm=this.formBuilder.group({
        filterProjects: ['']
      })
      this.searchProjectForm.get('filterProjects')?.valueChanges.subscribe(value => {
        this.filterProjectData(value);
      });
      /// Ended to search the tests details by using test terms
    }


      ngOnInit(): void{
    debugger;
     this.ProjectForm = this.formBuilder.group({
      ddlProjectStatus: [''],
      SeachByName: [''],     
    });
    this.loggedInUserId=localStorage.getItem('userId');
    /// used to load and Serach the Project Data
    this.loadProjectData();
   }

   /// used to load and Serach the Project Data
   loadProjectData() {
  debugger;
  this.loaderService.show(); // ✅ Show loader at start

  this.centerStatus = this.ProjectForm.get('ddlProjectStatus')?.value;
  this.SeachByNameOrCode = this.ProjectForm.get('SeachByName')?.value;

  this.projectService
    .getAllProjects(this.partnerId, this.centerStatus, this.SeachByNameOrCode)
    .pipe(
      finalize(() => {
        // ✅ Always hide loader once API completes (success or error)
        this.loaderService.hide();
      })
    )
    .subscribe({
      next: (response: any) => {
        debugger;

        if (response?.status && response?.statusCode === 200) {
          this.projectApiResponse = response.data;
          this.IsNoRecordFound = false;
          this.IsRecordFound = true;
          console.log(this.projectApiResponse);
        } else {
          this.IsNoRecordFound = true;
          this.IsRecordFound = false;
          console.warn('No Record Found!');
        }
      },
      error: (err) => {
        this.IsNoRecordFound = true;
        this.IsRecordFound = false;
        console.error('Error while fetching profiles:', err);
      },
    });
}


   /// Filter the data based on the search term
   filterProjectData(term: string) {
    debugger;
    this.filteredData = this.projectApiResponse.filter((item: {
      projectName: any;contactPerson: any; contactNumber:any;email:any;
    }) => 
      item.projectName.toLowerCase().includes(term.toLowerCase()) ||
      item.contactPerson.toLowerCase().includes(term.toLowerCase()) ||
      item.contactNumber.toLowerCase().includes(term.toLowerCase()) ||
      item.email.toLowerCase().includes(term.toLowerCase()) 
     );
     debugger;
    this.projectApiResponse= this.filteredData;
    if(term==""){
      this.ngOnInit();
    }
  }

  projectDeleteConfirmationDialog(projectId:any): void {
        debugger;
        const dialogRef = this.dialog.open(ConfirmationDialogComponentComponent, {
           width: 'auto',
           disableClose: true,  
          data: { message: 'Are you sure you want to delete this Project?',projectId: projectId }
        });
    
        dialogRef.afterClosed().subscribe(result => {
          debugger;
          if (result.success) {
            debugger;
            this.projectService.deleteProjectDetails(projectId,this.partnerId).subscribe((response:any)=>{
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

 /// Open Add New Center Master PopUp
       
       OpenAddProjectMasterPopUp(): void {
         this.dialog.open(PopupProjecteditComponent, {
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
 
       // View center details
        ViewProjectDetails(projectId:string){
             debugger;
             this.dialog.open(PopupProjecteditComponent, {
              width: '1500px',           // slightly larger than medium
               maxWidth: '90vw',         // responsive on smaller screens
               height: 'auto',            // taller than medium but not full screen
               minHeight: '400px',       // ensures minimum height
               panelClass: 'large-dialog', // optional custom CSS
               disableClose: true,  
               data: {projectId:projectId},        // Pass data if needed   
             });
 
           this.dialog.afterAllClosed.subscribe(() => {
           this.ngOnInit(); // Refresh the list after the dialog is closed
         });
       } 

}
