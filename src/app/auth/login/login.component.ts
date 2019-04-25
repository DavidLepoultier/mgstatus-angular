import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { NotifierSvc } from '../../services/notifier.service'
import { Router } from '@angular/router';

import { restoreView } from '@angular/core/src/render3';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  show: boolean;
  eyeIcon: string;
  jbbData:any = null;
  isAuthenticated:boolean = false;
  welcomeMessage:String = '';
  notifier: NotifierSvc;

  constructor(private auth:AuthService, notifierSvc:NotifierSvc, private router:Router) { 
    this.show = false;
    this.eyeIcon = 'fa-eye';
    this.notifier = notifierSvc;
  }

  ngOnInit() {
    if(this.auth.userIsLoggedIn()) {
      this.refreshFlags();
      this.router.navigate(['/']);
    }
  }

  password() {
    this.show = !this.show;
    if(this.show) {
      this.eyeIcon = 'fa-eye-slash';
    } else {
      this.eyeIcon = 'fa-eye';
    }
  }

  refreshFlags() {
    this.isAuthenticated = true;
    this.welcomeMessage = 'Welcome';
  }

  login(loginForm: any) {
    this.auth.login(loginForm).subscribe(
      data  => this.handlerLoginSuccess(data),
      error => this.handlerError(error)
    );
  }

  handlerError(error: any) {
    this.notifier.showNotification(
      'error',
      error.error.message
    );
  }

  handlerLoginSuccess(data: any) {
    this.jbbData = data;
    this.refreshFlags();
    sessionStorage.setItem('jbb-data', JSON.stringify(this.jbbData))
    this.router.navigate(['/']);
  }
}
