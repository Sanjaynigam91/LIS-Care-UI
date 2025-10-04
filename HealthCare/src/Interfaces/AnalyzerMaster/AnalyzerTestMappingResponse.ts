export interface AnalyzerTestMappingResponse {
  statusCode: number;
  status: boolean;
  responseMessage: string;
  data: AnalyzerTestMapping[];
}

export interface AnalyzerTestMapping {
  mappingId: number;
  analyzerTestCode: string;
  analyzerId: number;
  labTestCode: string;
  status: boolean;
  isProfileCode: boolean;
  sampleType: string;
  partnerId: string;
}
