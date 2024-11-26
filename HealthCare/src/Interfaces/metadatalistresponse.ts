export interface metadatalistresponse {

    statusCode: number;
    status: boolean;
    responseMessage: string;
    data: {
        recordId:number;
        partnerId:string;
        category:string;
        itemType:string;
        itemDescription:string
    }; 
  }
    
  