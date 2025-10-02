export interface Supplier {
  supplierCode: string;
  supplierName: string;
}

export interface SupplierResponse {
  statusCode: number;
  status: boolean;
  responseMessage: string;
  data: Supplier[];
}
