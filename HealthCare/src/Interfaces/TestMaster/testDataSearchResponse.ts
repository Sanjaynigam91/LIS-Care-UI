export interface testDataSearchResponse {

    statusCode: number;
    status: boolean;
    responseMessage: string;
    data: {
        testCode:string;
        testName:string;
        specimenType:string;
        referenceUnits:string;
        discipline:string;
        mrp:number;
        B2CRates:number;
        labRates:number;
        reportingStyle:string;
        printAs:string;
        aliasName:string;
        reportTemplateTame:string;
        subDiscipline:string;
    }; 
  }