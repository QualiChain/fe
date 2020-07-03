import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './_components/home/home.component';
import { JobsComponent } from './_components/jobs/jobs.component';
import { JobsGetComponent } from './_components/jobs-get/jobs-get.component';

import { JobsAddComponent } from './_components/jobs-add/jobs-add.component';
//import { JobsEditComponent } from './_components/jobs-edit/jobs-edit.component';

//import { CvsComponent } from './cvs/cvs.component';
import { ProfilesComponent } from './_components/profiles/profiles.component';
import { RecruitmentComponent } from './_components/recruitment/recruitment.component';
import { ProfilesViewComponent } from './_components/profiles-view/profiles-view.component';
import { ProfilesAddComponent } from './_components/profiles-add/profiles-add.component';

import { RecruitmentViewComponent } from './_components/recruitment-view/recruitment-view.component';
import { BestCareerOptionsComponent } from './_components/best-career-options/best-career-options.component';
import { CareerAdvisorComponent } from './_components/career-advisor/career-advisor.component';
import { LoginComponent } from './_components/login/login.component';
import { AccessDeniedComponent } from './_components/access-denied/access-denied.component';
import { CoursesComponent } from './_components/courses/courses.component';
import { CoursesGetComponent } from './_components/courses-get/courses-get.component';
import { CoursesEditComponent } from './_components/courses-edit/courses-edit.component';
import { AwardSmartBadgeComponent } from './_components/award-smart-badge/award-smart-badge.component';
import { RecomendedCoursesComponent, RecomendedCoursesComponentPage } from './_components/recomended-courses/recomended-courses.component';
import { RecomendedJobsComponent, RecomendedJobsComponentPage } from './_components/recomended-jobs/recomended-jobs.component';
import { RecomendedSkillsComponent } from './_components/recomended-skills/recomended-skills.component';
import { NotFoundComponent } from './_components/not-found/not-found.component';

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
   canActivate: [AuthGuard],
   data: { roles: [Role.student, Role.employee, Role.recruiter, Role.admin, Role.administrator ] }
  },
  {
    path: 'jobs/add',
    component: JobsAddComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.recruiter, Role.admin, Role.administrator ] }
  },
  {
    path: 'jobs/:id',
    component: JobsGetComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'jobs/:id/edit',
    //component: JobsEditComponent,
    component: JobsAddComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.recruiter, Role.admin, Role.administrator ] }
  },  
  //{
  // path: 'cvs',
  // component: CvsComponent,
  // canActivate: [AuthGuard]
  //},
  {
   path: 'profiles',
   component: ProfilesComponent,
   canActivate: [AuthGuard],
   data: { roles: [Role.professor, Role.recruiter, Role.admin, Role.administrator ] }  
  },
  {
    path: 'profiles/add',
    component: ProfilesAddComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.admin, Role.administrator ] }  
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
    path: 'profiles/:id/best-career-options',
    component: BestCareerOptionsComponent,
    canActivate: [AuthGuard]
  },  
  {
    path: 'profiles/:id/career-advisor',
    component: CareerAdvisorComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'recruitment',
    component: RecruitmentComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.recruiter, Role.admin, Role.administrator] }
   },    
   {
    path: 'recruitment/:id',
    component: RecruitmentViewComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.recruiter, Role.admin, Role.administrator] }    
  },  
  {
    path: 'courses',
    component: CoursesComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.student, Role.employee, Role.professor, Role.admin, Role.administrator] }    
  },
  {
    path: 'courses/add',
    component: CoursesEditComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.professor, Role.admin, Role.administrator] }    
  },  
  {
    path: 'courses/:id',
    component: CoursesGetComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.student, Role.employee, Role.professor, Role.admin, Role.administrator] }    
  },       
  {
    path: 'courses/:id/edit',
    component: CoursesEditComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.professor, Role.admin, Role.administrator] }    
  },  
  {
    path: 'courses/:id/award',
    component: AwardSmartBadgeComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.professor, Role.admin, Role.administrator] }    
  },  
  {
    path: 'profiles/:id/recomended/courses',
    component: RecomendedCoursesComponentPage,
    canActivate: [AuthGuard],
    data: { roles: [Role.student, Role.employee, Role.admin, Role.administrator] }    
  },
  {
    path: 'profiles/:id/recomended/jobs',
    component: RecomendedJobsComponentPage,
    canActivate: [AuthGuard],
    data: { roles: [Role.student, Role.employee, Role.admin, Role.administrator] }    
  },
  {
    path: 'profiles/:id/recomended/skills',
    component: RecomendedSkillsComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.student, Role.employee, Role.admin, Role.administrator] }    
  },
  {
    path: 'access_denied',
    component: AccessDeniedComponent
  },
  { 
    path: 'not_found', 
    component: NotFoundComponent
  } ,
  { 
    path: '**', 
    component: NotFoundComponent
  } ,
  { path: '**', redirectTo: '' }
  ];


@NgModule({
  imports: [CommonModule,RouterModule.forRoot(routes)],
  exports: [RouterModule]
})


export class AppRoutingModule { }
