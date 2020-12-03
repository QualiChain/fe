import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
//import { filter } from 'rxjs/operators'
import { HttpClient } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AuthService } from '../_services/auth.service';

@Injectable({ providedIn: 'root' })
export class MessageService {    
    private subject = new Subject<any>();
    private uriNotifications = environment.notificationsURL;
    private uriNotificationsPreferences = environment.notificationPreferences;
    
    constructor(
      private authService: AuthService,
      private http: HttpClient) { }

    sendNotification(obj: Object) {
      let headers = this.authService.createQCAuthorizationHeader();

        return this.http.post(`${this.uriNotifications}`, obj, {headers:headers}).
        pipe(
           map((data: any) => {
             return data;
           }), catchError( error => {
             return throwError( 'Something went wrong!' );
           })
        )
      }

    changeNotificationStatus(notificationId: number, obj: Object) {
      let headers = this.authService.createQCAuthorizationHeader();

      return this.http.post(`${this.uriNotifications}/${notificationId}`, obj, {headers:headers}).
      pipe(
          map((data: any) => {
            return data;
          }), catchError( error => {
            return throwError( 'Something went wrong!' );
          })
      )
    }

    deleteNotification(notificationId: number) {
      let headers = this.authService.createQCAuthorizationHeader();

      return this.http.delete(`${this.uriNotifications}/${notificationId}`, {headers:headers}).
      pipe(
          map((data: any) => {
            return data;
          }), catchError( error => {
            return throwError( 'Something went wrong!' );
          })
      )
    }

    getNotificationsByUserId(userId: Number) {
      let headers = this.authService.createQCAuthorizationHeader();
      
      return this
      .http
      .get(`${this.uriNotifications}?userid=${userId}`, {headers:headers});
      //.get(`${this.uriNotifications}`);
    } 

    sendMessage(messageId: number, message: string, read: boolean) {
        let max = 10000;
        let min = 1;
        //let messageId = Math.floor(Math.random() * (max - min)) + min;
        this.subject.next({ message: message , id: messageId, read: read});
    }

    clearMessages() {
        this.subject.next();
    }

    deleteItemMessages(id: number): void {
        console.log(id);
    }

    getMessage(): Observable<any> {
        return this.subject.asObservable();
    }


    addUserNotificationsPreferences(obj: Object) {
      let headers = this.authService.createQCAuthorizationHeader();

      return this.http.post(`${this.uriNotificationsPreferences}/notification/preferences`, obj, {headers:headers}).
      pipe(
         map((data: any) => {
           return data;
         }), catchError( error => {
           return throwError( 'Something went wrong!' );
         })
      )
    } 

    getUserNotificationsPreferences(userId: Number) {
      let headers = this.authService.createQCAuthorizationHeader();

      return this.http.get(`${this.uriNotificationsPreferences}/notification/preferences?user_id=${userId}`, {headers:headers});
    } 

    deleteUserNotificationsPreferences(preferenceId: Number) {
      let headers = this.authService.createQCAuthorizationHeader();
      
      return this.http.delete(`${this.uriNotificationsPreferences}/notification/preferences?preference_id=${preferenceId}`, {headers:headers}).
      pipe(
         map((data: any) => {
           return data;
         }), catchError( error => {
           return throwError( 'Something went wrong!' );
         })
      )
    }    

}