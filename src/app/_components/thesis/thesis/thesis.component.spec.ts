import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThesisComponent } from './thesis.component';
import { AppComponent } from '../../../app.component';
import { QCStorageService } from '../../../_services/QC_storage.services';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from "@ngx-translate/core";
import { NotFoundComponent } from '../../../_components/utils/not-found/not-found.component';
import {MatDialogModule} from '@angular/material/dialog';

describe('ThesisComponent', () => {
  let component: ThesisComponent;
  let fixture: ComponentFixture<ThesisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThesisComponent ],
      imports: [
        TranslateModule.forRoot(),
        HttpClientTestingModule,
        RouterTestingModule,
        RouterTestingModule.withRoutes(
          [{path: 'not_found', component: NotFoundComponent}]
        ),
        MatDialogModule
      ],
      providers: [AppComponent, QCStorageService]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThesisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
