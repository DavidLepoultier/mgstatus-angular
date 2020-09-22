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
    INTERNET_ELB_ID: '',
    INTERNET_ELB_IP: '',
  }

  account_validation_messages = {
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
      INTERNET_ELB_ID: new FormControl(this.config.INTERNET_ELB_ID, Validators.compose([
        Validators.required,
      ])),
      INTERNET_ELB_IP: new FormControl(this.config.INTERNET_ELB_IP, Validators.compose([
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
