import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-flexible',
  templateUrl: './flexible.component.html',
  styleUrls: ['./flexible.component.scss']
})
export class FlexibleComponent implements OnInit {

  myClass = '';
  
  constructor(private auth: AuthService, private router: Router) { }

  ngOnInit() {
    if(!this.auth.userIsLoggedIn()) {
      this.router.navigate(['/login']);
    } else {
      if (window.scrollY <= 70) {
        window.scrollTo(0, 0);
        this.myClass = '';
      } else {
        window.scrollTo(0, 121);
        this.myClass = 'update-wrapper';
      }
    }
  }

}
