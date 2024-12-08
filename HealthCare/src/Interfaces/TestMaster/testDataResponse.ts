export interface testDataResponse {

    statusCode: number;
    status: boolean;
    responseMessage: string;
    data: {
        partnerId:string;
        testCode:string;
        testName:string;
        specimenType:string;
        containerType:string;
        specimenVolume:string;
        transportConditions:string;
        discipline:string;
        subDiscipline:string;
        methodology:string;
        analyzerName:string;
        isAutomated:string;
        isCalculated:string;
        reportingLeadTime:string;
        mrp:number;
        isActive:boolean;
        normalRangeOneline:string;
        reportTemplateName:string;
        reportingDecimals:number;
        referenceUnits:string;
        b2CRates:number;
        reportingStyle:string;
        scheduledDays:string;
        isReserved:string;
        isOutlab:boolean;
        outlabCode:string;
        reportPrintOrder:number;
        reportSection:string;
        labRates:number;
        lowestAllowed:number;
        highestAllowed:number;
        technology:string;
        printAs:string;
        cptCode:string;
        calculatedValue:string;
        aliasName:string;
        recordId:number;
        normalRangeFooter:string;
        departmentWiseNumbers:string;
        testShortName:string;
        modality:string;
        defaultFilmCount:string;
        defaultContrastML:string;
        testProfitRate:number;
        labTestCode:string;
        testApplicable:string;
        isLMP:boolean;
        oldtestCode:string;
        isNABLApplicable:boolean;

    }; 
  }