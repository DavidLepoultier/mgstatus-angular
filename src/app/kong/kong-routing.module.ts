import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OrganizationsComponent } from './organizations/organizations.component'

import { ListOrganizationComponent } from './organizations/list-organization/list-organization.component';
import { CreateOrganizationComponent } from './organizations/create-organization/create-organization.component';
import { DetailOrganizationComponent } from './organizations/detail-organization/detail-organization.component';

const routes: Routes = [
  { 
    path: 'orgs',  
    component: OrganizationsComponent,
    children: [
      {
        path: '',
        children: [
          { path: 'create', component: CreateOrganizationComponent },
          { path: ':id', component: DetailOrganizationComponent},
          { path: '', component: ListOrganizationComponent }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class KongRoutingModule { }
