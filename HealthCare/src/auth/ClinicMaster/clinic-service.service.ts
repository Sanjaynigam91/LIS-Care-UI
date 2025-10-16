import { Injectable } from '@angular/core';
import { environment } from '../../app/environments/environments';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
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

}
