import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecruitingComponent } from './recruiting.component';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FlashMessagesService } from 'angular2-flash-messages';
//import { FlashMessagesModule } from 'angular2-flash-messages';
import { ValidateService } from '../../_services/recruiting/validate.service'
import { AuthService } from '../../_services/recruiting/auth.service';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';


import { JwtModule, JWT_OPTIONS, JwtHelperService } from '@auth0/angular-jwt';
//import { MatDialogModule } from '@angular/material/dialog';
//import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from '../../../environments/environment';
import { TranslateModule } from "@ngx-translate/core";

export function tokenGetter() {
  return localStorage.getItem("access_token");
}

describe('RecruitingComponent', () => {
  let component: RecruitingComponent;
  let fixture: ComponentFixture<RecruitingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecruitingComponent ],
      imports: [
        TranslateModule.forRoot(),
        HttpClientTestingModule, FormsModule, ReactiveFormsModule,
        JwtModule.forRoot({
          config: {
            tokenGetter: tokenGetter,
            allowedDomains: environment.JwtModule.allowedDomains,
            disallowedRoutes: environment.JwtModule.disallowedRoutes,
          }}),
      ],
      providers: [ FlashMessagesService, ValidateService, AuthService ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecruitingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
});
