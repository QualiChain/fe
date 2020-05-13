import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import User from '../_models/user';
import { HttpClientModule } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BadgesService {

  
  private uriBadges = environment.badgesUrl;
  private uriUser = environment.userUrl;

  constructor(private http: HttpClient) { }

  
  getBadges() {
    return this.http.get(`${this.uriBadges}`).
    pipe(
       map((data: [any]) => {
         return data;
       }), catchError( error => {
         return throwError( 'Something went wrong!' );
       })
    )
  }

    getBadge(badgeId: Number) {
      return this.http.get(`${this.uriBadges}/${badgeId}`).
      pipe(
         map((data: any) => {
           return data;
         }), catchError( error => {
           return throwError( 'Something went wrong!' );
         })
      )
    }

  addBadge(obj: Object) {
    return this.http.post(`${this.uriBadges}`, obj).
    pipe(
       map((data: any) => {
         return data;
       }), catchError( error => {
         return throwError( 'Something went wrong!' );
       })
    )
  }

  addBadgeToUser(obj: Object) {
    return this.http.post(`${this.uriUser}/badges`, obj).
    pipe(
       map((data: any) => {
         return data;
       }), catchError( error => {
         return throwError( 'Something went wrong!' );
       })
    )
  }
 
  getBadgesByUser(userId: Number) {
    return this.http.get(`${this.uriUser}/badges?userid=${userId}`).
    pipe(
       map((data: any) => {
         return data;
       }), catchError( error => {
         return throwError( 'Something went wrong!' );
       })
    )
  }
 
  deleteBadgeOfUser(userId: Number, badgeId: Number) {
    return this.http.delete(`${this.uriUser}/badges?badgeid=${badgeId}&userid=${userId}`)    
    .pipe(
       map((data: any) => {
         return data;
       }), catchError( error => {
         return throwError( 'Something went wrong!' );
       })
    )
  }  

}