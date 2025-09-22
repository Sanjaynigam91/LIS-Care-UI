// Root response interface
export interface ProfileResponse {
  statusCode: number;
  status: boolean;
  responseMessage: string;
  data: Profile[];
}

// Profile interface
export interface Profile {
  partnerId: string;
  profileCode: string;
  profileName: string;
  mrp: number;
  profileStatus: boolean;
  b2CRates: number;
  sampleTypes: string;
  labrates: number;
  tatHrs: number;
  cptCodes: string;
  printSequence: number;
  isRestricted: boolean;
  subProfilesCount: number;
  recordId: number;
  normalRangeFooter: string;
  testShortName: string;
  profileProfitRate: number;
  labTestCodes: string;
  isProfileOutLab: boolean;
  testApplicable: string;
  isLMP: boolean;
  isNABLApplicable: boolean;
  isAvailableForAll: boolean;
}