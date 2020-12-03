import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QcLocationCountryComponent } from './qc-location-country.component';
import { TranslateModule } from "@ngx-translate/core";
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { QCStorageService } from '../../../_services/QC_storage.services';

describe('QcLocationCountryComponent', () => {
  let component: QcLocationCountryComponent;
  let fixture: ComponentFixture<QcLocationCountryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QcLocationCountryComponent ],
      imports: [
        TranslateModule.forRoot(),
        HttpClientTestingModule
        ],
        providers: [QCStorageService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QcLocationCountryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
