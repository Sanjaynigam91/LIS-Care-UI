export interface PatientResponse {
  patientId: string;              // Guid → string
  patientCode: string;
  patientName: string;
  woeDate: string;
  centerCode: string;
  createdOn: Date;                // DateTime → Date
  barcode: string;
  totalOriginalAmount: number;    // decimal → number
  billAmount: number;
  receivedAmount: number;
  balanceAmount: number;
  visitId: number;
  registrationStatus: string;
  referredDoctor: string;
  partnerId: string;
  discountStatus: string;
  testRequested: string;
  patientTestType: string;
  isProject: boolean;
  invoiceReceiptNo: string;
  registeredOn: Date;
  referredLab: string;
  centerrName: string;
  specimenType: string;
  partnerType: string;
  referredBy: string;
}
