import { Injectable } from '@angular/core';
import { environment } from '../../app/environments/environments';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CenterResponse } from '../../Interfaces/CenterMaster/CenterResponse';

@Injectable({
  providedIn: 'root'
})
export class CenterServiceService {
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

   getAllCenters(partnerId: any,centerStatus:any,searchBy:any): Observable<CenterResponse[]> {
      debugger;
      // Create HttpParams instance and append query parameters
       let params = new HttpParams()
        .set('partnerId', partnerId.toString())
        .set('centerStatus', centerStatus.toString())
        .set('searchBy',searchBy.toString());
       return this.httpClient.get<CenterResponse[]>(`${this.baseUrl}/GetAllCenters`, {params});
    }

}
