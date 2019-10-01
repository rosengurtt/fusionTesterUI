import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Test, TestAction } from '../test'
import { Observable, of, interval } from 'rxjs';
import { timer } from 'rxjs';
import { catchError, map, tap, flatMap } from 'rxjs/operators';
import { TestsStatistics } from '../TestsStatistics';
import { TestResult } from '../test.result';

@Injectable({
  providedIn: 'root'
})
export class DbService {

  private baseUrl = '/fusiontester'
  private testsUrl = this.baseUrl + '/tests'
  private testsStatisticsUrl = this.baseUrl + '/tests/statistics'
  private airportsUrl = this.baseUrl + '/airports'
  private airlinesUrl = this.baseUrl + '/airlines'
  private fusionRequestTypesUrl = this.baseUrl + '/fusion-request-types'
  private testExecutionUrl = this.baseUrl + '/execution'
  
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { }

  public getTests(pageSize: number = 10, page: number = 1, dateFrom: string = "1900-01-01", dateTo: string = "3000-01-01"): Observable<Test[]> {
    const params = new HttpParams()
      .set("page-size", pageSize.toString())
      .set("page", page.toString())
      .set("date-from", dateFrom.toString())
      .set("date-to", dateTo.toString());

    return timer(0, 10000)
    .pipe(
        flatMap(() => this.http.get<Test[]>(this.testsUrl, { params }))
    )
  }

  public getTestResults(testId: number, pageSize: number = 10, page: number = 1): Observable<TestResult[]> {
    const params = new HttpParams()
      .set("page-size", pageSize.toString())
      .set("page", page.toString())

    return timer(0, 1000000)
    .pipe(
        flatMap(() => this.http.get<TestResult[]>(this.testsUrl+ '/' + testId + '/results', { params }))
    )
  }
  public getTest(TestId: number) {
    return this.http.get<Test[]>(this.testsUrl + "/" + TestId);
  }

  public getTestsStatistics(): Observable<any> {
    return this.http.get<any>(this.testsStatisticsUrl);
  }

  public getTestResultsStatistics(testId: number): Observable<any> {
    return this.http.get<any>(this.testsUrl + '/' + testId + '/results/statistics');
  }

  public getResultDetails(testResultId: number): Observable<any> {
    return this.http.get<any>(this.testsUrl +  '/results/' + testResultId);
  }

  public getAirlines(): Observable<any> {
    return this.http.get(this.airlinesUrl, { responseType: 'text' });
  }

  public getAirports(): Observable<any> {
    return this.http.get(this.airportsUrl, { responseType: 'text' });
  }

  public getFusionRequestTypes(): Observable<any> {
    return this.http.get(this.fusionRequestTypesUrl, { responseType: 'text' });
  }

  public postNewTest(data) {
    return this.http.post(this.testsUrl, data)
  }

  public putTest(TestId: number, data) {
    return this.http.put(this.testsUrl + '/' + TestId, data)
  }

  public startStopTest(TestId: number, testAction: TestAction) {
    return this.http.post(this.testExecutionUrl + '/' + TestId, { "Action": testAction })
  }
  

}
