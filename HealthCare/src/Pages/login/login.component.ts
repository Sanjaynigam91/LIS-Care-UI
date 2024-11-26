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

  UserLogin(){
      debugger;
      if(this.loginForm.value.username==''){
        this.toasterService.showToast('Please enter user name', 'error');
      }
      else if(this.loginForm.value.password==''){
        this.toasterService.showToast('Please enter password', 'error');
      }
      else{
         this.authService.UserLogin(this.loginForm.value)
         .subscribe((response) => {
        debugger;
        if(response.statusCode==200 && response.status){
          debugger;
          this.toasterService.showToast('Login successful!', 'success');
          this.alertType = 'success'; 
          // On successful login:
          localStorage.setItem('username', response.data.fullName);
          localStorage.setItem('userId', response.data.userId.toString());
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('partnerId', response.data.partnerId);
          localStorage.setItem('email', response.data.email);
          localStorage.setItem('mobileNumber', response.data.mobileNumber);
          localStorage.setItem('userLogo', response.data.userLogo);
          localStorage.setItem('roleId', response.data.roleId);
          this.currentUserSubject.next(response.data.fullName); // Save the username   
          this.router.navigate(['/dashboard']);
          this.message="Login successful!";
        }
        else{
          debugger;
          this.message = 'Invalid username or password!';
          this.alertType = 'danger';
        }
        // if(this.authService.isLoggedIn()){
        //   debugger;
        //  this.router.navigate(['/admin']);
        //  this.message="Login successful!";
        //  this.alertType = 'success';
        // console.log('Login successful', data);
        // }
        // else{
         
        // }
        console.log(this.message);
        console.log(this.alertType);
        console.log(response);
      });
      }
    }
    
  }




