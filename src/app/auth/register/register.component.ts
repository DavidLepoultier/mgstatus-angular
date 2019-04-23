import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { NotifierSvc } from '../../services/notifier.service'
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  show: boolean;
  eyeIcon: any;
  jbbData:any = null;
  isAuthenticated:boolean = false;
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
    this.notifier.showNotification(
      'error',
      error.error
    );
  }

  handlerLoginSuccess(data: any) {
    this.jbbData = JSON.stringify(data);
    this.refreshFlags();
    sessionStorage.setItem('jbb-data', this.jbbData)
    this.router.navigate(['/']);
  }
}
