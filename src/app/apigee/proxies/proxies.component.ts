import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { ApigeeService } from '../apigee.service';
import { NotifierSvc } from '../../services/notifier.service';
import {FormControl, FormGroup, FormBuilder, Validators} from '@angular/forms';

@Component({
  selector: 'app-proxies',
  templateUrl: './proxies.component.html',
  styleUrls: ['./proxies.component.scss']
})
export class ProxiesComponent implements OnInit {

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
    this.apigee.actionProxie(this.postProxie, proxie.action).subscribe(
      data => {
        switch(proxie.action) {
          case 'create': 
            this.handlerCreateProxieResponse(data);
            break;
        }  
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
    if(this.jwtDecoded['role'] === "orgAdmin") {
      this.getProxies();
      this.createForms();
    } else {
      this.router.navigate(['/']);
    }
  }

  jwtDecode() {
    this.jwtDecoded = this.auth.jwtTokenDecode();
  }

  getProxies() {
    this.apigee.getProxies().subscribe(
      data  => {
        this.handlerServerResponse(data);
      },
      error => {
        this.handlerError(error);
      }
    );
  }

  getProductDescription(products: any) {
    this.apigee.getDeploymentStatus(products).subscribe(
      data  => {
        let status = data;
        this.apigee.getProxieRevision(products, '1').subscribe(
          data  => {
            let desc = data;
            console.log('desc:', desc, 'status:', status);
          },
          error => {
            this.handlerError(error);
          }
        );
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
    this.allProxies = data.proxies;
    this.allProxies = this.allProxies.sort((a: any, b: any) => {
      if (a['name'] < b['name']) {
        return this.sorted ? -1 : 1;
      }
      if (a['name'] > b['name']) {
        return this.sorted ? 1 : -1;
      }
      return 0;
    });
    //console.log('allProxies:', this.allProxies)
  }

  modalHide(){
    this.showAddOffers = false;
  }

  handlerCreateProxieResponse(data: any){
    this.notifier.showNotification(
      'success',
      `${data.message.name} created.`
    );
    this.allProxies = [];
    this.getProxies();
    this.addOffersHide();
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
