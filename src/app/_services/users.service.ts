import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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
  private uriJobs = environment.jobsUrl;
  private jobsProfilesURL = environment.jobsProfilesUrl;

  constructor(private http: HttpClient) { }
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

    async getUserAsync(userId: any) {
    
      let data = await this.http.get(`${this.uriUsers}/${userId}`).toPromise().catch(()=>
      {
          return {};
      });
      return data;    
    }    

  addUser(obj: Object) {
    return this.http.post(`${this.uriUsers}`, JSON.stringify(obj), {headers: this.createHeader()}).
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
    //return this.http.get(`${this.uriJobs}/${userId}/jobapplies`).
    return this.http.get(`${this.jobsProfilesURL}/${userId}/applications`).
    pipe(
       map((data: any) => {
         return data;
       }), catchError( error => {
         return throwError( 'Something went wrong!' );
       })
    )
  }

  getUserProfileInJobEndPoint(userId: Number) {
    return this.http.get(`${this.jobsProfilesURL}/${userId}`).
    pipe(
       map((data: any) => {
         return data;
       }), catchError( error => {
         return throwError( 'Something went wrong!' );
       })
    )
  }

  deleteUser(userId: Number){
    return this.http.delete(`${this.uriUsers}/${userId}`);
  }



  getUserAvatar(userId: Number) {
    return this.http.get(`http://qualichain.epu.ntua.gr:5004/get/user/${userId}/avatar`).
    pipe(
       map((data: any) => {
         return data;
       }), catchError( error => {
         return throwError( 'Something went wrong!' );
       })
    )
  }
}