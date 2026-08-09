import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { environment } from '../app/environments/environments';
import { BehaviorSubject, Observable, Subscription, timer } from 'rxjs';
import { Router } from '@angular/router';

import { rolesApiResponse } from '../Interfaces/rolesApiResponse';
import { LoginApiResponse } from '../Interfaces/login-api-response';
import { labrolesResponse } from '../Interfaces/labrolesResponse';
import { userroleresponse } from '../Interfaces/userroleresponse';
import { userdepartments } from '../Interfaces/userdepartments';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl: string = environment.apiUrl;

  loginApiResponse: Observable<LoginApiResponse> | any;

  private currentUserSubject =
    new BehaviorSubject<string | null>(null);

  currentUser$ = this.currentUserSubject.asObservable();

  // ✅ Timer used to automatically logout when JWT expires
  private logoutTimer?: Subscription;

  constructor(
    private httpClient: HttpClient,
    private router: Router
  ) {

    // Initialize current user
    const storedUsername = localStorage.getItem('username');

    if (storedUsername) {
      this.currentUserSubject.next(storedUsername);
    }

    // ✅ Important:
    // Check token when application starts/reloads
    this.startTokenExpirationTimer();
  }


  // =========================================================
  // LOGIN
  // =========================================================

  UserLogin(data: any): Observable<any> {

    return this.httpClient.post(
      `${this.baseUrl}/Login/Login`,
      data
    );
  }


  // =========================================================
  // JWT EXPIRATION HANDLING
  // =========================================================

  startTokenExpirationTimer(): void {

    // Cancel previous timer
    this.logoutTimer?.unsubscribe();

    const token = localStorage.getItem('token');

    // No token = user is not logged in
    if (!token) {
      return;
    }

    try {

      const parts = token.split('.');

      // JWT must contain header.payload.signature
      if (parts.length !== 3) {

        console.error('Invalid JWT token format.');

        this.logout();
        return;
      }

      // Decode JWT payload
      const payload = JSON.parse(
        this.base64UrlDecode(parts[1])
      );

      const expirationTime = payload.exp;

      if (!expirationTime) {

        console.error(
          'JWT token does not contain expiration (exp).'
        );

        this.logout();
        return;
      }

      // JWT exp is in seconds
      const expirationDate = expirationTime * 1000;

      const remainingTime =
        expirationDate - Date.now();

      console.log(
        'JWT expires at:',
        new Date(expirationDate)
      );

      console.log(
        'Remaining JWT time:',
        Math.round(remainingTime / 1000),
        'seconds'
      );


      // =====================================================
      // TOKEN ALREADY EXPIRED
      // =====================================================

      if (remainingTime <= 0) {

        console.log(
          'JWT already expired. Logging out.'
        );

        this.logout();

        return;
      }


      // =====================================================
      // AUTOMATIC LOGOUT WHEN TOKEN EXPIRES
      // =====================================================

      this.logoutTimer = timer(remainingTime)
        .subscribe(() => {

          console.log(
            'JWT token expired. Logging out automatically.'
          );

          this.logout();

        });

    }
    catch (error) {

      console.error(
        'Unable to read JWT token.',
        error
      );

      this.logout();
    }
  }


  // =========================================================
  // BASE64 URL DECODER
  // =========================================================

  private base64UrlDecode(value: string): string {

    let base64 = value
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    while (base64.length % 4) {
      base64 += '=';
    }

    return atob(base64);
  }


  // =========================================================
  // LOGOUT
  // =========================================================

  logout(): void {

    console.log('Logging out...');

    // Stop expiration timer
    this.logoutTimer?.unsubscribe();
    this.logoutTimer = undefined;


    // Clear all login-related information
    localStorage.removeItem('authUser');
    localStorage.removeItem('username');
    localStorage.removeItem('userId');
    localStorage.removeItem('token');
    localStorage.removeItem('partnerId');
    localStorage.removeItem('email');
    localStorage.removeItem('mobileNumber');
    localStorage.removeItem('userLogo');
    localStorage.removeItem('roleId');
    localStorage.removeItem('centerCode');


    // Clear current user
    this.currentUserSubject.next(null);


    // Redirect to login page
    this.router.navigate(['/login']);
  }


  // =========================================================
  // CHECK LOGIN STATUS
  // =========================================================

  isLoggedIn(): boolean {

    const token = localStorage.getItem('token');

    if (!token) {
      return false;
    }

    try {

      const parts = token.split('.');

      if (parts.length !== 3) {
        return false;
      }

      const payload = JSON.parse(
        this.base64UrlDecode(parts[1])
      );

      const expirationTime = payload.exp;

      if (!expirationTime) {
        return false;
      }

      // Check whether token has expired
      return expirationTime * 1000 > Date.now();

    }
    catch {

      return false;
    }
  }


  // =========================================================
  // GET TOKEN
  // =========================================================

  getToken(): string | null {

    return localStorage.getItem('token');
  }


  // =========================================================
  // OTHER EXISTING METHODS
  // =========================================================

  getAllRoles(): Observable<any> {

    return this.httpClient.get(
      `${this.baseUrl}/GetAllLISRoles`
    );
  }


  signup(data: any) {

    return this.httpClient.post(
      `${this.baseUrl}/UserSignUp`,
      data
    );
  }


  GetLabRoles(): Observable<any> {

    return this.httpClient.get(
      `${this.baseUrl}/GetLabRoles`
    );
  }


  getAllRoleType(): Observable<any> {

    return this.httpClient.get(
      `${this.baseUrl}/GetAllRoleType`
    );
  }


  getAllDepartments(): Observable<any> {

    return this.httpClient.get(
      `${this.baseUrl}/GetAllDepartments`
    );
  }

}