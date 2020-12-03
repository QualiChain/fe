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
export class CVService {
 
  uri = environment.cvUrl;
  //uri = 'http://localhost:4000/cvs';

 

  constructor(
    private authService: AuthService,
    private httpClient: HttpClient) {
  }

  getCV(userId: any) {

    let headers = this.authService.createQCAuthorizationHeader();

    return this
      .httpClient
      .get(`${this.uri}/${userId}`, { headers: headers } );
    }   
  
  postCV(userId, dataIn:any) {

    let headers = this.authService.createQCAuthorizationHeader();

    const obj = dataIn;
    return this.httpClient.post(`${this.uri}`, JSON.stringify(dataIn), { headers: headers} );/*.
    pipe(
       map((data: any) => {
           console.log("post OK");
         return data;
       }), catchError( error => {
        console.log("post KO");
         return throwError( 'Something went wrong!' );
       })
    )
    */
    }



}
