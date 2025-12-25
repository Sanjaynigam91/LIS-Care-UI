import { Injectable } from '@angular/core';
import { environment } from '../../app/environments/environments';
import { BehaviorSubject, delay, Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { TestSampleResponse } from '../../Interfaces/Patient/test-sample-response';
import { PatientResponse } from '../../Interfaces/Patient/patient-response';
import dayjs, { Dayjs } from 'dayjs';
import { PatientDetailResponse } from '../../Interfaces/Patient/patient-detail-response';

@Injectable({
  providedIn: 'root'
})
export class PatientService {
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

    /// used to get all sample 
     getAllSamples(partnerId: any,centerCode:any,projectCode:number,testCode:any,testApplicable:any): Observable<TestSampleResponse[]> {
          debugger;
          // Create HttpParams instance and append query parameters
          let params = new HttpParams()
          .set('partnerId', partnerId ?? '')
          .set('centerCode', centerCode ?? '')
          .set('projectCode', projectCode != null ? projectCode.toString() : '0')
          .set('testCode', testCode ?? '')
          .set('testApplicable', testApplicable ?? '');

           return this.httpClient.get<TestSampleResponse[]>(`${this.baseUrl}/GetAllTestSamples`, {params});
        }

  addUpdatePatientInformation(data:any){
    debugger;
   return this.httpClient.post(`${this.baseUrl}/PatientRegistration`, data).pipe(delay(1000));
  }

  addPatientTestDetails(data:any){
    debugger;
   return this.httpClient.post(`${this.baseUrl}/AddTestRequested`, data).pipe(delay(1000));
  }

 /// used to get all sample 

getPatientSummary(
  barcode: string | null,
  startDate: Dayjs | Date | string | null,
  endDate: Dayjs | Date | string | null,
  patientName: string | null,
  patientCode: string | null,
  centerCode: string | null,
  status: string | null,
  partnerId: string
): Observable<PatientResponse[]> {

  let params = new HttpParams();

  if (barcode) {
    params = params.set('barcode', barcode);
  }

  const start = this.formatDate(startDate);
  const end = this.formatDate(endDate);

  if (start) {
    params = params.set('startDate', start);
  }

  if (end) {
    params = params.set('endDate', end);
  }

  if (patientName) {
    params = params.set('patientName', patientName);
  }

  if (patientCode) {
    params = params.set('patientCode', patientCode);
  }

  if (centerCode) {
    params = params.set('centerCode', centerCode);
  }

  if (status) {
    params = params.set('status', status);
  }

  params = params.set('partnerId', partnerId);

  return this.httpClient.get<PatientResponse[]>(
    `${this.baseUrl}/GetPatientSummary`,
    { params }
  );
}



private formatDate(value: Dayjs | Date | string | null): string | null {
  if (!value) return null;

  // Dayjs
  if (dayjs.isDayjs(value)) {
    return value.format('YYYY-MM-DD');
  }

  // JavaScript Date
  if (value instanceof Date) {
    return dayjs(value).format('YYYY-MM-DD');
  }

  // String (already formatted)
  if (typeof value === 'string') {
    return value;
  }

  return null;
}

 /// used to get all sample 
     getPatientDetailsByPatientId(patientId: any): Observable<PatientDetailResponse[]> {
          debugger;
          // Create HttpParams instance and append query parameters
          let params = new HttpParams()
          .set('patientId', patientId ?? '');
           return this.httpClient.get<PatientDetailResponse[]>(`${this.baseUrl}/GetPatientDetailsByPatientId`, {params});
        }

  /// used to get all sample 
     getAllSelectedTestByPatientId(patientId: any,partnerId: any): Observable<TestSampleResponse[]> {
          debugger;
          // Create HttpParams instance and append query parameters
          let params = new HttpParams()
          .set('patientId', patientId ?? '')
          .set('partnerId', partnerId ?? '');
        
           return this.httpClient.get<TestSampleResponse[]>(`${this.baseUrl}/GetSelectedSamples`, {params});
        }     

deletePatientRequestedTest(patientId: any, testCode: any) {
  return this.httpClient.delete(
    `${this.baseUrl}/DeletePatientSampleTest`,
    {
      params: {
        patientId,
        testCode
      }
    }
  ).pipe(delay(1000));
}

getPatientReceipt(patientId: any,partnerId: any): Observable<Blob> {
  debugger;
  // Create HttpParams instance and append query parameters
  let params = new HttpParams()
  .set('patientId', patientId ?? '')
  .set('partnerId', partnerId ?? '');
  return this.httpClient.get(`${this.baseUrl}/GeneratePatientReceipt`, {
    params,
    responseType: 'blob'
  });
}


}

