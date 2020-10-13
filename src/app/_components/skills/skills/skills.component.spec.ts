import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillsComponent } from './skills.component';
import { TranslateModule } from "@ngx-translate/core";
import { MatTableModule } from '@angular/material/table';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {MatDialogModule} from '@angular/material/dialog';
import { AppComponent } from '../../../app.component';
import { QCStorageService } from '../../../_services/QC_storage.services';

describe('SkillsComponent', () => {
  let component: SkillsComponent;
  let fixture: ComponentFixture<SkillsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SkillsComponent ],
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
    fixture = TestBed.createComponent(SkillsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
