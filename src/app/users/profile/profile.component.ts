import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { SnackBarComponent } from 'src/app/snack-bar/snack-bar.component';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  verifyForm: FormGroup;
  setpassword = false;
  jbbData:any = null;
  show:Boolean = false;
  
  userToken = {
    firstname: '',
    lastname: '',
    user: ''
  };
  myClass = '';


  validation_messages = {
    'currentPassword': [
      { type: 'required', message: 'Old Password is required' },
    ],
    'password': [
      { type: 'required', message: 'Password is required' },
      { type: 'minlength', message: 'Password must be at least 6 characters' }
    ],
    'passwordConfirm': [
      { type: 'required', message: 'Confirmation password is required' },
      { type: 'mustMatch', message: 'Passwords must match' }
    ]
  }

  constructor(private snackBar: SnackBarComponent, private fb: FormBuilder, private route: ActivatedRoute, private router: Router, private auth: AuthService) { }

  ngOnInit() {
    window.scrollTo(0, 0);
    this.myClass = '';
    this.createForms();
    this.userToken = this.auth.jwtTokenDecode();
  }

  createForms() {
    // user links form validations
    this.verifyForm = this.fb.group({
      passwordConfirm: new FormControl('', Validators.compose([
        Validators.required
      ])),
      currentPassword: new FormControl('', Validators.compose([
        Validators.required
      ])),
      password: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(6)
      ]))
    },{
      validator: MustMatch('password', 'passwordConfirm')
    });
  }

  verify(user: any) {
    user.email = this.userToken['user'];
    this.auth.userResetPassword(this.userToken['id'], user).subscribe(
      data => this.login(user),
      error => this.handlerError(error.error)
    )
  }
  
  login(user: any) {
    this.auth.login(user).subscribe(
      data  => this.handlerLoginSuccess(data)
    );
  }

  handlerError(error: any) {
    this.snackBar.openSnackBar(error.message,'Close','failed');
  }

  handlerLoginSuccess(data: any) {
    this.jbbData = data;
    sessionStorage.setItem('jbb-data', JSON.stringify(this.jbbData))
    this.snackBar.openSnackBar('Password updated','Close','');
    this.createForms();
    // this.router.navigate(['/']);
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
