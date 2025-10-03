// Root response from API
export interface AnalyzerApiResponse {
  statusCode: number;
  status: boolean;
  responseMessage: string;
  data: AnalyzerResponse[];  // array of analyzers
}

// Individual analyzer object
export interface AnalyzerResponse {
  analyzerId: number;
  analyzerName: string;
  analyzerCode: string;
  analyzerStatus: boolean;
  supplierCode: string;
  purchaseValue: number;
  warrantyEndDate: string;    // ISO date string or custom format "20301002"
  engineerContactNo: string;
  assetCode: string;
  partnerId: string;
}
