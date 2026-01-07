export interface ApiResponseModel<T> {
  statusCode: number;
  status: boolean;
  responseMessage: string;
  data: T | null;
}
