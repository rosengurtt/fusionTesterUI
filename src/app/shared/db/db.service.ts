import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Test } from '../test'
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { TestsStatistics } from '../TestsStatistics';

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
    return this.http.get<Test[]>(this.testsUrl, { params });
  }

  public getTest(TestId: number){
    return this.http.get<Test[]>(this.testsUrl + "/" + TestId);
  }

  public getTestsStatistics(): Observable<any> {
    return this.http.get<any>(this.testsStatisticsUrl);
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

  public putTest(TestId: number, data){
    return this.http.put(this.testsUrl + '/' + TestId , data)
  }
  
  public startTest(TestId: number, reset: boolean){
    return this.http.post(this.testsUrl, data)
  }

}
