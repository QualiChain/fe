import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ModalModule } from './_modal';

import { AppComponent } from './app.component';
import { HeaderComponent } from './_components/header/header.component';
import { FooterComponent } from './_components/footer/footer.component';
import { JobsComponent } from './_components/jobs/jobs.component';
import { AwardSmartBadgeComponent } from './_components/award-smart-badge/award-smart-badge.component';
import { HomeComponent } from './_components/home/home.component';
import { AccessDeniedComponent } from './_components/access-denied/access-denied.component';
import { AppRoutingModule } from './app-routing.module';
import { CvsComponent } from './_components/cvs/cvs.component';
import { ProfilesComponent } from './_components/profiles/profiles.component';
import { RecruitmentComponent } from './_components/recruitment/recruitment.component';
import { NotFoundComponent } from './core/not-found/not-found.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatAutocompleteModule} from '@angular/material/autocomplete';
import { MatSliderModule } from '@angular/material/slider';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatInputModule} from '@angular/material/input';
import { MatChipsModule} from '@angular/material/chips';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { LoginComponent } from './_components/login/login.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ChartsModule } from 'ng2-charts';
import { NbSecurityModule } from '@nebular/security';
import { ReactiveFormsModule } from '@angular/forms';

import { CustomMaterialModule } from './_components/custom-material/custom-material.module';
import { ConfirmDialogComponent } from './_components/confirm-dialog/confirm-dialog.component';


// for HttpClient import:
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';
// for Router import:
import { LoadingBarRouterModule } from '@ngx-loading-bar/router';
// for Core import:
import { LoadingBarModule } from '@ngx-loading-bar/core';
import { JobsAddComponent } from './_components/jobs-add/jobs-add.component';
import { JobsGetComponent } from './_components/jobs-get/jobs-get.component';
import { JobsEditComponent } from './_components/jobs-edit/jobs-edit.component';

import { JobsService } from './_services/jobs.service';
import { ProfilesViewComponent } from './_components/profiles-view/profiles-view.component';
import { RecruitmentViewComponent } from './_components/recruitment-view/recruitment-view.component';
import { BestCarrerOptionsComponent } from './_components/best-carrer-options/best-carrer-options.component';
import { CarrerAdvisorComponent } from './_components/carrer-advisor/carrer-advisor.component';
import { RecomendedCoursesComponent } from './_components/recomended-courses/recomended-courses.component';
import { RecomendedJobsComponent } from './_components/recomended-jobs/recomended-jobs.component';
import { CoursesEditComponent } from './_components/courses-edit/courses-edit.component';
import { EmploymentTypePipe } from './_pipes/employment-type/employment-type.pipe';
import { LevelTypePipe } from './_pipes/level-type/level-type.pipe';

export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient);
}


@NgModule({
  entryComponents: [ConfirmDialogComponent],
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    JobsComponent,
    AwardSmartBadgeComponent,
    HomeComponent,
    AccessDeniedComponent,
    CvsComponent,
    ProfilesComponent,
    RecruitmentComponent,
    NotFoundComponent,
    LoginComponent,
    JobsAddComponent,
    JobsGetComponent,
    JobsEditComponent,
    ConfirmDialogComponent,
    ProfilesViewComponent,
    RecruitmentViewComponent,
    BestCarrerOptionsComponent,
    CarrerAdvisorComponent,
    RecomendedCoursesComponent,
    RecomendedJobsComponent,
    CoursesEditComponent,
    EmploymentTypePipe,
    LevelTypePipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ModalModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatAutocompleteModule,
    MatSliderModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatChipsModule,
    BrowserModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    NgbModule,
    ChartsModule,
    NbSecurityModule.forRoot(),
    LoadingBarHttpClientModule,
    LoadingBarRouterModule,
    LoadingBarModule,
    ReactiveFormsModule,
    CustomMaterialModule
  ],
  providers: [JobsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
