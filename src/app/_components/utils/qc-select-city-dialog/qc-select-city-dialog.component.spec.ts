import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import { TranslateModule } from "@ngx-translate/core";
import { QcSelectCityDialogComponent } from './qc-select-city-dialog.component';

describe('QcSelectCityDialogComponent', () => {
  let component: QcSelectCityDialogComponent;
  let fixture: ComponentFixture<QcSelectCityDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QcSelectCityDialogComponent ],
      imports: [  
        TranslateModule.forRoot(),      
        FormsModule,
        ReactiveFormsModule,
        MatDialogModule
      ],
      providers: [
        { provide: MatDialogRef, useValue: {} }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QcSelectCityDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
