export interface referalRangeResponse {

    statusCode: number;
    status: boolean;
    responseMessage: string;
    data: {
        referralId:number;
        partnerId:string;
        testCode:string;
        gender:string;
        lowRange:number;
        highRange:number;
        normalRange:string;
        ageFrom:number;
        ageTo:number;
        isPregnant:boolean;
        lowCriticalValue:number;
        ageUnits:string;
        highCriticalValue:number;
        labTest:number;
    }; 
  }