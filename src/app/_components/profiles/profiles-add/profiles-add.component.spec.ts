import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilesAddComponent } from './profiles-add.component';
import { TranslateModule } from "@ngx-translate/core";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
//import { LoadingBarRouterModule } from '@ngx-loading-bar/router';
import { UploadService } from '../../../_services/upload.service';
import { QCStorageService } from '../../../_services/QC_storage.services';
import { AccessDeniedComponent } from '../../../_components/utils/access-denied/access-denied.component';
import { OrderTemplatePipePipe } from '../../../_pipes/orderTemplatePipe/order-template-pipe.pipe';

describe('ProfilesAddComponent', () => {
  let component: ProfilesAddComponent;
  let fixture: ComponentFixture<ProfilesAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfilesAddComponent, OrderTemplatePipePipe ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA
      ],
      imports: [
        TranslateModule.forRoot(),
        FormsModule,
        ReactiveFormsModule,
        MatDatepickerModule,
        MatNativeDateModule,
        RouterTestingModule,
        HttpClientTestingModule,
        RouterTestingModule.withRoutes(
          [{path: 'access_denied', component: AccessDeniedComponent}]
        ),
        ],
        providers: [UploadService, QCStorageService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfilesAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
