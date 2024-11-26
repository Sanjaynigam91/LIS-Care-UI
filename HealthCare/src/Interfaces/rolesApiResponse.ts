export interface rolesApiResponse {

  statusCode: number;
  status: boolean;
  responseMessage: string;
  data: {
    roleId: number;
    roleCode: string;
    roleName:string;
    roleType:string;
    department:string;
    rleStatus:string
  }; 
}
  
