import { Component, OnInit } from '@angular/core';
import { RestService } from '../rest.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NotifierSvc } from '../services/notifier.service';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {

  orgPref:any;
  
  notifier:NotifierSvc;
  error:any = null;
  errorMessage:any = '';
  projects:any = [];

  constructor(public rest:RestService, private route: ActivatedRoute, private router: Router, notifierSvc:NotifierSvc, private auth:AuthService) { 
    this.notifier = notifierSvc;
  }

  ngOnInit() {
    this.orgPref = JSON.parse(this.auth.userOrgPreference());
    this.getResources();
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