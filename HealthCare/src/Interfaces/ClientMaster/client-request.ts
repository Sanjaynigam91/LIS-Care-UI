export interface ClientRequest {
  clientId?: string | null; // ✅ optional or null allowed
  partnerId: string;
  clientCode: string;
  clientName: string;
  speciality: string;
  licenseNumber: string;
  clientType: string;
  emailId: string;
  mobileNumber: string;
  address: string;
  centreCode: string;
  clientStatus: boolean;
}



