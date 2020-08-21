import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SnackBarComponent } from 'src/app/snack-bar/snack-bar.component';
import { Router } from '@angular/router';
import { RolesService } from 'src/app/services/roles.service';

@Component({
  selector: 'app-create-role',
  templateUrl: './create-role.component.html',
  styleUrls: ['./create-role.component.scss']
})
export class CreateRoleComponent implements OnInit {

  createRoleForm: FormGroup;
  deployments = [];

  show: boolean = false;
  isAuthenticated:boolean = false;
  newOrg = {};
  status = 0;

  config = {
    id: '',
    name: '',
    organizations: {
      POST: false,
      PUT: false,
      DELETE: false,
      GET: false
    },
    users: {
      POST: false,
      PUT: false,
      DELETE: false,
      GET: false
    },
    roles: {
      POST: false,
      PUT: false,
      DELETE: false,
      GET: false
    }
  }

  account_validation_messages = {
    'name': [ 
      { type: 'required', message: "Organization's name is required" }
    ]
  }

  constructor( private router:Router, private fb: FormBuilder, private roles: RolesService, private snackBar: SnackBarComponent) { 
  }

  myClass = '';

  ngOnInit() {
    window.scrollTo(0, 0);
    this.myClass = '';
    this.createForms();
  }

  createForms() {
    // user links form validations
    this.createRoleForm = this.fb.group({
      id: new FormControl(this.config.id),
      name: new FormControl(this.config.name, Validators.compose([
        Validators.required,
      ])),
      organizationsPOST: new FormControl(this.config.organizations.POST),
      organizationsPUT: new FormControl(this.config.organizations.PUT),
      organizationsDELETE: new FormControl(this.config.organizations.DELETE),
      organizationsGET: new FormControl(this.config.organizations.GET),
      usersPOST: new FormControl(this.config.users.POST),
      usersPUT: new FormControl(this.config.users.PUT),
      usersDELETE: new FormControl(this.config.users.DELETE),
      usersGET: new FormControl(this.config.users.GET),
      rolesPOST: new FormControl(this.config.roles.POST),
      rolesPUT: new FormControl(this.config.roles.PUT),
      rolesDELETE: new FormControl(this.config.roles.DELETE),
      rolesGET: new FormControl(this.config.roles.GET),
    })
  }

  createRole(createRoleForm: any) {
    let roleConfig = {
      name: createRoleForm.name,
      organizations: {
        POST: createRoleForm.organizationsPOST,
        PUT: createRoleForm.organizationsPUT,
        DELETE: createRoleForm.organizationsDELETE,
        GET: createRoleForm.organizationsGET
      },
      users: {
        POST: createRoleForm.usersPOST,
        PUT: createRoleForm.usersPUT,
        DELETE: createRoleForm.usersDELETE,
        GET: createRoleForm.usersGET
      },
      roles: {
        POST: createRoleForm.rolesPOST,
        PUT: createRoleForm.rolesPUT,
        DELETE: createRoleForm.rolesDELETE,
        GET: createRoleForm.rolesGET
      }
    }
    this.roles.createRole(roleConfig).subscribe(
      data  => this.handlerSuccess(data),
      error => this.handlerError(error.error)
    );
  }

  close() {
    this.router.navigate(['/roles']);
  }

  handlerSuccess(data: any) {
    this.snackBar.openSnackBar(data.message,'Close','');
    this.close();
  }

  handlerError(error: any) {
    console.log(error)
    this.snackBar.openSnackBar(error.message.message,'Close','failed');
  }

}
