import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilesViewComponent } from './profiles-view.component';
import { TranslateModule } from "@ngx-translate/core";
import { RouterTestingModule } from '@angular/router/testing';
import {MatTooltipModule} from '@angular/material/tooltip';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatDialogModule} from '@angular/material/dialog';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AppComponent } from '../../../app.component';
import { UploadService } from '../../../_services/upload.service';
import { QCStorageService } from '../../../_services/QC_storage.services';
import { AccessDeniedComponent } from '../../../_components/utils/access-denied/access-denied.component';

describe('ProfilesViewComponent', () => {
  let component: ProfilesViewComponent;
  let fixture: ComponentFixture<ProfilesViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfilesViewComponent ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA
      ],
      imports: [
        TranslateModule.forRoot(),
        RouterTestingModule,
        MatTooltipModule,
        FormsModule,
        ReactiveFormsModule,
        MatDialogModule,
        HttpClientTestingModule,
        RouterTestingModule.withRoutes(
          [{path: 'access_denied', component: AccessDeniedComponent}]
        ),
        ],
        providers: [AppComponent, UploadService, QCStorageService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfilesViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
