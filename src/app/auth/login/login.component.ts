import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;

  show: boolean = false;
  jbbData:any = null;
  isAuthenticated:boolean = false;
  welcomeMessage:String = '';

  myClass = '';

  account_validation_messages = {
    'email': [
      { type: 'required', message: 'Email is required' },
      { type: 'pattern', message: 'Enter a valid email' }
    ],
    'password': [
      { type: 'required', message: 'Password is required' }
    ]
  }

  constructor(private auth:AuthService, private router:Router, private fb: FormBuilder, private toastr: ToastrService) { }

  ngOnInit() {
    window.scrollTo(0, 0);
    this.myClass = '';
    if(this.auth.userIsLoggedIn()) {
      this.refreshFlags();
      this.router.navigate(['/']);
    } else {
      this.createForms();
    }
  }


  createForms() {
    // user links form validations
    this.loginForm = this.fb.group({
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$')
      ])),
      password: new FormControl('', Validators.compose([
        Validators.required
      ]))
    })
  }

  refreshFlags() {
    this.isAuthenticated = true;
    this.welcomeMessage = 'Welcome';
  }

  login(loginForm: any) {
    this.auth.login(loginForm).subscribe(
      data  => this.handlerLoginSuccess(data),
      error => this.handlerError(error.error)
    );
  }

  handlerError(error: any) {
    // this.snackBar.openSnackBar(error.message,'Close','failed');
    this.toastr.error(error.message, 'Login')
  }

  handlerLoginSuccess(data: any) {
    this.jbbData = data;
    this.refreshFlags();
    sessionStorage.setItem('jbb-data', JSON.stringify(this.jbbData))
    this.router.navigate(['/orgs']);
  }
}
