import { Component, OnInit, Input } from '@angular/core';
import { DbService } from '../../shared/db/db.service';

@Component({
  selector: 'app-result-details',
  templateUrl: './result-details.component.html',
  styleUrls: ['./result-details.component.scss']
})
export class ResultDetailsComponent implements OnInit {
  @Input() TestResultId: number 
  expectedFusionResponse: string
  actualFusionResponse: string
  expectedDcsCalls: string
  actualDcsCalls: string

  constructor(private dbService: DbService) { }

  ngOnInit() { }
  ngOnChanges() {
    this.expectedFusionResponse = ''
    this.actualFusionResponse = ''
    this.expectedDcsCalls = ''
    this.actualDcsCalls = ''
    if (this.TestResultId) {
      this.dbService.getResultDetails(this.TestResultId)
        .subscribe(data => {
          this.expectedFusionResponse = data[0].ExpectedResponse
          this.actualFusionResponse = data[0].ActualResponse
          this.expectedDcsCalls = data[0].ExpectedDCScalls
          this.actualDcsCalls = data[0].ActualDCScalls
        })
    }
  }

}
