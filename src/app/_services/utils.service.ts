import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import User from '../_models/user';
import { AuthService } from '../_services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  private uriSelect = environment.selectUrl;
  private uriTextTriples = environment.insertTextTriples
  private uriQuestionnaire = environment.questionnaireURL;

  constructor(
    private authService: AuthService,
    private http: HttpClient) { }

  createHeader() {
      const headers= new HttpHeaders()
            .set('content-type', 'application/json');    
       return headers;
  }

  getCountries() {
    let headers = this.authService.createQCAuthorizationHeader();

    return this.http.get(`${this.uriSelect}/location`, { headers:headers } ).
    pipe(
       map((data: [any]) => {
         return data;
       }), catchError( error => {
         return throwError( 'Something went wrong!' );
       })
    )
  }

  getStatesByCountry(countryId: String) {
    let headers = this.authService.createQCAuthorizationHeader();

    return this.http.get(`${this.uriSelect}/location?country=${countryId}`, { headers:headers }).
    pipe(
       map((data: [any]) => {
         return data;
       }), catchError( error => {
         return throwError( 'Something went wrong!' );
       })
    )
  }

  getCitiesByState(stateId: String) {
    let headers = this.authService.createQCAuthorizationHeader();

    return this.http.get(`${this.uriSelect}/location?state=${stateId}`, { headers:headers }).
    pipe(
       map((data: [any]) => {
         return data;
       }), catchError( error => {
         return throwError( 'Something went wrong!' );
       })
    )
  }

  sendTextTriples(textTriples: String){
    let headers = this.authService.createQCAuthorizationHeader();

    return this.http.post(`${this.uriTextTriples}`, textTriples, { headers:headers, responseType: 'text'}).
        pipe(
            map((data: any) => {
                return data;
            }), catchError( error => {
                return throwError( 'Something went wrong!' );
            })
        )

  }

  postQuestionnaire(dataToPost){
    let headers = this.authService.createQCAuthorizationHeader();

    return this.http.post(`${this.uriQuestionnaire}`, dataToPost, { headers:headers}).
        pipe(
            map((data: any) => {
                return data;
            }), catchError( error => {
                return throwError( 'Something went wrong!' );
            })
        )

  }

}