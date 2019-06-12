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
  allProxies: any = [];
  searchText: string;
  descProxie: object = {};
  sorted = true;  
  jwtDecoded: object = {};
  notifier: NotifierSvc;
  postProxie: object = {};
  disabled: boolean = true;
  updateProxieForm: FormGroup;
  currentProxie: string;
  fromTo: object = {
    link: '',
    display: ''
  };
  orgPref:any;

  constructor(private router:Router, private auth:AuthService, private apigee:ApigeeService, notifierSvc:NotifierSvc, private fb:FormBuilder, private route:ActivatedRoute) { 
    this.notifier = notifierSvc;
  }

  ngOnInit() {
    if(!this.auth.userIsLoggedIn()) {
      this.router.navigate(['/']);
    }
    this.jwtDecode();
    if(this.jwtDecoded['role'] === "orgAdmin" || this.jwtDecoded['role'] === "developer") {
      switch(this.jwtDecoded['role']) {
        case 'orgAdmin':
          this.orgPref.name = '';
          this.fromTo = {
            link: 'proxies',
            display: 'Proxies'
          }
        break;
        case 'developer':
          this.orgPref = JSON.parse(this.auth.userOrgPreference());
          this.fromTo = {
            link: 'myProxies',
            display: 'myProxies'
          }
          this.getProxies();
        break;
      }
      this.getEnvironments();
      this.getProxieDescription();
      this.currentProxie = this.route.snapshot.params['id']
    } else {
      this.router.navigate(['/']);
    }
  }

  createForms() {
    this.updateProxieForm = this.fb.group({
      action: new FormControl('update'),
      basePath: new FormControl({value: this.descProxie['proxie'].basepaths[0], disabled: this.disabled}),
      target: new FormControl({value: this.descProxie['targets'], disabled: this.disabled}),
      proxie: new FormControl(this.descProxie['proxie'].name)
    })
  }

  getProxies() {
    this.apigee.getMyProxies().subscribe(
      data => {
        this.handlerServerResponse(data);
      },
      error => {
        this.handlerError(error);
      }
    )
  }

  handlerServerResponse(data: any) {
    this.allProxies = data.apis;
  }

  updateMyProxies(proxie: any){
    for (let index = 0; index < this.allProxies.apis.length; index++) {
      if(this.allProxies.apis[index] === proxie) {
        this.allProxies.apis.splice(index, 1);
      }
    }
    let body = {
      user: this.jwtDecoded['user'],
      apis: this.allProxies['apis'],
      products: this.allProxies['products']
    }
    this.apigee.updateMyProxie(body).subscribe(
      data => {
        console.log('remove done')
      },
      error => {
        this.handlerError(error);
      }
    )
  }

  updateProxie(proxie: any){
    this.postProxie = {
      "proxie": proxie
    }
    this.apigee.updateProxie(this.postProxie).subscribe(
      data => {
        switch(proxie.action) {
          case 'update': 
            this.handlerUpdateProxieResponse(data);
            break;
        }  
      },
      error => {
        this.handlerError(error);
      }
    )
  }

  deleteProxie(){
    this.apigee.deleteProxie(this.route.snapshot.params['id']).subscribe(
      data => {
        this.handlerDeleteProxieResponse(data);
      },
      error => {
        this.handlerError(error);
      }
    )
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

  deployProxie(status: boolean, proxie: any, env: string) {
    this.apigee.deployProxie(proxie.name, proxie.revision, env, status).subscribe(
      data => {
        this.handlerDeployProxieResponse(data)
      },
      error => {
        this.handlerError(error);
    });
  }

  getProxieDescription() {
    let proxie = this.route.snapshot.params['id'];
    this.apigee.getProxie(proxie).subscribe(
      data  => {
        let api = data.proxie[0].api;
        let env = data.proxie[0].environments;
        let rev = api.revision[0];
        this.apigee.getProxieRevision(api.name, rev).subscribe(
          data  => {
            this.descProxie['proxie'] = data.proxie;
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
            this.apigee.getProxieTarget(api.name, rev).subscribe(
              data  => {
                this.descProxie['targets'] = data.targets.connection.uRL;
                this.createForms();
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
      },
      error => {
        this.handlerError(error);
      }
    );
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
      `${data.message} deleted.`
    );
    this.updateMyProxies(this.route.snapshot.params['id'])
    setTimeout(() => {
        this.router.navigate(['/' + this.fromTo['link']],);
    }, 2000);
  }

  handlerDeployProxieResponse(data: any){
    this.notifier.showNotification(
      'success',
      `Proxie ${data.message.state}`
    );
    this.getProxieDescription();
  }

  handlerUpdateProxieResponse(data: any){
    this.notifier.showNotification(
      'success',
      `Proxie udpate ${data.message}`
    );
    this.disabled = true;
    this.getProxieDescription();
  }

}
