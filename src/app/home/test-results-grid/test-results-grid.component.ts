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
  pageSize: number = 8
  currentPage: number = 1
  totalPages: number
  pages: number[]
  selectedResult: number = null
  ExcludeOKrecords: boolean = false
  pageLinksToShow: number = 20

  columns: string[] = ["FusionRequestId", "TestResult", "NumberOfDifferences", "DCScallsMatch", "Airline",
    "Airport", "FusionRequestType", "EventTime"]

  constructor(private dbService: DbService) { }

  ngOnInit() {

  }
  loadGrid() {
    this.selectedResult = null
    let args: any = {}
    args.testId = this.TestId
    args['page-size'] = this.pageSize
    args.page = this.currentPage
    args['exclude-ok-results'] = this.ExcludeOKrecords
    this.results$ = this.dbService.getTestResults(args)
  }

  ngOnChanges() {
    if (this.TestId) {
      this.updatePagingButtons()
    }
    else {
      this.ExcludeOKrecords = false
      this.selectedResult = null
    }
  }

  updatePagingButtons() {
    this.dbService.getTestResultsStatistics(this.TestId)
      .subscribe(data => {
        if (this.ExcludeOKrecords) {
          this.totalResults = data.data.FailedRecords
        }
        else {
          this.totalResults = data.data.TotalRecords
        }
        this.totalPages = (this.totalResults % this.pageSize != 0) ? Math.floor(this.totalResults / this.pageSize) + 1 : this.totalResults / this.pageSize
        this.pages = Array.from(Array(this.totalPages), (x, i) => i + 1)
        this.loadGrid()
      })
  }

  setPage(i: number) {
    if (i != this.currentPage) {
      this.currentPage = i
      this.loadGrid()
    }
  }

  onTestResultsRowClicked(testResultId) {
    this.selectedResult = testResultId
  }

  isTestResultsSelected(testResultId) {
    return this.selectedResult == testResultId
  }

  excludeOKclicked(event) {
    this.ExcludeOKrecords = event.srcElement.checked
    this.setPage(1)
    this.loadGrid()
    this.updatePagingButtons()
  }

  showPageLink(page: number) {
    if (page > this.currentPage - this.pageLinksToShow/2 && page < this.currentPage + this.pageLinksToShow/2 )
      return true
    return false
  }

  getTextToDisplay(text){
    if (text != null){
      return (text.toString().length > 220)? text.toString().substring(0,220) + "......": text.toString()
    }
  }
}
