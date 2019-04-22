import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service'

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  show: boolean;
  eyeIcon: any;

  constructor(private auth:AuthService) { 
    this.show = false;
    this.eyeIcon = 'fa-eye';
  }

  ngOnInit() {
  }

  password() {
    this.show = !this.show;
    if(this.show) {
      this.eyeIcon = 'fa-eye-slash';
    } else {
      this.eyeIcon = 'fa-eye';
    }
  }

  register(formData:any) {
    this.auth.register(formData);
  }
}
