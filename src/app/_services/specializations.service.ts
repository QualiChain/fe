import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SpecializationsService {

  
    private specializationsURL = environment.specializationsURL;
  
    constructor(private http: HttpClient) { }    

    getSpecializations() {
        return this.http.get(`${this.specializationsURL}`).
        pipe(
           map((data: any) => {
             return data;
           }), catchError( error => {
             return throwError( 'Something went wrong!' );
           })
        )
      } 
    
      getSpecialization(specializationId: number) {
        return this.http.get(`${this.specializationsURL}/${specializationId}`).
        pipe(
           map((data: any) => {
             return data;
           }), catchError( error => {
             return throwError( 'Something went wrong!' );
           })
        )
      }    

}    