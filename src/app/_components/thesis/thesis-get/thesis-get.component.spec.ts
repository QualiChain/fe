import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThesisGetComponent } from './thesis-get.component';
import { AppComponent } from '../../../app.component';
import { QCStorageService } from '../../../_services/QC_storage.services';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from "@ngx-translate/core";
import { NotFoundComponent } from '../../../_components/utils/not-found/not-found.component';

describe('ThesisGetComponent', () => {
  let component: ThesisGetComponent;
  let fixture: ComponentFixture<ThesisGetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThesisGetComponent ],
      imports: [
        TranslateModule.forRoot(),
        HttpClientTestingModule,
        RouterTestingModule,
        RouterTestingModule.withRoutes(
          [{path: 'not_found', component: NotFoundComponent}]
        )
      ],
      providers: [AppComponent, QCStorageService]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThesisGetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
