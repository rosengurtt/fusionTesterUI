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
  beginningOfTime: string = "2019-01-01 12:00:00.00"
  endOfTime: string = "2030-01-01 12:00:00.00"
  selectedDateFrom: string
  selectedDateTo: string
  testNameTyped: string
  dateFromIsValid: boolean = true
  dateToIsValid: boolean = true

  columns: string[] = ["TestId", "TestName", "TestDescription", "TestCreator", "CreationDateTime",
    "IncludeAirports", "IncludeAirlines", "IncludeFusionRequestTypes", "DateFrom", "DateTo", "StartDateTime", "EndDateTime", "RecordsProcessed",
    "NumberOfErrors", "TotalRecords", "Status"]
  constructor(private dbService: DbService, private router: Router) { }

  ngOnInit() {

    this.loadGrid()
  }

  loadGrid() {
    let args: any = {}
    args['page-size'] = this.pageSize
    args['page'] = this.currentPage

    if (this.selectedDateFrom && this.selectedDateFrom != this.beginningOfTime )
      args['date-from'] = this.selectedDateFrom
    if (this.selectedDateTo && this.selectedDateTo != this.endOfTime )
      args['date-to'] = this.selectedDateTo
    if (this.testNameTyped )
      args['test-name'] = this.testNameTyped

    this.dbService.getTestsStatistics(args)
      .subscribe(data => {
        this.totalTests = data.data.Tests
        this.totalPages = (this.totalTests % this.pageSize != 0) ? Math.floor(this.totalTests / this.pageSize) + 1 : this.totalTests / this.pageSize
        this.pages = Array.from(Array(this.totalPages), (x, i) => i + 1)
      })
    this.tests$ = this.dbService.getTests(args)
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

  dequeueTest(testId){
    let that = this
    this.dbService.startStopTest(testId, TestAction.dequeue).subscribe(
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

  showPageLink(page: number){
    return page < 5 || page > this.totalPages - 5
  }
  applyFilter(control){
    switch (control.id){
      case "dateFrom":
        let dateFrom =  new  Date(control.value)       
        if (dateFrom.toString() == 'Invalid Date'){
           this.dateFromIsValid = false
          return
        }
        else {
          if (control.value.length < 10) return
          this.selectedDateFrom = dateFrom.toISOString()
          this.dateFromIsValid = true
        }
        break
      case "dateTo":
          let dateTo =  new  Date(control.value)       
          if (dateTo.toString() == 'Invalid Date'){
            this.dateToIsValid = false
            return
          } 
          else {
            if (control.value.length < 10) return
            this.selectedDateTo = dateTo.toISOString()
            this.dateToIsValid = true            
          }
        break
      case("testName"):
        this.testNameTyped = control.value
        break;
    }
    this.loadGrid() 
  }

}
