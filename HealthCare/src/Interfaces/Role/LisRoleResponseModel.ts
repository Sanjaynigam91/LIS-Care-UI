export interface LisRoleResponseModel {
    statusCode: number;
    status: boolean;
    responseMessage: string;
    data: {
        roleId:number;
        roleCode:string;
        roleName:string;
        roleType:string;
        department:string;
        roleStatus:string
    }; 
  }
    
  