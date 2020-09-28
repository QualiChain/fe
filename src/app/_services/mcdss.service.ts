import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
//import { filter } from 'rxjs/operators'
import { HttpClient } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class McdssService {
    
    private uriMCDSS = environment.mcdssURL;
    
    constructor(private http: HttpClient) { }
    
    postMCDSS(method: String, obj: Object) {
        return this.http.post(`${this.uriMCDSS}/${method}`, obj).
        pipe(
           map((data: any) => {
             return data;
           }), catchError( error => {
             //return throwError( 'Something went wrong!' );
             return throwError(error.message);
             //return throwError(error.error);
           })
        )
    }

    postMCDSSFile(method: String, formData: any) {
      //console.log("At Validate, Form Data:");
      //console.log(formData.get('Decision Matrix'))
      
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');

      return this.http.post(`${this.uriMCDSS}/${method}/file`, formData)
      .pipe(
        map((res: any) => {
          return res;
        }), catchError( error => {
          return throwError(error.message+": "+error.error );
          //return throwError( 'Something went wrong!' );
        })
      );
    }

      

}