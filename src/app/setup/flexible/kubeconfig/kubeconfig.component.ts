import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import {FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth/auth.service';
import { KubernetesService } from 'src/app/services/kubernetes.service';
import { SnackBarComponent } from 'src/app/snack-bar/snack-bar.component';

@Component({
  selector: 'app-kubeconfig',
  templateUrl: './kubeconfig.component.html',
  styleUrls: ['./kubeconfig.component.scss']
})
export class KubeconfigComponent implements OnInit {

  kubeconfigForm: FormGroup;

  config = {
    id: '',
    nameSpace: '',
    clusterName: '',
    serverName: '',
    serverCA: '',
    verifyTls: false,
    userName: '',
    userClientCert: '',
    userClientKey: '',
    contextName: 'kubernetes',
    contextCluster: '',
    contextUsername: ''
  };
  show: boolean = false;
  jbbData:any = null;
  disabled = false;
  contextState = true;
  configChecked = false;

  cluster_validation_messages = {
    'clusterName': [
      { type: 'required', message: 'Cluster name is required' }
    ],
    'serverName': [
      { type: 'required', message: 'Server url endpoint is required' }
    ],
    'userName': [
      { type: 'required', message: 'Username is required' }
    ],
    'nameSpace': [
      { type: 'required', message: 'Kubernetes namespace is required'}
    ]
  }

  constructor( private fb: FormBuilder, private cdref: ChangeDetectorRef, private auth:AuthService, private kube:KubernetesService, private snackBar: SnackBarComponent) { }

  myClass = '';

  ngOnInit() {
    window.scrollTo(0, 0);
    this.myClass = '';
    this.createForms();
    this.getConfig();
  }

  ngAfterContentChecked() {
    if(!this.disabled) {
      this.kubeconfigForm.setControl('serverCA', new FormControl(''));
    }
    this.cdref.detectChanges();
  }

  createForms() {
    // user links form validations
    this.kubeconfigForm = this.fb.group({
      id: new FormControl(this.config.id),
      nameSpace: new FormControl(this.config.nameSpace, Validators.compose([
        Validators.required
      ])),
      clusterName: new FormControl(this.config.clusterName, Validators.compose([
        Validators.required
      ])),
      serverName: new FormControl(this.config.serverName, Validators.compose([
        Validators.required
      ])),
      serverCA: new FormControl(atob(this.config.serverCA)),
      verifyTls: new FormControl(this.config.verifyTls),
      userName: new FormControl(this.config.userName, Validators.compose([
        Validators.required
      ])),
      userClientCert: new FormControl(atob(this.config.userClientCert), Validators.compose([
        Validators.required
      ])),
      userClientKey: new FormControl(atob(this.config.userClientKey), Validators.compose([
        Validators.required
      ])),
      contextName: new FormControl(this.config.contextName),
      contextCluster: new FormControl(this.config.contextCluster),
      contextUsername: new FormControl(this.config.contextUsername)
    })
  }

  getConfig(){
    this.kube.getKubeConfig().subscribe(
      data => {
        this.config = data.kubeconfig
        this.createForms();
      }
    );
  }
  saveConfig(kubeconfigForm: any) {
    kubeconfigForm.contextCluster = kubeconfigForm.clusterName;
    kubeconfigForm.contextUsername = kubeconfigForm.userName;
    kubeconfigForm.userClientCert64 = btoa(kubeconfigForm.userClientCert);
    kubeconfigForm.userClientKey64 = btoa(kubeconfigForm.userClientKey);
    kubeconfigForm.serverCA64 = btoa(kubeconfigForm.serverCA);
    this.kube.addKubeConfig(kubeconfigForm).subscribe(
      data  => {
        this.handlerSuccess(data),
        this.configChecked = false,
        this.getConfig()
      },
      error => this.handlerError(error)
    );
  }
  
  testConfig(kubeconfigForm: any) {
    kubeconfigForm.contextCluster = kubeconfigForm.clusterName;
    kubeconfigForm.contextUsername = kubeconfigForm.userName;
    kubeconfigForm.userClientCert64 = btoa(kubeconfigForm.userClientCert);
    kubeconfigForm.userClientKey64 = btoa(kubeconfigForm.userClientKey);
    kubeconfigForm.serverCA64 = btoa(kubeconfigForm.serverCA);
    this.kube.testKubeAccess(kubeconfigForm).subscribe(
      data  => {
        this.handlerSuccess(data),
        this.configChecked = true
      },
      error => this.handlerError(error)
    );
  }

  handlerSuccess(data: any) {
    this.snackBar.openSnackBar(data.message,'Close','');
  }

  handlerError(error: any) {
    this.snackBar.openSnackBar(error.message,'Close','failed');
  }

  // handlerServerResponse(data: any) {
  // 
  // }
}
