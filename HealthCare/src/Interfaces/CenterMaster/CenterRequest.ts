export interface CenterRequest {
  centerCode: string;
  centerName: string;
  centerInchargeName: string;
  salesIncharge: string;
  centerAddress: string;
  pincode: string;
  mobileNumber: string;
  alternateContactNo?: string;
  emailId: string;
  rateType?: string;        // default = ''
  centerStatus?: boolean;   // default = false
  introducedBy?: string;
  creditLimit?: number;
  isAutoBarcode: boolean;
  partnerId: string;
  createdBy?: string;
  modifiedBy?: string;
}
