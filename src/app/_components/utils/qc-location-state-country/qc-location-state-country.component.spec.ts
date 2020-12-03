import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QcLocationStateCountryComponent } from './qc-location-state-country.component';
import { TranslateModule } from "@ngx-translate/core";
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { QCStorageService } from '../../../_services/QC_storage.services';

describe('QcLocationStateCountryComponent', () => {
  let component: QcLocationStateCountryComponent;
  let fixture: ComponentFixture<QcLocationStateCountryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QcLocationStateCountryComponent ],
      imports: [
        TranslateModule.forRoot(),
        HttpClientTestingModule
        ],
        providers: [QCStorageService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QcLocationStateCountryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
