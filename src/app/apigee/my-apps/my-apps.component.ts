import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { ApigeeService } from '../apigee.service';
import { NotifierSvc } from '../../services/notifier.service';
import { MdbTableService } from 'angular-bootstrap-md';
import {FormControl, FormGroup, FormBuilder, Validators} from '@angular/forms';


@Component({
  selector: 'app-my-apps',
  templateUrl: './my-apps.component.html',
  styleUrls: ['./my-apps.component.scss']
})
export class MyAppsComponent implements OnInit {
  notifier: NotifierSvc;
  developer: object = {
    developer: 'david.lepoultier@orange.com'
  }
  postApp: object = {}
  myApps: any = [];
  products: object = [];
  sorted = true;
  searchText: string = '';
  previous: string;
  showModal: boolean;
  showCreateApp: boolean;
  application: string;

  createAppForm: FormGroup;

  application_validation_messages = {
    'app': [
      { type: 'required', message: 'Email is required' },
    ]
  }

  constructor(private router:Router, private auth:AuthService, private apigee:ApigeeService, notifierSvc:NotifierSvc, private mdbTable:MdbTableService, private fb:FormBuilder ) {
    this.notifier = notifierSvc;
    this.showModal = false;
    this.showCreateApp = false;
  }

  @HostListener('input') oninput() {
    this.searchItems();
  }

  ngOnInit() {
    if(!this.auth.userIsLoggedIn()) {
      this.router.navigate(['/']);
    }
    this.getDeveloperApps(this.developer);
    this.createForms();
  }

  createForms() {
    // user links form validations
    this.createAppForm = this.fb.group({
      app: new FormControl('', Validators.compose([
        Validators.required      
      ])),
      products: new FormControl('', Validators.compose([
        Validators.required
      ])),
      action: new FormControl('create')
    })
  }

  modalShow(value: string) {
    this.showModal = true; 
    this.application = value;
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
  }

  actionApp(app: any){
    this.postApp = {
      "developer": this.developer['developer'],
      "application": app,
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

  searchItems() {
    const prev = this.mdbTable.getDataSource();
    if (!this.searchText) {
      this.mdbTable
      this.mdbTable.setDataSource(this.previous);
      this.myApps = this.mdbTable.getDataSource();
    }
    if (this.searchText) {
      this.myApps = this.mdbTable.searchLocalDataBy(this.searchText);
      this.mdbTable.setDataSource(prev);
    }
  }

  getDeveloperApps(dev: object) {
    this.apigee.getDeveloperApps(dev).subscribe(
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
  }

  handlerServerResponse(data: any) {
    for (let index = 0; index < data.developerApps.app.length; index++) {
      this.myApps.push(data.developerApps.app[index]);
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
    this.mdbTable.setDataSource(this.myApps);
    this.previous = this.mdbTable.getDataSource();
  }
  
  handlerDeleteAppResponse(data: any) {
    this.notifier.showNotification(
      'success',
      `${data.action.name} has been deleted`
    );
    this.myApps = [];
    this.getDeveloperApps(this.developer);
    this.modalHide();
  }

  handlerGetProducts(data: any) {
    this.products = data.products;
  }

  handlerCreateAppResponse(data: any){
    this.notifier.showNotification(
      'success',
      `${data.message.name} has been created`
    );
    this.myApps = [];
    this.getDeveloperApps(this.developer);
    this.createAppHide();
  }
}
