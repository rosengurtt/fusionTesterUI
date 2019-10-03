import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-file-compare',
  templateUrl: './file-compare.component.html',
  styleUrls: ['./file-compare.component.scss']
})
export class FileCompareComponent implements OnInit {
  @Input() Expected: string
  @Input() Actual: string
  @Input() Title: string
  ExpectedFormatted: string
  ActualFormatted: string

  constructor() { }

  ngOnInit() {
  }
  ngOnChanges() {
    if (this.Expected && this.Actual)
      [this.ExpectedFormatted, this.ActualFormatted] = this.formatText(this.Expected, this.Actual)
    else
    [this.ExpectedFormatted, this.ActualFormatted] = ["",""]
  }

  formatText(expected: string, actual: string) {

    let ExpectedFormatted = ''
    let ActualFormatted = ''

    let linesExpected = expected.split('\n')
    let linesActual = actual.split('\n')

    let a = 0
    let e = 0


    while (e < linesExpected.length && a < linesActual.length ) {
      if (linesExpected[e].trim() == linesActual[a].trim()) {
        ExpectedFormatted += this.formatLine(linesExpected[e], false)
        ActualFormatted += this.formatLine(linesActual[a], false)
        e++
        a++
      }
      else {
        let da = 1
        let de = 1
        while (a+da < linesActual.length && linesExpected[e].trim() != linesActual[a + da].trim()) {
          da++
        }
        while (e+de < linesExpected.length && linesExpected[e + de].trim() != linesActual[a].trim()) {
          de++
        }
        
        if (a + da < linesActual.length - 1) {
          for (let i = 0; i < da; i++) {
            ExpectedFormatted += this.formatLine("-".repeat(linesActual[a + i].length), false)
            ActualFormatted += this.formatLine(linesActual[a + i], true)
          }
          a += da
        }
        else {
          if (e + de < linesExpected.length - 1 ) {
            for (let i = 0; i < de; i++) {
              ExpectedFormatted += this.formatLine(linesExpected[e + i], true)
              ActualFormatted += this.formatLine("-".repeat(linesExpected[e + i].length), false)
            }
            e += de
          }
        }        
        if (e < linesExpected.length && a < linesActual.length && linesExpected[e].trim() != linesActual[a].trim()) {
          ExpectedFormatted += this.formatLine(linesExpected[e], true)
          ActualFormatted += this.formatLine(linesActual[a], true)
          e++
          a++
        }
        
      }
    }
    while (e < linesExpected.length) {
      ExpectedFormatted += this.formatLine(linesExpected[e], true)
      e++
    }
    while (a < linesActual.length) {
      ActualFormatted += this.formatLine(linesActual[a], true)
      a++
    }
    return [ExpectedFormatted, ActualFormatted]
  }
  formatLine(text: string, highlight: boolean) {
    let retVal: string = ""
    let initialSpaces = text.match(/[ ]*/) || ""
    for (let i = 0; i < initialSpaces[0].length; i++) {
      if (i%2==1) retVal += "&nbsp;"
      else  retVal += " "
    }
    let emptyLinePattern = /^[-]*$/
    if (emptyLinePattern.test(text)){
      retVal += "<span  class='text-warning'>"
    }
    else if (highlight) {
      retVal += "<span class='bg-danger text-light'>"
    }
    else {
      retVal += "<span>"
    }
    retVal += this.htmlEncode(text.trim()) + "</span><br />"
    return retVal
  }
  htmlEncode(input) {
    input = input.replace(/&/g, '&amp;');
    input = input.replace(/</g, '&lt;');
    input = input.replace(/>/g, '&gt;');
    return input;
  }
}
