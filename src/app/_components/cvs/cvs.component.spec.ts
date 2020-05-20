import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CvsComponent } from './cvs.component';
import { TranslateModule } from "@ngx-translate/core";
import { MatTableModule } from '@angular/material';
import { ChartsModule } from 'ng2-charts';

describe('CvsComponent', () => {
  let component: CvsComponent;
  let fixture: ComponentFixture<CvsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CvsComponent ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA
      ],
      imports: [
        TranslateModule.forRoot(),
        MatTableModule,
        ChartsModule
        ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CvsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
