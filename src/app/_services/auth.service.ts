import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { from, Observable, BehaviorSubject, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from './../../environments/environment';
import { QCStorageService } from './QC_storage.services';
//import { UsersService } from './users.service';
import {GlobalApp, StorageService} from '../_helpers/global';

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
  IAMtokenvalidation = environment.IAMtokenvalidation;
  IAMValidateTokenUrl = environment.IAMValidateTokenUrl;
  userURL = environment.userUrl;
  private uriUsers = environment.usersUrl;
  //uri = 'http://localhost:4000/auth';

  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(
    //private us: UsersService,
    public storageService: StorageService,
    private qcStorageService: QCStorageService,
    private httpClient: HttpClient) {      
      //this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
      this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(this.qcStorageService.QCDecryptData(localStorage.getItem('currentUserQC'))));
      
      this.currentUser = this.currentUserSubject.asObservable();
      /*
      this.storageService.watchStorage().subscribe((data:string) => {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(this.qcStorageService.QCDecryptData(localStorage.getItem('currentUserQC'))));
      })
      */
  }

  public get currentUserValue(): User {
      return this.currentUserSubject.value;
  }
  

  logout() {
    //console.log("logout auth.service.ts")
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    localStorage.removeItem('currentUserQC');
    localStorage.removeItem('userdataQC');
    localStorage.removeItem('token');
    //localStorage.removeItem('QC_seen_questionnaire');
    localStorage.removeItem('QC_course_search_term');
    localStorage.removeItem('QC_course_search_pagination_index');
    localStorage.removeItem('QC_course_search_sort_name');
    localStorage.removeItem('QC_course_search_sort_direction');
    localStorage.removeItem('QC_course_search_pagination_size');
    //delete jobs data
    localStorage.removeItem('QC_job_search_term');
    localStorage.removeItem('QC_job_search_hiringOrganization');
    localStorage.removeItem('QC_job_search_startDate');
    localStorage.removeItem('QC_job_search_endDate');
    localStorage.removeItem('QC_job_search_createdByMe');
    localStorage.removeItem('QC_job_search_sort_direction');
    localStorage.removeItem('QC_job_search_sort_name');
    localStorage.removeItem('QC_job_search_pagination_index');
    localStorage.removeItem('QC_job_search_pagination_size');

    //localStorage.removeItem('QCP');
    localStorage.removeItem('qc.candidatesList');
    localStorage.removeItem('qc.recruitment');

    localStorage.removeItem('last_skillsList');
    localStorage.removeItem('last_skillField');

    this.currentUserSubject.next(null);
  }
  
  createCurentUserData(data: any) {
    let myAuthObj = {};
    let roles = [];
    if (data.hasOwnProperty('roles')){
      roles = data.roles;
    }
    let organizations = [];
    if (data.hasOwnProperty('organizations')){
      if (typeof data.organizations=='object') {
        organizations = data.organizations;
      }      
    }

    myAuthObj = { authenticated: true,  password:'******', name: data.name, 
    surname: data.surname, email: data.email, 
    userName: data.userName, id: data.id , 'avatar_path': '', 'role': data.role, roles: roles, 'pilotId': data.pilotId, 'organizations': organizations};
  
    //localStorage.setItem('currentUser', JSON.stringify(myAuthObj));      
    let encryptedData = this.qcStorageService.QCEncryptData(JSON.stringify(myAuthObj));
    localStorage.setItem('currentUser', encryptedData);
    localStorage.setItem('currentUserQC', encryptedData);
    return myAuthObj;
  }

  login(username, password) {
    const obj = { username: username, password: password};
    //console.log(obj);
    
    let myAuthObj = {};
    //let myAuthObj=  new User;
    
    return this.httpClient.post(`${this.uri}`, obj).
    pipe(
       map((data: any) => {

        myAuthObj = this.createCurentUserData(data);

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

  async requestpasswordIAM(email) {

    let myAuthObj= {};
    const formData = new FormData();
    
    formData.append('email', email);
    
    
    let data:any = await this.httpClient.post(`${this.IAMAuthUrl}/changePassword`, formData).toPromise().catch(()=>
    {
        //if there is an error we return emty response
        return myAuthObj;
    });

    if (data.succeeded) {

      return data;

    }
    else {
      myAuthObj = data;
    }
    
    return myAuthObj; 

    
}

  createQCAuthorizationHeaderForFormDataReturnBlob(){
    let token = localStorage.getItem('token');      
    //let token = "AABBCCCDDD";
    let dataToReturn: any = null;

    if (token) {
      let headers = new HttpHeaders()
        .set('Accept','image/jpeg')
        .set('Authorization', token);

        dataToReturn = headers;
    }
    else {
      let headers = new HttpHeaders();

      dataToReturn = headers;
    }

    return dataToReturn;
  }

  createQCAuthorizationHeaderForFormData() {
    let token = localStorage.getItem('token');      
    //let token = "AABBCCCDDD";
    let dataToReturn: any = null;

    if (token) {
      let headers = new HttpHeaders()
        .set('Authorization', token);

        dataToReturn = headers;
    }
    else {
      let headers = new HttpHeaders();

      dataToReturn = headers;
    }

    return dataToReturn;
  }

  createQCAuthorizationHeader() {
      let token = localStorage.getItem('token');      
      //let token = "AABBCCCDDD";
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

  createQCAuthorizationHeaderText() {
    let token = localStorage.getItem('token');      
    //let token = "AABBCCCDDD";
    let dataToReturn: any = null;

    if (token) {
      let headers = new HttpHeaders()
        .set('content-type', 'text/plain')
        .set('Authorization', token);

        dataToReturn = headers;
    }
    else {
      let headers = new HttpHeaders()
      .set('content-type', 'text/plain');

      dataToReturn = headers;
    }

    return dataToReturn;
}

  async validateTokenIAMAsync() {
    let myAuthObj= {};
    let token = localStorage.getItem('token'); 
    const formData = new FormData();
    let headers = new HttpHeaders()    
      .set('Authorization', token);

    if (this.IAMtokenvalidation) {
      let data:any = await this.httpClient.post(`${this.IAMValidateTokenUrl}`, formData, {headers:headers}).toPromise().catch(()=>
      {
          //if there is an error we return emty response
          return myAuthObj;
      });


      if (data) {
        if ( data.hasOwnProperty('succeeded') ) {
          return data.succeeded;
        }
        else {
          return false;
        }
      }
      else {
        return false;
      }
    }
    else {
      return true;
    }

  }

  async loginIAMAsync(username: string, password: string) {
    
    let myAuthObj= {};
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    
    let data:any = await this.httpClient.post(`${this.IAMAuthUrl}/login`, formData).toPromise().catch(()=>
    {
        //if there is an error we return emty response
        return myAuthObj;
    });

    if (data.succeeded) {
      localStorage.setItem('token', data.response_data.token); 
      let userID = data.response_data.user.id;
      let userQCData: any = await this.getUserAsyncInAuth(userID);
      userQCData['roles'] = data.response_data.user.roles;
      userQCData['organizations'] = data.response_data.user.organizations;
      
      if (userQCData.hasOwnProperty('id')){
        myAuthObj = this.createCurentUserData(userQCData);
        //localStorage.setItem('token', data.response_data.token); 
      }
      else {
        myAuthObj = { authenticated: false, message: ""};
        localStorage.removeItem('token');
      }

    }
    else {
      myAuthObj = { authenticated: false, message: data.message }
    }
    
    return myAuthObj;    

  }

  async getUserAsyncInAuth(userId: any) {
    let headers = this.createQCAuthorizationHeader();

    let data = await this.httpClient.get(`${this.uriUsers}/${userId}`, {headers:headers}).toPromise().catch(()=>
    {
        return {};
    });
    return data;    
  }     

  loginIAM(username: string, password: string) {
      
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
          
          //let dataP = this.recoverPerimissionsAsync();
          //console.log(dataP);

          //console.log(data);
          if (data.succeeded) {

            myAuthObj = this.createCurentUserData(data);
            /*
            myAuthObj = { authenticated: true,  password:'******', name: data.response_data.user.name, 
            surname: 'surname', email: data.response_data.user.email, 
            userName: 'name', id: data.response_data.user.id , 'avatar_path': '', 'role': 'authenticated', 'roles': data.response_data.user.roles, 'pilotId': null};
          
            //localStorage.setItem('currentUser', JSON.stringify(myAuthObj));        
            let encryptedData = this.qcStorageService.QCEncryptData(JSON.stringify(myAuthObj));

            localStorage.setItem('currentUserQC', encryptedData);  
            */      
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

      if (!currentLogedUser) {
        currentLogedUser = JSON.parse(this.qcStorageService.QCDecryptData(localStorage.getItem('userdataQC')));
      }

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





