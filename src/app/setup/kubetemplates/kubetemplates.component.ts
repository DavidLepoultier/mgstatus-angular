import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-kubetemplates',
  templateUrl: './kubetemplates.component.html',
  styleUrls: ['./kubetemplates.component.scss']
})
export class KubetemplatesComponent implements OnInit {

  myClass = '';
  
  constructor(private router: Router, private auth: AuthService) { }

  ngOnInit() {
    if(!this.auth.userIsLoggedIn()) {
      this.router.navigate(['/login']);
    } else {
      window.scrollTo(0, 0);
      this.myClass = '';
    }
  }

}
