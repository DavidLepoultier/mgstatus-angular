import { Component, OnInit } from '@angular/core';
import { RestService } from '../rest.service';
import { ActivatedRoute, Router } from '@angular/router';
import { containerRefreshStart } from '@angular/core/src/render3';

@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.scss']
})
export class ProjectDetailComponent implements OnInit {

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

  constructor(public rest:RestService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.project = [];
    this.chartData = [];
    this.chartColors[0].backgroundColor = [];
    this.rest.getResource(this.route.snapshot.params['id']).subscribe((data: {}) => {
      this.project = data;
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
    });
  }
}