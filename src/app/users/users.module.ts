import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DemoMaterialModule } from '../material-module';
import { MatNativeDateModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { UsersRoutingModule } from './users-routing.module';
import { SharingModule } from '../sharing-module';

import { CreateUserComponent } from './create-user/create-user.component';
import { DetailUserComponent } from './detail-user/detail-user.component';
import { UsersComponent } from './users.component';
import { ListUsersComponent } from './list-users/list-users.component';
import { ProfileComponent } from './profile/profile.component';

@NgModule({
  declarations: [CreateUserComponent, DetailUserComponent, UsersComponent, ListUsersComponent, ProfileComponent],
  imports: [
    CommonModule,
    DemoMaterialModule,
    MatNativeDateModule,
    FormsModule,
    ReactiveFormsModule,
    SharingModule,
    UsersRoutingModule
  ],
  entryComponents: [],
  providers: [],
  schemas: [ NO_ERRORS_SCHEMA ]
})
export class UsersModule { }
