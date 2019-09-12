import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { Observable } from 'rxjs';
import { DbService } from 'src/app/shared/db/db.service';
import { TestResult } from 'src/app/shared/test.result';

@Component({
  selector: 'app-test-results-grid',
  templateUrl: './test-results-grid.component.html',
  styleUrls: ['./test-results-grid.component.scss']
})
export class TestResultsGridComponent implements OnInit, OnChanges {
  @Input() TestId: number
  results$: Observable<TestResult[]>
  totalResults: number
  pageSize: number = 6
  currentPage: number = 1
  totalPages: number
  pages: number[]

  columns: string[] = ["FusionRequestId", "TestResult", "NumberOfDifferences", "DCScallsMatch", "Airline",
  "Airport", "FusionRequestType", "EventTime"]
  constructor(private dbService: DbService) { }

  ngOnInit() {

  }
  loadGrid() {
    console.log("voy a leer los results")
    this.results$ = this.dbService.getTestResults(this.TestId, this.pageSize, this.currentPage)
  }

  ngOnChanges(){
    console.log('el sorete es ' +this.TestId)
    this.dbService.getTestResultsStatistics(this.TestId)
      .subscribe(data => {
        console.log(data)
        this.totalResults = data.data.TotalRecords
        this.totalPages = (this.totalResults % this.pageSize != 0) ? Math.floor(this.totalResults / this.pageSize) + 1 : this.totalResults / this.pageSize
        this.pages = Array.from(Array(this.totalPages), (x, i) => i + 1)
      })
    this.loadGrid()
  }
}
