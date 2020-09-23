import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QcLocationStateCountryComponent } from './qc-location-state-country.component';
import { TranslateModule } from "@ngx-translate/core";
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('QcLocationStateCountryComponent', () => {
  let component: QcLocationStateCountryComponent;
  let fixture: ComponentFixture<QcLocationStateCountryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QcLocationStateCountryComponent ],
      imports: [
        TranslateModule.forRoot(),
        HttpClientTestingModule
        ]
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
