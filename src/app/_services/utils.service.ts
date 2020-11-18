import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import User from '../_models/user';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  private uriSelect = environment.selectUrl;
  private uriTextTriples = environment.insertTextTriples

  constructor(private http: HttpClient) { }

  createHeader() {
      const headers= new HttpHeaders()
            .set('content-type', 'application/json');    
       return headers;
  }

  getCountries() {
    return this.http.get(`${this.uriSelect}/location`).
    pipe(
       map((data: [any]) => {
         return data;
       }), catchError( error => {
         return throwError( 'Something went wrong!' );
       })
    )
  }

  getStatesByCountry(countryId: String) {
    return this.http.get(`${this.uriSelect}/location?country=${countryId}`).
    pipe(
       map((data: [any]) => {
         return data;
       }), catchError( error => {
         return throwError( 'Something went wrong!' );
       })
    )
  }

  getCitiesByState(stateId: String) {
    return this.http.get(`${this.uriSelect}/location?state=${stateId}`).
    pipe(
       map((data: [any]) => {
         return data;
       }), catchError( error => {
         return throwError( 'Something went wrong!' );
       })
    )
  }

  sendTextTriples(textTriples: String){

    return this.http.post(`${this.uriTextTriples}`, textTriples, { responseType: 'text'}).
        pipe(
            map((data: any) => {
                return data;
            }), catchError( error => {
                return throwError( 'Something went wrong!' );
            })
        )

  }


}