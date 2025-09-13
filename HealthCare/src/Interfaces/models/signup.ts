export interface SignupRequest {
    firstName: string,
    lastName: string,
    email:string,
    password:string, 
    mobileNumber:number,
    roleId:number
 }

 export interface SignupResponse {
   message: any;
   success: any;
  statusCode: number;
 status: boolean;
 responseMessage: string;
 data:""
}

   