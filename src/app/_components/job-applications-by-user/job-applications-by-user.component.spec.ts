import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobApplicationsByUserComponent } from './job-applications-by-user.component';

describe('JobApplicationsByUserComponent', () => {
  let component: JobApplicationsByUserComponent;
  let fixture: ComponentFixture<JobApplicationsByUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobApplicationsByUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobApplicationsByUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
