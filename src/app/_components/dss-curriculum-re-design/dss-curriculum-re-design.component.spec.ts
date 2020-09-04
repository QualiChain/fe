import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DSSCurriculumReDesignComponent } from './dss-curriculum-re-design.component';
import { TranslateModule } from "@ngx-translate/core";
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NotFoundComponent } from '../../_components/not-found/not-found.component';

describe('DSSCurriculumReDesignComponent', () => {
  let component: DSSCurriculumReDesignComponent;
  let fixture: ComponentFixture<DSSCurriculumReDesignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DSSCurriculumReDesignComponent ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA
      ],
      imports: [
        TranslateModule.forRoot(),
        HttpClientTestingModule,
        RouterTestingModule.withRoutes(
          [{path: 'not_found', component: NotFoundComponent}]
        )
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DSSCurriculumReDesignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
