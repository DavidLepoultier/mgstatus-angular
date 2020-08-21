import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  myClass = '';
  
  constructor(private auth: AuthService, private router: Router) { }

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
