import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { ApigeeService } from '../apigee.service';
import { NotifierSvc } from '../../services/notifier.service'


@Component({
  selector: 'app-developer',
  templateUrl: './developer.component.html',
  styleUrls: ['./developer.component.scss']
})
export class DeveloperComponent implements OnInit {

  notifier: NotifierSvc;
  developer: object = {
    developer: 'david.lepoultier@gmail.com',
  }
  myApps: any = null;


  constructor(private router:Router, private auth:AuthService, private apigee:ApigeeService, notifierSvc:NotifierSvc ) {
    this.notifier = notifierSvc;
  }

  ngOnInit() {
    if(!this.auth.userIsLoggedIn()) {
      this.router.navigate(['/']);
    }
    this.getDeveloperApps(this.developer);
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
    this.myApps = JSON.stringify(data);
  }
  
}
