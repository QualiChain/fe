import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecruitmentViewComponent } from './recruitment-view.component';
import { TranslateModule } from "@ngx-translate/core";
import { RouterTestingModule } from '@angular/router/testing';

describe('RecruitmentViewComponent', () => {
  let component: RecruitmentViewComponent;
  let fixture: ComponentFixture<RecruitmentViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecruitmentViewComponent ],
      imports: [
        TranslateModule.forRoot(),
        RouterTestingModule
        ]
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
