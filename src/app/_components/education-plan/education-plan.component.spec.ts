import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EducationPlanComponent } from './education-plan.component';
import { TranslateModule } from "@ngx-translate/core";
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NotFoundComponent } from '../../_components/utils/not-found/not-found.component';

describe('EducationPlanComponent', () => {
  let component: EducationPlanComponent;
  let fixture: ComponentFixture<EducationPlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EducationPlanComponent ],
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
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EducationPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
