import { BrowserModule } from '@angular/platform-browser';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import { AppComponent } from './app.component';
import { NotifierModule, NotifierOptions } from 'angular-notifier';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { HttpClientModule } from '@angular/common/http';
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
import { MyAppsComponent } from './apigee/my-apps/my-apps.component';
import { DemoMaterialModule } from './material-module';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MatNativeDateModule } from '@angular/material';
import { DateFormatPipe } from './pipes/date-format.pipe';
import { ProfileComponent } from './users/profile/profile.component';
import { AllAppsComponent } from './apigee/all-apps/all-apps.component';
import { OrgsComponent } from './apigee/orgs/orgs.component';
import { ProxiesComponent } from './apigee/proxies/proxies.component';
import { ReloadComponent } from './reload/reload.component';
import { FilterPipe } from './pipes/filter.pipe';
import { UniquePipe } from './pipes/unique.pipe';
import { UniqueProjectPipe } from './pipes/unique-project.pipe';

const appRoutes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    data: { title: 'Dashboard' }
  },
  {
    path: 'r-Gate',
    component: ProjectsComponent,
    data: { title: 'Projects List' }
  },
  {
    path: 'r-Gate/:id',
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
    data: { title: 'Register' }
  },
  {
    path: 'profile',
    component: ProfileComponent,
    data: { title: 'Register' }
  },
  {
    path: 'myApps',
    component: MyAppsComponent,
    data: { title: 'Developer' }
  },
  {
    path: 'allApps',
    component: AllAppsComponent,
    data: { title: 'All Apps' }
  },
  {
    path: 'proxies',
    component: ProxiesComponent,
    data: { title: 'Proxies' }
  },
  {
    path: 'orgs',
    component: OrgsComponent,
    data: { title: 'Organizations' }
  },
  { path: 'reload/:id',
    component: ReloadComponent,
    data: { title: 'Reload' }
  },
  { path: '',
    redirectTo: '/r-Gate',
    pathMatch: 'full'
  }
  // { path: '**', component: PageNotFoundComponent }
];

/**
 * Custom angular notifier options
 */
const customNotifierOptions: NotifierOptions = {
  position: {
		horizontal: {
			position: 'right',
			distance: 12
		},
		vertical: {
			position: 'top',
			distance: 150,
			gap: 10
		}
	},
  theme: 'material',
  behaviour: {
    autoHide: 3000,
    onClick: 'hide',
    onMouseover: 'pauseAutoHide',
    showDismissButton: true,
    stacking: 4
  },
  animations: {
    enabled: true,
    show: {
      preset: 'slide',
      speed: 300,
      easing: 'ease'
    },
    hide: {
      preset: 'fade',
      speed: 300,
      easing: 'ease',
      offset: 50
    },
    shift: {
      speed: 300,
      easing: 'ease'
    },
    overlap: 150
  }
};

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
    RegisterComponent,
    MyAppsComponent,
    DateFormatPipe,
    ProfileComponent,
    AllAppsComponent,
    OrgsComponent,
    ProxiesComponent,
    ReloadComponent,
    FilterPipe,
    UniquePipe,
    UniqueProjectPipe
  ],
  imports: [
    RouterModule.forRoot(appRoutes),
    NotifierModule.withConfig(customNotifierOptions),
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MDBBootstrapModule.forRoot(),
    DemoMaterialModule,
    MatNativeDateModule,
    ChartsModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [ NO_ERRORS_SCHEMA ]
})
export class AppModule { }