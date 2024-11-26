import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, delay, Observable } from 'rxjs';
import { lisroleresponse } from '../../Interfaces/Role/lisroleresponse';
import { environment } from '../../app/environments/environments';
import { LisRoleResponseModel } from '../../Interfaces/Role/LisRoleResponseModel';
import { lisRolNameResponse } from '../../Interfaces/Role/lisRolNameResponse';
import { PageHeaderResponseModel } from '../../Interfaces/Role/PageHeaderResponseModel';
import { LisPageResponseModel } from '../../Interfaces/Role/LisPageResponseModel';
import { PageEntityModel } from '../../Interfaces/Role/PageEntityModel';
import { LisCareCriteriaModel } from '../../Interfaces/Role/LisCareCriteriaModel';
import { LisPageModel } from '../../Interfaces/Role/LisPageModel';

@Injectable({
  providedIn: 'root'
})
export class LisroleService {

  private baseUrl :string=environment.apiUrl;

  private currentUserSubject = new BehaviorSubject<string | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();
  lisRoleResponse: Observable<lisroleresponse>| any;
  lisResponse: Observable<LisRoleResponseModel>| any;
  lisRolNameResponse:Observable<lisRolNameResponse>| any;
  pageHeaderResponse:Observable<PageHeaderResponseModel>| any;
  lisPageResponse:Observable<LisPageResponseModel>| any;
  lisPageEntityModel:Observable<PageEntityModel>| any;
  lisCareCriteriaModel:Observable<LisCareCriteriaModel>| any;
  lisPageModel:Observable<LisPageModel>| any;

  constructor(private httpClient: HttpClient) {
     // Initialize the current user from local storage if available
     const partnerId= localStorage.getItem('partnerId');
     const storedUsername = localStorage.getItem('username');
     if (storedUsername) {
       this.currentUserSubject.next(storedUsername);
     }
   }

   getLisRoleList():Observable<lisroleresponse>{
    debugger;
    return this.httpClient.get<lisroleresponse>(`${this.baseUrl}/GetAllLISRoles`).pipe(delay(1000));
  }

  GetRoleInfoById(roleId:any):Observable<LisRoleResponseModel>{
    debugger;
    return this.httpClient.get<LisRoleResponseModel>(`${this.baseUrl}/GetLISRoleByRoleId?roleId=${roleId}`).pipe(delay(1000));
  }

  addNewRole(data:any){
    debugger;
    return this.httpClient.post(`${this.baseUrl}/AddLISRole`, data).pipe(delay(1000));
  }
  EditRoleInfo(data:any){
    debugger;
    return this.httpClient.put(`${this.baseUrl}/UpdateLISRole`, data).pipe(delay(1000));
  }
  DeleteRoleById(roleId:any){
    debugger;
    return this.httpClient.delete(`${this.baseUrl}/DeleteRoleById?roleId=${roleId}`).pipe(delay(1000));
  }

  GetRoleNameByRoleType(roleType:any):Observable<lisRolNameResponse>{
    debugger;
    return this.httpClient.get<lisRolNameResponse>(`${this.baseUrl}/GetRoleByRoleType?roleType=${roleType}`).pipe(delay(1000));
  }

  getAllPageHeadersList(roleId:any,partnerId:string):Observable<PageHeaderResponseModel>{
    debugger;
    // Create HttpParams instance and append query parameters
   let params = new HttpParams()
   .set('roleId', roleId.toString())
   .set('partnerId', partnerId.toString());
    return this.httpClient.get<PageHeaderResponseModel>(`${this.baseUrl}/GetPageHeadersByRoleId`,{params}).pipe(delay(1000));
  }

  getAllLisPageList(partnerId:any):Observable<LisPageResponseModel>{
    debugger;
    return this.httpClient.get<LisPageResponseModel>(`${this.baseUrl}/GetAllLisPages?partnerId=${partnerId}`).pipe(delay(1000));
  }

  getAllPageEntities(partnerId:any):Observable<PageEntityModel>{
    debugger;
    return this.httpClient.get<PageEntityModel>(`${this.baseUrl}/GetPageEntity?partnerId=${partnerId}`).pipe(delay(1000));
  }

  getAllCriteria():Observable<LisCareCriteriaModel>{
    debugger;
    return this.httpClient.get<LisCareCriteriaModel>(`${this.baseUrl}/GetAllCriteria`).pipe(delay(1000));
  }

  getPagesByEntites(partnerId:string,pageEntity:string):Observable<LisPageModel>{
    debugger;
      // Create HttpParams instance and append query parameters
   let params = new HttpParams()
   .set('partnerId', partnerId.toString())
   .set('pageEntity', pageEntity.toString());
    return this.httpClient.get<LisPageModel>(`${this.baseUrl}/GetAllPageByEntity`,{params}).pipe(delay(1000));
  }

  saveLisPages(data:any){
    debugger;
    return this.httpClient.post(`${this.baseUrl}/SaveLisPageDetails`, data).pipe(delay(1000));
  }

  getPagesById(pageId:string,partnerId:string):Observable<LisPageResponseModel>{
    debugger;
      // Create HttpParams instance and append query parameters
   let params = new HttpParams()
   .set('pageId', pageId.toString())
   .set('partnerId', partnerId.toString());
  
    return this.httpClient.get<LisPageResponseModel>(`${this.baseUrl}/GetPageDetailsById`,{params}).pipe(delay(1000));
  }

  UpdateLisPages(data:any){
    debugger;
    return this.httpClient.put(`${this.baseUrl}/UpdateLisPage`, data).pipe(delay(1000));
  }

  DeletePageByPageId(pageId:string){
    debugger;
    return this.httpClient.delete(`${this.baseUrl}/DeleteLisPage?pageId=${pageId}`).pipe(delay(1000));
  }

  SearchLisPages(data:any):Observable<LisPageResponseModel>{
    debugger;
    return this.httpClient.post<LisPageResponseModel>(`${this.baseUrl}/SeachLisPages`, data).pipe(delay(1000));
  }

  AllowPermisiion(data:any){
    debugger;
    return this.httpClient.put(`${this.baseUrl}/PageAccessPermission`, data).pipe(delay(1000));
  }

}
