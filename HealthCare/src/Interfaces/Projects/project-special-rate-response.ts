export interface ProjectSpecialRateResponse {
  mappingId: number;
  projectId: number;
  projectName?: string | null;
  testcode?: string | null;
  testName?: string | null;
  mrp: number;
  isProfile: boolean;
  specialRate: number;
  validFrom: Date;
  validTo: Date;
  isCovered: boolean;
  isApprovalMandatory: boolean;
}
