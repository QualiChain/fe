import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillsGetComponent } from './skills-get.component';
import { TranslateModule } from "@ngx-translate/core";
import { MatTableModule } from '@angular/material/table';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {MatDialogModule} from '@angular/material/dialog';
import { AppComponent } from '../../../app.component';
import { QCStorageService } from '../../../_services/QC_storage.services';

describe('SkillsGetComponent', () => {
  let component: SkillsGetComponent;
  let fixture: ComponentFixture<SkillsGetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SkillsGetComponent ],
      imports: [
        TranslateModule.forRoot(),
        MatTableModule,
        RouterTestingModule,
        HttpClientTestingModule,
        MatDialogModule
        ],
        providers: [AppComponent, QCStorageService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SkillsGetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
