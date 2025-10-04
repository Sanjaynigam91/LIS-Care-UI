import { Injectable } from '@angular/core';
import { environment } from '../../app/environments/environments';
import { BehaviorSubject, delay, Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AnalyzerResponse } from '../../Interfaces/AnalyzerMaster/AnalyzerResponse';
import { SupplierResponse } from '../../Interfaces/AnalyzerMaster/SupplierResponse';
import { AnalyzerApiResponse } from '../../Interfaces/AnalyzerMaster/AnalyzerApiResponse';
import { AnalyzerMappingResponse } from '../../Interfaces/AnalyzerMaster/AnalyzerMappingResponse';

@Injectable({
  providedIn: 'root'
})
export class AnalyzerService {
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

   getAllAnalyzers(partnerId: any,analyzerNameOrShortCode:any,analyzerStatus:any): Observable<AnalyzerResponse[]> {
    debugger;
    // Create HttpParams instance and append query parameters
     let params = new HttpParams()
      .set('partnerId', partnerId.toString())
      .set('analyzerNameOrShortCode', analyzerNameOrShortCode.toString())
      .set('analyzerStatus',analyzerStatus.toString());
     return this.httpClient.get<AnalyzerResponse[]>(`${this.baseUrl}/GetAllAnalyzers`, {params});
  }

   getAllSuppliers(partnerId: any): Observable<SupplierResponse[]> {
    debugger;
    // Create HttpParams instance and append query parameters
     let params = new HttpParams()
      .set('partnerId', partnerId.toString());
     return this.httpClient.get<SupplierResponse[]>(`${this.baseUrl}/GetAllSuppliers`, {params});
  }

    getAnalyzersById(partnerId: any,analyzerId:any): Observable<AnalyzerApiResponse[]> {
    debugger;
    // Create HttpParams instance and append query parameters
     let params = new HttpParams()
      .set('partnerId', partnerId.toString())
      .set('analyzerId', analyzerId);
     return this.httpClient.get<AnalyzerApiResponse[]>(`${this.baseUrl}/GetAnalyzerDetailById`, {params});
  }

   getAnalyzersTestMappings(partnerId: any,analyzerId:any): Observable<AnalyzerMappingResponse[]> {
    debugger;
    // Create HttpParams instance and append query parameters
     let params = new HttpParams()
      .set('partnerId', partnerId.toString())
      .set('analyzerId', analyzerId);
     return this.httpClient.get<AnalyzerMappingResponse[]>(`${this.baseUrl}/GetAnalyzerTestMappings`, {params});
  }

  addAnalyzerDetails(data:any){
    debugger;
    return this.httpClient.post(`${this.baseUrl}/AddNewAnalyzer`, data).pipe(delay(1000));
  }

  updateAnalyzerDetails(data: any) {
    console.log("Payload before sending:", data); // Debugging line to check the payload
    return this.httpClient.put(
      `${this.baseUrl}/UpdateAnalyzer`,
      data,
      {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
      }
    ).pipe(delay(1000));
  
  }

  deleteAnalyzer(analyzerId:any,partnerId:any){
  debugger;
 // Create HttpParams instance and append query parameters
 let params = new HttpParams()
  .set('analyzerId', analyzerId)
  .set('partnerId', partnerId.toString());
 return this.httpClient.delete(`${this.baseUrl}/DeleteAnalyzer`, {params});
}

}
