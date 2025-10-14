export interface CentreCustomRateResponse {
  MappingId: number;
  CenterCode?: string;
  CenterName?: string;
  TestCode?: string;
  TestName?: string;
  Mrp: number;
  CustomRate?: number; // decimal in C# can be number in TS
}
