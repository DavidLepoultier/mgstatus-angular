import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { ApigeeService } from '../apigee.service';
import { NotifierSvc } from '../../services/notifier.service';
import { MdbTableService } from 'angular-bootstrap-md';
import { MatStepper } from '@angular/material';
import {FormControl, FormGroup, FormBuilder, Validators} from '@angular/forms';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';

@Component({
  selector: 'app-orgs',
  templateUrl: './orgs.component.html',
  styleUrls: ['./orgs.component.scss'],
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS, useValue: {displayDefaultIndicatorType: false}
  }]
})
export class OrgsComponent implements OnInit {
  notifier: NotifierSvc;
  orgs: any = [];
  sorted = true;
  searchText: string = '';
  previous: string;
  showModal: boolean;
  showCreateOrg: boolean;
  organization: string;
  adminUser: string;
  jwtDecoded: object = {};
  postOrg: object = {};

  registerOrgForm: FormGroup;
  registerOrgAdminForm: FormGroup;

  show: boolean = false;
  testValide: boolean = false;
  testValideUser: boolean = false;
  
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

  constructor(private router:Router, private auth:AuthService, private apigee:ApigeeService, notifierSvc:NotifierSvc, private mdbTable:MdbTableService, private fb: FormBuilder ) {
    this.notifier = notifierSvc;
    this.showModal = false;
    this.showCreateOrg = false;  
  }

  @HostListener('input') oninput() {
    this.searchItems();
  }

  ngOnInit() {
    if(!this.auth.userIsLoggedIn()) {
      this.router.navigate(['/']);
    }
    this.jwtDecode();
    if(this.jwtDecoded['role'] === "admin") {
      this.getAllOrgs();
      this.createForms();
    } else {
      this.router.navigate(['/']);
    }
  }

  jwtDecode() {
    this.jwtDecoded = this.auth.jwtTokenDecode();
  }

  searchItems() {
    const prev = this.mdbTable.getDataSource();
    if (!this.searchText) {
      this.mdbTable
      this.mdbTable.setDataSource(this.previous);
      this.orgs = this.mdbTable.getDataSource();
    }
    if (this.searchText) {
      this.orgs = this.mdbTable.searchLocalDataBy(this.searchText);
      this.mdbTable.setDataSource(prev);
    }
  }

  getAllOrgs() {
    this.apigee.getAllOrgs().subscribe(
      data  => {
        this.handlerServerResponse(data);
      },
      error => {
        this.handlerError(error);
      }
    );
  }

  modalShow(org: string, adminUser: string) {
    this.showModal = true; 
    this.organization = org;
    this.adminUser = adminUser;
  }

  modalHide(){
    this.showModal = false;
  }

  resetStepper(stepper: MatStepper){
    stepper.reset();
  }

  createOrgHide(stepper: MatStepper){
    this.resetStepper(stepper);
    this.testValide = false;
    this.testValideUser = false;
    this.showCreateOrg = false;
  }

  createOrgShow(){
    this.showCreateOrg = true;
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
    orgForm.orgName = adminForm.orgName;
    this.apigee.testAdminUser(orgForm).subscribe(
      data  => {
        this.handlerSuccess(data),
        this.testValideUser = true
      },
      error => this.handlerError(error)
    );
  }

  addOrganization(orgForm:any, adminForm:any, stepper: MatStepper) {
    this.apigee.createAdminOrg(adminForm).subscribe(
      data  => {
        this.handlerSuccess(data),
        this.apigee.createOrg(orgForm).subscribe(
          data  => {
            this.handlerSuccess(data),
            this.createOrgHide(stepper);
            this.orgs = [];
            this.getAllOrgs();
          },
          error => this.handlerError(error)
        );
      },
      error => this.handlerError(error)
    );
  }

  deleteOrg(org: any, admunUser: any) {
    this.apigee.deleteAdminOrg(admunUser).subscribe(
      data  => {
        this.handlerSuccess(data),
        this.apigee.deleteOrg(org).subscribe(
          data  => {
            this.handlerSuccess(data),
            this.orgs = [];
            this.modalHide();
            this.getAllOrgs();
          },
          error => this.handlerError(error)
        );
      },
      error => this.handlerError(error)
    );
  }

  handlerSuccess(data: any) {
    this.notifier.showNotification(
      'success',
      data.message
    );
  }

  handlerError(error: any) {
    this.notifier.showNotification(
      'error',
      error.error.message
    );
  }

  handlerServerResponse(data: any) {
    for (let index = 0; index < data.orgs.length; index++) {
      this.orgs.push(data.orgs[index]);
    }
    this.orgs = this.orgs.sort((a: any, b: any) => {
      if (a['name'] < b['name']) {
        return this.sorted ? -1 : 1;
      }
      if (a['name'] > b['name']) {
        return this.sorted ? 1 : -1;
      }
      return 0;
    });
    this.mdbTable.setDataSource(this.orgs);
    this.previous = this.mdbTable.getDataSource();
  }
}
