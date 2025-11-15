export interface ProjectTestMappingRequest {
  mappingId?: number;
  projectId?: number;
  partnerId?: string;
  testCode?: string;
  billRate?: number;  // decimal in C# → number in TS
}
