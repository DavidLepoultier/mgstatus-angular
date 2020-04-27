import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DemoMaterialModule } from '../material-module';
import { MatNativeDateModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';

import { SetupRoutingModule } from './setup-routing.module';
import { KongComponent } from './kong/kong.component';
import { FlexibleComponent } from './flexible/flexible.component';
import { KubeconfigComponent } from './flexible/kubeconfig/kubeconfig.component';
import { FeconfigComponent } from './flexible/feconfig/feconfig.component';
import { KubetemplatesComponent } from './kubetemplates/kubetemplates.component';
import { ListComponent } from './kubetemplates/list/list.component';
import { AddComponent } from './kubetemplates/add/add.component';
import { DetailComponent } from './kubetemplates/detail/detail.component';
import { EnvironmentComponent } from './kong/environment/environment.component';
import { SeqencesComponent } from './kong/seqences/seqences.component';
import { AddSequenceComponent } from './kong/seqences/add-sequence/add-sequence.component';
import { AddEnvironmentComponent } from './kong/environment/add-environment/add-environment.component';
import { DetailEnvironmentComponent } from './kong/environment/detail-environment/detail-environment.component';
import { DetailSequenceComponent } from './kong/seqences/detail-sequence/detail-sequence.component';
import { SharingModule } from '../sharing-module';
import { DeploymentComponent } from './kong/deployment/deployment.component';
import { AddDeploymentComponent } from './kong/deployment/add-deployment/add-deployment.component';
import { DetailDeploymentComponent } from './kong/deployment/detail-deployment/detail-deployment.component';

@NgModule({
  declarations: [
    KongComponent, 
    FlexibleComponent, 
    KubeconfigComponent, 
    FeconfigComponent, 
    KubetemplatesComponent, 
    ListComponent, 
    AddComponent, 
    DetailComponent,
    EnvironmentComponent,
    SeqencesComponent,
    AddSequenceComponent,
    AddEnvironmentComponent,
    DetailEnvironmentComponent,
    DetailSequenceComponent,
    DeploymentComponent,
    AddDeploymentComponent,
    DetailDeploymentComponent
  ],
  imports: [
    CommonModule,
    DemoMaterialModule,
    MatNativeDateModule,
    FormsModule,
    ReactiveFormsModule,
    SharingModule,
    SetupRoutingModule
  ],
  providers: [],
  schemas: [ NO_ERRORS_SCHEMA ]
})
export class SetupModule { }
