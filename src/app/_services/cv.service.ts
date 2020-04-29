import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { from, Observable, BehaviorSubject, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from './../../environments/environment';


//import { exists } from 'fs';


@Injectable({
  providedIn: 'root'
})
export class CVService {
 
  uri = environment.cvUrl;
  //uri = 'http://localhost:4000/cvs';

 

  constructor(private httpClient: HttpClient) {
  }

  getCV(userId: Number) {
    return this
      .httpClient
      .get(`${this.uri}/${userId}`);
    }   
  
  postCV(userId, dataIn) {
    const obj = dataIn;
    
    return this.httpClient.post(`${this.uri}/${userId}`, obj).
    pipe(
       map((data: any) => {
           console.log("post OK");
         return data;
       }), catchError( error => {
        console.log("post KO");
         return throwError( 'Something went wrong!' );
       })
    )
    
    }



}
