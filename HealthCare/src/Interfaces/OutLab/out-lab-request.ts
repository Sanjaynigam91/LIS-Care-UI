export interface OutLabRequest {
  labCode: string;
  labName: string;
  contactPerson: string; // keeping same spelling as in C# (typo preserved)
  mobileNumber: string;
  email: string;
  introducedBy: string;
  labStatus: boolean;
  partnerId: string;
}
