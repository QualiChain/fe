import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { LoginComponent } from './login.component';
import { TranslateModule } from "@ngx-translate/core";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { UploadService } from '../../_services/upload.service';
import { QCStorageService } from '../../_services/QC_storage.services';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginComponent ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA
      ],
      imports: [
        TranslateModule.forRoot(),
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule,
        HttpClientTestingModule
        ],
        providers: [UploadService, QCStorageService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
