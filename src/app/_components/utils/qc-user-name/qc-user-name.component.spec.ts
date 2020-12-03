import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QcUserNameComponent } from './qc-user-name.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { QCStorageService } from '../../../_services/QC_storage.services';

describe('QcUserNameComponent', () => {
  let component: QcUserNameComponent;
  let fixture: ComponentFixture<QcUserNameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QcUserNameComponent ],
      imports: [
        HttpClientTestingModule
        ],
        providers: [QCStorageService]
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
