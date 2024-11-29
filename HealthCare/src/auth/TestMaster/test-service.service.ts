import { Injectable } from '@angular/core';
import { environment } from '../../app/environments/environments';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs/internal/Observable';
import { testDepartmentResponse } from '../../Interfaces/TestMaster/TestDepartmentResponse';

@Injectable({
  providedIn: 'root'
})
export class TestServiceService {
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


  getTestDepartments():Observable<testDepartmentResponse>{
    debugger;
    return this.httpClient.get<testDepartmentResponse>(`${this.baseUrl}/GetTestDepartments`);
  }



}
