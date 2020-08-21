import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss']
})
export class RolesComponent implements OnInit {

  myClass = '';

  constructor(private router: Router, private auth: AuthService) { }

  ngOnInit() {
    if(!this.auth.userIsLoggedIn()) {
      this.router.navigate(['/login']);
    } else {
      let userToken = this.auth.jwtTokenDecode();
      if (userToken.role != "admin") 
        this.router.navigate(['/']);
      window.scrollTo(0, 0);
      this.myClass = '';
    }
  }

}
