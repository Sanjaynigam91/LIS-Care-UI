import { Injectable } from '@angular/core';
import { environment } from '../../app/environments/environments';
import { sampleCollectedAtResponse } from '../../Interfaces/SampleCollection/sampleCollectedAtResponse';
import { BehaviorSubject, delay, Observable } from 'rxjs';
import { HttpClient,HttpParams } from '@angular/common/http';

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
}
