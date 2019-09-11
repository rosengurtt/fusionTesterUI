export class Test {
  TestId: number
  TestName: string
  TestDescription: string
  CreationDateTime: string
  StartDateTime: string | null
  LastActiveDateTime: string | null
  EndDateTime: string | null
  RecordsProcessed: number | null
  NumberOfErrors: number | null
  TestCreator: string
  IncludeAirports: string
  IncludeAirlines: string
  FromDate: string | null
  ToDate: string | null
  IncludeFusionRequestType: string
}

export enum TestAction {
  start = "start",
  stop = "stop"
}