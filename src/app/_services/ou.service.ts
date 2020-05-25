import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { from, Observable, BehaviorSubject, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from './../../environments/environment';

//import { User } from '../_models/user';
import User from '../_models/user';
//import { exists } from 'fs';
import { CustomConfigEnvironmentDataService } from './customConfigEnvironmentData.service';

@Injectable({
  providedIn: 'root'
})
export class OUService {
 
  uri = environment.authUrl;
  //uri = 'http://localhost:4000/auth';

  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(private httpClient: HttpClient, private cs: CustomConfigEnvironmentDataService) {      
      this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
      this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
      return this.currentUserSubject.value;
  }
  
  getOUToken() {
    let obj = {
      "username" : this.cs.configData.OU_API_DATA.authentication.username,
      "password" :  this.cs.configData.OU_API_DATA.authentication.password
    };

    let endPoint = "/"+this.cs.configData.OU_API_DATA.authentication.endPoint;
    //console.log(endPoint);    
    return this.httpClient.post(`${endPoint}`, obj).
    pipe(
       map((data: any) => {
         //console.log(data);
         return data;
       }), catchError( error => {
         return throwError( 'Something went wrong!' );
       })
    )
  }

  createOUAuthorizationHeader(token: string) {
    
    const headers= new HttpHeaders()
        .set('content-type', 'application/json')
        .set('Authorization', 'Bearer '+token);

    return headers;
  }

  getRecipientsList(token: string) {    
    let endPoint = "/"+this.cs.configData.OU_API_DATA.apis.getRecipients;
    return this.httpClient.get(`${endPoint}`,{headers: this.createOUAuthorizationHeader(token)}).
    pipe(
       map((data: any) => {
         //console.log(data);
         return data;
       }), catchError( error => {
         return throwError( 'Something went wrong!' );
       })
    )
  }

  createBadge(token: string, obj: {}) {    
    let endPoint = "/"+this.cs.configData.OU_API_DATA.apis.createBadge;
    //console.log(endPoint);    
    return this.httpClient.post(`${endPoint}`, obj, {headers: this.createOUAuthorizationHeader(token)}).
    pipe(
       map((data: any) => {
         //console.log(data);
         return data;
       }), catchError( error => {
         return throwError( 'Something went wrong!' );
       })
    )
  }

  createBadgeIssuance(token: string, obj: {}) {    
    let endPoint = "/"+this.cs.configData.OU_API_DATA.apis.createNewBadgeIssuance;
    //console.log(endPoint);    
    return this.httpClient.post(`${endPoint}`, obj, {headers: this.createOUAuthorizationHeader(token)}).
    pipe(
       map((data: any) => {
         //console.log(data);
         return data;
       }), catchError( error => {
         return throwError( 'Something went wrong!' );
       })
    )
  }

  confirmBadgeIssuance(token: string, obj: {}) {    
    let endPoint = "/"+this.cs.configData.OU_API_DATA.apis.confirmBadgeIssuance;
    //console.log(endPoint);    
    return this.httpClient.post(`${endPoint}`, obj, {headers: this.createOUAuthorizationHeader(token)}).
    pipe(
       map((data: any) => {
         //console.log(data);
         return data;
       }), catchError( error => {
         return throwError( 'Something went wrong!' );
       })
    )
  }

  revokeBadgeIssuance(token: string, obj: {}) {    
    let endPoint = "/"+this.cs.configData.OU_API_DATA.apis.revokeBadgeIssuance;
    //console.log(endPoint);    
    return this.httpClient.post(`${endPoint}`, obj, {headers: this.createOUAuthorizationHeader(token)}).
    pipe(
       map((data: any) => {
         //console.log(data);
         return data;
       }), catchError( error => {
         return throwError( 'Something went wrong!' );
       })
    )
  }  

  getBadgesList(token: string) {    
    let endPoint = "/"+this.cs.configData.OU_API_DATA.apis.getBagdes;
    return this.httpClient.get(`${endPoint}`,{headers: this.createOUAuthorizationHeader(token)}).
    pipe(
       map((data: any) => {
         //console.log(data);
         return data;
       }), catchError( error => {
         return throwError( 'Something went wrong!' );
       })
    )
  }
  

}





