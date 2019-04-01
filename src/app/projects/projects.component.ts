import { Component, OnInit } from '@angular/core';
import { RestService } from '../rest.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {

  projects:any = [];

  constructor(public rest:RestService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.getResources();
  }

  getResources() {
    this.projects = [];
    this.rest.getResources().subscribe((data: {}) => {
      this.projects = data;
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