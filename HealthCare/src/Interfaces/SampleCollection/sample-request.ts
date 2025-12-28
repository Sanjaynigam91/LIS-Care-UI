export interface SampleRequest {
    barcode: string;
    collectionTime: Date;
    collectedBy: string|null;
    specimenType: string|any;
    patientId: string|null; // Guid → string
}
