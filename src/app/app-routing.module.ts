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

const routes: Routes = [
  {
   path: '',
   pathMatch: 'full',
   component: HomeComponent
  },
  {
    path: 'login',
    component: LoginComponent
   },
  {
   path: 'jobs',
   component: JobsComponent
  },
  {
    path: 'jobs/create',
    component: JobsAddComponent
  },
  {
    path: 'jobs/edit/:id',
    component: JobsEditComponent
  },  
  {
   path: 'cvs',
   component: CvsComponent
  },
  {
   path: 'profiles',
   component: ProfilesComponent
  },
  {
    path: 'profiles/:id',
    component: ProfilesViewComponent
  },
  {
    path: 'profiles/:id/best-carrer-options',
    component: BestCarrerOptionsComponent
  },  
  {
    path: 'profiles/:id/carrer-advisor',
    component: CarrerAdvisorComponent
  },
  {
    path: 'recruitment',
    component: RecruitmentComponent
   },    
   {
    path: 'recruitment/:id',
    component: RecruitmentViewComponent
  },
  { path: '**', redirectTo: '' }
  ];


@NgModule({
  imports: [CommonModule,RouterModule.forRoot(routes)],
  exports: [RouterModule]
})


export class AppRoutingModule { }
