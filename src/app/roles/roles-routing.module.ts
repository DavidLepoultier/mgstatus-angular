import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RolesComponent } from './roles.component';
import { DetailRoleComponent } from './detail-role/detail-role.component';
import { ListRolesComponent } from './list-roles/list-roles.component';
import { CreateRoleComponent } from './create-role/create-role.component';



const routes: Routes = [
  { 
    path: 'roles',  
    component: RolesComponent,
    children: [
      {
        path: '',
        children: [
          { path: 'create', component: CreateRoleComponent },
          { path: ':id', component: DetailRoleComponent},
          { path: '', component: ListRolesComponent }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RolesRoutingModule { }
