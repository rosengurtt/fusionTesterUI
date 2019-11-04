import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Test, TestAction } from '../test'
import { Observable, of, interval } from 'rxjs';
import { timer } from 'rxjs';
import { catchError, map, tap, flatMap } from 'rxjs/operators';
import { TestsStatistics } from '../TestsStatistics';
import { TestResult } from '../test.result';
import { FusionRequest } from '../fusion.request';

@Injectable({
  providedIn: 'root'
})
export class DbService {

  private fusionTesterBaseUrl = '/fusiontester'
  private testsUrl = this.fusionTesterBaseUrl + '/tests'
  private testsStatisticsUrl = this.fusionTesterBaseUrl + '/tests/statistics'
  private airportsUrl = this.fusionTesterBaseUrl + '/airports'
  private airlinesUrl = this.fusionTesterBaseUrl + '/airlines'
  private fusionRequestTypesUrl = this.fusionTesterBaseUrl + '/fusion-request-types'
  private testExecutionUrl = this.fusionTesterBaseUrl + '/execution'
  private fusionRequestsUrl = this.fusionTesterBaseUrl + '/fusion-requests'
  private fusionRequestsStatisticsUrl = this.fusionTesterBaseUrl + '/fusion-requests/statistics'
  private fusionTesterMiscBaseUrl =  '/api'
  private fileUpload = this.fusionTesterMiscBaseUrl + '/upload'

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { }

  public getTests(args: any): Observable<Test[]> {
    let params = new HttpParams({ fromObject: args });

    return timer(0, 10000)
      .pipe(
        flatMap(() => this.http.get<Test[]>(this.testsUrl, { params }))
      )
  }
  
  public getTestsStatistics(args:any): Observable<any> {
    let params = new HttpParams({ fromObject: args });
    return this.http.get<any>(this.testsStatisticsUrl, { params });
  }

  public getTestResults(args: any): Observable<TestResult[]> {
    let params = new HttpParams({ fromObject: args });

    return timer(0, 10000)
      .pipe(
        flatMap(() => this.http.get<TestResult[]>(this.testsUrl + '/' + args.testId + '/results', { params }))
      )
  }
  public getTest(TestId: number) {
    return this.http.get<Test[]>(this.testsUrl + "/" + TestId);
  }


  public getTestResultsStatistics(testId: number): Observable<any> {
    return this.http.get<any>(this.testsUrl + '/' + testId + '/results/statistics');
  }

  public getResultDetails(testResultId: number): Observable<any> {
    return this.http.get<any>(this.testsUrl + '/results/' + testResultId);
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

  public getFusionRequests(args: any): Observable<any> {
    let params = new HttpParams({ fromObject: args });

    return this.http.get<FusionRequest[]>(this.fusionRequestsUrl, {  params })
  }

  public getFusionRequestsStatistics(args: any): Observable<any> {
    let params = new HttpParams({ fromObject: args });

    return  this.http.get<FusionRequest[]>(this.fusionRequestsStatisticsUrl, { params })      
  }

  public getFusionRequestExecute(fusionRequestId: number): Observable<any> {
    return this.http.get<any>(this.fusionRequestsUrl + '/' + fusionRequestId );
  }

  public postUploadFiles(file1, file2){
    const formData: FormData = new FormData();
    formData.append("FusionRequests", file1, "FusionRequests")
    formData.append("DCSrequests", file2, "DCSrequests")
    return this.http.post(this.fileUpload, formData)
  }

  public getUploadStatus(){
    return timer(0, 10000).pipe(flatMap(() => this.http.get(this.fileUpload)))
  }
}
