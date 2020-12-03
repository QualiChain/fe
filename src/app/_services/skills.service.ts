import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AuthService } from '../_services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class SkillsService {

  
  private skillsURL = environment.skillsUrl;
  
  constructor(
    private authService: AuthService,
    private http: HttpClient) { }

  addSkill(dataIn: any) {
    let headers = this.authService.createQCAuthorizationHeader();

    return this.http.post(`${this.skillsURL}`, dataIn, {headers:headers}).
    pipe(
       map((data: any) => {
         return data;
       }), catchError( error => {
         return throwError( 'Something went wrong!' );
       })
    )
  }  

  updateSkill(skillId: number, dataIn: any) {
    let headers = this.authService.createQCAuthorizationHeader();

    return this.http.put(`${this.skillsURL}/${skillId}`, dataIn, {headers:headers}).
    pipe(
       map((data: any) => {
         return data;
       }), catchError( error => {
         return throwError( 'Something went wrong!' );
       })
    )
  }  

  getSkills() {
    let headers = this.authService.createQCAuthorizationHeader();

    return this.http.get(`${this.skillsURL}`, {headers:headers}).
    pipe(
       map((data: any) => {
         return data;
       }), catchError( error => {
         return throwError( 'Something went wrong!' );
       })
    )
  } 

  getSkill(skillId: number) {
    let headers = this.authService.createQCAuthorizationHeader();

    return this.http.get(`${this.skillsURL}/${skillId}`, {headers:headers}).
    pipe(
       map((data: any) => {
         return data;
       }), catchError( error => {
         return throwError( 'Something went wrong!' );
       })
    )
  } 

  deleteSkill(skillId: number) {
    let headers = this.authService.createQCAuthorizationHeader();

    return this.http.delete(`${this.skillsURL}/${skillId}`, {headers:headers}).
    pipe(
       map((data: any) => {
         return data;
       }), catchError( error => {
         return throwError( 'Something went wrong!' );
       })
    )
  } 
   

}
