import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from "@angular/material";
import { SnackBarComponent } from 'src/app/snack-bar/snack-bar.component';
import { Router, ActivatedRoute } from '@angular/router';
import { OrganizationService } from 'src/app/services/organization.service';
import { DeploymentProfileService } from 'src/app/services/deployment-profile.service';
import { DeleteOrganizationComponent } from '../../modals/delete-organization/delete-organization.component';

@Component({
  selector: 'app-detail-organization',
  templateUrl: './detail-organization.component.html',
  styleUrls: ['./detail-organization.component.scss']
})
export class DetailOrganizationComponent implements OnInit {

  updateOrgForm: FormGroup;
  deployments = []; 

  deployState = {};
  show: boolean = false;
  isAuthenticated:boolean = false;
  running: boolean = false;
  newOrg = {};
  status = 0;
  index = 0;

  config = {
    id: '',
    orgName: '',
    deployment: '',
    ADMIN_USER: '',
    ADMIN_PASSWORD: '',
    deployState: [],
    environment: {}
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

  constructor(private dialog: MatDialog, private route: ActivatedRoute, private router:Router, private fb: FormBuilder, private org: OrganizationService, private dep: DeploymentProfileService, private snackBar: SnackBarComponent) { 
  }

  deleteConfirm() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = false;
    dialogConfig.data = {id: this.config.id, name: this.config.orgName}

    const dialogRef = this.dialog.open(DeleteOrganizationComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.deleteOrgId();
      };
    });
  }

  deleteOrgId() {
    this.org.deleteOrgId(this.config.id).subscribe(
      data => {
        this.snackBar.openSnackBar(data.message,'Close','');
        this.router.navigate(['/orgs']);
      }),
      error => this.handlerError(error);
  }

  myClass = '';

  ngOnInit() {
    console.log(this.running)
    window.scrollTo(0, 0);
    this.myClass = '';
    this.getDeployments();
    this.getOrgById(this.route.snapshot.params['id']);
    this.createForms();
  }

  createForms() {
    // user links form validations
    this.updateOrgForm = this.fb.group({
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
      ])),
      deployState: new FormControl(this.config.deployState),
      environment: new FormControl(this.config.environment),
    })
  }

  updateProfile(updateOrgForm: any) {
    let newDeployId = { 
      newDeployId: updateOrgForm.deployment 
    }
    this.index = this.config.deployState.length
    this.org.changeProfileOrg(updateOrgForm.id, newDeployId).subscribe(
      data  => this.handlerSuccess(data),
      error => this.handlerError(error)
    );
  }

  getDeployments(){
    this.dep.getAllDeployment().subscribe(
      data => this.deployments = data.deployments
    )
  }

  getOrgById(id) {
    this.org.getOrgId(id).subscribe(
      data => {
        this.config = data.organization;
        this.createForms();
        if(data.organization.state == "created") {
          this.status = 1;
        }
      }
    );   
  }

  autoRefreshOrg(id) {
    let intervalId = setInterval(() => {
      this.getOrgById(id);
      this.deployState = this.config.deployState[this.index];
      if (this.status == 1) clearInterval(intervalId);
    }, 1000);
  }

  close() {
    this.router.navigate(['/orgs']);
  }

  handlerSuccess(data: any) {
    this.snackBar.openSnackBar(data.message,'Close','');
    this.org.getOrgId(this.route.snapshot.params['id']).subscribe(
      data => {
        this.config = data.organization;
      }
    );
    this.running = true;
    this.status = 0;
    
    this.autoRefreshOrg(this.route.snapshot.params['id']);
  }

  handlerError(error: any) {
    
  }
}