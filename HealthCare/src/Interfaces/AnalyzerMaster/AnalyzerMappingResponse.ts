export interface AnalyzerMappingResponse {
  statusCode: number;
  status: boolean;
  responseMessage: string;
  data: AnalyzerMapping[];
}

export interface AnalyzerMapping {
  mappingId: number;
  analyzerTestCode: string;
  analyzerId: number;
  labTestCode: string;
  status: boolean;
  isProfileCode: boolean;
  sampleType: string;
  partnerId: string;
  testName: string;
}
