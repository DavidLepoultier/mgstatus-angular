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
    { link: 'projects', label: 'Projects', icon: 'project-diagram' },
  ];
  navigationSideMenu = [
    ...this.navigation,
  ];

  navigationLogin = [
    { link: 'login', label: 'Login', icon: 'user' }
  ];

  ngOnInit() {
  }

}
