import { Injectable } from '@angular/core';
import { environment } from '../../app/environments/environments';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ClientResponse } from '../../Interfaces/ClientMaster/client-response';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
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

      /// used to get all clients
       getAllClients(clientStatus:any,partnerId: any,searchBy:any,centerCode:any): Observable<ClientResponse[]> {
          debugger;
          // Create HttpParams instance and append query parameters
           let params = new HttpParams()
            .set('clientStatus', clientStatus.toString())
            .set('partnerId', partnerId.toString())
            .set('searchBy',searchBy.toString())
            .set('centerCode',centerCode.toString());
           return this.httpClient.get<ClientResponse[]>(`${this.baseUrl}/GetAllClients`, {params});
        }

          /// used to get center details by center code
             getClientById(clientId:any,partnerId: any): Observable<ClientResponse[]> {
              debugger;
              // Create HttpParams instance and append query parameters
               let params = new HttpParams()
                .set('clientId', clientId.toString())
                .set('partnerId', partnerId.toString());
               return this.httpClient.get<ClientResponse[]>(`${this.baseUrl}/GetClientById`, {params});
            }

}
