import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
//import { filter } from 'rxjs/operators'
import { HttpClient } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class MessageService {
    private subject = new Subject<any>();
    private uriNotifications = environment.notificationsURL;
    private uriNotificationsPreferences = environment.notificationPreferences;
    
    constructor(private http: HttpClient) { }

    sendNotification(obj: Object) {
        return this.http.post(`${this.uriNotifications}`, obj).
        pipe(
           map((data: any) => {
             return data;
           }), catchError( error => {
             return throwError( 'Something went wrong!' );
           })
        )
      }

      changeNotificationStatus(notificationId: number, obj: Object) {
        return this.http.post(`${this.uriNotifications}/${notificationId}`, obj).
        pipe(
           map((data: any) => {
             return data;
           }), catchError( error => {
             return throwError( 'Something went wrong!' );
           })
        )
      }

      deleteNotification(notificationId: number) {
        return this.http.delete(`${this.uriNotifications}/${notificationId}`).
        pipe(
           map((data: any) => {
             return data;
           }), catchError( error => {
             return throwError( 'Something went wrong!' );
           })
        )
      }

    getNotificationsByUserId(userId: Number) {
        return this
        .http
        .get(`${this.uriNotifications}?userid=${userId}`);
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
      return this.http.post(`${this.uriNotificationsPreferences}/notification/preferences`, obj).
      pipe(
         map((data: any) => {
           return data;
         }), catchError( error => {
           return throwError( 'Something went wrong!' );
         })
      )
    } 

    getUserNotificationsPreferences(userId: Number) {
      return this.http.get(`${this.uriNotificationsPreferences}/notification/preferences?user_id=${userId}`);
    } 

    deleteUserNotificationsPreferences(preferenceId: Number) {
      return this.http.delete(`${this.uriNotificationsPreferences}/notification/preferences?preference_id=${preferenceId}`).
      pipe(
         map((data: any) => {
           return data;
         }), catchError( error => {
           return throwError( 'Something went wrong!' );
         })
      )
    }    

}