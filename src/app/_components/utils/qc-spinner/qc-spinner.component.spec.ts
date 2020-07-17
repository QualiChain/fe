import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QcSpinnerComponent } from './qc-spinner.component';

describe('QcSpinnerComponent', () => {
  let component: QcSpinnerComponent;
  let fixture: ComponentFixture<QcSpinnerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QcSpinnerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QcSpinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
