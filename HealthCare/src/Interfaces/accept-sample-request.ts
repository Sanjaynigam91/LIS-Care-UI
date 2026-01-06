export interface AcceptSampleRequest {
  woeDate: Date;            // maps to DateTime
  barcode: string;
  patientSpecimenId: number;
  patientCode: string;
  specimenType: string;
  createdBy: string|null;
  partnerId: string|null;
  visitId: number|null;
}
