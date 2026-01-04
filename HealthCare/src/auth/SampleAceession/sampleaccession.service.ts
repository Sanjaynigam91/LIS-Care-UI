import { Injectable } from '@angular/core';
import { environment } from '../../app/environments/environments';
import { BehaviorSubject, Observable } from 'rxjs';
import { PendingAccessionResponse } from '../../Interfaces/SampleAccession/pending-accession-response';
import { HttpClient, HttpParams } from '@angular/common/http';
import { SampleTypeResponse } from '../../Interfaces/SampleAccession/sample-type-response';
import { ApiResponse } from '../../Interfaces/apiResponse';
import { PatientInfoResponse } from '../../Interfaces/SampleAccession/patient-info-response';
import { SampleAccessionTestResponse } from '../../Interfaces/SampleAccession/sample-accession-test-response';

@Injectable({
  providedIn: 'root'
})
export class SampleaccessionService {

 private baseUrl :string=environment.apiUrl;
  pendingAccessionResponse: Observable<PendingAccessionResponse>| any;
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

private formatDateForApi(date: Date | null): string | null {
  if (!date) return null;
  return date.toISOString().split('T')[0]; // YYYY-MM-DD
}   

 getAllPendingSamplesForAccession(
  request: {
    startDate: any;
    endDate: any;
    barcode: any;
    centerCode: any;
    patientName: any;
    partnerId: any;
  }
): Observable<PendingAccessionResponse[]> {


  let params = new HttpParams()
  .set('startDate', this.formatDateForApi(request.startDate) ?? '')
  .set('endDate', this.formatDateForApi(request.endDate) ?? '')
  .set('barcode', request.barcode ?? '')
  .set('centerCode', request.centerCode ?? '')
  .set('patientName', request.patientName ?? '')
  .set('partnerId', request.partnerId);

  return this.httpClient.get<PendingAccessionResponse[]>(
    `${this.baseUrl}/GetAllSamplesForAccession`,
    { params }
  );
}

 getLastImported(
  request: {
    woeDate: any;
    partnerId: any;
  }
): Observable<ApiResponse[]> {
  let params = new HttpParams()
  .set('woeDate', this.formatDateForApi(request.woeDate) ?? '')
  .set('partnerId', request.partnerId);
  return this.httpClient.get<ApiResponse[]>(
    `${this.baseUrl}/GetLastImported`,
    { params }
  );
}


getSampleTypeByVisitId(
  visitId: any,
  partnerId: any
): Observable<ApiResponse> {

  return this.httpClient.get<ApiResponse>(
    `${this.baseUrl}/GetSampleTypeByVisitId`,
    {
      params: {
        visitId: visitId,
        partnerId: partnerId
      }
    }
  );
}



GetPatientInfoByVisitId(
  visitId: any,
  sampleType: any,
  partnerId: any
): Observable<PatientInfoResponse> {

  return this.httpClient.get<PatientInfoResponse>(
    `${this.baseUrl}/GetPatientInfoByBarcode`,
    {
      params: {
        visitId: visitId,
        sampleType: sampleType,
        partnerId: partnerId
      }
    }
  );
}

GetTestDetailsByVisitId(
  barcode: any,
  sampleType: any,
  partnerId: any
): Observable<SampleAccessionTestResponse> {

  return this.httpClient.get<SampleAccessionTestResponse>(
    `${this.baseUrl}/GetTestsByBarcode`,
    {
      params: {
        barcode: barcode,
        sampleType: sampleType,
        partnerId: partnerId
      }
    }
  );
}
}
