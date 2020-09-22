import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilesViewComponent } from './profiles-view.component';
import { TranslateModule } from "@ngx-translate/core";
import { RouterTestingModule } from '@angular/router/testing';
import {MatTooltipModule} from '@angular/material/tooltip';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatDialogModule} from '@angular/material/dialog';
import { HttpClientTestingModule } from '@angular/common/http/testing';

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
        HttpClientTestingModule
        ]
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
