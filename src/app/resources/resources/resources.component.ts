import { Component, OnInit } from '@angular/core';
import { ResourceService } from '../resource.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NotifierSvc } from '../../services/notifier.service';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-resources',
  templateUrl: './resources.component.html',
  styleUrls: ['./resources.component.scss']
})
export class ResourcesComponent implements OnInit {

  orgPref:any = '';
  sorted = true;
  filterBox:any = '';
  arrayFilterBox: any = [];

  jwtDecoded: object = {};

  notifier:NotifierSvc;
  error:any = null;
  errorMessage:any = '';
  projects:any = [];

  constructor(public rest:ResourceService, private route: ActivatedRoute, private router: Router, notifierSvc:NotifierSvc, private auth:AuthService) { 
    this.notifier = notifierSvc;
  }

  ngOnInit() {
    if(this.auth.userIsLoggedIn())
      this.jwtDecode();
    if(this.jwtDecoded['role'] != "admin")
      this.orgPref = JSON.parse(this.auth.userOrgPreference());
    this.getResources();
  }

  jwtDecode() {
    this.jwtDecoded = this.auth.jwtTokenDecode();
  }

  checkCheckBoxvalue(event: any){
    this.filterBox = event;
  }

  getResources() {
    this.rest.getResources().subscribe(
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
      'Error occured while trying to get r-Gate\'s list'
    );
  }

  handlerServerResponse(resources: any) {
    this.projects = [];
    this.projects = resources.resources;
    this.projects.success = resources.success; 
    const date = Date.now();
    for (let index = 0; index < this.projects.length; index++) {
      const element = this.projects[index];
      var running = 0;
      for (let container = 0; container < element.containers.length; container++) {
        if ((date - element.containers[container].time) < 60000) {
          running++;
        } 
      }
      if ( running === element.containers.length) {
        this.projects[index].containersState = 'indeterminate';
      } else if ( running > 0) {
        this.projects[index].containersState = 'amber';
      } else {
        this.projects[index].containersState = 'grey';
      }
      this.projects[index].containersRunning = running;
    }
    this.projects = this.projects.sort((a: any, b: any) => {
      if (a['id'] < b['id']) {
        return this.sorted ? -1 : 1;
      }
      if (a['id'] > b['id']) {
        return this.sorted ? 1 : -1;
      }
      return 0;
    });
  }

  add() {
    this.router.navigate(['/project-add']);
  }

  delete(id: any) {
    this.rest.deleteProject(id)
      .subscribe(res => {
          this.getResources();
        }, (err) => {
          console.log(err);
        }
      );
  }

}