export interface AnalyzerRequest {
  analyzerId: number;
  analyzerName: string;
  analyzerShortCode: string;
  status: string;
  supplierCode: string;
  purchasedValue?: number | null;     // nullable decimal
  warrantyEndDate?: Date | string | null; // nullable DateTime
  engineerContactNo: string;
  assetCode: string;
  partnerId: string;
}
