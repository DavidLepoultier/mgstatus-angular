import { BrowserModule } from '@angular/platform-browser';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { NavigationComponent } from './navigation/navigation.component';
import { FooterComponent } from './footer/footer.component';

import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';

import { DemoMaterialModule } from './material-module';
import { MatNativeDateModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';

import { PageNotFoundComponent }    from './page-not-found/page-not-found.component';
import { KongModule } from './kong/kong.module';
import { SetupModule } from './setup/setup.module';
import { LoginComponent } from './auth/login/login.component';
import { SharingModule } from './sharing-module';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { SubscribeComponent } from './auth/subscribe/subscribe.component';
import { VerifyComponent } from './auth/subscribe/verify/verify.component';
import { StatusComponent } from './status/status.component';

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    FooterComponent,
    PageNotFoundComponent,
    LoginComponent,
    SubscribeComponent,
    VerifyComponent,
    StatusComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MDBBootstrapModule.forRoot(),
    DemoMaterialModule,
    MatNativeDateModule,
    KongModule,
    SetupModule,
    UsersModule,
    RolesModule,
    SharingModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [ NO_ERRORS_SCHEMA ]
})
export class AppModule { 
  constructor(router: Router) {
    // Use a custom replacer to display function names in the route configs
    // const replacer = (key, value) => (typeof value === 'function') ? value.name : value;

    // console.log('Routes: ', JSON.stringify(router.config, replacer, 2));
  }
}
