export interface metadataresponse {

    statusCode: number;
    status: boolean;
    responseMessage: string;
    data: {
        tagId:number;
        partnerId:string;
        tagCode:string;
        tagDescription:string;
        metaStatus:string
    }; 
  }
    
  