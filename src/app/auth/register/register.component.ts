import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { NotifierSvc } from '../../services/notifier.service'
import { Router } from '@angular/router';
import {FormControl, FormGroup, FormBuilder, Validators} from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  orgs:any = [];
  show:boolean = false;
  jbbData:any = null;
  jwtDecoded: object = {};
  isAuthenticated:boolean = false;
  notifier:NotifierSvc;

  account_validation_messages = {
    'firstName': [
      { type: 'required', message: 'First name is required' }
    ],
    'lastName': [
      { type: 'required', message: 'Last name is required' }
    ],
    'email': [
      { type: 'required', message: 'Email is required' },
      { type: 'pattern', message: 'Enter a valid email' }
    ],
    'password': [
      { type: 'required', message: 'Password is required' },
      { type: 'pattern', message: 'At least 8 characters and 1 digit' }
    ]
  }

  constructor(private auth:AuthService, notifierSvc:NotifierSvc, private router:Router, private fb: FormBuilder) { 
    this.notifier = notifierSvc;
  }

  ngOnInit() {
    if(this.auth.userIsLoggedIn()) {
      this.refreshFlags();
      this.router.navigate(['/']);
    } else {
      this.getOrgs();
      this.createForms();
    }
  }

  createForms() {
    // user links form validations
    this.registerForm = this.fb.group({
      firstName: new FormControl('', Validators.compose([
        Validators.required
      ])),
      lastName: new FormControl('', Validators.compose([
        Validators.required
      ])),
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$')
      ])),
      orgName: new FormControl(''),
      password: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^(?=.*?[a-z])(?=.*?[0-9]).{8,}$')
      ])) 
    })
  }

  getOrgs(){
    this.auth.getAllOrgs().subscribe(
      data  => {
        this.orgs = data.orgs;
      }
    )
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

  jwtDecode() {
    this.jwtDecoded = this.auth.jwtTokenDecode();
  }

  handlerLoginSuccess(data: any) {
    this.jbbData = JSON.stringify(data);
    this.refreshFlags();
    sessionStorage.setItem('jbb-data', this.jbbData)
    this.jwtDecode();
    for (let index = 0; index < this.jwtDecoded['tenants'].length; index++) {
      let creds = {
        tenant: this.jwtDecoded['tenants'][index],
        email:  this.jwtDecoded['user'],
        name: this.jwtDecoded['name'].split(' ', 2)
      }
      this.auth.registerApigee(creds).subscribe( 
      );
    }
    this.router.navigate(['/']);
  }
}
