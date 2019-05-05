import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { ApigeeService } from '../apigee.service';
import { NotifierSvc } from '../../services/notifier.service';
import { MdbTableService } from 'angular-bootstrap-md';

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
  searchText: string = '';
  previous: string;
  showModal: boolean;
  application: string;
  jwtDecoded: object = {};

  constructor(private router:Router, private auth:AuthService, private apigee:ApigeeService, notifierSvc:NotifierSvc, private mdbTable:MdbTableService ) {
    this.notifier = notifierSvc;
    this.showModal = false;
  }

  @HostListener('input') oninput() {
    this.searchItems();
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

  modalShow(value: string) {
    this.showModal = true; 
    this.application = value;
  }

  modalHide(){
    this.showModal = false;
  }

  actionApp(app: any){
    this.postApp = {
      "application": app
    }
    console.log(this.postApp);
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

  searchItems() {
    const prev = this.mdbTable.getDataSource();
    if (!this.searchText) {
      this.mdbTable
      this.mdbTable.setDataSource(this.previous);
      this.allApps = this.mdbTable.getDataSource();
    }
    if (this.searchText) {
      this.allApps = this.mdbTable.searchLocalDataBy(this.searchText);
      this.mdbTable.setDataSource(prev);
    }
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
        setTimeout(() => {
            this.router.navigate(['/']);
        },4000);
        break;
    }
  }

  handlerServerResponse(data: any) {
    this.apigee.getDevelopers().subscribe(
      dev  => {
        for (let index = 0; index < data.apps.app.length; index++) {
          let developer = dev.developers.developer.filter(j => j.developerId === data.apps.app[index].developerId);
          if (developer.length > 0) {
            console.log('developer:', developer)
            data.apps.app[index].developerEmail = developer[0].email;
            this.allApps.push(data.apps.app[index]);
          }
        }
      }
    );
    this.allApps = this.allApps.sort((a: any, b: any) => {
      if (a['name'] < b['name']) {
        return this.sorted ? -1 : 1;
      }
      if (a['name'] > b['name']) {
        return this.sorted ? 1 : -1;
      }
      return 0;
    });
    this.mdbTable.setDataSource(this.allApps);
    this.previous = this.mdbTable.getDataSource();
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
