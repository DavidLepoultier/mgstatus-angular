import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SnackBarComponent } from 'src/app/snack-bar/snack-bar.component';
import { Router } from '@angular/router';
import { KongEnvironmentService } from 'src/app/services/kong-environment.service';

@Component({
  selector: 'app-add-environment',
  templateUrl: './add-environment.component.html',
  styleUrls: ['./add-environment.component.scss']
})
export class AddEnvironmentComponent implements OnInit {

  registerEnvForm: FormGroup;

  show: boolean = false;
  disabledInt: boolean = false;
  disabledGin: boolean = false;
  disabledSSLInt: boolean = false;
  jbbData:any = null;
  isAuthenticated:boolean = false;
  welcomeMessage:String = '';

  config = {
    id: '',
    envName: '',
    KONG_PG_USER: '',
    KONG_PG_PASSWORD: '',
    KONG_VERSION: '',
    KONG_INTERNET_FQDN: '',
    KONG_GIN_FQDN: '',
    INTERNET: '',
    GIN: '',
    SSL_INTERNET: '',
    SSL_INTERNET_CERT_CRT: '',
    SSL_INTERNET_CERT_KEY: ''
  }

  account_validation_messages = {
    'envName': [ 
      { type: 'required', message: "Environment name is required" }
    ],
    'KONG_PG_USER': [
      { type: 'required', message: "Database Username is required"}
    ],
    'KONG_PG_PASSWORD': [
      { type: 'required', message: "Database Password is required"}
    ],
    'KONG_VERSION': [
      { type: 'required', message: "Kong version is required"}
    ]
  }

  constructor( private cdref: ChangeDetectorRef, private router:Router, private fb: FormBuilder, private env: KongEnvironmentService, private snackBar: SnackBarComponent) { 
  }

  myClass = '';

  ngOnInit() {
    window.scrollTo(0, 0);
    this.myClass = '';
    this.createForms();
  }

  createForms() {
    // user links form validations
    this.registerEnvForm = this.fb.group({
      id: new FormControl(this.config.id),
      envName: new FormControl(this.config.envName, Validators.compose([
        Validators.required,
      ])),
      KONG_PG_USER: new FormControl(this.config.KONG_PG_USER, Validators.compose([
        Validators.required
      ])),
      KONG_PG_PASSWORD: new FormControl(this.config.KONG_PG_PASSWORD, Validators.compose([
        Validators.required
      ])),
      KONG_VERSION: new FormControl(this.config.KONG_VERSION, Validators.compose([
        Validators.required
      ])),
      KONG_INTERNET_FQDN: new FormControl(this.config.KONG_INTERNET_FQDN),
      KONG_GIN_FQDN: new FormControl(this.config.KONG_GIN_FQDN),
      INTERNET: new FormControl(this.config.INTERNET),
      GIN: new FormControl(this.config.GIN),
      SSL_INTERNET: new FormControl(this.config.SSL_INTERNET),
      SSL_INTERNET_CERT_KEY: new FormControl(atob(this.config.SSL_INTERNET_CERT_KEY)),
      SSL_INTERNET_CERT_CRT: new FormControl(atob(this.config.SSL_INTERNET_CERT_CRT))
    })
  }

  ngAfterContentChecked() {
    if(!this.disabledInt) {
      this.registerEnvForm.setControl('KONG_INTERNET_FQDN', new FormControl(''));
    }
    if(!this.disabledGin) {
      this.registerEnvForm.setControl('KONG_GIN_FQDN', new FormControl(''));
    }
    if(!this.disabledSSLInt) {
      this.registerEnvForm.setControl('SSL_INTERNET_CERT_KEY', new FormControl(''));
      this.registerEnvForm.setControl('SSL_INTERNET_CERT_CRT', new FormControl(''));
    }
    this.cdref.detectChanges();
  }

  saveConfig(registerEnvForm: any) {
    registerEnvForm.SSL_INTERNET_CERT_KEY = btoa(registerEnvForm.SSL_INTERNET_CERT_KEY);
    registerEnvForm.SSL_INTERNET_CERT_CRT = btoa(registerEnvForm.SSL_INTERNET_CERT_CRT);
    this.env.addEnvConfig(registerEnvForm).subscribe(
      data  => this.handlerSuccess(data),
      error => this.handlerError(error)
    );
  }

  handlerSuccess(data: any) {
    this.snackBar.openSnackBar(data.message,'Close','');
    this.router.navigate(['/kong/environments']);
  }

  handlerError(error: any) {
    
  }

}
