import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import AcademicOrganisation from '../_models/academicorganisation';
import { AuthService } from '../_services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AcademicOrganisationService {

    private academicorganisationURL = environment.academicorganisationUrl;
    
  
    constructor(
      private authService: AuthService,  
      private http: HttpClient) { }


        getAcademicOrganizations() {
            let headers = this.authService.createQCAuthorizationHeader();

            return this.http.get(`${this.academicorganisationURL}`, {headers:headers}).
            pipe(
                map((data: AcademicOrganisation[]) => {
                    return data;
                }), catchError( error => {
                    return throwError( 'Something went wrong!' );
                })
            )
        }


        getAcademicOrganization(academicOrganisationId: Number) {
            let headers = this.authService.createQCAuthorizationHeader();

            return this.http.get(`${this.academicorganisationURL}/${academicOrganisationId}`, {headers:headers}).
            pipe(
                map((data: AcademicOrganisation) => {
                    return data;
                }), catchError( error => {
                    return throwError( 'Something went wrong!' );
                })
            )
        }

}