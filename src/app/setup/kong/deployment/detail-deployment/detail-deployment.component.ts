import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SnackBarComponent } from 'src/app/snack-bar/snack-bar.component';
import { Router, ActivatedRoute } from '@angular/router';
import { KongEnvironmentService } from 'src/app/services/kong-environment.service';
import { DeploymentProfileService } from 'src/app/services/deployment-profile.service';
import { KongSequenceService } from 'src/app/services/kong-sequence.service';

@Component({
  selector: 'app-detail-deployment',
  templateUrl: './detail-deployment.component.html',
  styleUrls: ['./detail-deployment.component.scss']
})
export class DetailDeploymentComponent implements OnInit {
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
    'deploymentName': [
      { type: 'required', message: 'Deployment name is required' },
    ]
  }

  constructor( private dep: DeploymentProfileService, private seq: KongSequenceService, private route: ActivatedRoute, private router:Router, private fb: FormBuilder, private env: KongEnvironmentService, private snackBar: SnackBarComponent) { 
  }

  myClass = '';

  ngOnInit() {
    if (window.scrollY <= 70) {
      window.scrollTo(0, 0);
      this.myClass = '';
    } else {
      window.scrollTo(0, 121);
      this.myClass = 'update-wrapper';
    }
    this.getSequences();
    this.getEnvironmnets();
    this.createForms();
    this.getDeployment(this.route.snapshot.params['id']);
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

  getDeployment(id: any){
    this.dep.getDeployment(id).subscribe(
      data => {
        this.config = data.deployment;
        this.createForms();
      },
      error => this.handlerError(error)
    );
  }
  
  deleteDeployment(){
    this.dep.deleteDeployment(this.route.snapshot.params['id']).subscribe(
      data => this.handlerSuccess(data),
      error => this.handlerError(error)
    );
  }

  updateConfig(registerDepForm: any) {
    this.dep.updateDeploymentConfig(this.route.snapshot.params['id'], registerDepForm).subscribe(
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
