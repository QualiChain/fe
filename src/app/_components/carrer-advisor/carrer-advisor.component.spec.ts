import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CarrerAdvisorComponent } from './carrer-advisor.component';
import { TranslateModule } from "@ngx-translate/core";

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//import {MatDatepickerModule} from '@angular/material/datepicker';
//import {MatNativeDateModule} from '@angular/material/core';
import { RouterTestingModule } from '@angular/router/testing';
//import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('CarrerAdvisorComponent', () => {
  let component: CarrerAdvisorComponent;
  let fixture: ComponentFixture<CarrerAdvisorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CarrerAdvisorComponent ],
      imports: [
        TranslateModule.forRoot(),
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule
        ]      
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarrerAdvisorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
