import { Injectable } from '@angular/core';
import { environment } from '../../app/environments/environments';
import { BehaviorSubject, delay, Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { metadatalistresponse } from '../../Interfaces/metadatalistresponse';
import { EmployeeResponse } from '../../Interfaces/Employee/employee-response';

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
        
    
      /// used to get all employee departments
       getAllEmployeeDetails(empStatus:any,department:any,employeeName:any,partnerId: any): Observable<EmployeeResponse[]> {
          debugger;
          // Create HttpParams instance and append query parameters
           let params = new HttpParams()
            .set('empStatus', empStatus.toString())
            .set('department', department.toString())
            .set('employeeName', employeeName.toString())
            .set('partnerId', partnerId.toString());
           return this.httpClient.get<EmployeeResponse[]>(`${this.baseUrl}/GetAllEmployees`, {params});
        }
        
        deleteEmployeeDetails(employeeId:any,partnerId:any){
          debugger;
        // Create HttpParams instance and append query parameters
        let params = new HttpParams()
          .set('employeeId', employeeId)
          .set('partnerId', partnerId.toString());
        return this.httpClient.delete(`${this.baseUrl}/DeleteEmployee`, {params});
      }

      /// used to get employee by employee Id
       getEmployeeById(employeeId:any,partnerId:any): Observable<EmployeeResponse[]> {
          debugger;
          // Create HttpParams instance and append query parameters
           let params = new HttpParams()
            .set('employeeId', employeeId)
            .set('partnerId', partnerId.toString());
           return this.httpClient.get<EmployeeResponse[]>(`${this.baseUrl}/GetEmployeeById`, {params});
        }
       
    /// used to create new employee details
         addNewEmployee(data:any){
           debugger;
           return this.httpClient.post(`${this.baseUrl}/AddNewEmployee`, data).pipe(delay(1000));
         }
       /// used to update employee details
         updateEmployeeDetails(data: any) {
             console.log("Payload before sending:", data); // Debugging line to check the payload
             return this.httpClient.put(
               `${this.baseUrl}/UpdateEmployee`,
               data,
               {
                 headers: new HttpHeaders({ 'Content-Type': 'application/json' })
               }
             ).pipe(delay(1000));
           
           }     
  
}
