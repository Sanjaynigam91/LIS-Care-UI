
export interface testMasterRequest {
    partnerId:string;
    testCode:string;
    testName:string;
    department:string;
    subDepartment:string;
    methodology:string;
    specimenType:string;
    referenceUnits:string;
    reportingStyle:string;
    reportTemplateName:string;
    reportingDecimals:number;
    isOutlab:boolean;
    printSequence:number;
    isReserved:string;
    testShortName:string;
    patientRate:number;
    clientRate:number;
    labRate:number;
    status:boolean;
    analyzerName:string;
    isAutomated:boolean;
    isCalculated:boolean;
    labTestCode:string;
    testApplicable:string;
    isLMP:boolean;
    isNABLApplicable:boolean;
    referalRangeComments:string;
    updatedBy:string;

   }