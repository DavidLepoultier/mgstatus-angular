import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/auth/auth.service';
import { ElasticsearchService } from 'src/app/services/elasticsearch.service';

@Component({
  selector: 'app-elasticsearch',
  templateUrl: './elasticsearch.component.html',
  styleUrls: ['./elasticsearch.component.scss']
})
export class ElasticsearchComponent implements OnInit {

  esForm: FormGroup;

  config = {
    id: '',
    esHost: '',
    esPort: '',
    esScheme: '',
    esUser: '',
    esPassword: ''
  };
  show: boolean = false;
  jbbData:any = null;
  disabled = false;
  contextState = true;
  configChecked = false;

  elastic_validation_messages = {
    'esHost': [
      { type: 'required', message: 'Elasticsearch host is required' }
    ],
    'esPort': [
      { type: 'required', message: 'Elasticsearch port is required' }
    ],
    'esScheme': [
      { type: 'required', message: 'Elasticsearch scheme http(s) is required' }
    ],
    'esUser': [
      { type: 'required', message: 'Elasticsearch username is required' }
    ],
    'esPassword': [
      { type: 'required', message: 'Elasticsearch password is required'}
    ]
  }

  constructor( private fb: FormBuilder, private auth:AuthService, private es:ElasticsearchService, private toastr: ToastrService) { }

  myClass = '';

  ngOnInit() {
    window.scrollTo(0, 0);
    this.myClass = '';
    this.createForms();
    this.getConfig();
  }

  createForms() {
    // user links form validations
    this.esForm = this.fb.group({
      id: new FormControl(this.config.id),
      esHost: new FormControl(this.config.esHost, Validators.compose([
        Validators.required
      ])),
      esPort: new FormControl(this.config.esPort, Validators.compose([
        Validators.required
      ])),
      esScheme: new FormControl(this.config.esScheme, Validators.compose([
        Validators.required
      ])),
      esUser: new FormControl(this.config.esUser, Validators.compose([
        Validators.required
      ])),
      esPassword: new FormControl(this.config.esPassword, Validators.compose([
        Validators.required
      ])),
    })
  }

  getConfig(){
    this.es.getEsConfig().subscribe(
      data => {
        this.config = {
          id: data.esconfig.id,
          esHost: data.esconfig.host,
          esPort: data.esconfig.port,
          esScheme: data.esconfig.scheme,
          esUser: data.esconfig.user,
          esPassword: data.esconfig.password
        };
        this.createForms();
      }
    );
  }
  saveConfig(esConfig: any) {
    this.es.addEsConfig(esConfig).subscribe(
      data  => {
        this.handlerSuccess(data),
        this.configChecked = false,
        this.getConfig()
      },
      error => this.handlerError(error)
    );
  }
  
  testConfig(esConfig: any) {
    this.es.testEsAccess(esConfig).subscribe(
      data  => {
        this.handlerSuccess(data),
        this.configChecked = true
      },
      error => this.handlerError(error)
    );
  }

  handlerSuccess(data: any) {
    this.toastr.success(data.message);
  }

  handlerError(error: any) {
    this.toastr.error(error.message);
  }

}
