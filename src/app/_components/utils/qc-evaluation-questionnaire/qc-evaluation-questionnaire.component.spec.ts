import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QcEvaluationQuestionnaireComponent } from './qc-evaluation-questionnaire.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateModule } from "@ngx-translate/core";

describe('QcEvaluationQuestionnaireComponent', () => {
  let component: QcEvaluationQuestionnaireComponent;
  let fixture: ComponentFixture<QcEvaluationQuestionnaireComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QcEvaluationQuestionnaireComponent ],
      imports:[
        TranslateModule.forRoot(),
        MatDialogModule
      ],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {} }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QcEvaluationQuestionnaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
