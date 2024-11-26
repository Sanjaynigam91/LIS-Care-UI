export interface PageHeaderResponseModel {

    statusCode: number;
    status: boolean;
    responseMessage: string;
    data: {
        navigationId:string;
        urlLabel:string;
        messageHeader:string;
        menuId:string;
        roleId:any;
        visibility:boolean;
        isReadEnabled:boolean;
        isWriteEnabled:boolean;
        isApproveEnabled:boolean;
        isSpecialPermssion:boolean;
        partnerId:string;
    }; 
  }