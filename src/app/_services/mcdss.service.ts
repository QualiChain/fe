import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
//import { filter } from 'rxjs/operators'
import { HttpClient } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AuthService } from '../_services/auth.service';

@Injectable({ providedIn: 'root' })
export class McdssService {
    
    private uriMCDSS = environment.mcdssURL;
    
    constructor(
      private authService: AuthService, 
      private http: HttpClient) { }
    
    postMCDSS(method: String, obj: Object) {
      
        let headers = this.authService.createQCAuthorizationHeader();

        return this.http.post(`${this.uriMCDSS}/${method}`, obj, { headers: headers }).
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
      
      //let headers = new Headers();
      //headers.append('Content-Type', 'application/json');
      let headers = this.authService.createQCAuthorizationHeaderForFormData();

      return this.http.post(`${this.uriMCDSS}/${method}/file`, formData, { headers: headers})
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