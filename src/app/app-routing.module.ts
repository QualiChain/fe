import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './_components/home/home.component';
import { JobsComponent } from './_components/jobs/jobs.component';

import { JobsAddComponent } from './_components/jobs-add/jobs-add.component';
//import { JobsEditComponent } from './_components/jobs-edit/jobs-edit.component';

//import { CvsComponent } from './cvs/cvs.component';
import { ProfilesComponent } from './_components/profiles/profiles.component';
import { RecruitmentComponent } from './_components/recruitment/recruitment.component';
import {ProfilesViewComponent} from './_components/profiles-view/profiles-view.component';
import {ProfilesAddComponent} from './_components/profiles-add/profiles-add.component';

import {RecruitmentViewComponent} from './_components/recruitment-view/recruitment-view.component';
import {BestCarrerOptionsComponent} from './_components/best-carrer-options/best-carrer-options.component';
import {CarrerAdvisorComponent} from './_components/carrer-advisor/carrer-advisor.component';
import { LoginComponent } from './_components/login/login.component';
import { AccessDeniedComponent } from './_components/access-denied/access-denied.component';
import { CoursesEditComponent } from './_components/courses-edit/courses-edit.component';
import { AwardSmartBadgeComponent } from './_components/award-smart-badge/award-smart-badge.component';
import { RecomendedCoursesComponent } from './_components/recomended-courses/recomended-courses.component';
import { RecomendedJobsComponent } from './_components/recomended-jobs/recomended-jobs.component';

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
    path: 'jobs/add',
    component: JobsAddComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'jobs/:id/edit',
    //component: JobsEditComponent,
    component: JobsAddComponent,
    canActivate: [AuthGuard]
  },  
  //{
  // path: 'cvs',
  // component: CvsComponent,
  // canActivate: [AuthGuard]
  //},
  {
   path: 'profiles',
   component: ProfilesComponent,
   canActivate: [AuthGuard]
  },
  {
    path: 'profiles/add',
    component: ProfilesAddComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'profiles/:id',
    component: ProfilesViewComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'profiles/:id/edit',
    component: ProfilesAddComponent,
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
    path: 'courses/:id/edit',
    component: CoursesEditComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.teacher, Role.admin] }    
  },  
  {
    path: 'courses/:id/award',
    component: AwardSmartBadgeComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.teacher, Role.admin] }    
  },  
  {
    path: 'profiles/:id/recomended/courses',
    component: RecomendedCoursesComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.student, Role.admin] }    
  },
  {
    path: 'profiles/:id/recomended/jobs',
    component: RecomendedJobsComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.student, Role.admin] }    
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
