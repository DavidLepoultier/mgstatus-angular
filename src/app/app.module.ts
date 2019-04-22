import { BrowserModule } from '@angular/platform-browser';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule }   from '@angular/forms';
import { ProjectsComponent } from './projects/projects.component';
import { ProjectDetailComponent } from './project-detail/project-detail.component';
import { RouterModule, Routes } from '@angular/router';
import { ChartsModule } from 'ng2-charts';
import { NavigationComponent } from './navigation/navigation.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FooterComponent } from './footer/footer.component';
import { PipesPipe } from './pipes/pipes.pipe';
import { DowntimePipe } from './pipes/downtime.pipe';
import { ErrorsComponent } from './errors/errors.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';

const appRoutes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    data: { title: 'Dashboard' }
  },
  {
    path: 'projects',
    component: ProjectsComponent,
    data: { title: 'Projects List' }
  },
  {
    path: 'project/:id',
    component: ProjectDetailComponent,
    data: { title: 'Project Details' }
  },
  {
    path: 'login',
    component: LoginComponent,
    data: { title: 'Login' }
  },
  {
    path: 'register',
    component: RegisterComponent,
    data: { title: 'register' }
  },
  { path: '',
    redirectTo: '/projects',
    pathMatch: 'full'
  }
  // { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    ProjectsComponent,
    ProjectDetailComponent,
    NavigationComponent,
    DashboardComponent,
    FooterComponent,
    PipesPipe,
    DowntimePipe,
    ErrorsComponent,
    LoginComponent,
    RegisterComponent
  ],
  imports: [
    RouterModule.forRoot(appRoutes),
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MDBBootstrapModule.forRoot(),
    ChartsModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [ NO_ERRORS_SCHEMA ]
})
export class AppModule { }