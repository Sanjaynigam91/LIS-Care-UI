import { Injectable } from '@angular/core';
import { environment } from '../../app/environments/environments';
import { BehaviorSubject, delay, Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { TestSampleResponse } from '../../Interfaces/Patient/test-sample-response';

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

  //  /// used to get all sample 
  //    getLabSampleOrder(partnerId: any,centerCode:any,projectCode:number,testCode:any,testApplicable:any): Observable<TestSampleResponse[]> {
  //         debugger;
  //         // Create HttpParams instance and append query parameters
  //         let params = new HttpParams()
  //         .set('partnerId', partnerId ?? '')
  //         .set('centerCode', centerCode ?? '')
  //         .set('projectCode', projectCode != null ? projectCode.toString() : '0')
  //         .set('testCode', testCode ?? '')
  //         .set('testApplicable', testApplicable ?? '');

  //          return this.httpClient.get<TestSampleResponse[]>(`${this.baseUrl}/GetAllTestSamples`, {params});
  //       }


}
