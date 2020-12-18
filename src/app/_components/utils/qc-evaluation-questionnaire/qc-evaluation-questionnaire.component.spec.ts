import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QcEvaluationQuestionnaireComponent } from './qc-evaluation-questionnaire.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateModule } from "@ngx-translate/core";
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AppComponent } from '../../../app.component';
import { UploadService } from '../../../_services/upload.service';
import { QCStorageService } from '../../../_services/QC_storage.services';

describe('QcEvaluationQuestionnaireComponent', () => {
  let component: QcEvaluationQuestionnaireComponent;
  let fixture: ComponentFixture<QcEvaluationQuestionnaireComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QcEvaluationQuestionnaireComponent ],
      imports:[
        TranslateModule.forRoot(),
        MatDialogModule,
        HttpClientTestingModule
      ],
      providers: [
        AppComponent, UploadService, QCStorageService,
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
