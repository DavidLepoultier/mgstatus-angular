import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, FormBuilder, Validators} from '@angular/forms';
import { FlexibleService } from 'src/app/services/flexible.service';
import { SnackBarComponent } from 'src/app/snack-bar/snack-bar.component';

@Component({
  selector: 'app-feconfig',
  templateUrl: './feconfig.component.html',
  styleUrls: ['./feconfig.component.scss']
})
export class FeconfigComponent implements OnInit {

  flexibleForm: FormGroup;

  show: boolean = false;
  jbbData:any = null;
  isAuthenticated:boolean = false;
  welcomeMessage:String = '';

  config = {
    id: '',
    cpElbId: '',
    cpElbIp: '',
    INTERNET_ELB_ID: '',
    INTERNET_ELB_IP: '',
    KONG_PG_HOST: '',
    KONG_PG_PORT: '',
    PGUSER: '',
    PGPASSWORD: ''
  }

  account_validation_messages = {
    'KONG_PG_HOST': [ 
      { type: 'required', message: "PostgreSQL's IP is required" }
    ],
    'KONG_PG_PORT': [
      { type: 'required', message: "PostgreSQL's Port is required" }
    ],
    'PGUSER': [
      { type: 'required', message: "PostgreSQL's User is required" }
    ],
    'PGPASSWORD': [
      { type: 'required', message: "PostgreSQL's Password is required" }
    ],
    'cpElbId': [
      { type: 'required', message: 'Control plane ELB ID is required' },
    ],
    'cpElbIp': [
      { type: 'required', message: 'Control plane ELB IP is required' },
    ],
    'INTERNET_ELB_ID': [
      { type: 'required', message: 'Internet ELB ID is required' },
    ],
    'INTERNET_ELB_IP': [
      { type: 'required', message: 'Internet ELB IP is required' },
    ]
  }

  constructor( private fb: FormBuilder, private fe: FlexibleService, private snackBar: SnackBarComponent) { 
  }

  myClass = '';

  ngOnInit() {
    window.scrollTo(0, 0);
    this.myClass = '';
    this.createForms();
    this.getConfig();
  }

  createForms() {
    // user links form validations
    this.flexibleForm = this.fb.group({
      id: new FormControl(this.config.id),
      cpElbId: new FormControl(this.config.cpElbId, Validators.compose([
        Validators.required,
      ])),
      cpElbIp: new FormControl(this.config.cpElbIp, Validators.compose([
        Validators.required,
      ])),
      INTERNET_ELB_ID: new FormControl(this.config.INTERNET_ELB_ID, Validators.compose([
        Validators.required,
      ])),
      INTERNET_ELB_IP: new FormControl(this.config.INTERNET_ELB_IP, Validators.compose([
        Validators.required,
      ])),
      KONG_PG_HOST: new FormControl(this.config.KONG_PG_HOST, Validators.compose([
        Validators.required,
      ])),
      KONG_PG_PORT: new FormControl(this.config.KONG_PG_PORT, Validators.compose([
        Validators.required,
      ])),
      PGUSER: new FormControl(this.config.PGUSER, Validators.compose([
        Validators.required,
      ])),
      PGPASSWORD: new FormControl(this.config.PGPASSWORD, Validators.compose([
        Validators.required,
      ]))
    })
  }

  getConfig(){
    this.fe.getFeConfig().subscribe(
      data => {
        this.config = data.feconfig
        this.createForms();
      }
    );
  }

  saveConfig(flexibleForm: any) {
    this.fe.addFeConfig(flexibleForm).subscribe(
      data  => {
        this.handlerSuccess(data),
        this.getConfig()
      },
      error => this.handlerError(error)
    );
  }

  handlerSuccess(data: any) {
    this.snackBar.openSnackBar(data.message,'Close','');
  }

  handlerError(error: any) {
    
  }
}
