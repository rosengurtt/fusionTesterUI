import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { DbService } from './shared/db/db.service';
import { TestsGridComponent } from './home/tests-grid/tests-grid.component';
import { JwPaginationComponent } from 'jw-angular-pagination';
import { TestFormComponent } from './home/test-form/test-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { TestResultsGridComponent } from './home/test-results-grid/test-results-grid.component';
import { ResultDetailsComponent } from './home/result-details/result-details.component';
import { FileCompareComponent } from './shared/file-compare/file-compare.component';
import { FusionRequestsGridComponent } from './home/fusion-requests-grid/fusion-requests-grid.component';
import { FileUploadComponent } from './home/file-upload/file-upload.component';

const appRoutes: Routes = [
  { path: 'home', component: TestsGridComponent },
  { path: 'newTest/:TestId', component: TestFormComponent },

  { path: '**', component: TestsGridComponent }
];
@NgModule({
  declarations: [
    AppComponent,
    TestsGridComponent,
    JwPaginationComponent,
    TestFormComponent,
    TestResultsGridComponent,
    ResultDetailsComponent,
    FileCompareComponent,
    FusionRequestsGridComponent,
    FileUploadComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only
    )
    // other imports here
  ],
  providers: [DbService],
  bootstrap: [AppComponent]
})
export class AppModule { }

