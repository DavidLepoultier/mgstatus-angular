import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, FormBuilder, Validators} from '@angular/forms';
import { SnackBarComponent } from 'src/app/snack-bar/snack-bar.component';
import { SmtpService } from 'src/app/services/smtp.service';

@Component({
  selector: 'app-smtp',
  templateUrl: './smtp.component.html',
  styleUrls: ['./smtp.component.scss']
})
export class SmtpComponent implements OnInit {

  myClass = '';
  mailerForm: FormGroup;
  show: boolean = false;

  config = {
    id: '',
    server: '',
    port: '',
    domain: '',
    adminMailFrom: '',
    portalMailFrom: '',
    auth: {
      user: '',
      pass: ''
    },
    tls: {
      rejectUnauthorized: false,
    },
    secure: false,
    frontUrl: '',
    mailFrom: ''
  }

  validation_messages = {
    'server': [ 
      { type: 'required', message: "SMTP server's IP/DNS is required" }
    ],
    'port': [
      { type: 'required', message: "SMTP's port is required" }
    ],
    'frontUrl': [
      { type: 'required', message: "KAPIBB front url is required" }
    ],
    'mailFrom': [
      { type: 'required', message: 'Mail from is required' },
    ],

    'domain': [
      { type: 'required', message: 'Mail domain is required' },
    ],
    'adminMailFrom': [
      { type: 'required', message: 'Kong Admin email from is required' },
    ],
    'portalMailFrom': [
      { type: 'required', message: 'Kong Portal email from is required' },
    ]
  }

  constructor(private snackBar: SnackBarComponent, private fb: FormBuilder, private mailer: SmtpService) { }
  
  ngOnInit() {
    window.scrollTo(0, 0);
    this.myClass = '';
    this.createForms();
    this.getConfig();
  }

  createForms() {
    // user links form validations
    this.mailerForm = this.fb.group({
      id: new FormControl(this.config.id),
      server: new FormControl(this.config.server, Validators.compose([
        Validators.required,
      ])),
      port: new FormControl(this.config.port, Validators.compose([
        Validators.required,
      ])),
      secure: new FormControl(this.config.secure),
      frontUrl: new FormControl(this.config.frontUrl, Validators.compose([
        Validators.required,
      ])),
      mailFrom: new FormControl(this.config.mailFrom, Validators.compose([
        Validators.required,
      ])),
      domain: new FormControl(this.config.domain, Validators.compose([
        Validators.required,
      ])),
      portalMailFrom: new FormControl(this.config.portalMailFrom, Validators.compose([
        Validators.required,
      ])),
      adminMailFrom: new FormControl(this.config.adminMailFrom, Validators.compose([
        Validators.required,
      ])),
      authUser: new FormControl(this.config.auth.user),
      authPass: new FormControl(this.config.auth.pass),
      auth: new FormControl(this.config.auth),
      tls: new FormControl(this.config.tls)
    })
  }

  getConfig(){
    this.mailer.getMailer().subscribe(
      data => {
        this.config = data.mailconfig
        this.createForms();
      }
    );
  }

  saveConfig(mailerForm: any) {
    mailerForm['auth']['user'] = mailerForm.authUser;
    mailerForm['auth']['pass'] = mailerForm.authPass;
    mailerForm.authUser = undefined;
    mailerForm.authPass = undefined;
    this.mailer.addMailerConfig(mailerForm).subscribe(
      data  => {
        this.handlerSuccess(data),
        this.getConfig()
      },
      error => this.handlerError(error)
    );
  }

  handlerSuccess(data: any) {
    this.snackBar.openSnackBar(data.message,'Close','');
  }

  handlerError(error: any) {
    
  }

}
