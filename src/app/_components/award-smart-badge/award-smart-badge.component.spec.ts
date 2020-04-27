import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AwardSmartBadgeComponent } from './award-smart-badge.component';

describe('AwardSmartBadgeComponent', () => {
  let component: AwardSmartBadgeComponent;
  let fixture: ComponentFixture<AwardSmartBadgeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AwardSmartBadgeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AwardSmartBadgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
