import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { from, Observable, BehaviorSubject, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from './../../environments/environment';
import { AuthService } from '../_services/auth.service';

//import { exists } from 'fs';


@Injectable({
  providedIn: 'root'
})
export class CVService {
 
  uri = environment.cvUrl;
  uriSkillCV = environment.skillsCV;
  //uri = 'http://localhost:4000/cvs';

 

  constructor(
    private authService: AuthService,
    private httpClient: HttpClient) {
  }

  getCV(userId: any) {

    let headers = this.authService.createQCAuthorizationHeader();

    return this
      .httpClient
      .get(`${this.uri}/${userId}`, { headers: headers } );
  }   

  getPercentatgeCompletenessCV(userId: any) {

    let headers = this.authService.createQCAuthorizationHeader();
  
    return this
      .httpClient
      .get(`${this.uri}/${userId}/percentage`, { headers: headers } );
  }  

  postCV(userId, dataIn:any) {
    //userId is not needed  into the URL
    //the content type must be text/plain
    //the response of the API is text
    let headers = this.authService.createQCAuthorizationHeaderText();

    const obj = dataIn;
    //return this.httpClient.post(`${this.uri}`, JSON.stringify(dataIn), { headers: headers} ).
    return this.httpClient.post(`${this.uri}`, dataIn, { headers: headers, responseType: 'text'} ).    
    pipe(
       map((data: any) => {
           //console.log("post OK");
           //console.log(data);
         return data;
       }), catchError( error => {
        console.log("post KO");
         return throwError( 'Something went wrong!' );
       })
    )
    
    }

    updateCVByUserId(userId, dataIn:any) {
      //userId is not needed  into the URL
      //the content type must be text/plain
      //the response of the API is text
      let headers = this.authService.createQCAuthorizationHeaderText();
  
      const obj = dataIn;
      //return this.httpClient.post(`${this.uri}`, JSON.stringify(dataIn), { headers: headers} ).
      return this.httpClient.put(`${this.uri}/${userId}`, dataIn, { headers: headers, responseType: 'text'} ).    
      pipe(
         map((data: any) => {
             //console.log("post OK");
             //console.log(data);
           return data;
         }), catchError( error => {
          console.log("post KO");
           return throwError( 'Something went wrong!' );
         })
      )
      
    }    

    getCompetencesByUser(userId:string) {
      let headers = this.authService.createQCAuthorizationHeader();

      return this.httpClient.get(`${this.uri}/${userId}/skillsRefs`, {headers:headers}).
      pipe(
          map((data: []) => {
              return data;
          }), catchError( error => {
              return throwError( 'Something went wrong!' );
          })
      )
    }

    addSkilCompetence(userId:string, dataIn: any) {
      //let headers = this.authService.createQCAuthorizationHeader();
      let headers = this.authService.createQCAuthorizationHeaderText();

      return this.httpClient.post(`${this.uri}/${userId}/skills`, dataIn, {headers:headers}).
      pipe(
          map((data: any) => {
              return data;
          }), catchError( error => {
              return throwError( 'Something went wrong!' );
          })
      )
    }  

    updateSkilCompetence(userId:string, dataIn: any) {
      //let headers = this.authService.createQCAuthorizationHeader();
      let headers = this.authService.createQCAuthorizationHeaderText();

      return this.httpClient.put(`${this.uri}/${userId}/skills`, dataIn, {headers:headers}).
      pipe(
          map((data: any) => {
              return data;
          }), catchError( error => {
              return throwError( 'Something went wrong!' );
          })
      )
    }

  getCompetencesSkills() {
    let headers = this.authService.createQCAuthorizationHeader();

    //return this.httpClient.get(`${this.uri}/${userId}/skillsRefs`, {headers:headers}).
    return this.httpClient.get(`${this.uriSkillCV}`, {headers:headers}).
    pipe(
        map((data: []) => {
            return data;
        }), catchError( error => {
            return throwError( 'Something went wrong!' );
        })
    )
  }  

}
