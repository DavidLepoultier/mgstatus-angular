import { Component, OnInit } from '@angular/core';
import { RestService } from '../rest.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.scss']
})
export class ProjectDetailComponent implements OnInit {

  orgPref: object = {
    name: ''
  };
  error:any = null;
  errorMessage:any = '';

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

  constructor(public rest:RestService, private route: ActivatedRoute, private router: Router, private auth:AuthService) { }

  ngOnInit() {
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
  
  handlerError(error: any) {
    this.error = error.error;
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

