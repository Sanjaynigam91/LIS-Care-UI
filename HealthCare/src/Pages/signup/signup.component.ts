import { Component } from '@angular/core';
import { inject } from '@angular/core';
import { FormControl,FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { rolesApiResponse } from '../../Interfaces/rolesApiResponse';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { labrolesResponse } from '../../Interfaces/labrolesResponse';



@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule,CommonModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  
  rolesApiResponse: Observable<rolesApiResponse>| any;
  labroles: Observable<labrolesResponse>| any;

  constructor(private authService: AuthService,private formBuilder: FormBuilder) {}

  router  =  inject(Router);

  
  ngOnInit(): void{
   /// Used for to get the user role from API
   this.authService.GetLabRoles().subscribe((response:any)=>{
    debugger;
    this.labroles = response.data; 
    console.log(response);
   }) 
  }

  

  public signupForm = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    mobileNumber:new FormControl('',[Validators.required]),
    roleId:new FormControl('',[Validators.required])
  })

  
  public onSubmit() {
    debugger;
    if (this.signupForm.valid) {
      debugger;
      console.log(this.signupForm.value);
      this.authService.signup(this.signupForm.value)
        .subscribe({
          next: (response: any) => {
            debugger;
            if(response.statusCode==200 && response.status){
              debugger;
              console.log(response);
              this.router.navigate(['/login']);
            }
            else{
              debugger;
              console.log(response.message);
            }
            
          },
          error: (err) => console.log(err)
        });
    }
  }
}
