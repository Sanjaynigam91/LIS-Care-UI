import { Injectable } from '@angular/core';
import { environment } from '../../app/environments/environments';
import { BehaviorSubject, delay, Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { CenterResponse } from '../../Interfaces/CenterMaster/CenterResponse';
import { SalesInchargeResponse } from '../../Interfaces/CenterMaster/SalesInchargeResponse';

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

  /// used to get all centers
   getAllCenters(partnerId: any,centerStatus:any,searchBy:any): Observable<CenterResponse[]> {
      debugger;
      // Create HttpParams instance and append query parameters
       let params = new HttpParams()
        .set('partnerId', partnerId.toString())
        .set('centerStatus', centerStatus.toString())
        .set('searchBy',searchBy.toString());
       return this.httpClient.get<CenterResponse[]>(`${this.baseUrl}/GetAllCenters`, {params});
    }

    /// used to get sales incharge details
     getSalesInchargeDetails(partnerId: any): Observable<SalesInchargeResponse[]> {
      debugger;
      // Create HttpParams instance and append query parameters
       let params = new HttpParams()
        .set('partnerId', partnerId.toString());
       return this.httpClient.get<SalesInchargeResponse[]>(`${this.baseUrl}/GetSalesIncharge`, {params});
    }

    /// used to get center details by center code
     getCentersByCode(partnerId: any,centerCode:any): Observable<CenterResponse[]> {
      debugger;
      // Create HttpParams instance and append query parameters
       let params = new HttpParams()
        .set('partnerId', partnerId.toString())
        .set('centerCode', centerCode.toString());
       return this.httpClient.get<CenterResponse[]>(`${this.baseUrl}/GetCenterByCenterCode`, {params});
    }

    /// used to create new center details
      addNewCenter(data:any){
        debugger;
        return this.httpClient.post(`${this.baseUrl}/AddNewCenter`, data).pipe(delay(1000));
      }
    /// used to update center details
      updateCenterDetails(data: any) {
          console.log("Payload before sending:", data); // Debugging line to check the payload
          return this.httpClient.put(
            `${this.baseUrl}/UpdateCenter`,
            data,
            {
              headers: new HttpHeaders({ 'Content-Type': 'application/json' })
            }
          ).pipe(delay(1000));
        
        }

deleteCenterDetails(centerCode:any,partnerId:any){
  debugger;
 // Create HttpParams instance and append query parameters
 let params = new HttpParams()
  .set('centerCode', centerCode)
  .set('partnerId', partnerId.toString());
 return this.httpClient.delete(`${this.baseUrl}/DeleteCenter`, {params});
}

}
