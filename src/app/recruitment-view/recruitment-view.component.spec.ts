import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecruitmentViewComponent } from './recruitment-view.component';

describe('RecruitmentViewComponent', () => {
  let component: RecruitmentViewComponent;
  let fixture: ComponentFixture<RecruitmentViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecruitmentViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecruitmentViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
