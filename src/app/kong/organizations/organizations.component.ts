import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-organizations',
  templateUrl: './organizations.component.html',
  styleUrls: ['./organizations.component.scss']
})
export class OrganizationsComponent implements OnInit {

  myClass = '';
  create: boolean = false;
  
  constructor(private auth: AuthService, private router: Router) { }

  ngOnInit() {
    if(!this.auth.userIsLoggedIn()) {
      this.router.navigate(['/login']);
    } else {
      window.scrollTo(0, 0);
      let userToken = this.auth.jwtTokenDecode();
      if (userToken.role == "admin") 
        this.create = true;
      this.myClass = '';
    }
  }
}
