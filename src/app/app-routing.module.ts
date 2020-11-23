import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './_components/home/home.component';
import { JobsComponent } from './_components/jobs/jobs.component';
import { JobsGetComponent } from './_components/jobs-get/jobs-get.component';

import { JobsAddComponent } from './_components/jobs-add/jobs-add.component';
//import { JobsEditComponent } from './_components/jobs-edit/jobs-edit.component';

//import { CvsComponent } from './cvs/cvs.component';
import { ProfilesComponent } from './_components/profiles/profiles/profiles.component';
import { RecruitmentComponent } from './_components/recruitment/recruitment.component';
import { ProfilesViewComponent } from './_components/profiles/profiles-view/profiles-view.component';
import { ProfilesAddComponent } from './_components/profiles/profiles-add/profiles-add.component';

import { RecruitmentViewComponent } from './_components/recruitment-view/recruitment-view.component';
import { BestCareerOptionsComponent } from './_components/best-career-options/best-career-options.component';
import { CareerAdvisorComponent } from './_components/career-advisor/career-advisor.component';
import { LoginComponent } from './_components/login/login.component';
import { AccessDeniedComponent } from './_components/utils/access-denied/access-denied.component';
import { CoursesComponent } from './_components/courses/courses/courses.component';
import { CoursesGetComponent } from './_components/courses/courses-get/courses-get.component';
import { CoursesEditComponent } from './_components/courses/courses-edit/courses-edit.component';
import { AwardSmartBadgeComponent } from './_components/award-smart-badge/award-smart-badge.component';
import { RecomendedCoursesComponent, RecomendedCoursesComponentPage } from './_components/recomended-courses/recomended-courses.component';
import { RecomendedJobsComponent, RecomendedJobsComponentPage } from './_components/recomended-jobs/recomended-jobs.component';
import { RecomendedSkillsComponent, RecomendedSkillsComponentPage } from './_components/recomended-skills/recomended-skills.component';
import { NotFoundComponent } from './_components/utils/not-found/not-found.component';
import { JobAppliesComponentPage } from './_components/job-applications-by-user/job-applications-by-user.component';

import { RecruitingComponent } from './_components/recruiting/recruiting.component'; 
import { DSSCurriculumReDesignComponent } from './_components/dss-curriculum-re-design/dss-curriculum-re-design.component';
import { CurriculumGapAnalysisComponent } from './_components/curriculum-gap-analysis/curriculum-gap-analysis.component';
import { SkillsComponent } from './_components/skills/skills/skills.component';
import { SkillsGetComponent } from './_components/skills/skills-get/skills-get.component';
import { SkillsEditComponent } from './_components/skills/skills-edit/skills-edit.component';

import { AuthGuard } from './_helpers/auth.guard';
import { Role } from './_models/role';
import { MCDSSComponent } from './_components/mcdss/mcdss.component';
import { NotificationPreferencesComponent } from './_components/profiles/notification-preferences/notification-preferences.component';
import { FilesRepositoryComponent } from './_components/profiles/files-repository/files-repository.component';
import { EducationPlanComponent } from './_components/education-plan/education-plan.component';
import { AuthGuardByPermission } from './_directives/can-access.directive';

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
    path: 'skills',
    component: SkillsComponent,
    //canActivate: [AuthGuard],
    canActivate: [AuthGuardByPermission],
    data: { 
        roles: [Role.student, Role.employee, Role.recruiter, Role.admin, Role.administrator ],
        permissions: ['view_skills']
      }
   },   
   //{
   // path: 'skills/add',
   // component: SkillsEditComponent,
   // canActivate: [AuthGuard],
   // canActivate: [AuthGuardByPermission],
   // data: { roles: [Role.recruiter, Role.admin, Role.administrator ],
   //   permissions: ['add_skill']
   // }
   //},   
   {
    path: 'skills/:id',
    component: SkillsGetComponent,
    //canActivate: [AuthGuard],
    canActivate: [AuthGuardByPermission],
    data: { 
        roles: [Role.student, Role.employee, Role.recruiter, Role.admin, Role.administrator ],
        permissions: ['view_skills']
      }
   },
  // {
 //   path: 'skills/:id/edit',
  //  component: SkillsEditComponent,
  //  canActivate: [AuthGuard],
  //  canActivate: [AuthGuardByPermission],
  //  data: { roles: [Role.recruiter, Role.admin, Role.administrator ].
  //    permissions: ['edit_skill']
  //  }
  //},
   {
   path: 'jobs',
   component: JobsComponent,
   //canActivate: [AuthGuard],
   canActivate: [AuthGuardByPermission],
   data: { 
     roles: [Role.student, Role.employee, Role.recruiter, Role.admin, Role.administrator ],
     permissions: ['view_jobs'] 
    }
  },
  {
    path: 'jobs/add',
    component: JobsAddComponent,
    //canActivate: [AuthGuard],
    canActivate: [AuthGuardByPermission],
    data: { 
      roles: [Role.recruiter, Role.admin, Role.administrator ],      
      permissions: ['add_job_post']
      }
  },
  {
    path: 'jobs/:id',
    component: JobsGetComponent,
    //canActivate: [AuthGuard]
    canActivate: [AuthGuardByPermission],
    data: { 
      roles: [Role.student, Role.employee, Role.recruiter, Role.admin, Role.administrator ],
      permissions: ['view_jobs'] 
     }    
  },
  {
    path: 'jobs/:id/edit',
    //component: JobsEditComponent,
    component: JobsAddComponent,
    //canActivate: [AuthGuard],
    canActivate: [AuthGuardByPermission],
    data: { roles: [Role.recruiter, Role.admin, Role.administrator ],
      permissions: ['edit_job_post'] 
    }
  },  
  //{
  // path: 'cvs',
  // component: CvsComponent,
  // canActivate: [AuthGuard]
  //},
  {
   path: 'profiles',
   component: ProfilesComponent,
   //canActivate: [AuthGuard],
   canActivate: [AuthGuardByPermission],
   data: { roles: [Role.professor, Role.recruiter, Role.admin, Role.administrator ],
    permissions: ['view_profiles']   
   }  
  },
  {
    path: 'profiles/add',
    component: ProfilesAddComponent,
    //canActivate: [AuthGuard],
    canActivate: [AuthGuardByPermission],
    data: { roles: [Role.admin, Role.administrator ],
      permissions: ['add_profile'] }  
  },
  {
    path: 'myprofile',
    component: ProfilesViewComponent,
    //canActivate: [AuthGuard],
    canActivate: [AuthGuardByPermission],
    data: { roles: [],
      permissions: ['view_own_profile'] }  
  },
  {
    path: 'myprofile/edit',
    component: ProfilesAddComponent,
    //canActivate: [AuthGuard],
    canActivate: [AuthGuardByPermission],
    data: { roles: [],
      permissions: ['edit_own_profile'] }  
  },  
  {
    path: 'profiles/:id',
    component: ProfilesViewComponent,
    //canActivate: [AuthGuard],
    canActivate: [AuthGuardByPermission],
    data: { roles: [],
      permissions: ['view_own_profile','view_other_profile'] }  
  },
  {
    path: 'profiles/:id/edit',
    component: ProfilesAddComponent,
    //canActivate: [AuthGuard],
    canActivate: [AuthGuardByPermission],
    data: { roles: [],
      permissions: ['edit_own_profile', 'edit_other_profile'] }  
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
    path: 'profiles/:id/education-plan',
    component: EducationPlanComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'profiles/:id/dss-curriculum-re-design',
    component: DSSCurriculumReDesignComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'profiles/:id/cv-gap-analysis',
    component: CurriculumGapAnalysisComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.professor, Role.recruiter, Role.admin, Role.administrator ] }
  },
  {
    path: 'profiles/:id/notifications-preferences',
    component: NotificationPreferencesComponent,
    //canActivate: [AuthGuard],
    canActivate: [AuthGuardByPermission],
    data: { permissions: ['manage_own_notifications_preferences'] }    
  },    
  {
    path: 'profiles/:id/personal-files-repository',
    component: FilesRepositoryComponent,
    //canActivate: [AuthGuard],
    canActivate: [AuthGuardByPermission],
    data: { permissions: ['retrieve_own_files'] }    
  },    
  {
    path: 'profiles/:id/recomended/courses',
    component: RecomendedCoursesComponentPage,
    //canActivate: [AuthGuard],
    //data: { roles: [Role.student, Role.employee, Role.admin, Role.administrator] },
    canActivate: [AuthGuardByPermission],
    data: { permissions: ['get_courses_recomendations'] }
  },
  {
    path: 'profiles/:id/recomended/jobs',
    component: RecomendedJobsComponentPage,
    //canActivate: [AuthGuard],
    canActivate: [AuthGuardByPermission],
    data: { roles: [Role.student, Role.employee, Role.admin, Role.administrator],
      permissions: ['get_job_recommendations'] }    
  },
  {
    path: 'profiles/:id/recomended/skills',
    component: RecomendedSkillsComponentPage,
    //canActivate: [AuthGuard],
    canActivate: [AuthGuardByPermission],
    data: { roles: [Role.student, Role.employee, Role.admin, Role.administrator],
      permissions: ['get_skills_recomendations'] }    
  },{
    path: 'profiles/:id/jobapplies',
    component: JobAppliesComponentPage,
    //canActivate: [AuthGuard],
    canActivate: [AuthGuardByPermission],
    data: { roles: [Role.student, Role.employee, Role.admin, Role.administrator],
      permissions: ['get_their_job_applications'] }    
  },
  {
    path: 'recruitment/certificate-validation',
    component: RecruitingComponent,
    //canActivate: [AuthGuard],
    canActivate: [AuthGuardByPermission],
    data: { roles: [Role.recruiter, Role.admin, Role.administrator],
      permissions: ['view_recruitment'] 
    }
   }, 
  {
    path: 'recruitment',
    component: RecruitmentComponent,
    //canActivate: [AuthGuard],
    canActivate: [AuthGuardByPermission],
    data: { roles: [Role.recruiter, Role.admin, Role.administrator],
      permissions: ['view_recruitment']  
    }
   },    
   {
    path: 'recruitment/:id',
    component: RecruitmentViewComponent,
    //canActivate: [AuthGuard],
    canActivate: [AuthGuardByPermission],
    data: { roles: [Role.recruiter, Role.admin, Role.administrator],
      permissions: ['view_recruitment'] 
     }    
  },  
  {
    path: 'courses',
    component: CoursesComponent,
    //canActivate: [AuthGuard]
    canActivate: [AuthGuardByPermission],
    data: { roles: [Role.student, Role.employee, Role.professor, Role.admin, Role.administrator], 
      permissions: ['view_courses'] }    
  },
  {
    path: 'courses/add',
    component: CoursesEditComponent,
    //canActivate: [AuthGuard],
    canActivate: [AuthGuardByPermission],
    data: { roles: [Role.professor, Role.admin, Role.administrator],
    permissions: ['add_course'] }    
  },  
  {
    path: 'courses/:id',
    component: CoursesGetComponent,
    //canActivate: [AuthGuard]
    canActivate: [AuthGuardByPermission],
    data: { roles: [Role.student, Role.employee, Role.professor, Role.admin, Role.administrator],
    permissions: ['view_courses'] }    
  },       
  {
    path: 'courses/:id/edit',
    component: CoursesEditComponent,
    //canActivate: [AuthGuard],
    canActivate: [AuthGuardByPermission],
    data: { roles: [Role.professor, Role.admin, Role.administrator],
      permissions: ['edit_course'] }    
  },  
  {
    path: 'courses/:id/award',
    component: AwardSmartBadgeComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.professor, Role.admin, Role.administrator] }    
  },  
  {
    path: 'MCDSS',
    component: MCDSSComponent
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
  imports: [CommonModule,RouterModule.forRoot(routes, {scrollPositionRestoration: 'enabled'})],
  exports: [RouterModule]
})


export class AppRoutingModule { }
