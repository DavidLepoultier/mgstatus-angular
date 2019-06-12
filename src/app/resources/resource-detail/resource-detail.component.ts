import { Component, OnInit } from '@angular/core';
import { ResourceService } from '../resource.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-resource-detail',
  templateUrl: './resource-detail.component.html',
  styleUrls: ['./resource-detail.component.scss']
})
export class ResourceDetailComponent implements OnInit {

  orgPref:any = '';
  error:any = null;
  errorMessage:any = '';

  jwtDecoded: object = {};
  colProxies: string = 'col-md-7';

  project:any = [];
  date = Date.now();
  chartData:any = [];
  chartType:string = 'doughnut';
  chartColors:any = [
    {
      backgroundColor: []
    }
  ];
  chartOptions:any = { 
    responsive: true,
    cutoutPercentage: 65,
    title: {
      display: true,
      text: "Containers State",
      position: "bottom"
    }
  };

  constructor(public rest:ResourceService, private route: ActivatedRoute, private router: Router, private auth:AuthService) { }

  ngOnInit() {
    if(this.auth.userIsLoggedIn())
      this.jwtDecode();
    if(this.jwtDecoded['role'] === "admin")
      this.colProxies = 'col-md-6';
    if(this.jwtDecoded['role'] === 'developer')
      this.orgPref = JSON.parse(this.auth.userOrgPreference());
    this.rest.getResource(this.route.snapshot.params['id']).subscribe(
      data  => {
        this.handlerServerResponse(data);
      },
      error => {
        this.handlerError(error);
      }
    );
  }
  
  jwtDecode() {
    this.jwtDecoded = this.auth.jwtTokenDecode();
  }

  handlerError(error: any) {
    this.error = error.error;
  }

  deleteProject(project: any) {
    this.rest.deleteProject(project).subscribe(
      data  => {
        this.router.navigate([`/reload/r-Gate`]);
      },
      error => {
        this.handlerError(error);
      }
    )
  }

  deleteContainer(project: any, container: any) {
    this.rest.deleteContainer(project, container).subscribe(
      data  => {
        this.rest.getResource(this.route.snapshot.params['id']).subscribe(
          data  => {
            this.handlerServerResponse(data);
          },
          error => {
            this.handlerError(error);
          }
        )
      },
      error => {
        this.handlerError(error);
      }
    )
  }

  handlerServerResponse(response: any) {
    if (response.success) {
      this.chartData = [];
      this.chartColors[0].backgroundColor = [];
      this.project = response.resource[0];
      var container = 0;
      for (let index = 0; index < this.project.containers.length; index++) {
        if ((this.date - this.project.containers[index].time) < 60000) {
          this.chartColors[0].backgroundColor.push("#46BFBD");
        } else {
          this.chartColors[0].backgroundColor.push("#bdbdbd");
        }
        container++;
        this.chartData.push(1);
      }
      this.project.container = container;
      if (this.project.describe.contact) {
        this.project.contact = this.project.describe.contact;
      } else {
        this.project.contact = '';
      }
      if (this.project.describe.endpoint){
        this.project.endpoint = this.project.describe.endpoint;
      } else {
        this.project.endpoint = '';
      }
    }
  }
}

