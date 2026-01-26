export interface PendingPatientResponse {
    workOrderDate: string;
    centerCode: string;
    patientName: string;
    patientCode: string;
    departments: string;
    barcodeIds: string;
    testProfiles: string;
    newWorkOrderDate: Date;
    referredBy: string;
    clinicFileNumber: number;
    visitId: number;
    centerName: string;
    sampleType: string;
}
