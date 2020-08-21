
import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PageNotFoundComponent }    from './page-not-found/page-not-found.component';
import { LoginComponent } from './auth/login/login.component';
import { SubscribeComponent } from './auth/subscribe/subscribe.component';
import { VerifyComponent } from './auth/subscribe/verify/verify.component';

// import { AuthGuard }                          from './auth/auth.guard';
// import { SelectivePreloadingStrategyService } from './selective-preloading-strategy.service';

// const appRoutes: Routes = [
//   {
//     path: 'compose',
//     component: ComposeMessageComponent,
//     outlet: 'popup'
//   },
//   {
//     path: 'admin',
//     loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),
//     canLoad: [AuthGuard]
//   },
//   {
//     path: 'crisis-center',
//     loadChildren: () => import('./crisis-center/crisis-center.module').then(m => m.CrisisCenterModule),
//     data: { preload: true }
//   },
//   { path: '',   redirectTo: '/superheroes', pathMatch: 'full' },
//   { path: '**', component: PageNotFoundComponent }
// ];

const appRoutes: Routes = [
    {
      path: 'login',
      component: LoginComponent
    },
    { 
      path: 'subscribe/verify/:id',  
      component: VerifyComponent
    },
    { path: '',
      redirectTo: '/orgs',
      pathMatch: 'full'
    },
    { path: '**', component: PageNotFoundComponent }
  ];
  
@NgModule({
  imports: [
    RouterModule.forRoot(
      appRoutes,
      {
        enableTracing: false, // <-- debugging purposes only
        // preloadingStrategy: SelectivePreloadingStrategyService,
      }
    )
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
