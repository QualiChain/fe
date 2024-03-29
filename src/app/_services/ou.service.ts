import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { from, Observable, BehaviorSubject, throwError, fromEventPattern } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from './../../environments/environment';

//import { User } from '../_models/user';
import User from '../_models/user';
//import { exists } from 'fs';
import { CustomConfigEnvironmentDataService } from './customConfigEnvironmentData.service';
import { AuthService } from '../_services/auth.service';

//import {  HttpEventType, HttpResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OUService {
 
  uri = environment.authUrl;
  badgingURI = environment.badging;
  //uri = 'http://localhost:4000/auth';

  /*
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
*/
  constructor(
    private authService: AuthService,
    private httpClient: HttpClient, private cs: CustomConfigEnvironmentDataService) {      
     // this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
     // this.currentUser = this.currentUserSubject.asObservable();
  }
/*
  public get currentUserValue(): User {
      return this.currentUserSubject.value;
  }
 */ 

  //funtion used just to avoid testing errors as this is just a temporal service 
  getDefaultData() {

    return {
      "OU_API_DATA" : {
          "baseUrl": "http://localhost:4200",
          "authentication": {
              "endPoint": "qualichain/users/signin",
              "adminUser": {
                "username" : "<username>",
                "password" : "<password>"
            },
            "issuerUser": {
                "username" : "<username>",
                "password" : "<password>"
            }
          },
          "apis": {
              "createBadge": "qualichain/badges/create",
              "createNewBadgeIssuance": "qualichain/assertions/create",
              "confirmBadgeIssuance": "qualichain/assertions/issue",
              "revokeBadgeIssuance": "qualichain/assertions/revoke",
              "assertionsList": "qualichain/assertions/list",
              "getRecipients": "qualichain/recipients/list",
              "getBagdes": "qualichain/badges/list"
          }
      }
    }
  }

  getOUToken() {

    //funtion used just to avoid testing errors as this is just a temporal service 
    if (!this.cs.configData)
    {
      this.cs.configData = this.getDefaultData()
    }

    let obj = {
      "username" : this.cs.configData.OU_API_DATA.authentication.issuerUser.username,
      "password" :  this.cs.configData.OU_API_DATA.authentication.issuerUser.password
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

  getOUAdminToken() {

    //funtion used just to avoid testing errors as this is just a temporal service 
    if (!this.cs.configData)
    {
      this.cs.configData = this.getDefaultData()
    }

    let obj = {
      "username" : this.cs.configData.OU_API_DATA.authentication.adminUser.username,
      "password" :  this.cs.configData.OU_API_DATA.authentication.adminUser.password
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

    //funtion used just to avoid testing errors as this is just a temporal service 
    if (!this.cs.configData)
    {
      this.cs.configData = this.getDefaultData()
    }

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

    //funtion used just to avoid testing errors as this is just a temporal service 
    if (!this.cs.configData)
    {
      this.cs.configData = this.getDefaultData()
    }

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
    
    //funtion used just to avoid testing errors as this is just a temporal service 
    if (!this.cs.configData)
    {
      this.cs.configData = this.getDefaultData()
    }

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
    
    //funtion used just to avoid testing errors as this is just a temporal service 
    if (!this.cs.configData)
    {
      this.cs.configData = this.getDefaultData()
    }

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

    //funtion used just to avoid testing errors as this is just a temporal service 
    if (!this.cs.configData)
    {
      this.cs.configData = this.getDefaultData()
    }

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
    
    //funtion used just to avoid testing errors as this is just a temporal service 
    if (!this.cs.configData)
    {
      this.cs.configData = this.getDefaultData()
    }

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

  
  getAssertionsList(token: string) {    

    //funtion used just to avoid testing errors as this is just a temporal service 
    if (!this.cs.configData)
    {
      this.cs.configData = this.getDefaultData()
    }

    let endPoint = "/"+this.cs.configData.OU_API_DATA.apis.assertionsList;
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


  
  createBadgeV2(obj: {}) {

    let headers = this.authService.createQCAuthorizationHeader();

    let endPoint = this.badgingURI;
    //console.log(endPoint);    
    return this.httpClient.post(`${endPoint}/createSmartBadge`, obj, {headers: headers}).
    pipe(
       map((data: any) => {
         //console.log(data);
         return data;
       }), catchError( error => {
         //console.log(error);
         return throwError( error );
       })
    )
  }

  issueSmartBadgeV2(obj: {}) {

    let headers = this.authService.createQCAuthorizationHeader();

    let endPoint = this.badgingURI;
    //console.log(endPoint);    
    return this.httpClient.post(`${endPoint}/issueSmartBadge`, obj, {headers: headers}).
    pipe(
       map((data: any) => {
         //console.log(data);
         return data;
       }), catchError( error => {
         //console.log(error);
         return throwError( error );
       })
    )
  }

  verifySmartBadgeV2(obj: {}) {

    let headers = this.authService.createQCAuthorizationHeader();

    let endPoint = this.badgingURI;
    //console.log(endPoint);    
    return this.httpClient.post(`${endPoint}/verifySmartBadge`, obj, {headers: headers}).
    pipe(
       map((data: any) => {
         //console.log(data);
         return data;
       }), catchError( error => {
         //console.log(error);
         return throwError( error );
       })
    )
  }


  addSmartBadgeToImage(badge:{}, png: any) {

    //let headers = this.authService.createQCAuthorizationHeader();
    //let headers = this.authService.createQCAuthorizationHeaderForFormData();
    let headers = this.authService.createQCAuthorizationHeaderForFormDataReturnBlob();

    let endPoint = this.badgingURI;

    const formData: FormData = new FormData();
    formData.append('png', png, png.name);
    //formData.append('badge', JSON.stringify(badge));
    let newBadge = new Blob([JSON.stringify(badge)], {type : 'application/json'});
    formData.append('badge', newBadge);

    //console.log(endPoint);        

    //return this.httpClient.post(`${endPoint}/addSmartBadgeToImage`, formData, {headers: headers, responseType: 'text'});
//responseType: 'blob' as 'json'
    return this.httpClient.post(`${endPoint}/addSmartBadgeToImage`, formData, {headers: headers, 
      responseType: 'blob'
      })
    .pipe(
       map((data: any) => {
         return data;
       }), catchError( error => {
         return throwError( error );
       })
    )

   
  }

}





