import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { ApigeeService } from '../apigee.service';
import { NotifierSvc } from '../../services/notifier.service';

@Component({
  selector: 'app-all-apps',
  templateUrl: './all-apps.component.html',
  styleUrls: ['./all-apps.component.scss']
})
export class AllAppsComponent implements OnInit {
  notifier: NotifierSvc;
  postApp: object = {}
  allApps: any = [];
  sorted = true;
  searchText: string;
  showModal: boolean;
  application: string;
  developer: string;
  displayName: string;
  jwtDecoded: object = {};

  constructor(private router:Router, private auth:AuthService, private apigee:ApigeeService, notifierSvc:NotifierSvc ) {
    this.notifier = notifierSvc;
    this.showModal = false;
  }

  ngOnInit() {
    if(!this.auth.userIsLoggedIn()) {
      this.router.navigate(['/']);
    }
    this.jwtDecode();
    if(this.jwtDecoded['role'] === "orgAdmin") {
      this.getAllApps();
    } else {
      this.router.navigate(['/']);
    }
  }

  jwtDecode() {
    this.jwtDecoded = this.auth.jwtTokenDecode();
  }

  modalShow(app: string, dev: string, display: string) {
    this.showModal = true; 
    this.application = app;
    this.developer = dev;
    this.displayName = display;
  }

  modalHide(){
    this.showModal = false;
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
        }  
      },
      error => {
        this.handlerError(error);
      }
    )
  }

  getAllApps() {
    this.apigee.getAllApps().subscribe(
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
    for (let index = 0; index < data.apps.app.length; index++) {
      if (data.apps.app[index].name.startsWith('edgemicro_')) {
        this.apigee.getDevelopersId(data.apps.app[index].developerId).subscribe(
          dev => {
            data.apps.app[index].displayName = data.apps.app[index].attributes[0].value || data.apps.app[index].name;
            data.apps.app[index].developerEmail = dev.developers.developer[0].email;
            this.allApps.push(data.apps.app[index]);
          }  
        );
      }
    }
    this.allApps = this.allApps.sort((a: any, b: any) => {
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
      `${data.action.name} has been deleted`
    );
    this.allApps = [];
    this.getAllApps();
    this.modalHide();
  }

}
