export interface sampleCollectedAtResponse {

    statusCode: number;
    status: boolean;
    responseMessage: string;
    data: {
        recordId: number;
        partnerId:string;
        sampleCollectedPlaceName:string;
    }; 
  }