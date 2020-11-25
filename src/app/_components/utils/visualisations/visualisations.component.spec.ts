import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VisualisationsComponent } from './visualisations.component';
import { SafePipeModule } from 'safe-pipe';
import { MatDialogModule } from '@angular/material/dialog';
import { TranslateModule } from "@ngx-translate/core";
import { LevelTypePipe } from '../../../_pipes/level-type/level-type.pipe';

describe('VisualisationsComponent', () => {
  let component: VisualisationsComponent;
  let fixture: ComponentFixture<VisualisationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisualisationsComponent, LevelTypePipe ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA
      ],
      imports:[
        TranslateModule.forRoot(),
        SafePipeModule, 
        MatDialogModule]
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
