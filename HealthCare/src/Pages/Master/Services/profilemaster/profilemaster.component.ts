import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
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
[x: string]: any;
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


  
}
