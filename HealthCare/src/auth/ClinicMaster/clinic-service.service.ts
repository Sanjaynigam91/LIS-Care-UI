import { Injectable } from '@angular/core';
import { environment } from '../../app/environments/environments';
import { BehaviorSubject, delay, Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ClinicResponse } from '../../Interfaces/ClinicMaster/clinic-response';

@Injectable({
  providedIn: 'root'
})
export class ClinicServiceService {

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


    /// used to get all clinics
      getAllClinics(partnerId: any,centerCode:any,clinicStatus:any,searchBy:any): Observable<ClinicResponse[]> {
          debugger;
          // Create HttpParams instance and append query parameters
           let params = new HttpParams()
            .set('partnerId', partnerId.toString())
            .set('centerCode',centerCode)
            .set('clinicStatus', clinicStatus.toString())
            .set('searchBy',searchBy.toString());
           return this.httpClient.get<ClinicResponse[]>(`${this.baseUrl}/GetAllClinics`, {params});
        }

    /// used to get clinic by Id
       getClinicById(clinicId:number,partnerId: any): Observable<ClinicResponse[]> {
          debugger;
          // Create HttpParams instance and append query parameters
           let params = new HttpParams()
            .set('clinicId',clinicId)
            .set('partnerId', partnerId.toString());
           return this.httpClient.get<ClinicResponse[]>(`${this.baseUrl}/GetClinicById`, {params});
        }

   /// used to create new clinic
        addNewClinic(data:any){
          debugger;
          return this.httpClient.post(`${this.baseUrl}/AddNewClinic`, data).pipe(delay(1000));
        }
      /// used to update center details
        updateClinicDetails(data: any) {
            console.log("Payload before sending:", data); // Debugging line to check the payload
            return this.httpClient.put(
              `${this.baseUrl}/UpdateClinic`,
              data,
              {
                headers: new HttpHeaders({ 'Content-Type': 'application/json' })
              }
            ).pipe(delay(1000));
          
          }
  
        deleteClinicDetails(clinicId:number,partnerId:any){
          debugger;
        // Create HttpParams instance and append query parameters
        let params = new HttpParams()
          .set('clinicId', clinicId)
          .set('partnerId', partnerId.toString());
        return this.httpClient.delete(`${this.baseUrl}/DeleteClinic`, {params});
        }          

}
