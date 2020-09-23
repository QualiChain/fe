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
           })
        )
      }

}