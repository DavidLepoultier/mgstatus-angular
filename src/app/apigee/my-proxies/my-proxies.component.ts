import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { ApigeeService } from '../apigee.service';
import { NotifierSvc } from '../../services/notifier.service';
import {FormControl, FormGroup, FormBuilder, Validators} from '@angular/forms';

@Component({
  selector: 'app-my-proxies',
  templateUrl: './my-proxies.component.html',
  styleUrls: ['./my-proxies.component.scss']
})
export class MyProxiesComponent implements OnInit {

  notifier: NotifierSvc;
  allProxies: any = [];
  allEnvironments: any = [];
  descProxie: object = {
    proxie: {
      name: '',
      displayName: '',
      description: ''
    }
  };
  searchText: string;
  sorted = true;
  jwtDecoded: object = {};
  addProxiesForm: FormGroup;
  showAddOffers: boolean = false;
  postProxie: object = {};
  orgPref:any;

  application_validation_messages = {
    'proxie': [
      { type: 'required', message: 'Proxie name is required' },
    ],
    'basePath': [
      { type: 'required', message: 'Base path is required' },
    ],
    'target': [
      { type: 'required', message: 'Target is required' },
    ]
  }

  constructor(private router:Router, private auth:AuthService, private apigee:ApigeeService, notifierSvc:NotifierSvc, private fb:FormBuilder) { 
    this.notifier = notifierSvc;
  }

  createForms() {
    // user links form validations
    this.addProxiesForm = this.fb.group({
      proxie: new FormControl('', Validators.compose([
        Validators.required      
      ])),
      description: new FormControl(''),
      action: new FormControl('create'),
      basePath: new FormControl('', Validators.compose([
        Validators.required      
      ])),
      target: new FormControl('', Validators.compose([
        Validators.required
      ]))
    })
  }

  addOffersShow(){
    this.showAddOffers = true;
  }

  addOffersHide(){
    this.showAddOffers = false;
  }

  actionOffers(proxie: any){
    this.postProxie = {
      "proxie": proxie
    }
    this.apigee.createProxie(this.postProxie).subscribe(
      data => {
        this.handlerCreateProxieResponse(data, this.postProxie);
      },
      error => {
        this.handlerError(error);
      }
    )
  }

  autoCreateProduct(proxie: any){
    proxie['environments'] = this.allEnvironments;
    this.apigee.autoCreateProduct(proxie).subscribe(
      data => {
        this.handlerCreateProductResponse(data);
      },
      error => {
        this.handlerError(error);
      }
    )
  }

  updateMyProxies(proxie: any){
    this.allProxies.apis.push('edgemicro_' + proxie['proxie'].proxie);
    this.allProxies.products.push('edgemicro_' + proxie['proxie'].proxie + '-product');
    let body = {
      user: this.jwtDecoded['user'],
      apis: this.allProxies['apis'],
      products: this.allProxies['products']
    }
    this.apigee.updateMyProxie(body).subscribe(
      data => {
        this.autoCreateProduct(proxie);
      },
      error => {
        this.handlerError(error);
      }
    )
  }

  ngOnInit() {
    if(!this.auth.userIsLoggedIn()) {
      this.router.navigate(['/']);
    }
    this.jwtDecode();
    if(this.jwtDecoded['role'] === "developer") {
      this.orgPref = JSON.parse(this.auth.userOrgPreference());
      this.getProxies();
      this.getEnvironments();
      this.createForms();
    } else {
      this.router.navigate(['/']);
    }
  }

  jwtDecode() {
    this.jwtDecoded = this.auth.jwtTokenDecode();
  }

  getEnvironments() {
    this.apigee.getEnvironments().subscribe(
      data  => {
        this.handlerEnvironmentResponse(data);
      },
      error => {
        console.log(error);
        this.handlerError(error);
      }
    );
  }

  getProxies() {
    this.apigee.getMyProxies().subscribe(
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

  handlerEnvironmentResponse(data: any) { 
    this.allEnvironments = data.environments;
    this.allEnvironments = this.allEnvironments.sort((a: any, b: any) => {
      if (a['name'] < b['name']) {
        return this.sorted ? -1 : 1;
      }
      if (a['name'] > b['name']) {
        return this.sorted ? 1 : -1;
      }
      return 0;
    });
  }

  handlerServerResponse(data: any) { 
    this.allProxies = data.apis;
    // this.allProxies = this.allProxies.sort((a: any, b: any) => {
    //   if (a['name'] < b['name']) {
    //     return this.sorted ? -1 : 1;
    //   }
    //   if (a['name'] > b['name']) {
    //     return this.sorted ? 1 : -1;
    //   }
    //   return 0;
    // });
  }

  modalHide(){
    this.showAddOffers = false;
  }

  handlerCreateProxieResponse(data: any, proxie: any) {
    this.notifier.showNotification(
      'success',
      `${data.message} created.`
    );
    this.updateMyProxies(proxie);
    this.addOffersHide();
  }

  handlerCreateProductResponse(data: any){
    this.notifier.showNotification(
      'success',
      `${data.message.displayName} created.`
    );
  }

  handlerDeployProxieResponse(data: any){
    this.notifier.showNotification(
      'success',
      `Proxie ${data.message.state}`
    );
    //this.allProxies = [];
    this.getProxies();
  }
}
