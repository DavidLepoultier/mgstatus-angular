import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-kong',
  templateUrl: './kong.component.html',
  styleUrls: ['./kong.component.scss']
})
export class KongComponent implements OnInit {

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
