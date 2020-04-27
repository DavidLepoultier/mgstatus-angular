import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SnackBarComponent } from 'src/app/snack-bar/snack-bar.component';
import { Router } from '@angular/router';
import { KongEnvironmentService } from 'src/app/services/kong-environment.service';
import { KongSequenceService } from 'src/app/services/kong-sequence.service';
import { DeploymentProfileService } from 'src/app/services/deployment-profile.service';

@Component({
  selector: 'app-add-deployment',
  templateUrl: './add-deployment.component.html',
  styleUrls: ['./add-deployment.component.scss']
})
export class AddDeploymentComponent implements OnInit {

  registerDepForm: FormGroup;
  sequences = [];
  environments = [];

  show: boolean = false;
  jbbData:any = null;
  isAuthenticated:boolean = false;
  welcomeMessage:String = '';

  config = {
    id: '',
    deploymentName: '',
    environmentId: '',
    deploymentSequenceId: ''
  }

  account_validation_messages = {

  }

  constructor( private dep: DeploymentProfileService , private router:Router, private fb: FormBuilder, private seq: KongSequenceService, private env: KongEnvironmentService, private snackBar: SnackBarComponent) { 
  }

  myClass = '';

  ngOnInit() {
    window.scrollTo(0, 0);
    this.myClass = '';
    this.getSequences();
    this.getEnvironmnets();
    this.createForms();
  }

  createForms() {
    // user links form validations
    this.registerDepForm = this.fb.group({
      id: new FormControl(this.config.id),
      deploymentName: new FormControl(this.config.deploymentName, Validators.compose([
        Validators.required,
      ])),
      environmentId: new FormControl(this.config.environmentId, Validators.compose([
        Validators.required,
      ])),
      deploymentSequenceId: new FormControl(this.config.deploymentSequenceId, Validators.compose([
        Validators.required,
      ]))
    })
  }

  getSequences(){
    this.seq.getAllSequence().subscribe(
      data => this.sequences = data.sequences
    )
  }

  getEnvironmnets(){
    this.env.getAllEnvironment().subscribe(
      data => this.environments = data.environments
    )
  }

  saveConfig(registerDepForm: any) {
    this.dep.addDeploymentConfig(registerDepForm).subscribe(
      data  => this.handlerSuccess(data),
      error => this.handlerError(error)
    );
  }

  handlerSuccess(data: any) {
    this.snackBar.openSnackBar(data.message,'Close','');
    this.router.navigate(['/kong']);
  }

  handlerError(error: any) {
    
  }

}
