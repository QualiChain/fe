import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecruitmentComponent } from './recruitment.component';
import { TranslateModule } from "@ngx-translate/core";
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ChartsModule } from 'ng2-charts';
import { QCStorageService } from '../../_services/QC_storage.services';
import { AppComponent } from '../../app.component';

describe('RecruitmentComponent', () => {
  let component: RecruitmentComponent;
  let fixture: ComponentFixture<RecruitmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecruitmentComponent ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA
      ],
      imports: [
        TranslateModule.forRoot(),
        FormsModule,
        MatTableModule,
        RouterTestingModule,
        HttpClientTestingModule,
        ChartsModule
        ],
        providers: [AppComponent, QCStorageService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecruitmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
