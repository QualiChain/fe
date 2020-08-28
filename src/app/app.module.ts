import { APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
/*
import { MatAutocompleteModule} from '@angular/material/autocomplete';
import { MatSliderModule } from '@angular/material/slider';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatInputModule} from '@angular/material/input';
import { MatChipsModule} from '@angular/material/chips';
*/
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatBadgeModule} from '@angular/material/badge';
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';
import {MatButtonModule} from '@angular/material/button';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatCardModule} from '@angular/material/card';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatChipsModule} from '@angular/material/chips';
import {MatStepperModule} from '@angular/material/stepper';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatDialogModule} from '@angular/material/dialog';
import {MatDividerModule} from '@angular/material/divider';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatListModule} from '@angular/material/list';
import {MatMenuModule} from '@angular/material/menu';
import {MatNativeDateModule, MatRippleModule} from '@angular/material/core';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatRadioModule} from '@angular/material/radio';
import {MatSelectModule} from '@angular/material/select';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatSliderModule} from '@angular/material/slider';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatSortModule} from '@angular/material/sort';
import {MatTableModule} from '@angular/material/table';
import {MatTabsModule} from '@angular/material/tabs';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatTreeModule} from '@angular/material/tree';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ChartsModule } from 'ng2-charts';
//import { NbSecurityModule } from '@nebular/security';
import { ReactiveFormsModule } from '@angular/forms';

// for HttpClient import:
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';
// for Router import:
import { LoadingBarRouterModule } from '@ngx-loading-bar/router';

// for Core import:
import { LoadingBarModule } from '@ngx-loading-bar/core';

import { ModalModule } from './_modal';
/*custom services*/
import { UsersService } from './_services/users.service';
import { JobsService } from './_services/jobs.service';
import { SkillsService } from './_services/skills.service';
import { UploadService } from './_services/upload.service';
import { CoursesService } from './_services/courses.service';
import { RecomendationsService } from './_services/recomendations.service';
import { CustomConfigEnvironmentDataService } from './_services/customConfigEnvironmentData.service';
import { PilotsService } from './_services/pilots.services';
/*custom pipes*/
import { EmploymentTypePipe } from './_pipes/employment-type/employment-type.pipe';
import { LevelTypePipe } from './_pipes/level-type/level-type.pipe';
import { FilterArrayByValuePipe } from './_pipes/filterArrayByValue/filterArrayByValue.pipe';
/*custom components*/
//import { CvsComponent } from './_components/cvs/cvs.component';
import { NotFoundComponent } from './_components/not-found/not-found.component';
import { LoginComponent } from './_components/login/login.component';
import { ProfilesComponent, createChangePasswordDialog_modal } from './_components/profiles/profiles.component';
import { RecruitmentComponent } from './_components/recruitment/recruitment.component';
import { HeaderComponent } from './_components/utils/header/header.component';
import { FooterComponent } from './_components/utils/footer/footer.component';
import { JobsComponent, applyJobDialog_modal } from './_components/jobs/jobs.component';
import { AwardSmartBadgeComponent, awardDialog_modal, createAwardDialog_modal } from './_components/award-smart-badge/award-smart-badge.component';
import { HomeComponent } from './_components/home/home.component';
import { PilotHomeComponent } from './_components/pilot-home/pilot-home.component';
import { HomePilot1Component, HomePilot2Component, HomePilot3Component, HomePilot4Component, HomePilot5Component } from './_components/pilot-home/pilot-home.component';

import { AccessDeniedComponent } from './_components/access-denied/access-denied.component';
import { CustomMaterialModule } from './_components/custom-material/custom-material.module';
import { ConfirmDialogComponent } from './_components/utils/confirm-dialog/confirm-dialog.component';
import { JobsAddComponent } from './_components/jobs-add/jobs-add.component';
import { JobsGetComponent } from './_components/jobs-get/jobs-get.component';
import { ProfilesViewComponent, CVDialog_modal } from './_components/profiles-view/profiles-view.component';
import { ProfilesAddComponent } from './_components/profiles-add/profiles-add.component';
import { RecruitmentViewComponent } from './_components/recruitment-view/recruitment-view.component';
import { BestCareerOptionsComponent } from './_components/best-career-options/best-career-options.component';
import { CareerAdvisorComponent } from './_components/career-advisor/career-advisor.component';
import { RecomendedCoursesComponent, RecomendedCoursesComponentPage } from './_components/recomended-courses/recomended-courses.component';
import { RecomendedJobsComponent, RecomendedJobsComponentPage } from './_components/recomended-jobs/recomended-jobs.component';
import { RecomendedSkillsComponent, RecomendedSkillsComponentPage } from './_components/recomended-skills/recomended-skills.component';
import { CoursesComponent } from './_components/courses/courses.component';
import { CoursesGetComponent } from './_components/courses-get/courses-get.component';
import { CoursesEditComponent } from './_components/courses-edit/courses-edit.component';
import { ProgressComponent } from './_components/utils/progress/progress.component';
import { UploadFilesComponent } from './_components/utils/upload-files/upload-files.component';
import { JobApplicationsByUserComponent, JobAppliesComponentPage } from './_components/job-applications-by-user/job-applications-by-user.component';
/*custom directives*/
import { DndDirective } from './_directives/dnd/dnd.directive';


import { DatePipe } from '@angular/common';


import { of, Observable, ObservableInput } from '../../node_modules/rxjs';
import { map, catchError } from 'rxjs/operators';
import { QcSpinnerComponent } from './_components/utils/qc-spinner/qc-spinner.component';
import { QcLocationCountryComponent } from './_components/utils/qc-location-country/qc-location-country.component';
import { QcLocationStateCountryComponent } from './_components/utils/qc-location-state-country/qc-location-state-country.component';
import { QcLocationCityStateComponent } from './_components/utils/qc-location-city-state/qc-location-city-state.component';

import { RecruitingComponent } from './_components/recruiting/recruiting.component';
import { FlashMessagesModule } from 'angular2-flash-messages';
import { ValidateService } from './_services/recruiting/validate.service';
import { AuthService } from './_services/recruiting/auth.service';
import { JwtModule, JWT_OPTIONS, JwtHelperService } from '@auth0/angular-jwt';


import { environment } from '../environments/environment';


export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient);
}

const materialModules = [
    MatFormFieldModule,
    MatAutocompleteModule,
    MatBadgeModule,
    MatBottomSheetModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatStepperModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatTreeModule
];

export function load(http: HttpClient, config: CustomConfigEnvironmentDataService): (() => Promise<boolean>) {
  return (): Promise<boolean> => {
    return new Promise<boolean>((resolve: (a: boolean) => void): void => {     
       http.get('../../assets/config.json')
         .pipe(
           map((x: CustomConfigEnvironmentDataService) => {
             //config.baseUrl = x.baseUrl;
             //console.log(x);
             config.configData = x;
             resolve(true);
           }),
           catchError((x: { status: number }, caught: Observable<void>): ObservableInput<{}> => {
             if (x.status !== 404) {
               resolve(false);
             }
             config.configData = {};
             resolve(true);
             return of({});
           })
         ).subscribe();
         
    });
  };
}

export function tokenGetter() {
  return localStorage.getItem("access_token");
}

@NgModule({
  entryComponents: [ConfirmDialogComponent, awardDialog_modal, createAwardDialog_modal, applyJobDialog_modal, createChangePasswordDialog_modal, CVDialog_modal],
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    JobsComponent,
    applyJobDialog_modal,
    AwardSmartBadgeComponent,
    awardDialog_modal,
    createAwardDialog_modal,
    HomeComponent,
    PilotHomeComponent,
    HomePilot1Component, HomePilot2Component, HomePilot3Component, HomePilot4Component, HomePilot5Component,
    AccessDeniedComponent,
    ProfilesComponent,
    RecruitmentComponent,
    NotFoundComponent,
    LoginComponent,
    JobsAddComponent,
    JobsGetComponent,
    ConfirmDialogComponent,
    ProfilesViewComponent, CVDialog_modal,
    createChangePasswordDialog_modal,
    ProfilesAddComponent,
    RecruitmentViewComponent,
    BestCareerOptionsComponent,
    CareerAdvisorComponent,
    RecomendedCoursesComponent, RecomendedCoursesComponentPage,
    RecomendedJobsComponent, RecomendedJobsComponentPage,
    RecomendedSkillsComponent, RecomendedSkillsComponentPage,
    CoursesComponent,
    CoursesGetComponent,
    CoursesEditComponent,
    EmploymentTypePipe,
    LevelTypePipe,
    FilterArrayByValuePipe,
    DndDirective,
    ProgressComponent,
    UploadFilesComponent,
    QcSpinnerComponent,
    JobApplicationsByUserComponent, JobAppliesComponentPage, QcLocationCountryComponent, QcLocationStateCountryComponent, QcLocationCityStateComponent,
    RecruitingComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ModalModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    materialModules,
    BrowserModule,
    HttpClientModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: environment.JwtModule.allowedDomains,
        disallowedRoutes: environment.JwtModule.disallowedRoutes,
      },      
  }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    NgbModule,
    ChartsModule,
    //NbSecurityModule.forRoot(),
    LoadingBarHttpClientModule,
    LoadingBarRouterModule,
    LoadingBarModule,
    ReactiveFormsModule,
    CustomMaterialModule,
    FlashMessagesModule.forRoot()
  ],
  exports: [materialModules],
  providers: [ PilotsService, DatePipe, UsersService, JobsService, SkillsService, UploadService, CoursesService, RecomendationsService, ValidateService, AuthService, JwtHelperService,
    { provide: MAT_DIALOG_DATA, useValue: {} },
    {
      provide: APP_INITIALIZER,
      useFactory: load,
      deps: [
        HttpClient,
        CustomConfigEnvironmentDataService
      ],
      multi: true
    }],
  bootstrap: [AppComponent],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AppModule { }
