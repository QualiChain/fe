import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from "@ngx-translate/core";
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import { MyColleaguesComponent } from './my-colleagues.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { QCStorageService } from '../../_services/QC_storage.services';

describe('MyColleaguesComponent', () => {
  let component: MyColleaguesComponent;
  let fixture: ComponentFixture<MyColleaguesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyColleaguesComponent ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA
      ],
      imports: [
        TranslateModule.forRoot(),
        MatTableModule,
        MatDialogModule,
        HttpClientTestingModule
        ],
        providers: [QCStorageService]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyColleaguesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
