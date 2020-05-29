import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import User from '../_models/user';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  //uri = 'http://localhost:4000/users';
  private uriUsers = environment.usersUrl;

  constructor(private http: HttpClient) { }
/*
  getUsers() {
    return this
      .http
      .get(`${this.uriUsers}`);
  }
*/
  getUsers() {
    return this.http.get(`${this.uriUsers}`).
    pipe(
       map((data: [User]) => {
         return data;
       }), catchError( error => {
         return throwError( 'Something went wrong!' );
       })
    )
  }

/*
  getUser(userId: Number) {
    return this
      .http
      .get(`${this.uriUsers}/${userId}`);
    }  
*/
    getUser(userId: any) {
      return this.http.get(`${this.uriUsers}/${userId}`).
      pipe(
         map((data: User) => {
           return data;
         }), catchError( error => {
           return throwError( 'Something went wrong!' );
         })
      )
    }

  addUser(obj: Object) {
    return this.http.post(`${this.uriUsers}`, JSON.stringify(obj)).
    pipe(
       map((data: any) => {
         return data;
       }), catchError( error => {
         return throwError( 'Something went wrong!' );
       })
    )
  }

  updateUser(userId: number, obj: Object) {
    return this.http.put(`${this.uriUsers}/${userId}`, obj).
    pipe(
       map((data: any) => {
         return data;
       }), catchError( error => {
         return throwError( 'Something went wrong!' );
       })
    )
  }

  requestNewPassword(userId: Number, password: String) {
    
    let obj = {"password": password};
    
    return this.http.post(`${this.uriUsers}/${userId}/requestnewpassword`, obj).
    pipe(
       map((data: any) => {
         return data;
       }), catchError( error => {
         return throwError( 'Something went wrong!' );
       })
    )
  }

  changePassword(userId: Number, password: String) {
    
    let obj = {"new_password": password};
    
    return this.http.post(`${this.uriUsers}/${userId}/updatePassword`, obj).
    pipe(
       map((data: any) => {
         return data;
       }), catchError( error => {
         return throwError( 'Something went wrong!' );
       })
    )
  }  
  
  getJobApplisByUser(userId: Number) {
    return this.http.get(`${this.uriUsers}/${userId}/jobapplies`).
    pipe(
       map((data: any) => {
         return data;
       }), catchError( error => {
         return throwError( 'Something went wrong!' );
       })
    )
  }

}