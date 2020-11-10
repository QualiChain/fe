import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QcUserNameComponent } from './qc-user-name.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('QcUserNameComponent', () => {
  let component: QcUserNameComponent;
  let fixture: ComponentFixture<QcUserNameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QcUserNameComponent ],
      imports: [
        HttpClientTestingModule
        ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QcUserNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
