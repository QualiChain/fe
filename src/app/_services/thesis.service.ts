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
export class ThesisService {
 
  uri = environment.thesisURL;
  //uri = 'http://localhost:4000/cvs';


  constructor(
    private authService: AuthService,
    private httpClient: HttpClient) {
  }

  getAllThesis() {
    let headers = this.authService.createQCAuthorizationHeader();
    return this
      .httpClient
      .get(`${this.uri}`, { headers: headers } );
  }   

  getThesisById(thesisId: any) {
      let headers = this.authService.createQCAuthorizationHeader();
      return this
        .httpClient
        .get(`${this.uri}/${thesisId}`, { headers: headers } );
  }   
          
  getThesisByProfessorId(userId: any) {
    let headers = this.authService.createQCAuthorizationHeader();
    return this
      .httpClient
      .get(`${this.uri}?professor_id=${userId}`, { headers: headers } );
  }   
  
  getThesisByStudentId(userId) {
    let headers = this.authService.createQCAuthorizationHeader();
    return this
      .httpClient
      .get(`${this.uri}?student_id=${userId}`, { headers: headers } );
  }
  
  deleteThesis(thesisId) {
    let headers = this.authService.createQCAuthorizationHeader();

    return this.httpClient.delete(`${this.uri}/${thesisId}`, {headers:headers}).
    pipe(
        map((data) => {
            return data;
        }), catchError( error => {
            return throwError( 'Something went wrong!' );
        })
    )
    }

    addThesis(dataIn: any) {
      let headers = this.authService.createQCAuthorizationHeader();

      return this.httpClient.post(`${this.uri}`, dataIn, {headers:headers}).
      pipe(
          map((data: any) => {
              return data;
          }), catchError( error => {
              return throwError( 'Something went wrong!' );
          })
      )
    }  

        
    updateThesis(thesisId: string, dataIn: any) {
      let headers = this.authService.createQCAuthorizationHeader();

      return this.httpClient.put(`${this.uri}/${thesisId}`, dataIn, {headers:headers}).
      pipe(
          map((data: any) => {
              return data;
          }), catchError( error => {
              return throwError( 'Something went wrong!' );
          })
      )
    }  

}
