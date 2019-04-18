import { Component, OnInit } from '@angular/core';
import { RestService } from '../rest.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {

  error:any = null;
  errorMessage:any = '';
  projects:any = [];

  constructor(public rest:RestService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
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
    this.error = error.error;
  }

  handlerServerResponse(resources: any) {
    this.projects = [];
    this.projects.success = resources.success; 
    this.projects = resources.resources;
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