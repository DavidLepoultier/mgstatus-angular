import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SnackBarComponent } from 'src/app/snack-bar/snack-bar.component';
import { Router, ActivatedRoute } from '@angular/router';
import { KongEnvironmentService } from 'src/app/services/kong-environment.service';

@Component({
  selector: 'app-detail-environment',
  templateUrl: './detail-environment.component.html',
  styleUrls: ['./detail-environment.component.scss']
})
export class DetailEnvironmentComponent implements OnInit {

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
    INTERNET: false,
    GIN: false,
    SSL_INTERNET: false,
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

  constructor( private cdref: ChangeDetectorRef, private route: ActivatedRoute, private router:Router, private fb: FormBuilder, private env: KongEnvironmentService, private snackBar: SnackBarComponent) { 
  }

  myClass = '';

  ngOnInit() {
    window.scrollTo(0, 0);
    this.myClass = '';
    this.createForms();
    this.getEnvironment(this.route.snapshot.params['id']);
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
      this.registerEnvForm.setControl('KONG_INTERNET_FQDN', new FormControl(this.config.KONG_INTERNET_FQDN));
    }
    if(!this.disabledGin) {
      this.registerEnvForm.setControl('KONG_GIN_FQDN', new FormControl(this.config.KONG_GIN_FQDN));
    }
    if(!this.disabledSSLInt) {
      this.registerEnvForm.setControl('SSL_INTERNET_CERT_KEY', new FormControl(atob(this.config.SSL_INTERNET_CERT_KEY)));
      this.registerEnvForm.setControl('SSL_INTERNET_CERT_CRT', new FormControl(atob(this.config.SSL_INTERNET_CERT_CRT)));
    }
    this.cdref.detectChanges();
  }

  getEnvironment(id: any){
    this.env.getEnvironment(id).subscribe(
      data => {
        this.config = data.environment;
        this.disabledGin = this.config.GIN;
        this.disabledInt = this.config.INTERNET;
        this.disabledSSLInt = this.config.SSL_INTERNET;
        this.createForms();
      },
      error => this.handlerError(error)
    );
  }
  
  deleteEnv(){
    this.env.deleteEnv(this.route.snapshot.params['id']).subscribe(
      data => this.handlerSuccess(data),
      error => this.handlerError(error)
    );
  }

  updateConfig(registerEnvForm: any) {
    registerEnvForm.SSL_INTERNET_CERT_KEY = btoa(registerEnvForm.SSL_INTERNET_CERT_KEY);
    registerEnvForm.SSL_INTERNET_CERT_CRT = btoa(registerEnvForm.SSL_INTERNET_CERT_CRT);
    this.env.updateEnvConfig(this.route.snapshot.params['id'], registerEnvForm).subscribe(
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
