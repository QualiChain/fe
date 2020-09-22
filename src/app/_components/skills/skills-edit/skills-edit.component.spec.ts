import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillsEditComponent } from './skills-edit.component';
import { TranslateModule } from "@ngx-translate/core";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatChipsModule } from '@angular/material/chips';
//import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

import { MatNativeDateModule } from '@angular/material/core';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('SkillsEditComponent', () => {
  let component: SkillsEditComponent;
  let fixture: ComponentFixture<SkillsEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SkillsEditComponent ],
      imports: [
        TranslateModule.forRoot(),
        FormsModule,
        ReactiveFormsModule,
        MatDatepickerModule,
        MatChipsModule,      
        MatNativeDateModule,
        RouterTestingModule,
        HttpClientTestingModule,
        MatAutocompleteModule
        ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SkillsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
