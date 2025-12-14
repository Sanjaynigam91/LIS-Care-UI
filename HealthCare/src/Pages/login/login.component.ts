import { Component } from '@angular/core';
import { inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { ToastrModule } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../auth/Toaster/toast.service';
import { ToastComponent } from "../Toaster/toast/toast.component";


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, CommonModule, ToastComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  message: string | null = null;
  alertType: string | null = null;
  private currentUserSubject = new BehaviorSubject<string | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private authService: AuthService,private toasterService: ToastService) { }

  //authService = inject(AuthService);
  router = inject(Router);

  protected loginForm = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  })

UserLogin() {
  debugger;

  // Validation checks
  if (!this.loginForm.value.username?.trim()) {
    this.toasterService.showToast('Please enter username', 'error');
    return;
  }

  if (!this.loginForm.value.password?.trim()) {
    this.toasterService.showToast('Please enter password', 'error');
    return;
  }

  // Call API
  this.authService.UserLogin(this.loginForm.value).subscribe({
    next: (response) => {
      debugger;

      if (response.statusCode === 200 && response.status) {
        // ✅ Success
        this.toasterService.showToast(response.responseMessage || 'Login successful!', 'success');
        this.alertType = 'success';

        // Save to localStorage
        localStorage.setItem('username', response.data.fullName);
        localStorage.setItem('userId', response.data.userId.toString());
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('partnerId', response.data.partnerId);
        localStorage.setItem('email', response.data.email);
        localStorage.setItem('mobileNumber', response.data.mobileNumber);
        localStorage.setItem('userLogo', response.data.userLogo);
        localStorage.setItem('roleId', response.data.roleId);
        

        // Update user info
        this.currentUserSubject.next(response.data.fullName);
         
        // Navigate to dashboard
        if(response.data.roleId=='13')
        {
          this.router.navigate(['/clientdashboard']);
        }
        else{
          this.router.navigate(['/dashboard']);
        }
        
        this.message = response.responseMessage || 'Login successful!';
      } 
      else {
        // ❌ Failed login
        this.message = response.responseMessage || 'Invalid username or password!';
        this.alertType = 'danger';
        this.toasterService.showToast(this.message, 'error');
      }

      console.log('Response:', response);
    },
    error: (error) => {
      debugger;
      // ⚠️ API error (network/server)
      const errorMsg = error?.error?.responseMessage || 'Something went wrong. Please try again.';
      this.toasterService.showToast(errorMsg, 'error');
      this.alertType = 'danger';
      this.message = errorMsg;
      console.error('Login API error:', error);
    }
  });
}

    
  }




