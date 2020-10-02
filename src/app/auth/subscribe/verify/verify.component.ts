import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.scss']
})
export class VerifyComponent implements OnInit {
  
  verifyForm: FormGroup;
  setpassword = false;
  currentUser = {};
  jbbData:any = null;
  isAuthenticated:boolean = false;
  welcomeMessage:String = '';

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private router: Router, private auth: AuthService, private toastr: ToastrService) { }

  myClass = '';

  validation_messages = {
    'password': [
      { type: 'required', message: 'Password is required' },
      { type: 'minlength', message: 'Password must be at least 6 characters' }
    ],
    'passwordConfirm': [
      { type: 'required', message: 'Confirmation password is required' },
      { type: 'mustMatch', message: 'Passwords must match' }
    ]
  }

  ngOnInit() {
    window.scrollTo(0, 0);
    this.myClass = '';
    this.createForms();
    this.getUser(this.route.snapshot.params['id']);
  }

  createForms() {
    // user links form validations
    this.verifyForm = this.fb.group({
      passwordConfirm: new FormControl('', Validators.compose([
        Validators.required
      ])),
      password: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(6)
      ]))
    },{
      validator: MustMatch('password', 'passwordConfirm')
    }
    )
  }

  getUser(id: any){
    this.auth.getUserVerify(id).subscribe(
      data => {
        this.setpassword = true;
        this.currentUser = data.user;
      },
      error => {
        this.router.navigate(['/login']);
      }
    )
  }

  verify(user: any) {
    user.verified = true;
    user.email = this.currentUser['email']
    this.auth.userVerify(this.route.snapshot.params['id'], user).subscribe(
      data => this.login(user),
      error => this.handlerError(error.error)
    )
  }

  refreshFlags() {
    this.isAuthenticated = true;
    this.welcomeMessage = 'Welcome';
  }
  
  login(user: any) {
    this.auth.login(user).subscribe(
      data  => this.handlerLoginSuccess(data)
    );
  }

  handlerError(error: any) {
    // this.snackBar.openSnackBar(error.message,'Close','failed');
    this.toastr.error(error.message)
  }

  handlerLoginSuccess(data: any) {
    this.jbbData = data;
    this.refreshFlags();
    sessionStorage.setItem('jbb-data', JSON.stringify(this.jbbData))
    this.router.navigate(['/']);
  }

}

// custom validator to check that two fields match
export function MustMatch(controlName: string, matchingControlName: string) {
  return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors.mustMatch) {
          // return if another validator has already found an error on the matchingControl
          return;
      }

      // set error on matchingControl if validation fails
      if (control.value !== matchingControl.value) {
          matchingControl.setErrors({ mustMatch: true });
      } else {
          matchingControl.setErrors(null);
      }
  }
}