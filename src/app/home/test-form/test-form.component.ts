import { Component, OnInit, ChangeDetectorRef, OnChanges } from '@angular/core';
import { DbService } from 'src/app/shared/db/db.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupDirective,
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
  TestId: number

  constructor(private dbService: DbService, fb: FormBuilder, private router: Router, private route: ActivatedRoute) {

    this.newTestForm = fb.group({
      TestName: [, Validators.minLength(2)],
      TestDescription: [],
      TestCreator: [],
      IncludeAirports: [],
      IncludeAirlines: [],
      IncludeFusionRequestTypes: [],
      FromDate: [],
      ToDate: []
    }, {
      validator: [fromDateOlderThanToDateValidator]
    });
  }

  ngOnInit() {

    this.sub = this.route.params.subscribe(params => {
      this.TestId = + params['TestId'] // (+) converts string 'id' to a number
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
            next(x) { that.populateForm(x[0]) }
          })
        }
      }
    )



  }

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
      this.newTestForm.controls['FromDate'].setValue(data['FromDate'])
      this.newTestForm.controls['ToDate'].setValue(data['ToDate'])

      for (let i = 1; i < this.airports.length; i++) {
        if (data['IncludeAirports'].includes(this.airports[i])) {
          this.selectedAirports[i] = true
          this.selectedAirports[0] = false
        }
        else
          this.selectedAirports[i] = false
      }
      for (let i = 1; i < this.airlines.length; i++) {
        if (data['IncludeAirlines'].includes(this.airlines[i])) {
          this.selectedAirlines[i] = true
          this.selectedAirlines[0] = false
        }
        else
          this.selectedAirlines[i] = false
      }
      for (let i = 1; i < this.fusionRequestTypes.length; i++) {
        if (data['IncludeFusionRequestTypes'].includes(this.fusionRequestTypes[i])) {
          this.selectedRequestTypes[i] = true
          this.selectedRequestTypes[0] = false
        }
        else
          this.selectedRequestTypes[i] = false
      }
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
    this.dbService.getAirlines()
      .subscribe(data => {
        this.airlines = data.split(/[\r\n]+/).filter(Boolean)
        this.airlines[0] = 'All'
      });

    this.dbService.getAirports()
      .subscribe(data => {
        this.airports = data.split(/[\r\n]+/).filter(Boolean)
        this.airports[0] = 'All'
      });

    this.dbService.getFusionRequestTypes()
      .subscribe(data => {
        this.fusionRequestTypes = data.split(/[\r\n]+/).filter(Boolean)
        this.fusionRequestTypes[0] = 'All'
      });
  }


  onSubmit(): void {
    this.errorMessage = ""
    let that = this

    this.setDefaultValueForArray('IncludeAirlines')
    this.setDefaultValueForArray('IncludeAirports')
    this.setDefaultValueForArray('IncludeFusionRequestTypes')
    let formHandle = this.router
    if (this.newTestForm.valid) {
      if (isNaN(this.TestId)) {
        this.dbService.postNewTest(this.newTestForm.value).subscribe({
          next(x) { formHandle.navigate(['/home']); },
          error(err) { that.errorMessage = "The data could not be saved."; console.error(err); },
          complete() { formHandle.navigate(['/home']); },
        });
      }
      else {
        this.dbService.putTest(this.TestId, this.newTestForm.value).subscribe({
          next(x) { formHandle.navigate(['/home']);  },
          error(err) { that.errorMessage = "The data could not be saved."; console.error(err); },
          complete() { formHandle.navigate(['/home']); },
        });
      }
    }
    else {
      this.errorMessage = "The data is invalid"
    };
  }
  // This function is needed because if the user hasn't changed the selection of the select controls, Angular
  // will return an emtpy array (despite the first "All" element been selected by default)
  // Thank you Angular for being such a peace of sheet
  private setDefaultValueForArray(arrayName: string) {
    if (this.newTestForm.controls[arrayName].value == null) {
      this.newTestForm.controls[arrayName].setValue(["All"])
    }
  }

  cancel(): void {
    this.router.navigate(['/home']);
  }

}
function fromDateOlderThanToDateValidator(group: FormGroup): ValidationErrors | null {
  const fromDate = group.controls['FromDate'].value;
  const toDate = group.controls['ToDate'].value;

  if (fromDate && toDate) {
    return fromDate <= toDate ? null : { checkFromDateIsOlderThanToDate: true };
  } else {
    return null;
  }
}


