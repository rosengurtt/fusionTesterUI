import { Component, OnInit, Input } from '@angular/core';
import {  TestAction } from '../../shared/test'
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
  pageSize: number = 10
  currentPage: number = 1
  totalPages: number
  pages: number[]
  testRunning: boolean[]
  testStopping: boolean[]
  refreshPeriodInSeconds: number = 30
  
  columns: string[] = ["TestId", "TestName", "TestDescription", "TestCreator", "CreationDateTime",
    "IncludeAirports", "IncludeAirlines", "IncludeFusionRequestTypes", "FromDate", "ToDate", "StartDateTime", "EndDateTime", "RecordsProcessed", "TotalRecords"]
  constructor(private dbService: DbService, private router: Router) {
    let that = this
    interval(this.refreshPeriodInSeconds * 1000).subscribe(x => { that.loadGrid() })
  }

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
    this.tests$ = this.dbService.getTests(this.pageSize, this.currentPage);
    this.testRunning = new Array(this.pageSize)
  }

  setPage(i: number) {
    this.currentPage = i
    this.loadGrid()
  }

  onClickEditTest(testId) {
    this.router.navigate(['/newTest/' + testId])
  }

  startTest(testId) {
    console.log("Will start test " + testId)
    let that = this
    this.dbService.startStopTest(testId, TestAction.start).subscribe(
      data => {
        if (data['result'] === 'success') {
          that.loadGrid()
        }
      },
      err => { console.log(err) }
    )
  }

  stopTest(testId){
    let that = this
    this.dbService.startStopTest(testId, TestAction.stop).subscribe(
      data => {
        if (data['result'] === 'success') {
          that.loadGrid()
        }
      },
      err => { console.log(err) }
    )
  }
}
