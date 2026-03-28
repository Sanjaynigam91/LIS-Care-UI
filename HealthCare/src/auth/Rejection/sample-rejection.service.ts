import { Injectable } from '@angular/core';
import { environment } from '../../app/environments/environments';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { delay } from 'rxjs/internal/operators/delay';


@Injectable({
  providedIn: 'root'
})
export class SampleRejectionService {
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

  /// used to update Sample Rejection details
updateSampleRejectionDetails(data: any) {
  debugger;
  const token = localStorage.getItem('token');

  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  });

  const params = {
    patientSpecimenId: data.patientSpecimenId,
    testCode: data.testCode,
    rejectionReason: data.rejectionReason,
    rejectedBy: data.rejectedBy,
    partnerId: data.partnerId
  };

  return this.httpClient.put(
    `${this.baseUrl}/RejectTestBeforeAccession`,
    null,   // ❗ NO BODY
    { headers, params }
  );
}    

}
