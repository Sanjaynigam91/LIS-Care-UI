import { Injectable } from '@angular/core';
import { environment } from '../../app/environments/environments';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { metadatalistresponse } from '../../Interfaces/metadatalistresponse';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
   [x: string]: any;
      private baseUrl :string=environment.apiUrl;
      private currentUserSubject = new BehaviorSubject<string | null>(null);
      currentUser$ = this.currentUserSubject.asObservable();
      constructor(private httpClient: HttpClient) {  
        // Initialize the current user from local storage if available
        const partnerId= localStorage.getItem('partnerId');
        const storedUsername = localStorage.getItem('username');
        if (storedUsername) {
          this.currentUserSubject.next(storedUsername);
        } 
      } 

/// used to get all employee departments
       getAllEmployeeDepartments(category:any,partnerId: any): Observable<metadatalistresponse[]> {
          debugger;
          // Create HttpParams instance and append query parameters
           let params = new HttpParams()
            .set('category', category.toString())
            .set('partnerId', partnerId.toString());
           return this.httpClient.get<metadatalistresponse[]>(`${this.baseUrl}/GetEmployeeDepartment`, {params});
        }      
  
}
