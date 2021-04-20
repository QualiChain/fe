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
    private userURL = environment.userUrl;
  
    constructor(
      private authService: AuthService,  
      private http: HttpClient) { }

        //Get all academic organisations 
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

        //Get specific academic organization by id 
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

        //Create Academic Organisation 
        addAcademicOrganization(dataIn: any) {
            let headers = this.authService.createQCAuthorizationHeader();
    
            return this.http.post(`${this.academicorganisationURL}`, dataIn, {headers:headers}).
            pipe(
                map((data: any) => {
                    return data;
                }), catchError( error => {
                    return throwError( 'Something went wrong!' );
                })
            )
        }

        //Edit academic organization 
        updateAcademicOrganization(organizationId: number, dataIn: any) {
            let headers = this.authService.createQCAuthorizationHeader();
    
            return this.http.put(`${this.academicorganisationURL}/${organizationId}`, dataIn, {headers:headers}).
                pipe(
                    map((data: any) => {
                        return data;
                    }), catchError( error => {
                        return throwError( 'Something went wrong!' );
                    })
                )
        }

        //Delete academic organization by id 
        deleteAcademicOrganization(organizationId: Number) {
            let headers = this.authService.createQCAuthorizationHeader();
    
            return this.http.delete(`${this.academicorganisationURL}/${organizationId}`, {headers:headers}).
            pipe(
                map((data) => {
                    return data;
                }), catchError( error => {
                    return throwError( 'Something went wrong!' );
                })
            )
        }        

        //Add user-academic_organisation relation 
        addUserToAcademicOrganization(dataIn: any) {
            let headers = this.authService.createQCAuthorizationHeader();
    
            return this.http.post(`${this.userURL}/academicorganisation `, dataIn, {headers:headers}).
            pipe(
                map((data: any) => {
                    return data;
                }), catchError( error => {
                    return throwError( 'Something went wrong!' );
                })
            )
        }

        //Get all user-academic organisation relations of given organisation_id 
        getAllUserAcademicOrganizationByOrganizationId(academicOrganisationId: Number) {
            let headers = this.authService.createQCAuthorizationHeader();

            return this.http.get(`${this.userURL}/academicorganisation/${academicOrganisationId}`, {headers:headers}).
            pipe(
                map((data: AcademicOrganisation) => {
                    return data;
                }), catchError( error => {
                return throwError( 'Something went wrong!' );
                })
            )
        }
 
        //Delete all user-academic organisation relations of given organisation_id 
        deleteAllUserAcademicOrganizationByOrganizationId(academicOrganisationId: Number) {
            let headers = this.authService.createQCAuthorizationHeader();

            return this.http.delete(`${this.userURL}/academicorganisation/${academicOrganisationId}`, {headers:headers}).
            pipe(
                map((data) => {
                    return data;
                }), catchError( error => {
                return throwError( 'Something went wrong!' );
                })
            )
        }
 
        //Get all user-academic organisation relations of given user_id  
        getAllUserAcademicOrganizationByUserId(userId: Number) {
            let headers = this.authService.createQCAuthorizationHeader();

            return this.http.get(`${this.academicorganisationURL}/user/${userId}`, {headers:headers}).
            pipe(
                map((data: AcademicOrganisation) => {
                    return data;
                }), catchError( error => {
                    return throwError( 'Something went wrong!' );
                })
            )
        }

        //Delete all user-academic organisation relations of given user_id 
        deleteAllUserAcademicOrganizationByUserId(userId: Number) {
            let headers = this.authService.createQCAuthorizationHeader();

            return this.http.delete(`${this.academicorganisationURL}/user/${userId}`, {headers:headers}).
            pipe(
                map((data) => {
                    return data;
                }), catchError( error => {
                    return throwError( 'Something went wrong!' );
                })
            )
        }

        //Get user-academic_org relation by id 
        getUserAcademicOrganizationById(id: Number) {
            let headers = this.authService.createQCAuthorizationHeader();

            return this.http.get(`${this.academicorganisationURL}/${id}`, {headers:headers}).
            pipe(
                map((data: AcademicOrganisation) => {
                    return data;
                }), catchError( error => {
                    return throwError( 'Something went wrong!' );
                })
            )
        }
 
        //Delete user-academic_org relation by id 
        deleteUserAcademicOrganizationById(id: Number) {
            let headers = this.authService.createQCAuthorizationHeader();

            return this.http.get(`${this.academicorganisationURL}/${id}`, {headers:headers}).
            pipe(
                map((data) => {
                    return data;
                }), catchError( error => {
                    return throwError( 'Something went wrong!' );
                })
            )
        }

}