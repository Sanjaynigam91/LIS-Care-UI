export interface ProjectRequest {
  projectId: number;
  projectName: string;
  contactNumber: string;
  contactPerson: string;
  email: string;
  alternateEmail: string;
  projectAddress: string;
  referedBy: string;
  createdOn: Date;
  projectStatus: boolean;
  partnerId: string;
  validFrom: Date;
  validTo: Date;
  rateType: string;
  receiptPrefix: string;
}
