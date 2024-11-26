import { Component, inject } from '@angular/core';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatToolbar, MatToolbarModule } from '@angular/material/toolbar';
import { AuthService } from '../../../auth/auth.service';
import { Router } from '@angular/router';
import { MatCardActions, MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatListModule } from '@angular/material/list';
import { MatGridListModule, MatGridTile } from '@angular/material/grid-list';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatButtonModule,MatTableModule,MatPaginatorModule,MatCardModule,
    MatListModule,MatGridListModule,MatGridTile,MatIconModule,MatToolbarModule,CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  username: string | null = null;
  userId:string | null = null;
  token:string | null = null;
  fileBase64: string | ArrayBuffer | null = null;

  constructor(private authService: AuthService) {}
  router = inject(Router);
  
  ngOnInit(): void {
    debugger;
    this.username=localStorage.getItem('username');
    this.userId=localStorage.getItem('userId');
    this.token=localStorage.getItem('token');
    this.fileBase64=localStorage.getItem('userLogo');

  }

  UserLogOut():void{
    debugger;
    this.authService.logout();
    this.router.navigate(['/login']); // Redirect to login page after logout
  }


}
