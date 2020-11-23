import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { from, Observable, BehaviorSubject, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from './../../environments/environment';
import { QCStorageService } from './QC_storage.services';

//import { User } from '../_models/user';
import User from '../_models/user';
//import { exists } from 'fs';
import { exit } from 'process';
import permissionsByRoleTest from "../_helpers/permissionsByRole";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
 
  uri = environment.authUrl;
  permissionsUrl = environment.permissionsUrl;
  IAMAuthUrl = environment.IAMAuthUrl;
  userURL = environment.userUrl;
  //uri = 'http://localhost:4000/auth';

  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(
    private qcStorageService: QCStorageService,
    private httpClient: HttpClient) {      
      //this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
      this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(this.qcStorageService.QCDecryptData(localStorage.getItem('currentUserQC'))));
      this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
      return this.currentUserSubject.value;
  }
  

  logout() {
    //console.log("logout auth.service.ts")
    // remove user from local storage to log user out
    localStorage.removeItem('currentUserQC');
    localStorage.removeItem('userdataQC');
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
  }
  
  login(username, password) {
    const obj = { username: username, password: password};
    //console.log(obj);
    
    let myAuthObj = {};
    //let myAuthObj=  new User;
    
    return this.httpClient.post(`${this.uri}`, obj).
    pipe(
       map((data: any) => {

        myAuthObj = { authenticated: true,  password:'******', name: data.name, 
        surname: data.surname, email: data.email, 
        userName: data.userName, id: data.id , 'avatar_path': '', 'role': data.role, roles: [], 'pilotId': data.pilotId};
      
        //localStorage.setItem('currentUser', JSON.stringify(myAuthObj));        
        let encryptedData = this.qcStorageService.QCEncryptData(JSON.stringify(myAuthObj));
        localStorage.setItem('currentUserQC', encryptedData);        

         //return data;
         return  myAuthObj;
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
         
      return this.httpClient.post(`${this.userURL}`+"/"+`${username}`+"/resetPassword", obj).
      pipe(
         map((data: any) => {
           return data;
         }), catchError( error => {
           return throwError( 'Something went wrong!' );
         })
      )
  }


  createQCAuthorizationHeader() {
      let token = localStorage.getItem('token');
      //token = "AABBCCCDDD";
      let dataToReturn: any = null;

      if (token) {
        let headers = new HttpHeaders()
          .set('content-type', 'application/json')
          .set('Authorization', token);

          dataToReturn = headers;
      }
      else {
        let headers = new HttpHeaders()
        .set('content-type', 'application/json');

        dataToReturn = headers;
      }

      return dataToReturn;
  }      


  loginIAM(username, password) {
      
      const formData = new FormData();
      formData.append('username', username);
      formData.append('password', password);
      //console.log(obj);
      
      //let myAuthObj = {};
      //let myAuthObj=  new User;
      let myAuthObj= {};
      
      return this.httpClient.post(`${this.IAMAuthUrl}/login`, formData).
      pipe(
         map((data: any) => {
          
          //console.log(data);
          if (data.succeeded) {
            myAuthObj = { authenticated: true,  password:'******', name: data.response_data.user.name, 
            surname: 'surname', email: data.response_data.user.email, 
            userName: 'name', id: data.response_data.user.id , 'avatar_path': '', 'role': 'authenticated', 'roles': data.response_data.user.roles, 'pilotId': null};
          
            //localStorage.setItem('currentUser', JSON.stringify(myAuthObj));        
            let encryptedData = this.qcStorageService.QCEncryptData(JSON.stringify(myAuthObj));

            localStorage.setItem('currentUserQC', encryptedData);        
            localStorage.setItem('token', data.response_data.token); 
          }
          else {
            myAuthObj = { authenticated: false, message: data.message }
          }
          
          return myAuthObj;
          

         }), catchError( error => {
           return throwError( 'Something went wrong!' );
         })
      )
  }

    
  public checkIfPermissionsExistsByUserRoles(value: string | string[]) {
    //console.log(value);
    let currentLogedUser: any;
    this.currentUser.subscribe(x => currentLogedUser = x);
      let authorized = false;
      if (currentLogedUser) {
          for (const elementV of value) {
            //let permissionsByRole = permissionsByRoleTest;
            let permissionsByRole = JSON.parse(this.qcStorageService.QCDecryptData(localStorage.getItem('QCP')));
            //console.log(permissionsByRole);

              if (permissionsByRole[elementV]) {                      
                  for (const pRole of permissionsByRole[elementV]) {
                      //check if logged user has this role
                      if (currentLogedUser.hasOwnProperty('role')) {
                          if (currentLogedUser['role']===pRole) {
                              authorized = true;
                              return true;
                              //exit;
                          }
                      }
                      if (currentLogedUser.hasOwnProperty('roles')) {                              
                          let posRoleInArray = currentLogedUser['roles'].indexOf(pRole);
                          if (posRoleInArray > -1) {
                              authorized = true;
                              return true;
                              //exit;
                          }
                      }
                  }
              }
          }
      }
      return authorized;
  }
       
  
  async recoverPerimissionsAsync() {
    
    let data = await this.httpClient.get(`${this.permissionsUrl}`).toPromise().catch(()=>
    {
        return {};
    });
    //console.log(data);
    return data;    
  }    

    
}





