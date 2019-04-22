import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service'

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  show: boolean;
  eyeIcon: any;
  error:any = null;
  jbbData:any = null;
  isAuthenticated:boolean = false;

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

  register(formData:any) {
    this.auth.register(formData).subscribe(
      data  => this.handlerLoginSuccess(data),
      error => this.handlerError(error)
    );
  }

  refreshFlags() {
    this.isAuthenticated = true;
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
