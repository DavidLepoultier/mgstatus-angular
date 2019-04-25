import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {
  
  constructor(public auth:AuthService) { }

  navigation = [
    //{ link: 'dashboard', label: 'dashboard', icon: 'tachometer-alt' },
    { link: 'r-Gate', label: 'r-Gate', icon: 'project-diagram' },
  ];
  
  navigationSideMenu = [];

  navigationAuth = [
    { link: 'myApps', label: 'myApps', icon: 'mobile-alt' },
  ];

  navigationLogin = [
    { link: 'login', label: 'Login', icon: 'user' }
  ];

  ngOnInit() {
    
  }

  checkAuth() {
    if(this.auth.userIsLoggedIn()) {
      this.navigationSideMenu = [
        ...this.navigation,
        ...this.navigationAuth
      ];
      return true;
    } else {
      this.navigationSideMenu = [
        ...this.navigation
      ];
      return true;
    }
  }
}
