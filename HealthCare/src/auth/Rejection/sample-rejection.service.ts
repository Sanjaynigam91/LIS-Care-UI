import { Injectable } from '@angular/core';
import { environment } from '../../app/environments/environments';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { delay } from 'rxjs/internal/operators/delay';
import { Dayjs } from 'dayjs';
import { Observable } from 'rxjs';
import { RejectedSampleResponse } from '../../Interfaces/Patient/rejected-sample-response';


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

/// used to get all sample rejections
getRejectionSummary(
  partnerId: string,
  barcode: string | null,
  startDate: Dayjs | Date | string | null,
  endDate: Dayjs | Date | string | null,
  patientNameOrCode: string | null,
  centerCode: string | null
): Observable<RejectedSampleResponse> {

  let params = new HttpParams();

  params = params.set('partnerId', partnerId);

 const start = this.formatDate(startDate);
 const end = this.formatDate(endDate);

  if (start) {
    params = params.set('startDate', start);
  }

  if (end) {
    params = params.set('endDate', end);
  }

  if (barcode) {
    params = params.set('barcode', barcode);
  }

  if (patientNameOrCode) {
    params = params.set('patientNameOrCode', patientNameOrCode);
  }

  if (centerCode) {
    params = params.set('centerCode', centerCode);
  }

  return this.httpClient.get<RejectedSampleResponse>(
    `${this.baseUrl}/GetRejectedSamples`,
    { params }
  );
}

private formatDate(
  date: Dayjs | Date | string | null
): string | null {

  if (!date) {
    return null;
  }

  if (typeof date === 'string') {
    return date;
  }

  if (date instanceof Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  // Dayjs
  return date.format('YYYY-MM-DD');
}

}
