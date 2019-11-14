import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CarrerAdvisorComponent } from './carrer-advisor.component';

describe('CarrerAdvisorComponent', () => {
  let component: CarrerAdvisorComponent;
  let fixture: ComponentFixture<CarrerAdvisorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CarrerAdvisorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarrerAdvisorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
