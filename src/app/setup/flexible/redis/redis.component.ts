import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth/auth.service';
import { RedisService } from 'src/app/services/redis.service';
import { SnackBarComponent } from 'src/app/snack-bar/snack-bar.component';

@Component({
  selector: 'app-redis',
  templateUrl: './redis.component.html',
  styleUrls: ['./redis.component.scss']
})
export class RedisComponent implements OnInit {
  redisForm: FormGroup;

  config = {
    id: '',
    redisHost: '',
    redisPort: '',
  };
  show: boolean = false;
  jbbData:any = null;
  disabled = false;
  contextState = true;

  redis_validation_messages = {
    'redisHost': [
      { type: 'required', message: 'Redis host is required' }
    ],
    'redisPort': [
      { type: 'required', message: 'Redis port is required' }
    ]
  }

  constructor( private fb: FormBuilder, private auth:AuthService, private redis:RedisService, private snackBar: SnackBarComponent) { }

  myClass = '';

  ngOnInit() {
    window.scrollTo(0, 0);
    this.myClass = '';
    this.createForms();
    this.getConfig();
  }

  createForms() {
    // user links form validations
    this.redisForm = this.fb.group({
      id: new FormControl(this.config.id),
      redisHost: new FormControl(this.config.redisHost, Validators.compose([
        Validators.required
      ])),
      redisPort: new FormControl(this.config.redisPort, Validators.compose([
        Validators.required
      ]))
    })
  }

  getConfig(){
    this.redis.getRedisConfig().subscribe(
      data => {
        this.config = {
          id: data.redisconfig.id,
          redisHost: data.redisconfig.host,
          redisPort: data.redisconfig.port
        };
        this.createForms();
      }
    );
  }
  saveConfig(redisConfig: any) {
    this.redis.addRedisConfig(redisConfig).subscribe(
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
    this.snackBar.openSnackBar(error.message,'Close','failed');
  }
}
