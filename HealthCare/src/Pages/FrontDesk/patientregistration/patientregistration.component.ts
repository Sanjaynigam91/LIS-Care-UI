import { Component } from '@angular/core';
import { MatIcon, MatIconModule } from "@angular/material/icon";

@Component({
  selector: 'app-patientregistration',
  standalone: true,
  imports: [MatIconModule],     // <-- REQUIRED
  templateUrl: './patientregistration.component.html',
  styleUrl: './patientregistration.component.css'
})
export class PatientregistrationComponent {

}
