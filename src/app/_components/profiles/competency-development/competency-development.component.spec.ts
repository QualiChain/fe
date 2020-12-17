import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompetencyDevelopmentComponent } from './competency-development.component';
import { AppComponent } from '../../../app.component';
import { QCStorageService } from '../../../_services/QC_storage.services';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from "@ngx-translate/core";
import {MatDialogModule} from '@angular/material/dialog';

describe('CompetencyDevelopmentComponent', () => {
  let component: CompetencyDevelopmentComponent;
  let fixture: ComponentFixture<CompetencyDevelopmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompetencyDevelopmentComponent ],
      imports: [
        TranslateModule.forRoot(),
        HttpClientTestingModule,
        RouterTestingModule,
        MatDialogModule
      ],
      providers: [AppComponent, QCStorageService]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompetencyDevelopmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
