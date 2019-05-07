import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { ApigeeService } from '../apigee.service';
import { NotifierSvc } from '../../services/notifier.service';
import { MdbTableService } from 'angular-bootstrap-md';
import {FormControl, FormGroup, FormBuilder, Validators} from '@angular/forms';

@Component({
  selector: 'app-proxies',
  templateUrl: './proxies.component.html',
  styleUrls: ['./proxies.component.scss']
})
export class ProxiesComponent implements OnInit {

  notifier: NotifierSvc;
  allProxies: any = [];
  sorted = true;
  searchText: string = '';
  previous: string;
  jwtDecoded: object = {};


  constructor(private router:Router, private auth:AuthService, private apigee:ApigeeService, notifierSvc:NotifierSvc, private mdbTable:MdbTableService, private fb:FormBuilder) { 
    this.notifier = notifierSvc;
  }

  ngOnInit() {
    if(!this.auth.userIsLoggedIn()) {
      this.router.navigate(['/']);
    }
    this.jwtDecode();
    if(this.jwtDecoded['role'] === "orgAdmin") {
      this.getProxies();
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
      this.allProxies = this.mdbTable.getDataSource();
    }
    if (this.searchText) {
      this.allProxies = this.mdbTable.searchLocalDataBy(this.searchText);
      this.mdbTable.setDataSource(prev);
    }
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

  getProxieDescription(proxie: any) {
    this.apigee.getDeploymentStatus(proxie).subscribe(
      data  => {
        let status = data;
        this.apigee.getProxieRevision(proxie, '1').subscribe(
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
        setTimeout(() => {
            this.router.navigate(['/']);
        },4000);
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
    this.mdbTable.setDataSource(this.allProxies);
    this.previous = this.mdbTable.getDataSource();
  }
}
