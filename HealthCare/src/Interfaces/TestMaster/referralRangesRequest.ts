export interface referralRangesRequest {
  opType: string;
  referralId: number;
  testCode: string;
  lowRange: number;
  highRange: number;
  normalRange: string;
  ageFrom: number;
  ageTo: number;
  gender: string;
  isPregnant: boolean;
  lowCriticalValue: number;
  highCriticalValue: number;
  partnerId: string;
  updatedBy: string;
}
