export interface LisPageResponseModel {
      statusCode: number;
      status: boolean;
      responseMessage: string;
      data: {  
        navigationId:string;
        pageName:string;
        pageEntity:string;
        criteria:string;
        status:string;
        partnerId:string
  }
}
    
  