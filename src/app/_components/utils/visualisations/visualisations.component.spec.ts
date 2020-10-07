import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualisationsComponent } from './visualisations.component';
import { SafePipeModule } from 'safe-pipe';

describe('VisualisationsComponent', () => {
  let component: VisualisationsComponent;
  let fixture: ComponentFixture<VisualisationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisualisationsComponent ],
      imports:[SafePipeModule]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VisualisationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
