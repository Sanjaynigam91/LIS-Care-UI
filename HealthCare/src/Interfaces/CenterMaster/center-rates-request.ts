export interface CenterRatesRequest {
  centerCode: string;      // required
  partnerId: string;       // required
  testCode: string;        // required
  billRate: string;        // required
  createdBy?: string;      // optional
  updatedBy?: string;      // optional
}
