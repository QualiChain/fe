import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { QcJobCandidatesManagementComponent } from './qc-job-candidates-management.component';
import { TranslateModule } from "@ngx-translate/core";
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AppComponent } from '../../../app.component';
import { AuthService } from '../../../_services';
import { QCStorageService } from '../../../_services/QC_storage.services';
import {MatDialogModule} from '@angular/material/dialog';

describe('QcJobCandidatesManagementComponent', () => {
  let component: QcJobCandidatesManagementComponent;
  let fixture: ComponentFixture<QcJobCandidatesManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QcJobCandidatesManagementComponent ],
      imports: [
        RouterTestingModule,
        TranslateModule.forRoot(),
        HttpClientTestingModule,
        MatDialogModule
        ],
        providers: [AppComponent, AuthService, QCStorageService]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QcJobCandidatesManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
