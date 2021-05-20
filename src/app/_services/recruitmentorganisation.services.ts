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
    private userURL = environment.userUrl;
  
    constructor(
      private authService: AuthService,  
      private http: HttpClient) { }

        //Get all recruitment organisations
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

        //Get specific recruitment organization by id 
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

        //Create Recruitment Organisation  
        addRecruitmentOrganization(dataIn: any) {
            let headers = this.authService.createQCAuthorizationHeader();
    
            return this.http.post(`${this.recruitmentorganisationUrl}`, dataIn, {headers:headers}).
            pipe(
                map((data: any) => {
                    return data;
                }), catchError( error => {
                    return throwError( 'Something went wrong!' );
                })
            )
        }

        //Edit recruitment organization  
        updateRecruitmentOrganization(organizationId: number, dataIn: any) {
            let headers = this.authService.createQCAuthorizationHeader();
    
            return this.http.put(`${this.recruitmentorganisationUrl}/${organizationId}`, dataIn, {headers:headers}).
                pipe(
                    map((data: any) => {
                        return data;
                    }), catchError( error => {
                        return throwError( 'Something went wrong!' );
                    })
                )
        }

        //Delete recruitment organization by id 
        deleteAcademicOrganization(organizationId: Number) {
            let headers = this.authService.createQCAuthorizationHeader();
    
            return this.http.delete(`${this.recruitmentorganisationUrl}/${organizationId}`, {headers:headers}).
            pipe(
                map((data) => {
                    return data;
                }), catchError( error => {
                    return throwError( 'Something went wrong!' );
                })
            )
        }

        //Add user-recruitment_organisation relation 
        addUserToRecruitmentOrganization(dataIn: any) {
            let headers = this.authService.createQCAuthorizationHeader();
    
            return this.http.post(`${this.userURL}/recruitmentorganisation`, dataIn, {headers:headers}).
            pipe(
                map((data: any) => {
                    return data;
                }), catchError( error => {
                    return throwError( 'Something went wrong!' );
                })
            )
        }


        //Get all user-academic organisation relations of given organisation_id 
        getAllUserRecruitmentOrganizationByOrganizationId(recruitmentOrganisationId: Number) {
            let headers = this.authService.createQCAuthorizationHeader();

            return this.http.get(`${this.userURL}/recruitmentorganisation/${recruitmentOrganisationId}`, {headers:headers}).
            pipe(
                map((data: any[]) => {
                    return data;
                }), catchError( error => {
                    return throwError( 'Something went wrong!' );
                })
            )
        }

        //Delete all user-recruitment organisation relations of given organisation_id 
        deleteAllUserReruiterOrganizationByOrganizationId(recruitmentOrganisationId: Number) {
            let headers = this.authService.createQCAuthorizationHeader();

            return this.http.delete(`${this.userURL}/recruitmentorganisation/${recruitmentOrganisationId}`, {headers:headers}).
            pipe(
                map((data) => {
                    return data;
                }), catchError( error => {
                    return throwError( 'Something went wrong!' );
                })
            )
        }

        //Get all user-recruitment organisation relations of given user_id 
        getAllUserRecruitmentOrganizationByUserId(userId: Number) {
            let headers = this.authService.createQCAuthorizationHeader();

            return this.http.get(`${this.recruitmentorganisationUrl}/user/${userId}`, {headers:headers}).
            pipe(
                map((data: any[]) => {
                    return data;
                }), catchError( error => {
                    return throwError( 'Something went wrong!' );
                })
            )
        }

        //Delete all user-recruitment organisation relations of given user_id  
        deleteAllUserRecruitmentOrganizationByUserId(userId: Number) {
            let headers = this.authService.createQCAuthorizationHeader();

            return this.http.delete(`${this.recruitmentorganisationUrl}/user/${userId}`, {headers:headers}).
            pipe(
                map((data) => {
                    return data;
                }), catchError( error => {
                    return throwError( 'Something went wrong!' );
                })
            )
        }

        //Get user-recruitment_org relation by id  
        getUserRecruitmentOrganizationById(id: Number) {
            let headers = this.authService.createQCAuthorizationHeader();

            return this.http.get(`${this.recruitmentorganisationUrl}/${id}`, {headers:headers}).
            pipe(
                map((data: RecruitmentOrganisation) => {
                    return data;
                }), catchError( error => {
                    return throwError( 'Something went wrong!' );
                })
            )
        }

        //Delete user-recruitment_org relation by id 
        deleteUserRecruitmentOrganizationById(id: Number) {
            let headers = this.authService.createQCAuthorizationHeader();

            return this.http.get(`${this.recruitmentorganisationUrl}/${id}`, {headers:headers}).
            pipe(
                map((data) => {
                    return data;
                }), catchError( error => {
                    return throwError( 'Something went wrong!' );
                })
            )
        }

}