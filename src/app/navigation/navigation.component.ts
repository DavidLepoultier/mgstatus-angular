import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {
  
  navigation = [
    //{ link: 'dashboard', label: 'dashboard', icon: 'tachometer-alt' },
    { link: 'projects', label: 'Projects', icon: 'project-diagram' }
  ];
  navigationSideMenu = [
    ...this.navigation
    //{ link: 'settings', label: 'csrx.menu.settings' }
  ];

  constructor() { }

  ngOnInit() {
  }

}
