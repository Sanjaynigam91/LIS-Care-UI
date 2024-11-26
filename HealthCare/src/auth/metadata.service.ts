import { Injectable } from '@angular/core';
import { environment } from '../app/environments/environments';
import { metadataresponse } from '../Interfaces/metadataresponse';
import { BehaviorSubject, delay, Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { metadatalistresponse } from '../Interfaces/metadatalistresponse';

@Injectable({
  providedIn: 'root'
})
export class MetadataService {
  private baseUrl :string=environment.apiUrl;
  metadataresponse: Observable<metadataresponse>| any;
  private currentUserSubject = new BehaviorSubject<string | null>(null);
  metadatalistresponse: Observable<metadatalistresponse>| any;
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private httpClient: HttpClient) { 
     // Initialize the current user from local storage if available
     const partnerId= localStorage.getItem('partnerId');
     const storedUsername = localStorage.getItem('username');
     if (storedUsername) {
       this.currentUserSubject.next(storedUsername);
     }
  }

  getAllMetaTags(partnerId:any):Observable<metadataresponse>{
    debugger;
    // Create HttpParams to pass query parameters
    let params = new HttpParams().set('partnerId', partnerId);
    return this.httpClient.get<metadataresponse>(`${this.baseUrl}/GetAllTag`,{ params });
  }

  getAllMetaTagList(category:any,partnerId:any):Observable<metadatalistresponse>{
    debugger;
    // Create HttpParams to pass query parameters
    let params = new HttpParams()
    .set('category', category.toString())
    .set('partnerId', partnerId.toString());
    return this.httpClient.get<metadatalistresponse>(`${this.baseUrl}/GetAllMasterListByCategory`,{ params });
  }

  DeleteByRecordId(recordId:any){
    debugger;
   // Create HttpParams instance and append query parameters
   let params = new HttpParams()
   .set('recordId', recordId.toString());
   return this.httpClient.delete(`${this.baseUrl}/DeleteMasterList`, {params});
  }

  createNewMasterLst(data:any){
    debugger;
    return this.httpClient.post(`${this.baseUrl}/CreateNewMasterList`, data).pipe(delay(1000));
  }

  createNewMetaTag(data:any){
    debugger;
    return this.httpClient.post(`${this.baseUrl}/CreateNewMetaDataTag`, data).pipe(delay(1000));
  }

  updateMetaTag(data:any){
    debugger;
    return this.httpClient.put(`${this.baseUrl}/UpdateMetaDataTag`, data).pipe(delay(1000));
  }

  getMetaTagById(tagId:any):Observable<metadataresponse>{
    debugger;
   // Create HttpParams instance and append query parameters
   let params = new HttpParams()
   .set('tagId', tagId.toString());
   return this.httpClient.get<metadataresponse>(`${this.baseUrl}/GetMetaTagById`, {params});
  }

}
