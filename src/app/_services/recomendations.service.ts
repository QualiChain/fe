import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import User from '../_models/user';

@Injectable({
  providedIn: 'root'
})
export class RecomendationsService {

  private uriRecomendations = environment.recomendationsUrl;
  

  constructor(private http: HttpClient) { }

  getRecomendationsSkills(userId: Number) {    
    return this.http.get(`${this.uriRecomendations}/${userId}/skills`).
    pipe(
       map((data: any) => {
         return data;
       }), catchError( error => {
         return throwError( 'Something went wrong!' );
       })
    )
  }

  getRecomendationsCourses(userId: Number) {    
    return this.http.get(`${this.uriRecomendations}/${userId}/courses`).
    pipe(
       map((data: any) => {
         return data;
       }), catchError( error => {
         return throwError( 'Something went wrong!' );
       })
    )
  }


  getRecomendationsJobs(userId: Number) {    
    return this.http.get(`${this.uriRecomendations}/${userId}/jobs`).
    pipe(
       map((data: any) => {
         return data;
       }), catchError( error => {
         return throwError( 'Something went wrong!' );
       })
    )
  }  

}