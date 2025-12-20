export interface PatientDetailResponse {
  title: string;
  gender: string;
  patientName: string;
  age: number;
  ageType: string;
  emailId: string;
  mobileNumber: string;
  centerCode: string;
  referredDoctor: string;
  patientType: string;
  isProject: boolean;
  projectId: number;
  labInstruction: string;
  referralNumber: string;
  sampleCollectedAt: string;
  totalOriginalAmount: number;
  billAmount: number;
  receivedAmount: number;
  balanceAmount: number;
  discountAmount: number;
  isPercentage: boolean;
  discountRemarks: string;
  patientSpecimenId: number;
  barcode: string;
  collectionTime: string;      // ISO string from API
  woeStatus: string;
  specimenType: string;
  paymentType: string;
  visitId: number;
  discountStatus: string;
  partnerId: string;
  patientId: string;           // Guid as string
  patientCode: string;
  registrationDate: string;    // ISO string
}
