import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { from, Observable, BehaviorSubject, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from './../../environments/environment';

//import { User } from '../_models/user';
import User from '../_models/user';
//import { exists } from 'fs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
 
  uri = environment.authUrl;
  userURL = environment.userUrl;
  //uri = 'http://localhost:4000/auth';

  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(private httpClient: HttpClient) {      
      this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
      this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
      return this.currentUserSubject.value;
  }
  

  logout() {
    console.log("logout auth.service.ts")
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }
  
  login(username, password) {
    const obj = { username: username, password: password};
    //console.log(obj);
    
    //let myAuthObj = {};
    let myAuthObj=  new User;
    
    return this.httpClient.post(`${this.uri}`, obj).
    pipe(
       map((data: any) => {

        myAuthObj = { authenticated: true,  password:'******', name: data.name, 
        surname: data.surname, email: data.email, 
        userName: data.userName, id: data.id , 'avatar_path': '', 'role': data.role, 'pilotId': data.pilotId};
      
        localStorage.setItem('currentUser', JSON.stringify(myAuthObj));

         return data;
       }), catchError( error => {
         return throwError( 'Something went wrong!' );
       })
    )
    }


    requestpassword(username, email) {
      const obj = { email: email};
      //console.log(obj);
      
      //let myAuthObj = {};
      let myAuthObj=  new User;
         
      return this.httpClient.post(`${this.userURL}`+"/${username}/resetPassword", obj).
      pipe(
         map((data: any) => {
           return data;
         }), catchError( error => {
           return throwError( 'Something went wrong!' );
         })
      )
      }

}





