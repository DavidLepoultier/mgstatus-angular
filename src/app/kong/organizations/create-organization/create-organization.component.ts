import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { OrganizationService } from 'src/app/services/organization.service';
import { DeploymentProfileService } from 'src/app/services/deployment-profile.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-organization',
  templateUrl: './create-organization.component.html',
  styleUrls: ['./create-organization.component.scss']
})
export class CreateOrganizationComponent implements OnInit {

  createOrgForm: FormGroup;
  deployments = [];

  show: boolean = false;
  isAuthenticated:boolean = false;
  running: boolean = false;
  history = [];
  stateStatus = ["created","failed"];
  newOrg = {};
  status = 0;
  disabled: boolean = true;

  config = {
    id: '',
    orgName: '',
    deployment: '',
    ADMIN_USER: '',
    ADMIN_PASSWORD: ''
  }

  account_validation_messages = {
    'orgName': [ 
      { type: 'required', message: "Organization's name is required" }
    ],
    'deployment': [
      { type: 'required', message: "Deployment profile is required"}
    ],
    'ADMIN_PASSWORD': [
      { type: 'require', message: "Password admin is required"}
    ],
    'ADMIN_USER': [
      { type: 'require', message: "Username admin is required"}
    ]
  }

  constructor( private router:Router, private fb: FormBuilder, private org: OrganizationService, private dep: DeploymentProfileService, private toastr: ToastrService) { 
  }

  myClass = '';

  ngOnInit() {
    window.scrollTo(0, 0);
    this.myClass = '';
    this.getDeployments();
    this.createForms();
  }

  createForms() {
    // user links form validations
    this.createOrgForm = this.fb.group({
      id: new FormControl(this.config.id),
      orgName: new FormControl(this.config.orgName, Validators.compose([
        Validators.required,
      ])),
      deployment: new FormControl(this.config.deployment, Validators.compose([
        Validators.required,
      ])),
      ADMIN_PASSWORD: new FormControl(this.config.ADMIN_PASSWORD, Validators.compose([
        Validators.required,
      ])),
      ADMIN_USER: new FormControl(this.config.ADMIN_USER, Validators.compose([
        Validators.required,
      ]))
    })
  }

  getDeployments(){
    this.dep.getAllDeployment().subscribe(
      data => this.deployments = data.deployments
    )
  }

  createOrg(createOrgForm: any) {
    this.org.createOrg(createOrgForm).subscribe(
      data  => this.handlerSuccess(data),
      error => this.handlerError(error.error)
    );
  }

  getDeployState(id: any) {
    this.org.getDeployStateOrgId(id).subscribe(
      data => {
        this.history = data.organization.deployState
        let state = data.organization.state
        if (this.status === 0) {
          this.history.sort((a, b) => (a.created_at > b.created_at) ? 1 : -1)
          if (this.history[0].status) {
            let checkIndex = this.history[0].status.length - 1;
            if(this.stateStatus.includes(this.history[0].status[checkIndex].state)) {
              this.org.getOrgId(id).subscribe(
                data => {
                  this.newOrg = data.organization;
                }
              );
              this.status = 1;
              this.disabled = false;
            }
            if(this.stateStatus.includes(state)) {
              this.org.getOrgId(id).subscribe(
                data => {
                  this.config = data.organization;
                }
              );
              this.status = 1;
              this.disabled = false;
            }
          }
        } 
      }
    )
  }

  autoRefreshOrg(id: any) {
    let intervalId = setInterval(() => {
      this.getDeployState(id);
      if (this.status === 1) clearInterval(intervalId);
    }, 1000);
  }

  close() {
    this.router.navigate(['/orgs']);
  }

  handlerSuccess(data: any) {
    this.toastr.success(data.message)
    this.org.getOrgId(data.createId).subscribe(
      data => this.newOrg = data.organization
    );
    this.running = true;
    this.status = 0;
    this.history = [];
    this.disabled = true;
    this.getDeployState(data.createId);
    this.autoRefreshOrg(data.createId);
  }

  handlerError(error: any) {
    console.log(error)
    this.toastr.error(error.message)
  }
}
