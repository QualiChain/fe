import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadFilesComponent } from './upload-files.component';
import { FilterArrayByValuePipe } from '../../../_pipes/filterArrayByValue/filterArrayByValue.pipe';
import { TranslateModule } from "@ngx-translate/core";
import { UploadService } from '../../../_services/upload.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { QCStorageService } from '../../../_services/QC_storage.services';

describe('UploadFilesComponent', () => {
  let component: UploadFilesComponent;
  let fixture: ComponentFixture<UploadFilesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadFilesComponent, FilterArrayByValuePipe ],
      providers: [QCStorageService, UploadService],
      imports: [
        TranslateModule.forRoot(),
        HttpClientTestingModule
      ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadFilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
