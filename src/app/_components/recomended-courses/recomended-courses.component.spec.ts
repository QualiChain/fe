import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecomendedCoursesComponent } from './recomended-courses.component';

describe('RecomendedCoursesComponent', () => {
  let component: RecomendedCoursesComponent;
  let fixture: ComponentFixture<RecomendedCoursesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecomendedCoursesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecomendedCoursesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
