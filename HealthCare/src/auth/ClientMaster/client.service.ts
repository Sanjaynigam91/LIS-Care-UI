import { Injectable } from '@angular/core';
import { environment } from '../../app/environments/environments';
import { BehaviorSubject, delay, Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ClientResponse } from '../../Interfaces/ClientMaster/client-response';
import { ClientCustomRateResponse } from '../../Interfaces/ClientMaster/client-custom-rate-response';

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

       /// used to create new center details
          addNewClient(data:any){
            debugger;
            return this.httpClient.post(`${this.baseUrl}/AddNewClient`, data).pipe(delay(1000));
          }
        /// used to update center details
          updateClientDetails(data: any) {
              console.log("Payload before sending:", data); // Debugging line to check the payload
              return this.httpClient.put(
                `${this.baseUrl}/UpdateClient`,
                data,
                {
                  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
                }
              ).pipe(delay(1000));
            
            }
          
          deleteClientDetails(clientId:any,partnerId:any){
            debugger;
          // Create HttpParams instance and append query parameters
          let params = new HttpParams()
            .set('clientId', clientId)
            .set('partnerId', partnerId.toString());
          return this.httpClient.delete(`${this.baseUrl}/DeleteClient`, {params});
          }
          
          /// used to get all clients custom rates
             getClientCustomRate(optype:any,clientCode:any,partnerId:any,testCode:any): Observable<ClientCustomRateResponse[]> {
                debugger;
                // Create HttpParams instance and append query parameters
                 let params = new HttpParams()
                  .set('optype', optype.toString())
                  .set('clientCode', clientCode.toString())
                  .set('partnerId', partnerId.toString())
                  .set('testCode',testCode.toString());
                 return this.httpClient.get<ClientCustomRateResponse[]>(`${this.baseUrl}/GetClientCustomRates`, {params});
              }

            /// used to update client's test rates
          updateClientTestRate(payload: any): Observable<any> {
          return this.httpClient.put(`${this.baseUrl}/UpdateClientTestRates`, payload, {
          headers: { 'Content-Type': 'application/json' }
        });
      }      
      
      /// used to import client rates
      ImportClientRates(data:any){
        debugger;
        return this.httpClient.post(`${this.baseUrl}/ImportClientRates`, data).pipe(delay(1000));
      }

}
