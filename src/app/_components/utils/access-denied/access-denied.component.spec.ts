import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessDeniedComponent } from './access-denied.component';
import { TranslateModule } from "@ngx-translate/core";
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { QCStorageService } from '../../../_services/QC_storage.services';

describe('HomeCAccessDeniedComponentomponent', () => {
  let component: AccessDeniedComponent;
  let fixture: ComponentFixture<AccessDeniedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccessDeniedComponent ],
      imports: [
        TranslateModule.forRoot(),
        HttpClientTestingModule 
        ],
        providers: [QCStorageService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccessDeniedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
