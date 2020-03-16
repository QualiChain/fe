import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { from, Observable, BehaviorSubject, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from './../../environments/environment';

import { User } from '../_models/user';
//import { exists } from 'fs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
 
  uri = environment.authUrl;
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

    if ((username=="student") && (password=="student")) {

      myAuthObj=  new User;
      //myAuthObj.authenticated = true;

      
      myAuthObj = {authenticated: true,  password:'*****', name: 'Dilbert', 
      surname: 'Adams', email: 'dilbert.adams@qualichain-project.eu', 
      username: 'dilbert.adams', id: 1 , 'avatar_path': 'assets/img/dilbert.jpg', 'role': 'student'};
      
      localStorage.setItem('currentUser', JSON.stringify(myAuthObj));
      this.currentUserSubject.next(myAuthObj);
    }
    else if ((username=="recruiter") && (password=="recruiter")) {

      
      myAuthObj = { authenticated: true,  password:'******', name: 'Recruiter', 
      surname: 'demo', email: 'recruiter.demo@qualichain-project.eu', 
      username: 'recruiter.demo', id: 5 , 'avatar_path': 'assets/img/recruiter.png', 'role': 'recruiter'};
      
      localStorage.setItem('currentUser', JSON.stringify(myAuthObj));
      
      this.currentUserSubject.next(myAuthObj);
    }
    

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
