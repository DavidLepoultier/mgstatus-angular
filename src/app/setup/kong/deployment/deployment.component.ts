import { Component, OnInit } from '@angular/core';
import { DeploymentProfileService } from 'src/app/services/deployment-profile.service';

@Component({
  selector: 'app-deployment',
  templateUrl: './deployment.component.html',
  styleUrls: ['./deployment.component.scss']
})
export class DeploymentComponent implements OnInit {

  searchText: string;
  deployments: [];
  myClass = '';

  constructor(private dep: DeploymentProfileService) { }

  ngOnInit() {
    window.scrollTo(0, 0);
    this.myClass = '';
    this.getConfig();
  }

  getConfig(){
    this.dep.getAllDeployment().subscribe(
      data => {
        this.deployments = data.deployments;
      }
    );
  }

}
