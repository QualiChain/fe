import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import RecruitmentOrganisation from '../_models/recruitmentorganisation';
import { AuthService } from '../_services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RecruitmentOrganisationService {

    private recruitmentorganisationUrl = environment.recruitmentorganisationUrl;
    
  
    constructor(
      private authService: AuthService,  
      private http: HttpClient) { }


        getRecruitmentOrganisations() {
            let headers = this.authService.createQCAuthorizationHeader();

            return this.http.get(`${this.recruitmentorganisationUrl}`, {headers:headers}).
            pipe(
                map((data: RecruitmentOrganisation[]) => {
                    return data;
                }), catchError( error => {
                    return throwError( 'Something went wrong!' );
                })
            )
        }


        getRecruitmentOrganisation(recruitmentOrganisationId: Number) {
            let headers = this.authService.createQCAuthorizationHeader();

            return this.http.get(`${this.recruitmentorganisationUrl}/${recruitmentOrganisationId}`, {headers:headers}).
            pipe(
                map((data: RecruitmentOrganisation) => {
                    return data;
                }), catchError( error => {
                    return throwError( 'Something went wrong!' );
                })
            )
        }

}