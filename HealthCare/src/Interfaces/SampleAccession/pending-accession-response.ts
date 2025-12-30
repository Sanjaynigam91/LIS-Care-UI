export interface PendingAccessionResponse {
  registerDate: Date;
  workOrderDate: Date;
  patientName: string;
  referredBy: string;
  sampleStatus: string;
  rejectedDetails: string;
  visitId: number;
  projectId: number;
  partnerId: string;
  centerName: string;
  centerCode: string;
  barcode: string;
  sampleType: string;
  testRequested: string;

}
