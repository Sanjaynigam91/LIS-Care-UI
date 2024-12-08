import { Injectable } from '@angular/core';
import { HttpClient,HttpErrorResponse,HttpHeaders, HttpParams } from '@angular/common/http';
import { inject } from '@angular/core';
import { delay, tap } from 'rxjs/operators';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { environment } from '../../app/environments/environments';
import { LoginApiResponse } from '../../Interfaces/login-api-response';
import { userroleresponse } from '../../Interfaces/userroleresponse';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseUrl :string=environment.apiUrl;

  loginApiResponse: Observable<LoginApiResponse>| any;
  userroleresponse: Observable<userroleresponse>| any;
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

  getPaginatedData(page: number, pageSize: number,partnerId:any): Observable<LoginApiResponse> {
    debugger;
    let params  = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString())
      .set('partnerId',partnerId);

    return this.httpClient.get<LoginApiResponse>(`${this.baseUrl}/GetAllUsers`,{ params });
  }

  getUsersList(partnerId:any):Observable<LoginApiResponse>{
    debugger;
    // Create HttpParams to pass query parameters
    let params = new HttpParams().set('partnerId', partnerId);
    return this.httpClient.get<LoginApiResponse>(`${this.baseUrl}/GetAllUsers`,{ params }).pipe(delay(1000));
  }

  getUsersType():Observable<userroleresponse>{
    debugger;
    return this.httpClient.get<userroleresponse>(`${this.baseUrl}/GetAllRoleType`);
  }

  SearchUserInfo(data:any):Observable<LoginApiResponse>{
    debugger;
    return this.httpClient.post<LoginApiResponse>(`${this.baseUrl}/SearchAllUser`,data).pipe(delay(1000));
  }
  
  GetUserInfoById(userId:any):Observable<LoginApiResponse>{
    debugger;
    //const apiUrl = `${this.baseUrl}/GetUserById?userId=${userId}`;
    return this.httpClient.get<LoginApiResponse>(`${this.baseUrl}/GetUserById?userId=${userId}`).pipe(delay(1000));
  }

  saveUserInfo(data:any){
    debugger;
    return this.httpClient.post(`${this.baseUrl}/AddUsers`, data).pipe(delay(1000));
  }
  
  EditUserInfo(data:any){
    debugger;
    return this.httpClient.put(`${this.baseUrl}/UpdateUserInformation`, data).pipe(delay(1000));
  }

   DeleteById(userId:any,delById:any){
    debugger;
   // Create HttpParams instance and append query parameters
   let params = new HttpParams()
   .set('userId', userId.toString())
   .set('delById', delById.toString());
   return this.httpClient.delete(`${this.baseUrl}/DeleteUserById`, {params});
  }
}
