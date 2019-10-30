import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TestsGridComponent } from './home/tests-grid/tests-grid.component';
import { FusionRequestsGridComponent } from './home/fusion-requests-grid/fusion-requests-grid.component';


const routes: Routes = [
  {path: 'tests', component: TestsGridComponent},
  {path: 'fusion-requests', component: FusionRequestsGridComponent},
  {path: '', redirectTo: '/tests',  pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
