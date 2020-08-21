import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DemoMaterialModule } from '../material-module';
import { MatNativeDateModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';

import { KongRoutingModule } from './kong-routing.module';
import { SharingModule } from '../sharing-module';
import { OrganizationsComponent } from './organizations/organizations.component';
import { CreateOrganizationComponent } from './organizations/create-organization/create-organization.component';
import { ListOrganizationComponent } from './organizations/list-organization/list-organization.component';
import { DetailOrganizationComponent } from './organizations/detail-organization/detail-organization.component';
import { DeleteOrganizationComponent } from './modals/delete-organization/delete-organization.component';
import { AddUserOrganizationComponent } from './modals/add-user-organization/add-user-organization.component';

@NgModule({
  declarations: [OrganizationsComponent, CreateOrganizationComponent, ListOrganizationComponent, DetailOrganizationComponent, DeleteOrganizationComponent, AddUserOrganizationComponent],
  imports: [
    CommonModule,
    CommonModule,
    DemoMaterialModule,
    MatNativeDateModule,
    FormsModule,
    ReactiveFormsModule,
    SharingModule,
    KongRoutingModule
  ],
  entryComponents: [DeleteOrganizationComponent, AddUserOrganizationComponent],
  providers: [],
  schemas: [ NO_ERRORS_SCHEMA ]
})
export class KongModule { }
