import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThesisEditComponent } from './thesis-edit.component';
import { AppComponent } from '../../../app.component';
import { QCStorageService } from '../../../_services/QC_storage.services';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from "@ngx-translate/core";
import { NotFoundComponent } from '../../../_components/utils/not-found/not-found.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

describe('ThesisEditComponent', () => {
  let component: ThesisEditComponent;
  let fixture: ComponentFixture<ThesisEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThesisEditComponent ],
      imports: [
        TranslateModule.forRoot(),
        HttpClientTestingModule,
        RouterTestingModule,
        RouterTestingModule.withRoutes(
          [{path: 'not_found', component: NotFoundComponent}]
        ),
        FormsModule,
        ReactiveFormsModule,
      ],
      providers: [AppComponent, QCStorageService]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThesisEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
