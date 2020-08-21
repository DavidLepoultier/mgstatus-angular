import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, FormBuilder, Validators} from '@angular/forms';
import { SnackBarComponent } from 'src/app/snack-bar/snack-bar.component';
import { KubeTemplatesService } from 'src/app/services/kube-templates.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {

  templateForm: FormGroup;

  show: boolean = false;
  jbbData:any = null;
  isAuthenticated:boolean = false;
  welcomeMessage:String = '';

  config = {
    id: '',
    templateName: '',
    template: '',
    templateType: '',
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

  constructor( private route:ActivatedRoute, private router:Router, private fb: FormBuilder, private tpl: KubeTemplatesService, private snackBar: SnackBarComponent) { 
  }

  myClass = '';

  ngOnInit() {
    window.scrollTo(0, 0);
    this.myClass = '';
    this.createForms();
    this.getTemplate(this.route.snapshot.params['id']);
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

  getTemplate(id: any){
    this.tpl.getTemplateId(id).subscribe(
      data => {
        this.config = data.kubetemplate;
        this.createForms();
      },
      error => this.handlerError(error)
    );
  }

  deleteTemplate(){
    this.tpl.deleteTemplateId(this.route.snapshot.params['id']).subscribe(
      data => {
        this.handlerSuccess(data);
        this.router.navigate(['/templates']);
      },
      error => this.handlerError(error)
    );
  }

  updateConfig(templateForm: any) {
    this.tpl.updateTplConfig(this.route.snapshot.params['id'], templateForm).subscribe(
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
