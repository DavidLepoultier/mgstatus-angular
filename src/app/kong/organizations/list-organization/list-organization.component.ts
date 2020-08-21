import { Component, OnInit } from '@angular/core';
import { OrganizationService } from 'src/app/services/organization.service';
import { AuthService } from 'src/app/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-organization',
  templateUrl: './list-organization.component.html',
  styleUrls: ['./list-organization.component.scss']
})
export class ListOrganizationComponent implements OnInit {

  searchText: string;
  organizations: [];
  myClass = '';
  token = ''

  constructor(private org: OrganizationService, private router: Router, private auth: AuthService ) { }
  
  ngOnInit() {
    this.token = this.auth.jwtTokenDecode()
    let checkToken = !this.token
    window.scrollTo(0, 0);
    this.myClass = '';
    if (!checkToken) {
      this.getOrgs();
    }
  }

  getOrgs(){
    this.org.getOrganizations().subscribe(
      data => {
        this.organizations = data.organizations;
      }
    );
  }

}
