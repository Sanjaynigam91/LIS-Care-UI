export interface AcceptSampleResponse {
  data: boolean;
  responseMessage(responseMessage: any): unknown;
  status: boolean;
  statusCode: number;
  visitId: number;
  woeVialNo: number;
  message: string;
}
