import { Component, OnInit } from '@angular/core';
import { DbService } from 'src/app/shared/db/db.service';
import {
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-test-form',
  templateUrl: './test-form.component.html',
  styleUrls: ['./test-form.component.css']
})
export class TestFormComponent implements OnInit {
  airlines: string[]
  selectedAirlines: boolean[]
  airports: string[]
  selectedAirports: boolean[]
  fusionRequestTypes: string[]
  selectedRequestTypes: boolean[]
  newTestForm: FormGroup
  errorMessage: string = ""
  sub: any
  sub2: any
  TestId: number
  Clone: boolean
  dateFromIsValid: boolean = true
  dateToIsValid: boolean = true

  constructor(private dbService: DbService, fb: FormBuilder, private router: Router, private route: ActivatedRoute) {

    this.newTestForm = fb.group({
      TestName: [, Validators.minLength(2)],
      TestDescription: [],
      TestCreator: [],
      IncludeAirports: [],
      IncludeAirlines: [],
      IncludeFusionRequestTypes: [],
      DateFrom: [],
      DateTo: []
    }, {
      validator: [dateFromOlderThanDateToValidator]
    });
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.TestId = + params['TestId'] // (+) converts string 'id' to a number
    })
    this.sub2 = this.route.queryParams.subscribe(params => {
      this.Clone = (params['Clone'] == 'true')
    })
    let that = this
    this.loadADropDownData().subscribe(
      data => {
        this.fillDropdownArrays(data)
        if (isNaN(this.TestId)) {
          this.populateForm(null)
        }
        else {

          this.dbService.getTest(this.TestId).subscribe({
            next(x) { that.populateForm(x) }
          })
        }
      }
    )
  }
  get TestName() { return this.newTestForm.get('TestName'); }

  private populateForm(data: any) {
    this.selectedAirports = new Array(this.airports.length)
    this.selectedAirports[0] = true
    this.selectedAirlines = new Array(this.airlines.length)
    this.selectedAirlines[0] = true
    this.selectedRequestTypes = new Array(this.fusionRequestTypes.length)
    this.selectedRequestTypes[0] = true

    if (data) {

      this.newTestForm.controls['TestName'].setValue(data['TestName'])
      this.newTestForm.controls['TestDescription'].setValue(data['TestDescription'])
      this.newTestForm.controls['TestCreator'].setValue(data['TestCreator'])
      this.newTestForm.controls['DateFrom'].setValue(data['DateFrom'])
      this.newTestForm.controls['DateTo'].setValue(data['DateTo'])

      let auxAirports: string[] = []
      for (let i = 1; i < this.airports.length; i++) {
        if (data['IncludeAirports'].includes(this.airports[i])) {
          this.selectedAirports[i] = true
          this.selectedAirports[0] = false
          auxAirports.push(this.airports[i])
        }
        else
          this.selectedAirports[i] = false
      }
      this.newTestForm.controls['IncludeAirports'].setValue(auxAirports)

      let auxAirlines: string[] = []
      for (let i = 1; i < this.airlines.length; i++) {
        if (data['IncludeAirlines'].includes(this.airlines[i])) {
          this.selectedAirlines[i] = true
          this.selectedAirlines[0] = false
          auxAirlines.push(this.airlines[i])
        }
        else
          this.selectedAirlines[i] = false
      }
      this.newTestForm.controls['IncludeAirlines'].setValue(auxAirlines)

      let auxRequestTypes: string[] = []
      for (let i = 1; i < this.fusionRequestTypes.length; i++) {
        if (data['IncludeFusionRequestTypes'].includes(this.fusionRequestTypes[i])) {
          this.selectedRequestTypes[i] = true
          this.selectedRequestTypes[0] = false
          auxRequestTypes.push(this.fusionRequestTypes[i])
        }
        else
          this.selectedRequestTypes[i] = false
      }
      this.newTestForm.controls['IncludeFusionRequestTypes'].setValue(auxRequestTypes)
    }
    else {
      this.newTestForm.controls['TestDescription'].setValue('')
      this.newTestForm.controls['TestCreator'].setValue('')
    }
  }

  fillDropdownArrays(responseList) {
    this.airlines = responseList[0].split(/[\r\n]+/).filter(Boolean)
    this.airlines[0] = 'All'
    this.airports = responseList[1].split(/[\r\n]+/).filter(Boolean)
    this.airports[0] = 'All'
    this.fusionRequestTypes = responseList[2].split(/[\r\n]+/).filter(Boolean)
    this.fusionRequestTypes[0] = 'All'
  }

  loadADropDownData() {
    return forkJoin([this.dbService.getAirlines(), this.dbService.getAirports(), this.dbService.getFusionRequestTypes()])
  }


  onSubmit(): void {
    this.errorMessage = ""
    let that = this
    this.setControlsAsTouched()
    this.setDefaultValueForArray('IncludeAirlines')
    this.setDefaultValueForArray('IncludeAirports')
    this.setDefaultValueForArray('IncludeFusionRequestTypes')
    let formHandle = this.router
    if (!this.newTestForm.errors) {
      if (isNaN(this.TestId) || this.Clone == true) {
        this.dbService.postNewTest(this.newTestForm.value).subscribe({
          next(x) {
            formHandle.navigate(['/home']);
          },
          error(err) { that.errorMessage = "The data could not be saved."; console.error(err); },
          complete() {
            formHandle.navigate(['/home']);
          },
        });
      }
      else {
        this.dbService.putTest(this.TestId, this.newTestForm.value).subscribe({
          next(x) {
            formHandle.navigate(['/home']);
          },
          error(err) { that.errorMessage = "The data could not be saved."; console.error(err); },
          complete() {
            formHandle.navigate(['/home']);
          },
        });
      }
    }
    else {
      this.errorMessage = "The data is invalid"
      console.log(this.newTestForm.errors)
    };
  }

  setControlsAsTouched() {
    Object.keys(this.newTestForm.controls).forEach(field => {
      const control = this.newTestForm.get(field);
      control.markAsTouched({ onlySelf: true });
    });
  }

  displayFieldCss(field: string) {
    let control = this.newTestForm.get(field);
    return {
      'is-invalid': !control.valid && control.touched
    };
  }

  // This function is needed because if the user hasn't changed the selection of the select controls, Angular
  // will return an emtpy array (despite the first "All" element been selected by default)
  // Thank you Angular for being such a peace of sheet
  private setDefaultValueForArray(arrayName: string) {
    if (this.newTestForm.controls[arrayName].value == null || this.newTestForm.controls[arrayName].value.length === 0) {
      this.newTestForm.controls[arrayName].setValue(["All"])
    }
  }


  cancel(): void {
    this.router.navigate(['/home']);
  }

  applyFilter(control) {
    console.log(control)
    switch (control.id) {
      case "dateFrom":
        console.log(control)
        let dateFrom = new Date(control.value)
        if (dateFrom.toString() == 'Invalid Date')
          this.dateFromIsValid = false
        else
          this.dateFromIsValid = true
        break
      case "dateTo":
        let dateTo = new Date(control.value)
        if (dateTo.toString() == 'Invalid Date')
          this.dateToIsValid = false
        else
          this.dateToIsValid = true
        break
    }
  }


}
function dateFromOlderThanDateToValidator(group: FormGroup): ValidationErrors | null {
  const dateFrom = group.controls['DateFrom'].value;
  const dateTo = group.controls['DateTo'].value;

  if (dateFrom && dateTo) {
    return dateFrom <= dateTo ? null : { checkDateFromIsOlderThanDateTo: true };
  } else {
    return null;
  }
}




