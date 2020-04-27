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

  organizations: [];
  myClass = '';

  constructor(private org: OrganizationService ) { }
  
  ngOnInit() {
      window.scrollTo(0, 0);
      this.myClass = '';
      this.getOrgs();
  }

  getOrgs(){
    this.org.getOrganizations().subscribe(
      data => {
        this.organizations = data.organizations;
      }
    );
  }

}
