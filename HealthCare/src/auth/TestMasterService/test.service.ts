import { Injectable } from '@angular/core';
import { environment } from '../../app/environments/environments';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs/internal/Observable';
import { delay } from 'rxjs';
import { testDepartmentResponse } from '../../Interfaces/TestMaster/testDepartmentResponse';
import { testDataSearchResponse } from '../../Interfaces/TestMaster/testDataSearchResponse';
import { testDataResponse } from '../../Interfaces/TestMaster/testDataResponse';
import { referalRangeResponse } from '../../Interfaces/TestMaster/referalRangeResponse';



@Injectable({
  providedIn: 'root'
})
export class TestService {

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

getTestDepartments(partnerId:any):Observable<testDepartmentResponse>{
  debugger;
  return this.httpClient.get<testDepartmentResponse>(`${this.baseUrl}/GetTestDepartments?partnerId=${partnerId}`);
}

BindTestInfo(data:any):Observable<testDataSearchResponse>{
  debugger;
  return this.httpClient.post<testDataSearchResponse>(`${this.baseUrl}/GetLabTestInfo`,data).pipe(delay(1000));
}

SearchTests(data:any):Observable<testDataSearchResponse>{
  debugger;
  return this.httpClient.post<testDataSearchResponse>(`${this.baseUrl}/SearchTests`,data).pipe(delay(1000));
}

DeleteTestByTestCode(partnerId:any,testCode:any){
  debugger;
 // Create HttpParams instance and append query parameters
 let params = new HttpParams()
 .set('testCode', testCode.toString())
 .set('partnerId', partnerId.toString());
 return this.httpClient.delete(`${this.baseUrl}/DeleteTest`, {params});
}


GetTestDetailsByTestCode(partnerId:any,testCode:any):Observable<testDataResponse>{
  debugger;
 // Create HttpParams instance and append query parameters
 let params = new HttpParams()
 .set('partnerId', partnerId.toString())
 .set('testCode', testCode.toString());
 return this.httpClient.get<testDataResponse>(`${this.baseUrl}/GetTestByTestCode`, {params}).pipe(delay(1000));
}

GetReferralRangeByTestCode(partnerId:any,testCode:any):Observable<referalRangeResponse>{
  debugger;
 // Create HttpParams instance and append query parameters
 let params = new HttpParams()
 .set('partnerId', partnerId.toString())
 .set('testCode', testCode.toString());
 return this.httpClient.get<referalRangeResponse>(`${this.baseUrl}/GetReferalRangeByTestCode`, {params}).pipe(delay(1000));
}

}
