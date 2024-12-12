export interface centerRateResponse {

    statusCode: number;
    status: boolean;
    responseMessage: string;
    data: {       
        partnerCode:string;
        partnerName:string;
        testCode:string;
        billRate:number;
    }; 
  }