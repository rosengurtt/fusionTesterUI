import { Component } from '@angular/core';
import * as WjCore from 'wijmo/wijmo';
import { DbService } from './shared/db/db.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'FusionTesterUI';


  constructor() {

  }
}
