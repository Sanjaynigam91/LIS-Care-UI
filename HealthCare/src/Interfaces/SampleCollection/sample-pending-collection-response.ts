export interface SamplePendingCollectionResponse {
  registeredDate: string;          // DateTime → ISO string
  referedDoctor: string;
  totalTubes: number;
  sampleType: string;
  barcode: string;
  newBarcode: string;
  sampleCollectionTime: string;    // DateTime → ISO string
  workOrderStatus: string;
  partnerId: string;
  patientCode: string;
  patientId: string;               // Guid → string
  lab: string;
  sampleId: number;
  isSpecimenCollected: boolean;
  actualBarcode: string;

}
export interface RequestedTest {
  testCode: string;
  testName: string;
  specimenType: string;
}