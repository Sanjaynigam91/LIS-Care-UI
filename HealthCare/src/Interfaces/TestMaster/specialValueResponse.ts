export interface specialValueResponse {

    statusCode: number;
    status: boolean;
    responseMessage: string;
    data: {
        recordId:number;
        partnerId:string;
        testCode:string;
        testName:string;
        allowedValue:string;
        isAbnormal:boolean;
    }; 
  }