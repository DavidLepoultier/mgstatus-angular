import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { ApigeeService } from '../apigee.service';
import { NotifierSvc } from '../../services/notifier.service';
import { MdbTableService } from 'angular-bootstrap-md';

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
  sorted = true;
  searchText: string = '';
  previous: string;
  show: boolean;
  eyeIcon: string;
  showModal: boolean;
  application: string;

  constructor(private router:Router, private auth:AuthService, private apigee:ApigeeService, notifierSvc:NotifierSvc, private mdbTable: MdbTableService ) {
    this.notifier = notifierSvc;
    this.show = false;
    this.showModal = false;
    this.eyeIcon = 'fa-eye';
  }

  @HostListener('input') oninput() {
    this.searchItems();
  }

  ngOnInit() {
    if(!this.auth.userIsLoggedIn()) {
      this.router.navigate(['/']);
    }
    this.getDeveloperApps(this.developer);
  }

  modalShow(value: string) {
    this.showModal = true; // Show-Hide Modal Check
    this.application = value; // Dynamic Data
  }

  modalHide(){
    this.showModal = false;
  }

  deleteApp(app: string) {
    this.postApp = {
      "developer": this.developer['developer'],
      "application": app,
    }
    this.apigee.actionApp(this.postApp, 'delete').subscribe(
      data => {
        this.handlerDeleteAppResponse(data);
      },
      error => {
        this.handlerError(error);
      }
    )
  }

  showInput() {
    this.show = !this.show;
    if(this.show) {
      this.eyeIcon = 'fa-eye-slash';
    } else {
      this.eyeIcon = 'fa-eye';
    }
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

}
