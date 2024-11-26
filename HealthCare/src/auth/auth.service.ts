import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { inject } from '@angular/core';
import { tap } from 'rxjs/operators';
import { environment } from '../app/environments/environments';
import { BehaviorSubject, Observable } from 'rxjs';
import { rolesApiResponse } from '../Interfaces/rolesApiResponse';
import { LoginApiResponse } from '../Interfaces/login-api-response';
import { labrolesResponse } from '../Interfaces/labrolesResponse';
import { userroleresponse } from '../Interfaces/userroleresponse';
import { userdepartments } from '../Interfaces/userdepartments';



@Injectable({
  providedIn: 'root'
})
export class AuthService {
    //baseUrl = 'http://localhost:63035/api';
    private baseUrl :string=environment.apiUrl;

    loginApiResponse: Observable<LoginApiResponse>| any;
    private currentUserSubject = new BehaviorSubject<string | null>(null);
    currentUser$ = this.currentUserSubject.asObservable();
    

  constructor(private httpClient: HttpClient) { 
    // Initialize the current user from local storage if available
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      this.currentUserSubject.next(storedUsername);
    }
  }

  getAllRoles():Observable<rolesApiResponse>{
    return this.httpClient.get<rolesApiResponse>(`${this.baseUrl}/GetAllLISRoles`);
  }

  signup(data: any) {
    debugger;
    return this.httpClient.post(`${this.baseUrl}/UserSignUp`, data);
  }

  UserLogin(data:any):Observable<LoginApiResponse>{
    debugger; 
    return this.httpClient.post<LoginApiResponse>(`${this.baseUrl}/Login/Login`, data);
  }
  
  GetLabRoles():Observable<labrolesResponse>{
    debugger;
    return this.httpClient.get<labrolesResponse>(`${this.baseUrl}/GetLabRoles`);
  }

  getAllRoleType():Observable<userroleresponse>{
    return this.httpClient.get<userroleresponse>(`${this.baseUrl}/GetAllRoleType`);
  }
  
  getAllDepartments():Observable<userdepartments>{
    debugger;
    return this.httpClient.get<userdepartments>(`${this.baseUrl}/GetAllDepartments`);
  }
  logout() {
    debugger;
    localStorage.removeItem('authUser');
    localStorage.removeItem('username');
    localStorage.removeItem('userId');
    localStorage.removeItem('token');
    localStorage.removeItem('partnerId');
    localStorage.removeItem('email');
    localStorage.removeItem('mobileNumber');
    localStorage.removeItem('roleId');
    this.currentUserSubject.next(null); // Clear the username  
  }

  isLoggedIn() {
    debugger;
    return localStorage.getItem('authUser') !== null;
  }
  


}
