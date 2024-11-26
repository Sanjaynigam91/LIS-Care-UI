export interface LoginApiResponse {
    statusCode: number;
  status: boolean;
  responseMessage: string;
  data: {
    userId: number;
    roleId:any;
    fullName: string;
    password:string;
    email:string;
    mobileNumber:string,
    roleType:string;
    roleName:string;
    isMobileVerified:boolean;
    isEmailVerified:boolean;
    token:string;
    expires_in:Date,
    userStatus:string,
    partnerId:string,
    firstName:string,
    lastName:string,
    departmentId:number,
    userLogo:string
  };
}
