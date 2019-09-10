import { Component, OnInit, Input } from '@angular/core';
import { Test } from '../../shared/test'
import { Observable, Subscription } from 'rxjs';
import { DbService } from 'src/app/shared/db/db.service';
import { map } from "rxjs/operators";
import { ActivatedRoute, Router } from '@angular/router';

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
  pages : number[]

  columns: string[] = ["TestId", "TestName", "TestDescription", "TestCreator", "CreationDateTime", 
                      "IncludeAirports", "IncludeAirlines", "IncludeFusionRequestTypes", "EndDateTime", "FromDate", "ToDate", "TotalRecords"]
  constructor(private dbService: DbService, private router: Router) { }

  ngOnInit() {
    this.dbService.getTestsStatistics()
      .subscribe(data => {
        this.totalTests = data.data.Tests
        this.totalPages = (this.totalTests % this.pageSize != 0) ? Math.floor(this.totalTests / this.pageSize) + 1: this.totalTests / this.pageSize
        this.pages = Array.from(Array(this.totalPages),(x,i)=>i+1)
      })
    this.loadGrid()
  }

  loadGrid() {
    this.tests$ = this.dbService.getTests(this.pageSize, this.currentPage);
  }

  setPage(i: number) {
    this.currentPage = i
    this.loadGrid()
  }

  onClickNewTest(){
    this.router.navigate(['/newTest/new'])
  }

  startTest(testId){
console.log(testId)
  }
}
