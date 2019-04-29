import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { ApigeeService } from '../apigee.service';
import { NotifierSvc } from '../../services/notifier.service'
import { Router } from '@angular/router';
import {FormControl, FormGroup, FormBuilder, Validators} from '@angular/forms';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';

@Component({
  selector: 'app-my-apps-detail',
  templateUrl: './my-apps-detail.component.html',
  styleUrls: ['./my-apps-detail.component.scss'],
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS, useValue: {displayDefaultIndicatorType: false}
  }]
})

export class MyAppsDetailComponent implements OnInit {
  registerOrgForm: FormGroup;
  registerOrgAdminForm: FormGroup;

  show: boolean = false;
  testValide: boolean = false;
  testValideUser: boolean = false;
  isAuthenticated:boolean = false;
  notifier: NotifierSvc;

  org_validation_messages = {
    'orgName': [
      { type: 'required', message: 'Organization name is required' }
    ],
    'adminUrl': [
      { type: 'required', message: 'Apigee admin url is required' }
    ],
    'loginOrg': [
      { type: 'required', message: 'Login organization is required' },
      { type: 'pattern', message: 'Enter a valid email' }
    ],
    'password': [
      { type: 'required', message: 'Password is required' }
    ]
  }

  account_validation_messages = {
    'adminFirstName': [
      { type: 'required', message: 'First name is required' }
    ],
    'adminLastName': [
      { type: 'required', message: 'Last name is required' }
    ],
    'adminLogin': [
      { type: 'required', message: 'Email is required' },
      { type: 'pattern', message: 'Enter a valid email' }
    ],
    'adminPassword': [
      { type: 'required', message: 'Password is required' },
      { type: 'pattern', message: 'At least 8 characters and 1 digit' }
    ]
  }

  constructor(private apigee:ApigeeService, private auth:AuthService, notifierSvc:NotifierSvc, private router:Router, private fb: FormBuilder) { 
    this.notifier = notifierSvc;
  }

  ngOnInit() {
    this.createForms();
  }

  createForms() {
    // user links form validations
    this.registerOrgForm = this.fb.group({
      orgName: new FormControl('', Validators.compose([
        Validators.required
      ])),
      adminUrl: new FormControl('', Validators.compose([
        Validators.required
      ])),
      loginOrg: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$')
      ])),
      password: new FormControl('', Validators.compose([
        Validators.required
      ])) 
    });
    this.registerOrgAdminForm = this.fb.group({
      adminFirstName: new FormControl('', Validators.compose([
        Validators.required
      ])),
      adminLastName: new FormControl('', Validators.compose([
        Validators.required
      ])),
      adminLogin: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$')
      ])),
      adminPassword: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^(?=.*?[a-z])(?=.*?[0-9]).{8,}$')
      ])),
      adminRole: new FormControl('orgAdmin'),
      orgName: new FormControl()
    });
  }

  testConnexion(formData:any) {
    this.apigee.testAdminConnexion(formData).subscribe(
      data  => {
        this.handlerSuccess(data),
        this.testValide = true
      },
      error => this.handlerError(error)
    );
  }

  testUser(orgForm:any, adminForm:any) {
    console.log(orgForm);
    orgForm.orgName = adminForm.orgName;
    console.log(orgForm);
    this.apigee.testAdminUser(orgForm).subscribe(
      data  => {
        this.handlerSuccess(data),
        this.testValideUser = true
      },
      error => this.handlerError(error)
    );
  }

  addOrganization(orgForm:any, adminForm:any) {
    // console.log('orgForm:', orgForm);
    // console.log('adminForm:', adminForm);
    this.apigee.createOrg(orgForm).subscribe(
      data  => {
        this.handlerSuccess(data),
        this.apigee.createAdminOrg(adminForm).subscribe(
          data  => this.handlerSuccess(data),
          error => this.handlerError(error)
        );
      },
      error => this.handlerError(error)
    );
  }

  handlerError(error: any) {
    this.notifier.showNotification(
      'error',
      error.error.message
    );
  }

  handlerSuccess(data: any) {
    this.notifier.showNotification(
      'success',
      data.message
    );
  }

}
