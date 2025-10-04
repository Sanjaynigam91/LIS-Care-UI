export interface AnalyzerResponse {
  analyzerId: number;
  analyzerName: string;           // default ''
  analyzerCode: string;           // default ''
  analyzerStatus: boolean;        // default false
  supplierCode: string;           // default ''
  purchaseValue: number;          // default 0
  warrantyEndDate: string;          // default new Date()
  engineerContactNo: string;      // default ''
  assetCode: string;              // default ''
  partnerId: string;              // required
  supplierName: string;           // default ''
}
