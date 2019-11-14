import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BestCarrerOptionsComponent } from './best-carrer-options.component';

describe('BestCarrerOptionsComponent', () => {
  let component: BestCarrerOptionsComponent;
  let fixture: ComponentFixture<BestCarrerOptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BestCarrerOptionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BestCarrerOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
