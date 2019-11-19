import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { from, Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
 
  uri = environment.authUrl;
  //uri = 'http://localhost:4000/auth';

  constructor(private httpClient: HttpClient) { }

  login(username, password) {
    const obj = { username: username, password: password};
    //console.log(obj);
    
    return this.httpClient.post(`${this.uri}`, obj).
    pipe(
       map((data: any) => {
         return data;
       }), catchError( error => {
         return throwError( 'Something went wrong!' );
       })
    )
    }



}
