import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QcLocationCityStateComponent } from './qc-location-city-state.component';
import { TranslateModule } from "@ngx-translate/core";

describe('QcLocationCityStateComponent', () => {
  let component: QcLocationCityStateComponent;
  let fixture: ComponentFixture<QcLocationCityStateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QcLocationCityStateComponent ],
      imports: [
        TranslateModule.forRoot()
        ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QcLocationCityStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
