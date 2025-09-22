export interface ProfileTestMappingResponse {
  statusCode: number;
  status: boolean;
  responseMessage: string;
  data: ProfileTestMapping[];
}

export interface ProfileTestMapping {
  testsMappingId: string;
  profileCode: string;
  profileName: string;
  testCode: string;
  testName: string;
  reportTemplateName: string;
  printOrder: number;
  sectionName: string;
  groupHeader: string;
  canPrintSeparately: boolean;
}
