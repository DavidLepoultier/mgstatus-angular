import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { ApigeeService } from '../apigee.service';
import { NotifierSvc } from '../../services/notifier.service';
import {FormControl, FormGroup, FormBuilder, Validators} from '@angular/forms';

@Component({
  selector: 'app-proxie-detail',
  templateUrl: './proxie-detail.component.html',
  styleUrls: ['./proxie-detail.component.scss']
})
export class ProxieDetailComponent implements OnInit {

  showModal: boolean = false;
  allEnvironments: any = [];
  searchText: string;
  descProxie: object = {};
  sorted = true;  
  jwtDecoded: object = {};
  notifier: NotifierSvc;
  postProxie: object = {};

  constructor(private router:Router, private auth:AuthService, private apigee:ApigeeService, notifierSvc:NotifierSvc, private fb:FormBuilder, private route:ActivatedRoute) { 
    this.notifier = notifierSvc;
  }

  ngOnInit() {
      if(!this.auth.userIsLoggedIn()) {
        this.router.navigate(['/']);
      }
      this.jwtDecode();
      if(this.jwtDecoded['role'] === "orgAdmin") {
        this.getEnvironments();
        this.getProxieDescription(this.route.snapshot.params['id']);
        //this.createForms();
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
        this.handlerError(error);
      }
    );
  }

  deployProxie(status: boolean, proxie: any, env: string) {
    this.apigee.deployProxie(proxie.name, proxie.revision, env, status).subscribe(
      data => {
        this.handlerDeployProxieResponse(data)
      },
      error => {
        this.handlerError(error);
    });
  }

  getProxieDescription(proxie: any) {
    this.apigee.getProxie(proxie).subscribe(
      data  => {
        let api = data.proxie[0].api;
        let env = data.proxie[0].environments;
        let rev = api.revision[0];
        this.apigee.getProxieRevision(api.name, rev).subscribe(
          data  => {
            this.descProxie = data;
            let envList = [];
            for (let index = 0; index < this.allEnvironments.length; index++) {
              let element = this.allEnvironments[index];
              let searchEnv = env.filter(j => j === element);
              if (searchEnv.length === 0) {
                envList.push({env: element, deploy: false})
              } else {
                envList.push({env: element, deploy: true})
              }
            }
            this.descProxie['environments'] = envList;
            console.log(this.descProxie)
          },
          error => {
            this.handlerError(error);
          }
        );
        //console.log(data);
      },
      error => {
        this.handlerError(error);
      }
    );
  }

  actionOffers(proxie: any){
    this.postProxie = {
      "proxie": proxie
    }
    this.apigee.actionProxie(this.postProxie, proxie.action).subscribe(
      data => {
        switch(proxie.action) {
          case 'delete':
            this.handlerDeleteProxieResponse(data);
            break;
        }  
      },
      error => {
        this.handlerError(error);
      }
    )
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

  modalHide(){
    this.showModal = false;
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

  handlerDeleteProxieResponse(data: any) {
    this.notifier.showNotification(
      'success',
      `${data.action.name} deleted.`
    );
    // this.allProxies = [];
    // this.getProxieDescription();
    this.modalHide();
  }

  handlerDeployProxieResponse(data: any){
    this.notifier.showNotification(
      'success',
      `Proxie ${data.message.state}`
    );
    this.getProxieDescription(this.route.snapshot.params['id']);
  }

}
