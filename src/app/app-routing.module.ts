import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { JobsComponent } from './jobs/jobs.component';

import { JobsAddComponent } from './jobs-add/jobs-add.component';
import { JobsEditComponent } from './jobs-edit/jobs-edit.component';

import { CvsComponent } from './cvs/cvs.component';
import { ProfilesComponent } from './profiles/profiles.component';
import { RecruitmentComponent } from './recruitment/recruitment.component';
import {ProfilesViewComponent} from './profiles-view/profiles-view.component';
import {RecruitmentViewComponent} from './recruitment-view/recruitment-view.component';
import {BestCarrerOptionsComponent} from './best-carrer-options/best-carrer-options.component';
import {CarrerAdvisorComponent} from './carrer-advisor/carrer-advisor.component';
import { LoginComponent } from './login/login.component';
import { AccessDeniedComponent } from './access-denied/access-denied.component';

import { AuthGuard } from './_helpers/auth.guard';
import { Role } from './_models/role';

const routes: Routes = [
  {
   path: '',
   pathMatch: 'full',
   component: HomeComponent,
   canActivate: [AuthGuard]
  },
  {
    path: 'login',
    component: LoginComponent
   },
  {
   path: 'jobs',
   component: JobsComponent,
   canActivate: [AuthGuard]
  },
  {
    path: 'jobs/create',
    component: JobsAddComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'jobs/edit/:id',
    component: JobsEditComponent,
    canActivate: [AuthGuard]
  },  
  {
   path: 'cvs',
   component: CvsComponent,
   canActivate: [AuthGuard]
  },
  {
   path: 'profiles',
   component: ProfilesComponent,
   canActivate: [AuthGuard]
  },
  {
    path: 'profiles/:id',
    component: ProfilesViewComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'profiles/:id/best-carrer-options',
    component: BestCarrerOptionsComponent,
    canActivate: [AuthGuard]
  },  
  {
    path: 'profiles/:id/carrer-advisor',
    component: CarrerAdvisorComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'recruitment',
    component: RecruitmentComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.recruiter, Role.admin] }
   },    
   {
    path: 'recruitment/:id',
    component: RecruitmentViewComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.recruiter, Role.admin] }    
  },
  {
    path: 'access_denied',
    component: AccessDeniedComponent
  },
  { path: '**', redirectTo: '' }
  ];


@NgModule({
  imports: [CommonModule,RouterModule.forRoot(routes)],
  exports: [RouterModule]
})


export class AppRoutingModule { }
