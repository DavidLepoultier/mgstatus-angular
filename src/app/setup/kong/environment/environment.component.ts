import { Component, OnInit } from '@angular/core';
import { KongEnvironmentService } from 'src/app/services/kong-environment.service';

@Component({
  selector: 'app-environment',
  templateUrl: './environment.component.html',
  styleUrls: ['./environment.component.scss']
})
export class EnvironmentComponent implements OnInit {

  environments: [];
  myClass = '';

  constructor(private env: KongEnvironmentService) { }
  
  ngOnInit() {
    window.scrollTo(0, 0);
    this.myClass = '';
    this.getConfig();
  }

  getConfig(){
    this.env.getAllEnvironment().subscribe(
      data => {
        this.environments = data.environments;
      }
    );
  }

}
