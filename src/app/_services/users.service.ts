import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import User from '../_models/user';
import { AuthService } from '../_services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  //uri = 'http://localhost:4000/users';
  private uriUsers = environment.usersUrl;
  private uriJobs = environment.jobsUrl;
  private jobsProfilesURL = environment.jobsProfilesUrl;
  private avatarURL = environment.avatarURL;

  constructor(
    private authService: AuthService,
    private http: HttpClient) { }
/*
  getUsers() {
    return this
      .http
      .get(`${this.uriUsers}`);
  }
*/

  createHeader() {
      const headers= new HttpHeaders()
            .set('content-type', 'application/json');    
       return headers;
  }

  getUsers() {
    let headers = this.authService.createQCAuthorizationHeader();

    return this.http.get(`${this.uriUsers}`, {headers:headers}).
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
      let headers = this.authService.createQCAuthorizationHeader();

      return this.http.get(`${this.uriUsers}/${userId}`, {headers:headers}).
      pipe(
         map((data: User) => {
           return data;
         }), catchError( error => {
           return throwError( 'Something went wrong!' );
         })
      )
    }

    async getUserAsync(userId: any) {
      let headers = this.authService.createQCAuthorizationHeader();

      let data = await this.http.get(`${this.uriUsers}/${userId}`, {headers:headers}).toPromise().catch(()=>
      {
          return {};
      });
      return data;    
    }    

  addUser(obj: Object) {

    let headers = this.authService.createQCAuthorizationHeader();

    return this.http.post(`${this.uriUsers}`, JSON.stringify(obj), {headers: headers}).
    pipe(
       map((data: any) => {
         return data;
       }), catchError( error => {
         return throwError( 'Something went wrong!' );
       })
    )
  }

  updateUser(userId: number, obj: Object) {

    let headers = this.authService.createQCAuthorizationHeader();

    return this.http.put(`${this.uriUsers}/${userId}`, obj, {headers: headers}).
    pipe(
       map((data: any) => {
         return data;
       }), catchError( error => {
         return throwError( 'Something went wrong!' );
       })
    )
  }

  requestNewPassword(userId: Number, password: String) {
    
    let headers = this.authService.createQCAuthorizationHeader();

    let obj = {"password": password};
    
    return this.http.post(`${this.uriUsers}/${userId}/requestnewpassword`, obj, {headers: headers}).
    pipe(
       map((data: any) => {
         return data;
       }), catchError( error => {
         return throwError( 'Something went wrong!' );
       })
    )
  }

  changePassword(userId: Number, password: String) {
    
    let headers = this.authService.createQCAuthorizationHeader();

    let obj = {"new_password": password};
    
    return this.http.post(`${this.uriUsers}/${userId}/updatePassword`, obj, {headers: headers}).
    pipe(
       map((data: any) => {
         return data;
       }), catchError( error => {
         return throwError( 'Something went wrong!' );
       })
    )
  }  
  
  getJobApplisByUser(userId: Number) {

    let headers = this.authService.createQCAuthorizationHeader();

    //return this.http.get(`${this.uriJobs}/${userId}/jobapplies`).
    return this.http.get(`${this.jobsProfilesURL}/${userId}/applications`, {headers: headers}).
    pipe(
       map((data: any) => {
         return data;
       }), catchError( error => {
         return throwError( 'Something went wrong!' );
       })
    )
  }

  getUserProfileInJobEndPoint(userId: Number) {
    let headers = this.authService.createQCAuthorizationHeader();

    return this.http.get(`${this.jobsProfilesURL}/${userId}`, {headers: headers}).
    pipe(
       map((data: any) => {
         return data;
       }), catchError( error => {
         return throwError( 'Something went wrong!' );
       })
    )
  }

  deleteUser(userId: Number){
    let headers = this.authService.createQCAuthorizationHeader();

    return this.http.delete(`${this.uriUsers}/${userId}`, {headers: headers});
  }



  getUserAvatar(userId: Number) {
    let headers = this.authService.createQCAuthorizationHeader();

    return this.http.get(`${this.avatarURL}/user/${userId}/avatar`, {headers: headers}).
    pipe(
       map((data: any) => {
         return data;
       }), catchError( error => {
         return throwError( 'Something went wrong!' );
       })
    )
  }
}