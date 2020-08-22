import { Component, OnInit } from '@angular/core';
import { SnackBarComponent } from 'src/app/snack-bar/snack-bar.component';
import { UserService } from 'src/app/services/user.service';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss']
})
export class CreateUserComponent implements OnInit {
  
  createUserForm: FormGroup;
  show_result: boolean = true;

  constructor(private snackBar: SnackBarComponent, private user: UserService, private fb: FormBuilder, private router: Router) { }

  validation_messages = {
    'firstname': [ 
      { type: 'required', message: 'Firstname is required' }
    ],
    'lastname': [
      { type: 'required', message: 'Lastname is required' }
    ],
    'email': [
      { type: 'required', message: 'Email is required' },
      { type: 'pattern', message: 'Enter a valid email' }
    ],
    'role': [
      { type: 'required', message: 'Role is required'}
    ]
  }

  myClass = '';

  ngOnInit() {
    window.scrollTo(0, 0);
    this.myClass = '';
    this.createForms();
  }

  createForms() {
    // user links form validations
    this.createUserForm = this.fb.group({
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$')
      ])),
      lastname: new FormControl('', Validators.compose([
        Validators.required
      ])),
      firstname: new FormControl('', Validators.compose([
        Validators.required
      ])),
      role: new FormControl('user', Validators.compose([
        Validators.required
      ]))
    })
  }
  
  createUser(user: any) {
    this.show_result = false
    user.firstname = user.firstname[0].toUpperCase() + user.firstname.substr(1).toLowerCase();
    user.lastname = user.lastname[0].toUpperCase() + user.lastname.substr(1).toLowerCase();
    this.user.createUser(user).subscribe(
      data  => this.handlerSuccess(data),
      error => this.handlerError(error.error)
    )
  }

  close() {
    this.router.navigate(['/users']);
  }

  handlerSuccess(data: any) {
    this.snackBar.openSnackBar(data.user,'Close','');
    this.show_result = true
    this.close();
  }

  handlerError(error: any) {
    this.snackBar.openSnackBar(error.message.message,'Close','failed');
    this.show_result = true
    this.close();
  }

}
