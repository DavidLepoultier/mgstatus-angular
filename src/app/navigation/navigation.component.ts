import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {
  
  constructor(public auth:AuthService, private router:Router) { }

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
    { link: 'proxies', label: 'Proxies', icon: 'bezier-curve' },
    { link: 'allApps', label: 'Apps', icon: 'mobile-alt' },
  ];

  navigationAdmin = [
    { link: 'orgs', label: 'Organizations' },
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

  setOrgPref(org: any) {
    this.jwtDecode();
    localStorage.setItem(`${this.jwtDecoded['id']}_orgName`, `{"name":"${org}"}`)
    this.router.navigate([`/reload${this.router.url}`]);
  }

  checkAuth() {
    if(this.auth.userIsLoggedIn()) {
      this.jwtDecode();
      //console.log(this.jwtDecoded['role']);
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
            this.navigationSideMenu = [
              ...this.navigation,
              ...this.navigationAdminTenant
            ];
            this.navigationOtherSideMenu = [
              ...this.navigationProfile
            ];
          break;
          case 'admin': 
            this.navigationSideMenu = [
              ...this.navigation
            ];
            this.navigationOtherSideMenu = [
              ...this.navigationAdmin,
              ...this.navigationProfile
            ];
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
