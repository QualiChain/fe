import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QcSmartBadgesListByUserComponent } from './qc-smart-badges-list-by-user.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AppComponent } from '../../../app.component';
import { AuthService } from '../../../_services';
import { QCStorageService } from '../../../_services/QC_storage.services';
import {MatDialogModule} from '@angular/material/dialog';

describe('QcSmartBadgesListByUserComponent', () => {
  let component: QcSmartBadgesListByUserComponent;
  let fixture: ComponentFixture<QcSmartBadgesListByUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QcSmartBadgesListByUserComponent ],
      imports: [
        HttpClientTestingModule,
        MatDialogModule
        ],
      providers: [AppComponent, AuthService, QCStorageService]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QcSmartBadgesListByUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
