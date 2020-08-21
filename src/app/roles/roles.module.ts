import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DemoMaterialModule } from '../material-module';
import { MatNativeDateModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { SharingModule } from '../sharing-module';

import { RolesRoutingModule } from './roles-routing.module';
import { RolesComponent } from './roles.component';
import { ListRolesComponent } from './list-roles/list-roles.component';
import { CreateRoleComponent } from './create-role/create-role.component';
import { DetailRoleComponent } from './detail-role/detail-role.component';


@NgModule({
  declarations: [RolesComponent, ListRolesComponent, CreateRoleComponent, DetailRoleComponent],
  imports: [
    CommonModule,
    DemoMaterialModule,
    MatNativeDateModule,
    FormsModule,
    ReactiveFormsModule,
    SharingModule,
    RolesRoutingModule
  ],
  entryComponents: [],
  providers: [],
  schemas: [ NO_ERRORS_SCHEMA ]
})
export class RolesModule { }
