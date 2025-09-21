import { Injectable } from '@angular/core';
import { environment } from '../../app/environments/environments';
import { BehaviorSubject, delay, Observable } from 'rxjs';
import { ProfileResponse } from '../../Interfaces/ProfileMaster/ProfileResponse';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';




@Injectable({
  providedIn: 'root'
})
export class ProfileService {
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

 getAllProfiles(partnerId: any): Observable<ProfileResponse[]> {
  debugger;
  return this.httpClient.get<ProfileResponse[]>(`${this.baseUrl}/GetAllProfileDetails?partnerId=${partnerId}`);
}

DeleteProfileByProfileCode(partnerId:any,profileCode:any){
  debugger;
 // Create HttpParams instance and append query parameters
 let params = new HttpParams()
  .set('partnerId', partnerId.toString())
  .set('profileCode', profileCode.toString());
 return this.httpClient.delete(`${this.baseUrl}/DeleteProfileByProfileCode`, {params});
}

getProfileByProfileCode(partnerId:any,profileCode:any): Observable<ProfileResponse[]> {
  debugger;
   // Create HttpParams instance and append query parameters
 let params = new HttpParams()
  .set('partnerId', partnerId.toString())
  .set('profileCode', profileCode.toString());
  return this.httpClient.get<ProfileResponse[]>(`${this.baseUrl}/GetProfileByProfileCode`, {params});
}

}
