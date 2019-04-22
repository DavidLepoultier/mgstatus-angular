import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { restoreView } from '@angular/core/src/render3';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  show: boolean;
  eyeIcon: any;
  error:any = null;
  jbbData:any = null;
  isAuthenticated:boolean = false;
  welcomeMessage:String = '';

  constructor(private auth:AuthService) { 
    this.show = false;
    this.eyeIcon = 'fa-eye';
  }

  ngOnInit() {
    if(this.auth.userIsLoggedIn()) {
      this.refreshFlags();
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
    this.error = error.error;
    console.log('failure', error)
  }

  handlerLoginSuccess(data: any) {
    this.error = null;
    console.log('success', data);
    this.jbbData = data;
    this.refreshFlags();
    sessionStorage.setItem('jbb-data', JSON.stringify(this.jbbData))
  }
}
