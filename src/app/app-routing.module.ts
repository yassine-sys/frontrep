import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GroupComponent } from './components/group/group.component';
import { GroupFormComponent } from './components/groupform/groupform.component';
import { NestedGridComponent } from './components/nested-grid/nested-grid.component';
import { AddgroupComponent } from './components/addgroup/addgroup.component';
import { UserManagmentComponent } from './components/user-managment/user-managment.component';
import { HomeComponent } from './components/home/home.component';
import { AppComponent } from './app.component';
import { AuthGuard } from './auth.guard';
import { ErrorComponent } from './components/error/error.component';
import { FunctionDetailsComponent } from './components/function-details/function-details.component';
import { ChartComponent } from './components/chart/chart.component';
import { FunctionChartsComponent } from './components/function-charts/function-charts.component';
import { LoginComponent } from './components/login/login.component';
import { GroupdetailsComponent } from './components/groupdetails/groupdetails.component';
import { ForgotPassComponent } from './components/forgot-pass/forgot-pass.component';

const routes: Routes = [
  {path:'login',component:LoginComponent},
  {path:'forgot',component:ForgotPassComponent},
  {path:'',component:ChartComponent,canActivate:[AuthGuard]},
  {path:'group',component:GroupComponent,canActivate:[AuthGuard]},
  {path:'group/add',component:AddgroupComponent,canActivate:[AuthGuard]},
  {path:'group/:id',component:AddgroupComponent,canActivate:[AuthGuard]},
  {path:'modules',component:NestedGridComponent,canActivate:[AuthGuard]},
  {path:'users',component:UserManagmentComponent,canActivate:[AuthGuard]},
  {path:'test',component:HomeComponent,canActivate:[AuthGuard]},
  {path:'error',component:ErrorComponent,canActivate:[AuthGuard]},
  {path:'function/:id',component:FunctionDetailsComponent,canActivate:[AuthGuard]},
  {path:'function/charts/:id',component:FunctionChartsComponent,canActivate:[AuthGuard]},
  {path:'groupe/:id',component:GroupdetailsComponent,canActivate:[AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
