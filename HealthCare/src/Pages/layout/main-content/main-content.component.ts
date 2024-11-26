import { Component } from '@angular/core';
import { MatSidenavContainer } from '@angular/material/sidenav';
import { RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { UserMasterComponent } from "../../Master/security/user-master/user-master.component";
import { AdduserComponent } from "../../Master/security/adduser/adduser.component";

@Component({
  selector: 'app-main-content',
  standalone: true,
  imports: [RouterOutlet, MatToolbarModule, MatSidenavContainer, MatSidenavModule,
    MatListModule, MatCardModule, MatButtonModule, UserMasterComponent, AdduserComponent],
  templateUrl: './main-content.component.html',
  styleUrl: './main-content.component.css'
})
export class MainContentComponent {

}
