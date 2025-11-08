import { Injectable } from '@angular/core';
import { environment } from '../../app/environments/environments';
import { BehaviorSubject, delay, Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ProjectResponse } from '../../Interfaces/Projects/project-response';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

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

   /// used to get all projects
     getAllProjects(partnerId: any,projectStatus:any,projectName:any): Observable<ProjectResponse[]> {
        debugger;
        // Create HttpParams instance and append query parameters
         let params = new HttpParams()
          .set('partnerId', partnerId.toString())
          .set('projectStatus', projectStatus.toString())
          .set('projectName',projectName.toString());
         return this.httpClient.get<ProjectResponse[]>(`${this.baseUrl}/GetAllProjects`, {params});
      }
      
   /// used to get project details by project Id
     getProjectById(partnerId: any,projectId:any): Observable<ProjectResponse[]> {
      debugger;
      // Create HttpParams instance and append query parameters
       let params = new HttpParams()
        .set('partnerId', partnerId.toString())
        .set('projectId', projectId.toString());
       return this.httpClient.get<ProjectResponse[]>(`${this.baseUrl}/GetProjectById`, {params});
    }

  /// used to create new project details
      addNewProject(data:any){
        debugger;
        return this.httpClient.post(`${this.baseUrl}/AddNewProject`, data).pipe(delay(1000));
      }
    /// used to update project details
      updateProjectDetails(data: any) {
          console.log("Payload before sending:", data); // Debugging line to check the payload
          return this.httpClient.put(
            `${this.baseUrl}/UpdateProject`,
            data,
            {
              headers: new HttpHeaders({ 'Content-Type': 'application/json' })
            }
          ).pipe(delay(1000));
        
        }

      deleteProjectDetails(projectId:any,partnerId:any){
        debugger;
      // Create HttpParams instance and append query parameters
      let params = new HttpParams()
        .set('projectId', projectId)
        .set('partnerId', partnerId.toString());
      return this.httpClient.delete(`${this.baseUrl}/DeleteProject`, {params});
      } 




}
