export interface PatientTestRequest {
  patientId: string;           // Guid -> string
  testCode: string;
  isProfile: boolean;
  specimenType: string;
  partnerId: string;
  originalPrice: number;
  price: number;
}
