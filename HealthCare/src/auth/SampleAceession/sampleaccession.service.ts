import { Injectable } from '@angular/core';
import { environment } from '../../app/environments/environments';
import { BehaviorSubject, Observable } from 'rxjs';
import { PendingAccessionResponse } from '../../Interfaces/SampleAccession/pending-accession-response';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SampleaccessionService {

 private baseUrl :string=environment.apiUrl;
  pendingAccessionResponse: Observable<PendingAccessionResponse>| any;
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

private formatDateForApi(date: Date | null): string | null {
  if (!date) return null;
  return date.toISOString().split('T')[0]; // YYYY-MM-DD
}   

 getAllPendingSamplesForAccession(
  request: {
    startDate: any;
    endDate: any;
    barcode: any;
    centerCode: any;
    patientName: any;
    partnerId: any;
  }
): Observable<PendingAccessionResponse[]> {


  let params = new HttpParams()
  .set('startDate', this.formatDateForApi(request.startDate) ?? '')
  .set('endDate', this.formatDateForApi(request.endDate) ?? '')
  .set('barcode', request.barcode ?? '')
  .set('centerCode', request.centerCode ?? '')
  .set('patientName', request.patientName ?? '')
  .set('partnerId', request.partnerId);

  return this.httpClient.get<PendingAccessionResponse[]>(
    `${this.baseUrl}/GetAllSamplesForAccession`,
    { params }
  );
}
}
