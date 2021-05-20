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
import { ProfilesAddComponent, ProfilesAddIAMUserComponent } from './_components/profiles/profiles-add/profiles-add.component';

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
import { AuthGuardByPermission, AuthGuardForAnonymous } from './_directives/can-access.directive';
import { ThesisComponent } from './_components/thesis/thesis/thesis.component';
import { ThesisGetComponent } from './_components/thesis/thesis-get/thesis-get.component';
import { ThesisEditComponent } from './_components/thesis/thesis-edit/thesis-edit.component';
import { CompetencyDevelopmentComponent } from './_components/profiles/competency-development/competency-development.component';
import { TermsOfUseComponent } from './_components/utils/terms-of-use/terms-of-use.component';
import { MyColleaguesComponent } from './_components/my-colleagues/my-colleagues.component';

const routes: Routes = [
  {
   path: '',
   pathMatch: 'full',
   component: HomeComponent,
   canActivate: [AuthGuard],
   data: {title: 'Home'}
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [AuthGuardForAnonymous],
    data: {title: 'Login'}
   },
   {
    path: 'skills',
    component: SkillsComponent,
    //canActivate: [AuthGuard],
    canActivate: [AuthGuardByPermission],
    data: { 
        roles: [Role.student, Role.employee, Role.recruiter, Role.admin, Role.administrator ],
        permissions: ['view_skills'],
        title: 'Skills'
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
        permissions: ['view_skills'],
        title: 'Skill | :id'      }
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
     permissions: ['view_jobs'],
     title: 'Jobs'
    }
  },
  {
    path: 'jobs/add',
    component: JobsAddComponent,
    //canActivate: [AuthGuard],
    canActivate: [AuthGuardByPermission],
    data: { 
      roles: [Role.recruiter, Role.admin, Role.administrator ],      
      permissions: ['add_job_post'],
      title: 'Jobs | Add'
      }
  },
  {
    path: 'jobs/:id',
    component: JobsGetComponent,
    //canActivate: [AuthGuard]
    canActivate: [AuthGuardByPermission],
    data: { 
      roles: [Role.student, Role.employee, Role.recruiter, Role.admin, Role.administrator ],
      permissions: ['view_jobs'],
      title: 'Job | :id'
     }    
  },
  {
    path: 'jobs/:id/edit',
    //component: JobsEditComponent,
    component: JobsAddComponent,
    //canActivate: [AuthGuard],
    canActivate: [AuthGuardByPermission],
    data: { roles: [Role.recruiter, Role.admin, Role.administrator ],
      permissions: ['edit_job_post'],
      title: 'Job | :id | Edit'
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
    permissions: ['view_profiles'],
    title: 'Profiles'
   }  
  },
  {
    path: 'profiles/add',
    //component: ProfilesAddComponent,
    component: ProfilesAddIAMUserComponent,
    //canActivate: [AuthGuard],
    canActivate: [AuthGuardByPermission],
    data: { roles: [Role.admin, Role.administrator ],
      permissions: ['add_profile'],
      title: 'Profiles | Add' }  
  },
  {
    path: 'myprofile',
    component: ProfilesViewComponent,
    //canActivate: [AuthGuard],
    canActivate: [AuthGuardByPermission],
    data: { roles: [],
      permissions: ['view_own_profile'],
      title: 'My profile' }  
  },
  {
    path: 'myprofile/edit',
    component: ProfilesAddComponent,
    //canActivate: [AuthGuard],
    canActivate: [AuthGuardByPermission],
    data: { roles: [],
      permissions: ['edit_own_profile'],
      title: 'My profile | Edit' }  
  },  
  {
    path: 'profiles/:id',
    component: ProfilesViewComponent,
    //canActivate: [AuthGuard],
    canActivate: [AuthGuardByPermission],
    data: { roles: [],
      permissions: ['view_own_profile','view_other_profile'],
      title: 'Profile | :id' }  
  },
  {
    path: 'profiles/:id/edit',
    component: ProfilesAddComponent,
    //canActivate: [AuthGuard],
    canActivate: [AuthGuardByPermission],
    data: { roles: [],
      permissions: ['edit_own_profile', 'edit_other_profile'],
      title: 'Profile | :id | Edit' }  
  },
  {
    path: 'profiles/:id/competences',
    component: CompetencyDevelopmentComponent,
    canActivate: [AuthGuardByPermission],
    data: { roles: [],
      permissions: ['view_own_profile'],
      title: 'Profile | :id | Competences' }   
  },  
  {
    path: 'profiles/:id/best-career-options',
    component: BestCareerOptionsComponent,
    canActivate: [AuthGuard],
    data: { title: 'Profile | :id | Best career options' }
  },  
  {
    path: 'profiles/:id/career-advisor',
    component: CareerAdvisorComponent,
    canActivate: [AuthGuard],
    data: { title: 'Profile | :id | Career advisor' }
  },
  {
    path: 'profiles/:id/education-plan',
    component: EducationPlanComponent,
    canActivate: [AuthGuard],
    data: { title: 'Profile | :id | Education plan' }
  },
  {
    path: 'profiles/:id/dss-curriculum-re-design',
    component: DSSCurriculumReDesignComponent,
    canActivate: [AuthGuard],
    data: { title: 'Profile | :id | DSS Curriculum re-design' }
  },
  {
    path: 'profiles/:id/cv-gap-analysis',
    component: CurriculumGapAnalysisComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.professor, Role.recruiter, Role.admin, Role.administrator ],
    title: 'Profile | :id | CV Gap analysis' }
  },
  {
    path: 'profiles/:id/notifications-preferences',
    component: NotificationPreferencesComponent,
    //canActivate: [AuthGuard],
    canActivate: [AuthGuardByPermission],
    data: { permissions: ['manage_own_notifications_preferences'],
    title: 'Profile | :id | Notifications preferences' }    
  },    
  {
    path: 'profiles/:id/personal-files-repository',
    component: FilesRepositoryComponent,
    //canActivate: [AuthGuard],
    canActivate: [AuthGuardByPermission],
    data: { permissions: ['retrieve_own_files'],
    title: 'Profile | :id | Personal files repository' }    
  },    
  {
    path: 'profiles/:id/recomended/courses',
    component: RecomendedCoursesComponentPage,
    //canActivate: [AuthGuard],
    //data: { roles: [Role.student, Role.employee, Role.admin, Role.administrator] },
    canActivate: [AuthGuardByPermission],
    data: { permissions: ['get_courses_recomendations'],
    title: 'Profile | :id | Recommended Courses' }
  },
  {
    path: 'profiles/:id/recomended/jobs',
    component: RecomendedJobsComponentPage,
    //canActivate: [AuthGuard],
    canActivate: [AuthGuardByPermission],
    data: { roles: [Role.student, Role.employee, Role.admin, Role.administrator],
      permissions: ['get_job_recommendations'],
      title: 'Profile | :id | Recommended Jobs' }    
  },
  {
    path: 'profiles/:id/recomended/skills',
    component: RecomendedSkillsComponentPage,
    //canActivate: [AuthGuard],
    canActivate: [AuthGuardByPermission],
    data: { roles: [Role.student, Role.employee, Role.admin, Role.administrator],
      permissions: ['get_skills_recomendations'],
      title: 'Profile | :id | Recommended Skills' }    
  },{
    path: 'profiles/:id/jobapplies',
    component: JobAppliesComponentPage,
    //canActivate: [AuthGuard],
    canActivate: [AuthGuardByPermission],
    data: { roles: [Role.student, Role.employee, Role.admin, Role.administrator],
      permissions: ['get_their_job_applications'],
      title: 'Profile | :id | Job applies' }    
  },
  {
    path: 'recruitment/certificate-validation',
    component: RecruitingComponent,
    //canActivate: [AuthGuard],
    canActivate: [AuthGuardByPermission],
    data: { roles: [Role.recruiter, Role.admin, Role.administrator],
      permissions: ['view_recruitment'],
      title: 'Recruitment | Certificate validation'
    }
   }, 
  {
    path: 'recruitment',
    component: RecruitmentComponent,
    //canActivate: [AuthGuard],
    canActivate: [AuthGuardByPermission],
    data: { roles: [Role.recruiter, Role.admin, Role.administrator],
      permissions: ['view_recruitment'],
      title: 'Recruitment'
    }
   },    
   {
    path: 'recruitment/:id',
    component: RecruitmentViewComponent,
    //canActivate: [AuthGuard],
    canActivate: [AuthGuardByPermission],
    data: { roles: [Role.recruiter, Role.admin, Role.administrator],
      permissions: ['view_recruitment'],
      title: 'Recruitment | :id'
     }    
  },  
  {
    path: 'courses',
    component: CoursesComponent,
    //canActivate: [AuthGuard]
    canActivate: [AuthGuardByPermission],
    data: { roles: [Role.student, Role.employee, Role.professor, Role.admin, Role.administrator], 
      permissions: ['view_courses'],
      title: 'Courses' }    
  },
  {
    path: 'courses/add',
    component: CoursesEditComponent,
    //canActivate: [AuthGuard],
    canActivate: [AuthGuardByPermission],
    data: { roles: [Role.professor, Role.admin, Role.administrator],
    permissions: ['add_course'],
    title: 'Courses | Add' }    
  },  
  {
    path: 'courses/:id',
    component: CoursesGetComponent,
    //canActivate: [AuthGuard]
    canActivate: [AuthGuardByPermission],
    data: { roles: [Role.student, Role.employee, Role.professor, Role.admin, Role.administrator],
    permissions: ['view_courses'],
    title: 'Course | :id' }    
  },       
  {
    path: 'courses/:id/edit',
    component: CoursesEditComponent,
    //canActivate: [AuthGuard],
    canActivate: [AuthGuardByPermission],
    data: { roles: [Role.professor, Role.admin, Role.administrator],
      permissions: ['edit_course'],
      title: 'Course | :id | Edit' }    
  },  
  {
    path: 'courses/:id/award',
    component: AwardSmartBadgeComponent,
    //canActivate: [AuthGuard],
    canActivate: [AuthGuardByPermission],
    data: { roles: [Role.professor, Role.admin, Role.administrator],
      permissions: ['create_smart_badge','issue_smart_badge'],
      title: 'Course | :id | Award' }    
  },
  {
    path: 'thesis',
    component: ThesisComponent,
    //canActivate: [AuthGuard],
    canActivate: [AuthGuardByPermission],
    data: { roles: [Role.professor, Role.student],
      permissions: ['view_thesis_subjects', 'add_and_update_thesis'],
      title: 'Thesis' }    
  },
  {
    path: 'thesis/add',
    component: ThesisEditComponent,
    //canActivate: [AuthGuard],
    canActivate: [AuthGuardByPermission],
    data: { roles: [Role.professor, Role.student],
      permissions: ['add_and_update_thesis'],
      title: 'Thesis | Add' }    
  }, 
  {
    path: 'thesis/:id',
    component: ThesisGetComponent,
    //canActivate: [AuthGuard],
    canActivate: [AuthGuardByPermission],
    data: { roles: [Role.professor, Role.student],
      permissions: ['view_thesis_subjects', 'add_and_update_thesis'],
      title: 'Thesis | :id' }    
  },
  {
    path: 'thesis/:id/edit',
    component: ThesisEditComponent,
    //canActivate: [AuthGuard],
    canActivate: [AuthGuardByPermission],
    data: { roles: [Role.professor, Role.student],
      permissions: ['add_and_update_thesis'],
      title: 'Thesis | :id | Edit' }    
  },   
  {
    path: 'MCDSS',
    component: MCDSSComponent,
    canActivate: [AuthGuardByPermission],
    data: {permissions: ['access_MCDSS'], title: 'MCDSS'}
  },  
  {
    path: 'terms-of-use',
    component: TermsOfUseComponent,
    data: {title: 'Terms of use'}
  },
  {
    path: 'mycolleagues',
    component: MyColleaguesComponent,
    canActivate: [AuthGuardByPermission],
    data: { roles: [Role.authenticated], title: 'My colleagues'}
  },  
  {
    path: 'access_denied',
    component: AccessDeniedComponent,
    data: {title: 'Access denied'}
  },
  { 
    path: 'not_found', 
    component: NotFoundComponent,
    data: {title: 'Not found'}
  } ,
  { 
    path: '**', 
    component: NotFoundComponent,
    data: {title: 'Not found'}
  } ,
  { path: '**', redirectTo: '' }
  ];


@NgModule({
  imports: [CommonModule,RouterModule.forRoot(routes, {scrollPositionRestoration: 'enabled'})],
  exports: [RouterModule]
})


export class AppRoutingModule { }
