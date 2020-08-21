import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FlexibleComponent } from './flexible/flexible.component';
import { KubeconfigComponent } from './flexible/kubeconfig/kubeconfig.component';
import { KubetemplatesComponent } from './kubetemplates/kubetemplates.component';
import { FeconfigComponent } from './flexible/feconfig/feconfig.component';
import { ListComponent } from './kubetemplates/list/list.component';
import { AddComponent } from './kubetemplates/add/add.component';
import { DetailComponent } from './kubetemplates/detail/detail.component';
import { EnvironmentComponent } from './kong/environment/environment.component';
import { SeqencesComponent } from './kong/seqences/seqences.component';
import { KongComponent } from './kong/kong.component';
import { AddEnvironmentComponent } from './kong/environment/add-environment/add-environment.component';
import { AddSequenceComponent } from './kong/seqences/add-sequence/add-sequence.component';
import { DetailEnvironmentComponent } from './kong/environment/detail-environment/detail-environment.component';
import { DetailSequenceComponent } from './kong/seqences/detail-sequence/detail-sequence.component';
import { DetailDeploymentComponent } from './kong/deployment/detail-deployment/detail-deployment.component';
import { AddDeploymentComponent } from './kong/deployment/add-deployment/add-deployment.component';
import { DeploymentComponent } from './kong/deployment/deployment.component';
import { SmtpComponent } from './flexible/smtp/smtp.component';


const routes: Routes = [
  {
    path: 'flexible',
    component: FlexibleComponent,
    children: [
      {
        path: '',
        children: [
          { path: 'kubeconfig', component: KubeconfigComponent },
          { path: 'mailer', component: SmtpComponent },
          { path: '', component: FeconfigComponent }
        ]
      }
    ]   
  },
  {
    path: 'templates',
    component: KubetemplatesComponent,
    children: [
      {
        path: '',
        children: [
          { path: 'add', component: AddComponent },
          { path: ':id', component:  DetailComponent},
          { path: '', component: ListComponent }
        ]
      }
    ]   
  },
  {
    path: 'kong',
    component: KongComponent,
    children: [
      {
        path: '',
        children: [
          { path: 'sequences', component: SeqencesComponent },
          { path: 'sequences/:id', component: DetailSequenceComponent },
          { path: 'sequence/add', component: AddSequenceComponent },
          { path: 'environments', component: EnvironmentComponent },
          { path: 'environment/add', component: AddEnvironmentComponent },
          { path: 'environments/:id', component: DetailEnvironmentComponent },
          { path: 'deployment/add', component: AddDeploymentComponent },
          { path: 'deployments/:id', component: DetailDeploymentComponent },
          { path: '', component: DeploymentComponent }
        ]
      }
    ]   
  }
];


// const routes: Routes = [
//   { 
//     path: 'orgs',  
//     component: OrgsComponent,
//     children: [
//       {
//         path: '',
//         children: [
//           { path: 'create', component: CreateComponent },
//           { path: '', component: ListComponent }
//         ]
//       }
//     ]
//   }
// ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SetupRoutingModule { }
