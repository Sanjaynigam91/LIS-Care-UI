import { Injectable } from '@angular/core';
import { environment } from '../../app/environments/environments';
import { BehaviorSubject, delay, Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { OutLabResponse } from '../../Interfaces/OutLab/out-lab-response';

@Injectable({
  providedIn: 'root'
})
export class OutLabService {
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

      /// used to get all out labs
       getAllOutlabs(labStatus:any,labname:any,labCode:any,partnerId: any): Observable<OutLabResponse[]> {
          debugger;
          // Create HttpParams instance and append query parameters
           let params = new HttpParams()
            .set('labStatus', labStatus.toString())
            .set('labname',labname.toString())
            .set('labCode',labCode.toString())
            .set('partnerId', partnerId.toString());
           return this.httpClient.get<OutLabResponse[]>(`${this.baseUrl}/GetAllOutLabs`, {params});
        }

        ///used to delete out lab details
      deleteOutLabDetails(labCode:any,partnerId:any){
            debugger;
          // Create HttpParams instance and append query parameters
          let params = new HttpParams()
            .set('labCode', labCode)
            .set('partnerId', partnerId.toString());
          return this.httpClient.delete(`${this.baseUrl}/DeleteOutLab`, {params});
          }
   
      /// used to create new out lab details
        addNewOutLab(data:any){
            debugger;
            return this.httpClient.post(`${this.baseUrl}/AddOutLab`, data).pipe(delay(1000));
          }
        /// used to update out lab details
          updateOutLabDetails(data: any) {
              console.log("Payload before sending:", data); // Debugging line to check the payload
              return this.httpClient.put(
                `${this.baseUrl}/UpdateOutLab`,
                data,
                {
                  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
                }
              ).pipe(delay(1000));
            
            }    

           /// used to get Out lab details by lab code
             getOutLabByLabCode(labCode:any,partnerId: any): Observable<OutLabResponse[]> {
              debugger;
              // Create HttpParams instance and append query parameters
               let params = new HttpParams()
                .set('labCode', labCode.toString())
                .set('partnerId', partnerId.toString());
               return this.httpClient.get<OutLabResponse[]>(`${this.baseUrl}/GetOutLabByLabCode`, {params});
            }
}
