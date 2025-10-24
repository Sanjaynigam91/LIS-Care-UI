export interface ClientRatesRequest {
  clientCode: string;
  partnerId: string;
  testCode: string;
  billRate: string;
  createdBy?: string;
  updatedBy?: string;
}
