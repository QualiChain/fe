import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SkillsService {

  
  private skillsURL = environment.skillsUrl;
  
  constructor(private http: HttpClient) { }

  addSkill(dataIn: any) {
    return this.http.post(`${this.skillsURL}`, dataIn).
    pipe(
       map((data: any) => {
         return data;
       }), catchError( error => {
         return throwError( 'Something went wrong!' );
       })
    )
  }  
  
  getSkills() {
    return this.http.get(`${this.skillsURL}`).
    pipe(
       map((data: any) => {
         return data;
       }), catchError( error => {
         return throwError( 'Something went wrong!' );
       })
    )
  } 

  getSkill(skillId: number) {
    return this.http.get(`${this.skillsURL}/${skillId}`).
    pipe(
       map((data: any) => {
         return data;
       }), catchError( error => {
         return throwError( 'Something went wrong!' );
       })
    )
  } 

  deleteSkill(skillId: number) {
    return this.http.delete(`${this.skillsURL}/${skillId}`).
    pipe(
       map((data: any) => {
         return data;
       }), catchError( error => {
         return throwError( 'Something went wrong!' );
       })
    )
  } 
   

}
