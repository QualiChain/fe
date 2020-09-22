import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CareerAdvisorComponent } from './career-advisor.component';
import { TranslateModule } from "@ngx-translate/core";

//import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//import {MatDatepickerModule} from '@angular/material/datepicker';
//import {MatNativeDateModule} from '@angular/material/core';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NotFoundComponent } from '../../_components/utils/not-found/not-found.component';

describe('CareerAdvisorComponent', () => {
  let component: CareerAdvisorComponent;
  let fixture: ComponentFixture<CareerAdvisorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CareerAdvisorComponent ],
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
    fixture = TestBed.createComponent(CareerAdvisorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
