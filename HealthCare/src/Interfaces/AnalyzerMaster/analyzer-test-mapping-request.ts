export interface AnalyzerTestMappingRequest {
    mappingId: number;
    analyzerId: number;
    analyzerTestCode: string;
    labTestCode: string;
    status: boolean;
    partnerId: string; 
}
