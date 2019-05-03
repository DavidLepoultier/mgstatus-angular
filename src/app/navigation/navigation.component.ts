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
    { link: 'r-Gate', label: 'r-Gateway', icon: 'project-diagram' },
  ];
  
  navigationSideMenu = [];
  navigationOtherSideMenu = [];
  jwtDecoded: object = {};

  navigationDeveloper = [
    { link: 'myApps', label: 'myApps', icon: 'mobile-alt' },
  ];

  navigationAdminTenant = [
    { link: 'devApps', label: 'devApps', icon: 'mobile-alt' },
  ];

  navigationProfile = [
    //{ link: 'profile', label: 'My Account' }
  ];

  navigationLogin = [
    { link: 'login', label: 'Log in', icon: 'user' }
  ];

  ngOnInit() {
    
  }

  jwtDecode() {
    this.jwtDecoded = this.auth.jwtTokenDecode();
  }

  checkAuth() {
    if(this.auth.userIsLoggedIn()) {
      this.jwtDecode();
      if(this.jwtDecoded['role'])
        switch(this.jwtDecoded['role']) {
          case 'developer':
            this.navigationSideMenu = [
              ...this.navigation,
              ...this.navigationDeveloper
            ];
            this.navigationOtherSideMenu = [
              ...this.navigationProfile
            ];
          break;
          case 'orgAdmin':

          break;
          case 'admin': 

          break;
          default:
            this.navigationSideMenu = [
              ...this.navigation
            ];
            this.navigationOtherSideMenu = [
              ...this.navigationProfile
            ];
        }
      return true;
    } else {
      this.navigationSideMenu = [
        ...this.navigation
      ];
      this.navigationOtherSideMenu = [
        ...this.navigationLogin
      ];
      return true;
    }
  }
}
