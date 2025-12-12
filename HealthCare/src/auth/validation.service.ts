import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  constructor() { }

   isValidPatientRecord(Patientform: FormGroup): { isValid: boolean, message: string } {

  if (!Patientform.get('ddlTitle')?.value)
    return { isValid: false, message: "Please select Title." };

  if (!Patientform.get('ddlGender')?.value)
    return { isValid: false, message: "Please select Gender." };

  if (!Patientform.get('PatientName')?.value)
    return { isValid: false, message: "Patient Name is required." };

  if (!(Patientform.get('PatientAge')?.value > 0))
    return { isValid: false, message: "Please enter valid Age." };

  if (!Patientform.get('ddlAgeType')?.value)
    return { isValid: false, message: "Please select Age Type." };

  if (!Patientform.get('ddlReferredDr')?.value)
    return { isValid: false, message: "Please select Referred Doctor." };

  if (!Patientform.get('ddlBillingPatientType')?.value)
    return { isValid: false, message: "Please select Billing Patient Type." };

  if (Patientform.get('ddlBillingPatientType')?.value === 'Project') {
    if (!Patientform.get('ddlProject')?.value)
      return { isValid: false, message: "Please select Project." };
  }

  return { isValid: true, message: "Success" };
}

generatePatientCode(superAdmin: string, centerCode: string): string {
//  const prefix = 'LIS';
debugger;
  // Take first 3 letters safely
  const adminPart = superAdmin
    ? superAdmin.substring(0, 3).toUpperCase()
    : '';

  const centerPart = centerCode
    ? centerCode.substring(0, 3).toUpperCase()
    : '';

  // Timestamp (yyMMddHHmmss)
  const now = new Date();
  const timestamp =
    now.getFullYear().toString().substring(2) +
    this.pad(now.getMonth() + 1) +
    this.pad(now.getDate()) +
    this.pad(now.getHours()) +
    this.pad(now.getMinutes()) +
    this.pad(now.getSeconds());

     return `${adminPart}${centerPart}${timestamp}`;
//  return `${prefix}${adminPart}${centerPart}${timestamp}`;
}

// Helper for adding leading zeros
pad(num: number): string {
  return num.toString().padStart(2, '0');
}

}
