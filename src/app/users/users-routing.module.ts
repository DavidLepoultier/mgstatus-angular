import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateUserComponent } from './create-user/create-user.component';
import { DetailUserComponent } from './detail-user/detail-user.component';
import { UsersComponent } from './users.component';
import { ListUsersComponent } from './list-users/list-users.component';
import { ProfileComponent } from './profile/profile.component';

const routes: Routes = [
  { 
    path: 'users',  
    component: UsersComponent,
    children: [
      {
        path: '',
        children: [
          { path: 'create', component: CreateUserComponent },
          { path: ':id', component: DetailUserComponent},
          { path: '', component: ListUsersComponent }
        ]
      }
    ]
  },
  { path: 'profile', component: ProfileComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
