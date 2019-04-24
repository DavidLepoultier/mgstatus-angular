import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { ApigeeService } from '../apigee.service';
import { NotifierSvc } from '../../services/notifier.service';
import { MdbTableService } from 'angular-bootstrap-md';


@Component({
  selector: 'app-developer',
  templateUrl: './developer.component.html',
  styleUrls: ['./developer.component.scss']
})
export class DeveloperComponent implements OnInit {
  notifier: NotifierSvc;
  developer: object = {
    developer: 'david.lepoultier@orange.com',
  }
  myApps: any = [];
  private sorted = true;
  searchText: string = '';
  previous: string;

  constructor(private router:Router, private auth:AuthService, private apigee:ApigeeService, notifierSvc:NotifierSvc, private mdbTable:MdbTableService ) {
    this.notifier = notifierSvc;
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

  sortBy(by: string | any): void {

    this.myApps.sort((a: any, b: any) => {
      if (a[by] > b[by]) {
        return this.sorted ? -1 : 1;
      }
      if (a[by] < b[by]) {
        return this.sorted ? 1 : -1;
      }

      return 0;
    });

    this.sorted = !this.sorted;
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
      let approved = false;
      if(data.developerApps.app[index].status === 'approved')
        approved = true
      this.myApps.push({
        devApp: data.developerApps.app[index].name,
        status: data.developerApps.app[index].status,
        approved: approved
      });
    }
    this.myApps = this.myApps.sort((a: any, b: any) => {
      if (a['devApp'] < b['devApp']) {
        return this.sorted ? -1 : 1;
      }
      if (a['devApp'] > b['devApp']) {
        return this.sorted ? 1 : -1;
      }

      return 0;
    });

    this.mdbTable.setDataSource(this.myApps);
    this.previous = this.mdbTable.getDataSource();
  }
  
}
