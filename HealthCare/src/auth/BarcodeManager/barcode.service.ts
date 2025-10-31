import { Injectable } from '@angular/core';
import { environment } from '../../app/environments/environments';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BarcodeResponse } from '../../Interfaces/BarcodeManager/barcode-response';

@Injectable({
  providedIn: 'root'
})
export class BarcodeService {
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

  /// used to get all barcode details
     getAllBarcodeDetails(partnerId: any): Observable<BarcodeResponse[]> {
      debugger;
      // Create HttpParams instance and append query parameters
       let params = new HttpParams()
        .set('partnerId', partnerId.toString());
       return this.httpClient.get<BarcodeResponse[]>(`${this.baseUrl}/GetAllBarcodes`, {params});
    }

getBulkBarcodesPdf(sequenceStart: number, sequenceEnd: number): Observable<Blob> {
  debugger;
  const params = new HttpParams()
    .set('sequenceStart', sequenceStart.toString())
    .set('sequenceEnd', sequenceEnd.toString());

  return this.httpClient.get(`${this.baseUrl}/GenerateBulkBarcode`, {
    params,
    responseType: 'blob'
  });
}




}
