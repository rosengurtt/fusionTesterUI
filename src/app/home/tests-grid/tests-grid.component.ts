import { Component, OnInit, Input } from '@angular/core';
import { TestAction } from '../../shared/test'
import { Observable, Subscription, interval } from 'rxjs';
import { DbService } from 'src/app/shared/db/db.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tests-grid',
  templateUrl: './tests-grid.component.html',
  styleUrls: ['./tests-grid.component.css']
})
export class TestsGridComponent implements OnInit {
  tests$: Observable<any[]>
  totalTests: number
  pageSize: number = 6
  currentPage: number = 1
  totalPages: number
  pages: number[]
  testStopping: boolean[]
  refreshPeriodInSeconds: number = 30
  selectedTest: number = null

  columns: string[] = ["TestId", "TestName", "TestDescription", "TestCreator", "CreationDateTime",
    "IncludeAirports", "IncludeAirlines", "IncludeFusionRequestTypes", "FromDate", "ToDate", "StartDateTime", "EndDateTime", "RecordsProcessed",
    "NumberOfErrors", "TotalRecords"]
  constructor(private dbService: DbService, private router: Router) { }

  ngOnInit() {
    this.dbService.getTestsStatistics()
      .subscribe(data => {
        this.totalTests = data.data.Tests
        this.totalPages = (this.totalTests % this.pageSize != 0) ? Math.floor(this.totalTests / this.pageSize) + 1 : this.totalTests / this.pageSize
        this.pages = Array.from(Array(this.totalPages), (x, i) => i + 1)
      })
    this.loadGrid()
  }

  loadGrid() {
    this.tests$ = this.dbService.getTests(this.pageSize, this.currentPage)
  }

  setPage(i: number) {
    if (i != this.currentPage) {
      this.currentPage = i
      this.selectedTest = null
      this.loadGrid()
    }
  }

  onClickEditTest(testId) {
    this.router.navigate(['/newTest/' + testId], { queryParams: { Clone: 'false' } })
  }

  onClickCloneTest(testId) {
    this.router.navigate(['/newTest/' + testId], { queryParams: { Clone: 'true' } })
  }

  startTest(testId) {
    let that = this
    this.dbService.startStopTest(testId, TestAction.start).subscribe(
      data => { },
      err => { console.log(err) }
    )
  }

  stopTest(testId) {
    let that = this
    this.dbService.startStopTest(testId, TestAction.stop).subscribe(
      data => { },
      err => { console.log(err) }
    )
  }

  onTestRowClicked(testId) {
    this.selectedTest = testId
  }

  isTestSelected(testId) {
    return this.selectedTest == testId
  }
}
