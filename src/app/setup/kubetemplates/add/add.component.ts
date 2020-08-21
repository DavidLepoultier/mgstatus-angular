import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SnackBarComponent } from 'src/app/snack-bar/snack-bar.component';
import { KubeTemplatesService } from 'src/app/services/kube-templates.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {

  templateForm: FormGroup;

  show: boolean = false;
  jbbData:any = null;
  isAuthenticated:boolean = false;
  welcomeMessage:String = '';

  config = {
    id: '',
    templateName: '',
    template: '',
    templateType: ''
  }

  account_validation_messages = {
    'templateName': [ 
      { type: 'required', message: "Template's name is required" }
    ],
    'template': [ 
      { type: 'required', message: "Template is required" }
    ],
    'templateType': [
      { type: 'required', message: "Template type is required" }
    ]
  }

  constructor( private router:Router, private fb: FormBuilder, private tpl: KubeTemplatesService, private snackBar: SnackBarComponent) { 
  }

  templateTypes = [
    {
      name: 'Namespace'
    },
    {
      name: 'Service'
    },
    {
      name: 'ConfigMap'
    },
    {
      name: 'Secret'
    },
    {
      name: 'DeployConfig'
    },
    {
      name: 'Job'
    },
    {
      name: 'Ingress'
    }
  ]

  myClass = '';

  ngOnInit() {
    window.scrollTo(0, 0);
    this.myClass = '';
    this.createForms();
  }

  createForms() {
    // user links form validations
    this.templateForm = this.fb.group({
      id: new FormControl(this.config.id),
      templateName: new FormControl(this.config.templateName, Validators.compose([
        Validators.required,
      ])),
      templateType: new FormControl(this.config.templateType, Validators.compose([
        Validators.required,
      ])),
      template: new FormControl(this.config.template)
    })
  }

  saveConfig(templateForm: any) {
    this.tpl.addTplConfig(templateForm).subscribe(
      data  => this.handlerSuccess(data),
      error => this.handlerError(error)
    );
  }

  handlerSuccess(data: any) {
    this.snackBar.openSnackBar(data.message,'Close','');
    this.router.navigate(['/templates']);
  }

  handlerError(error: any) {
    
  }

}
