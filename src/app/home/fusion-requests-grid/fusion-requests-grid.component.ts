import { Component, OnInit, Input } from '@angular/core';
import { Observable, Subscription, interval, forkJoin } from 'rxjs';
import { DbService } from 'src/app/shared/db/db.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-fusion-requests-grid',
  templateUrl: './fusion-requests-grid.component.html',
  styleUrls: ['./fusion-requests-grid.component.scss']
})
export class FusionRequestsGridComponent implements OnInit {
  requests$: Observable<any[]>
  totalRequests: number
  pageSize: number = 6
  currentPage: number = 1
  totalPages: number
  pages: number[]
  refreshPeriodInSeconds: number = 30
  selectedRequest: string = null

  selectedPNR: string = null
  selectedAirports: string[]
  selectedAirlines: string[]
  selectedRequestTypes: string[]
  selectedDateFrom: string
  selectedDateTo: string

  airlines: string[]
  airports: string[]
  requestTypes: string[]
  sub: any
  sub2: any
  FusionRequestId: string
  beginningOfTime: string = "2019-01-01 12:00:00.00"
  endOfTime: string = "2030-01-01 12:00:00.00"
  dateFromIsValid: boolean = true
  dateToIsValid: boolean = true

  columns: string[] = ["FusionRequestId", "RequestType", "Airline", "Airport", "PNR",
    "RequestTime", "FusionRequestXml", "FusionResponseXml"]
  
    constructor(private dbService: DbService, private router: Router) { }


  ngOnInit() {

    this.loadGrid()

    let that = this
    this.loadADropDownData().subscribe(
      data => {
        this.fillDropdownArrays(data)
      }
    )
  }
  
  
  fillDropdownArrays(responseList) {
    this.airlines = responseList[0].split(/[\r\n]+/).filter(Boolean)
    this.airlines[0] = 'All';
    this.airports = responseList[1].split(/[\r\n]+/).filter(Boolean)
    this.airports[0] = 'All';
    this.requestTypes = responseList[2].split(/[\r\n]+/).filter(Boolean)
    this.requestTypes[0] = 'All';
  }
  loadADropDownData() {
    return forkJoin([this.dbService.getAirlines(), this.dbService.getAirports(), this.dbService.getFusionRequestTypes()])
  }

  applyFilter(control){    
    let selectionChanged = [];
    for (var i = 0; i < control.length; i++) {
        if (control.options[i].selected) selectionChanged.push("'" + control.options[i].value + "'");
    }
    switch (control.id){
      case "RequestTypes":
          this.selectedRequestTypes =  selectionChanged
          break
      case "Airports":
          this.selectedAirports =  selectionChanged
          break
      case "Airlines":
           this.selectedAirlines =  selectionChanged
          break
      case "PNR":
        this.selectedPNR = control.value
        break
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
    }
    this.loadGrid() 
  }

  loadGrid() {
    let args: any = {}
    args['page-size'] = this.pageSize
    args['page'] = this.currentPage
    if (this.selectedRequestTypes && this.selectedRequestTypes.length > 0 && this.selectedRequestTypes[0] != "'All'")
      args['request-type'] = new Array(this.selectedRequestTypes).join()
    if (this.selectedAirports && this.selectedAirports.length > 0 && this.selectedAirports[0] != "'All'")
      args.airport = new Array(this.selectedAirports).join()
    if (this.selectedAirlines && this.selectedAirlines.length > 0 && this.selectedAirlines[0] != "'All'")
      args.airline = new Array(this.selectedAirlines).join()
    if (this.selectedPNR && this.selectedPNR.length > 0 )
      args.pnr = this.selectedPNR
    if (this.selectedDateFrom && this.selectedDateFrom != this.beginningOfTime )
      args['date-from'] = this.selectedDateFrom
    if (this.selectedDateTo && this.selectedDateTo != this.endOfTime )
      args['date-to'] = this.selectedDateTo

    this.dbService.getFusionRequestsStatistics(args)
      .subscribe(data => {
        this.totalRequests = data.data.FusionRequests
        this.totalPages = (this.totalRequests % this.pageSize != 0) ? Math.floor(this.totalRequests / this.pageSize) + 1 : this.totalRequests / this.pageSize
        this.pages = Array.from(Array(this.totalPages), (x, i) => i + 1)
        
      })
    this.requests$ = this.dbService.getFusionRequests(args )
  }

  setPage(i: number) {
    if (i != this.currentPage) {
      this.currentPage = i
      this.selectedRequest = null
      this.loadGrid()
    }
  }

  onClickExecute(fusionRequestId) {
    this.dbService.getFusionRequestExecute(fusionRequestId).subscribe(data => console.log(data))
  }


  onTestRowClicked(fusionRequestId) {
    this.selectedRequest = fusionRequestId
  }

  isTestSelected(fusionRequestId) {
    return this.selectedRequest == fusionRequestId
  }

  showPageLink(page: number){
    return page < 5 || page > this.totalPages - 5
  }
}
