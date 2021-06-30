import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QcSmartBadgesListComponent } from './qc-smart-badges-list.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AppComponent } from '../../../app.component';
import { AuthService } from '../../../_services';
import { QCStorageService } from '../../../_services/QC_storage.services';
import {MatDialogModule} from '@angular/material/dialog';
import { TranslateModule } from "@ngx-translate/core";
import { RouterModule } from '@angular/router';

describe('QcSmartBadgesListComponent', () => {
  let component: QcSmartBadgesListComponent;
  let fixture: ComponentFixture<QcSmartBadgesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QcSmartBadgesListComponent ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA
      ],
      imports: [
        TranslateModule.forRoot(),
        RouterModule.forRoot([]),
        HttpClientTestingModule,
        MatDialogModule
        ],
      providers: [AppComponent, AuthService, QCStorageService]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QcSmartBadgesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
