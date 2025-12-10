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

}
