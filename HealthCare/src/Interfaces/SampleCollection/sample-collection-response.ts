export interface SampleCollectionResponse {
  patientId: string;          // Guid → string (UUID)
  patientCode: string;
  patientName: string;
  mobileNumber: string;
  centerCode: string;
  visitId: number;
  referDoctor: string;
  workOrderDate: string;      // DateTime → ISO string
  enteredBy: string;
}
