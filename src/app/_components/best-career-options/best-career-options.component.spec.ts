import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BestCareerOptionsComponent } from './best-career-options.component';
import { TranslateModule } from "@ngx-translate/core";
import { RouterTestingModule } from '@angular/router/testing';
import { ChartsModule } from 'ng2-charts';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { QCStorageService } from '../../_services/QC_storage.services';

describe('BestCareerOptionsComponent', () => {
  let component: BestCareerOptionsComponent;
  let fixture: ComponentFixture<BestCareerOptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BestCareerOptionsComponent ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA
      ],
      imports: [
        TranslateModule.forRoot(),
        RouterTestingModule,
        ChartsModule,
        HttpClientTestingModule
        ],
        providers: [QCStorageService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BestCareerOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
