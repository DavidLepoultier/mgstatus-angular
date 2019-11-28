import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { ApigeeService } from '../apigee.service';
import { NotifierSvc } from '../../services/notifier.service';
import {FormControl, FormGroup, FormBuilder, Validators} from '@angular/forms';


@Component({
  selector: 'app-my-apps',
  templateUrl: './my-apps.component.html',
  styleUrls: ['./my-apps.component.scss']
})
export class MyAppsComponent implements OnInit {
  notifier: NotifierSvc;
  postApp: object = {}
  myApps: any = [];
  products: object = [];
  searchText: string;
  sorted = true;
  showModal: boolean;
  showCreateApp: boolean;
  application: string;
  displayName: string;
  jwtDecoded: object = {};
  orgPref:any;
  createAppForm: FormGroup;

  application_validation_messages = {
    'app': [
      { type: 'required', message: 'Email is required' },
    ]
  }

  constructor(private router:Router, private auth:AuthService, private apigee:ApigeeService, notifierSvc:NotifierSvc, private fb:FormBuilder ) {
    this.notifier = notifierSvc;
    this.showModal = false;
    this.showCreateApp = false;
  }

  ngOnInit() {
    if(!this.auth.userIsLoggedIn()) {
      this.router.navigate(['/']);
    }
    this.jwtDecode();
    if(this.jwtDecoded['role'] === "developer") {
      this.orgPref = JSON.parse(this.auth.userOrgPreference());
      this.getDeveloperApps();
    }
    this.createForms();
  }

  jwtDecode() {
    this.jwtDecoded = this.auth.jwtTokenDecode();
  }

  createForms() {
    // user links form validations
    this.createAppForm = this.fb.group({
      app: new FormControl('', Validators.compose([
        Validators.required      
      ])),
      displayName: new FormControl(''),
      products: new FormControl('', Validators.compose([
        Validators.required
      ])),
      action: new FormControl('create')
    })
  }

  modalShow(app: string, display: string) {
    this.showModal = true; 
    this.application = app;
    this.displayName = display;
  }

  modalHide(){
    this.showModal = false;
  }

  createAppShow(){
    this.showCreateApp = true;
    this.apigee.getProducts().subscribe(
      data => {
        this.handlerGetProducts(data);
      },
      error => {
        this.handlerError(error);
      }
    )
  }

  createAppHide(){
    this.showCreateApp = false;
    this.createAppForm.reset();
    this.createForms();
  }

  actionApp(app: any){
    this.postApp = {
      "application": app
    }
    this.apigee.actionApp(this.postApp, app.action).subscribe(
      data => {
        switch(app.action) {
          case 'delete':
            this.handlerDeleteAppResponse(data);
            break;
          case 'create': 
            this.handlerCreateAppResponse(data);
            break;
        }  
      },
      error => {
        this.handlerError(error);
      }
    )
  }

  getDeveloperApps() {
    this.apigee.getDeveloperApps().subscribe(
      data  => {
        this.handlerServerResponse(data);
      },
      error => {
        this.handlerError(error);
      }
    );
  }

  handlerError(error: any) {
    this.notifier.showNotification(
      'error',
      error.error.message
    );
    switch(error.status) {
      case 401:
        sessionStorage.removeItem('jbb-data');
        break;
    }
  }

  handlerServerResponse(data: any) {
    for (let index = 0; index < data.developerApps.length; index++) {
      data.developerApps[index].displayName = data.developerApps[index].attributes[0].value || data.developerApps[index].name;
      this.myApps.push(data.developerApps[index]);
    }
    this.myApps = this.myApps.sort((a: any, b: any) => {
      if (a['name'] < b['name']) {
        return this.sorted ? -1 : 1;
      }
      if (a['name'] > b['name']) {
        return this.sorted ? 1 : -1;
      }
      return 0;
    });
  }
  
  handlerDeleteAppResponse(data: any) {
    this.notifier.showNotification(
      'success',
      `${data.action.name} deleted.`
    );
    this.myApps = [];
    this.getDeveloperApps();
    this.modalHide();
  }

  handlerGetProducts(data: any) {
    this.products = data.products;
  }

  handlerCreateAppResponse(data: any){
    this.notifier.showNotification(
      'success',
      `${data.message.name} created.`
    );
    this.myApps = [];
    this.getDeveloperApps();
    this.createAppHide();
  }
}
