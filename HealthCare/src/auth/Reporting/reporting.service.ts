import { Injectable } from '@angular/core';
import { environment } from '../../app/environments/environments';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { PendingPatientResponse } from '../../Interfaces/Reporting/pending-patient-response';

@Injectable({
  providedIn: 'root'
})
export class ReportingService {

  [x: string]: any;
   private baseUrl :string=environment.apiUrl;
   private currentUserSubject = new BehaviorSubject<string | null>(null);
   currentUser$ = this.currentUserSubject.asObservable();
   constructor(private httpClient: HttpClient) {  
     // Initialize the current user from local storage if available
     const partnerId= localStorage.getItem('partnerId');
     const storedUsername = localStorage.getItem('username');
     const jwtToken = localStorage.getItem('token');
     const BrearerToken = 'Bearer ' + jwtToken;
     if (storedUsername) {
       this.currentUserSubject.next(storedUsername);
     } 
   }

 /// used to get pending patients for report entry  

RetrievePendingPatients(
  partnerId: any,
  startDate: any,
  endDate: any,
  barcode: any,
  department: any,
  patientName: any,
  centerCode: any,
  reportStatus: any
): Observable<PendingPatientResponse[]> {
debugger;
  let params = new HttpParams()
    .set('partnerId', partnerId)
    .set('startDate', startDate)
    .set('endDate', endDate)
    .set('reportStatus', reportStatus);

  // ✅ Add optional params ONLY if they have value
  if (barcode) {
    params = params.set('barcode', barcode);
  }

  if (department) {
    params = params.set('department', department);
  }

  if (patientName) {
    params = params.set('patientName', patientName);
  }

  if (centerCode) {
    params = params.set('centerCode', centerCode);
  }

  const token = localStorage.getItem('token');

  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`
  });

  return this.httpClient.get<PendingPatientResponse[]>(
    `${this.baseUrl}/RetrievePendingPatients`,
    { params, headers }
  );
}

   
}
