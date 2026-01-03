export interface SampleAccessionTestResponse {
    testCode: string;
    testName: string;
    sampleType: string;
    collectionTime: Date;
    sampleId: number;
    workOrderStatus: string;
    rejectionRemarks: string;
    rejectedBy: string;
    rejectedDate: Date;
    requestId: string; // Guid → string in TS
    isRejected: boolean;
    patientName: string;
    createdOn: Date;
    barcode: string;
    cancelRejectionRemark: string;
    isApprovalMandatory: boolean;
}
