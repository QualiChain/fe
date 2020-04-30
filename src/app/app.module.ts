import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ModalModule } from './_modal';

import { AppComponent } from './app.component';
import { HeaderComponent } from './_components/header/header.component';
import { FooterComponent } from './_components/footer/footer.component';
import { JobsComponent } from './_components/jobs/jobs.component';
import { AwardSmartBadgeComponent, awardDialog_modal, createAwardDialog_modal } from './_components/award-smart-badge/award-smart-badge.component';
import { HomeComponent } from './_components/home/home.component';
import { AccessDeniedComponent } from './_components/access-denied/access-denied.component';
import { AppRoutingModule } from './app-routing.module';
import { CvsComponent } from './_components/cvs/cvs.component';
import { ProfilesComponent } from './_components/profiles/profiles.component';
import { RecruitmentComponent } from './_components/recruitment/recruitment.component';
import { NotFoundComponent } from './core/not-found/not-found.component';
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
import { MAT_DIALOG_DATA } from '@angular/material';

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

import { UsersService } from './_services/users.service';
import { JobsService } from './_services/jobs.service';

import { ProfilesViewComponent } from './_components/profiles-view/profiles-view.component';
import { ProfilesAddComponent } from './_components/profiles-add/profiles-add.component';
import { RecruitmentViewComponent } from './_components/recruitment-view/recruitment-view.component';
import { BestCarrerOptionsComponent } from './_components/best-carrer-options/best-carrer-options.component';
import { CarrerAdvisorComponent } from './_components/carrer-advisor/carrer-advisor.component';
import { RecomendedCoursesComponent } from './_components/recomended-courses/recomended-courses.component';
import { RecomendedJobsComponent } from './_components/recomended-jobs/recomended-jobs.component';
import { CoursesEditComponent } from './_components/courses-edit/courses-edit.component';
import { EmploymentTypePipe } from './_pipes/employment-type/employment-type.pipe';
import { LevelTypePipe } from './_pipes/level-type/level-type.pipe';
import { DatePipe } from '@angular/common';

export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient);
}


@NgModule({
  entryComponents: [ConfirmDialogComponent, awardDialog_modal, createAwardDialog_modal],
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    JobsComponent,
    AwardSmartBadgeComponent,
    awardDialog_modal,
    createAwardDialog_modal,
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
    ProfilesAddComponent,
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
    MatTreeModule,
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
  providers: [DatePipe, UsersService, JobsService, { provide: MAT_DIALOG_DATA, useValue: {} }],
  bootstrap: [AppComponent]
})
export class AppModule { }
