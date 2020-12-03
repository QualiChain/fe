import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AuthService } from '../_services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class SpecializationsService {

  
    private specializationsURL = environment.specializationsURL;
  
    constructor(
      private authService: AuthService,
      private http: HttpClient) { }    

    getSpecializations() {

      let headers = this.authService.createQCAuthorizationHeader();

        return this.http.get(`${this.specializationsURL}`, {headers:headers}).
        pipe(
           map((data: any) => {
             return data;
           }), catchError( error => {
             return throwError( 'Something went wrong!' );
           })
        )
      } 
    
      getSpecialization(specializationId: number) {

        let headers = this.authService.createQCAuthorizationHeader();
        
        return this.http.get(`${this.specializationsURL}/${specializationId}`, {headers:headers}).
        pipe(
           map((data: any) => {
             return data;
           }), catchError( error => {
             return throwError( 'Something went wrong!' );
           })
        )
      }    

}    