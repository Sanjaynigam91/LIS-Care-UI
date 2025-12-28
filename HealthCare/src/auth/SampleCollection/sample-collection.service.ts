import { Injectable } from '@angular/core';
import { environment } from '../../app/environments/environments';
import { sampleCollectedAtResponse } from '../../Interfaces/SampleCollection/sampleCollectedAtResponse';
import { BehaviorSubject, delay, Observable } from 'rxjs';
import { HttpClient,HttpParams } from '@angular/common/http';
import { SampleCollectionResponse } from '../../Interfaces/SampleCollection/sample-collection-response';
import { RequestedTest, SamplePendingCollectionResponse } from '../../Interfaces/SampleCollection/sample-pending-collection-response';

@Injectable({
  providedIn: 'root'
})
export class SampleCollectionService {

  private baseUrl :string=environment.apiUrl;
  sampleCollectionResponse: Observable<sampleCollectedAtResponse>| any;
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
   
   GetSampleCollectionById(partnerId:any):Observable<sampleCollectedAtResponse>{
    debugger;
    //const apiUrl = `${this.baseUrl}/GetUserById?userId=${userId}`;
    return this.httpClient.get<sampleCollectedAtResponse>(`${this.baseUrl}/GetSampleCollectedPlaces?partnerId=${partnerId}`).pipe(delay(1000));
  }

  saveSampeCollectedPlace(data:any){
    debugger;
    return this.httpClient.post(`${this.baseUrl}/AddSampleCollectedPlace`, data).pipe(delay(1000));
  }

  DeleteById(recordId:any,partnerId:any){
    debugger;
   // Create HttpParams instance and append query parameters
   let params = new HttpParams()
   .set('recordId', recordId.toString())
   .set('partnerId', partnerId.toString());
   return this.httpClient.delete(`${this.baseUrl}/DeleteSamplePlace`, {params});
  }

 searchPatientsForSampleCollection(
  request: {
    startDate: any;
    endDate: any;
    patientCode: any;
    centerCode: any;
    patientName: any;
    partnerId: any;
  }
): Observable<SampleCollectionResponse[]> {


  let params = new HttpParams()
  .set('startDate', this.formatDateForApi(request.startDate) ?? '')
  .set('endDate', this.formatDateForApi(request.endDate) ?? '')
  .set('patientCode', request.patientCode ?? '')
  .set('centerCode', request.centerCode ?? '')
  .set('patientName', request.patientName ?? '')
  .set('partnerId', 'P610389');

  // const params = new HttpParams()
  //   .set('startDate', request.startDate ?? '')
  //   .set('endDate', request.endDate ?? '')
  //   .set('patientCode', request.patientCode ?? '')
  //   .set('centerCode', request.centerCode ?? '')
  //   .set('patientName', request.patientName ?? '')
  //   .set('partnerId', request.partnerId ?? '');

  return this.httpClient.get<SampleCollectionResponse[]>(
    `${this.baseUrl}/SearchPatientForCollection`,
    { params }
  );
}

GetPendingSampleForCollectionById(patientId:any):Observable<SamplePendingCollectionResponse>{
    debugger;
    //const apiUrl = `${this.baseUrl}/GetUserById?userId=${userId}`;
    return this.httpClient.get<SamplePendingCollectionResponse>(`${this.baseUrl}/GetSamplesForCollection?patientId=${patientId}`).pipe(delay(1000));
  }

GetRequsetedTestForCollection(
  patientId: any,
  barcode: string|undefined
): Observable<RequestedTest[]> {

  debugger;

  let params = new HttpParams()
    .set('patientId', patientId ?? '')
    .set('barcode', barcode ?? '');

  return this.httpClient
    .get<RequestedTest[]>(`${this.baseUrl}/GetRequestedSampleForCollection`, { params })
    .pipe(delay(1000));
}

  updateSampleCollectionStatus(data:any){
    debugger;
    return this.httpClient.put(`${this.baseUrl}/UpdateSampleCollectionStatus`, data).pipe(delay(1000));
  }

  private formatDateForApi(date: Date | null): string | null {
  if (!date) return null;
  return date.toISOString().split('T')[0]; // YYYY-MM-DD
}

      
}
