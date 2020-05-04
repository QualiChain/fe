import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  //uri = 'http://localhost:4000/users';
  private uriUsers = environment.usersUrl;

  constructor(private http: HttpClient) { }

  getUsers() {
    return this
      .http
      .get(`${this.uriUsers}`);
  }

  getUser(userId: Number) {
    return this
      .http
      .get(`${this.uriUsers}/${userId}`);
    }  


  addUser(obj: Object) {
    return this.http.post(`${this.uriUsers}`, obj).
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

}