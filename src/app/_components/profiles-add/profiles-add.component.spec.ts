import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilesAddComponent } from './profiles-add.component';

describe('ProfilesAddComponent', () => {
  let component: ProfilesAddComponent;
  let fixture: ComponentFixture<ProfilesAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfilesAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfilesAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
