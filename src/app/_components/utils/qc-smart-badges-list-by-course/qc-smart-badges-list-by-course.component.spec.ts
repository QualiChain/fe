import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QcSmartBadgesListByCourseComponent } from './qc-smart-badges-list-by-course.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AppComponent } from '../../../app.component';
import { AuthService } from '../../../_services';
import { QCStorageService } from '../../../_services/QC_storage.services';
import { TranslateModule } from "@ngx-translate/core";

describe('QcSmartBadgesListByCourseComponent', () => {
  let component: QcSmartBadgesListByCourseComponent;
  let fixture: ComponentFixture<QcSmartBadgesListByCourseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QcSmartBadgesListByCourseComponent ],
      imports: [
        HttpClientTestingModule, TranslateModule.forRoot()
        ],
      providers: [AppComponent, AuthService, QCStorageService]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QcSmartBadgesListByCourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
