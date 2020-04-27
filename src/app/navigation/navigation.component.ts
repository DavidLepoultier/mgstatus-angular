import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {
  
  constructor(public auth:AuthService, private router:Router) {}
  
  activeLink = "";
  navigationSideMenu = [];
  navigationPages = [];
  navigationOtherSideMenu = [];
  jwtDecoded: object = {};

  navigation = [];

  navigationDefault = [
    { link: 'r-Gate', label: 'r-Gateway', icon: 'fa-project-diagram', iconType: 'fas' },
    { link: 'orgs', label: 'organizations', icon: 'fa-project-diagram', iconType: 'fas' }
  ];

  navigationDeveloper = [
    // { link: 'myProxies', label: 'myProxies', icon: 'fa-bezier-curve', iconType: 'fas' },
    // { link: 'offers', label: 'Offers', icon: 'fa-product-hunt', iconType: 'fab' },
    { link: 'myApps', label: 'myApps', icon: 'fa-mobile-alt', iconType: 'fas' }
  ];

  navigationAdminTenant = [
    { link: 'proxies', label: 'Proxies', icon: 'fa-bezier-curve', iconType: 'fas' },
    { link: 'products', label: 'Products', icon: 'fa-product-hunt', iconType: 'fab' },
    { link: 'allApps', label: 'Apps', icon: 'fa-mobile-alt', iconType: 'fas' }
  ];

  navigationAdmin = [
    { link: 'orgs', label: 'Organizations' },
    { link: 'flexible', label: 'Configuration' }
  ];

  navigationProfile = [
    //{ link: 'profile', label: 'My Account' }
  ];

  navigationLogin = [
    { link: 'login', label: 'Login', icon: 'user' }
  ];

  navigationOrganization = [
    { link: 'orgs', label: 'Organizations' },
  ];
  navigationSetup = [
    { link: 'flexible', label: 'Flexible' },
    { link: 'kong', label: 'Kong' },
    { link: 'templates', label: 'kube templates' }
  ]

  ngOnInit() {
    this.navPageDefault();
  }

  navPageDefault () {
    switch(location.pathname){
      case '/flexible':
        this.navigation = [
          ...this.navigationSetup
        ];
        this.activeLink = 'flexible'
      break;
      default: 
        this.navigation = [
          ...this.navigationOrganization
        ];
        this.activeLink = 'orgs'
      break;
    }
  }

  navSelect (page: string) {
    switch(page) { 
      case 'orgs':
        this.navigation = [
          ...this.navigationOrganization
        ];
        this.activeLink = 'orgs'
      break;
      case 'flexible':
        this.navigation = [
          ...this.navigationSetup
        ];
        this.activeLink = 'flexible'
      break;    
    }
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
        //...this.navigation
      ];
      this.navigationOtherSideMenu = [
        ...this.navigationLogin
      ];
      return true;
    }
  }
}
