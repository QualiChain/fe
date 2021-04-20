import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import User from '../_models/user';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../_services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class BadgesService {

  
  private uriBadges = environment.badgesUrl;
  private uriUser = environment.userUrl;
  private uriCourse = environment.courseUrl;

  constructor(
    private authService: AuthService,
    private http: HttpClient) { }

  
  getBadges() {
    let headers = this.authService.createQCAuthorizationHeader();

    return this.http.get(`${this.uriBadges}`, { headers: headers }).
    pipe(
       map((data: [any]) => {
         return data;
       }), catchError( error => {
         return throwError( 'Something went wrong!' );
       })
    )
  }

    getBadge(badgeId: Number) {

      let headers = this.authService.createQCAuthorizationHeader();

      return this.http.get(`${this.uriBadges}/${badgeId}`, { headers: headers }).
      pipe(
         map((data: any) => {
           return data;
         }), catchError( error => {
           return throwError( 'Something went wrong!' );
         })
      )
    }

    deleteBadge(badgeId: Number) {

      let headers = this.authService.createQCAuthorizationHeader();

      return this.http.delete(`${this.uriBadges}/${badgeId}`, { headers: headers }).
      pipe(
         map((data: any) => {
           return data;
         }), catchError( error => {
           return throwError( 'Something went wrong!' );
         })
      )
    }

  addBadge(obj: Object) {
    let headers = this.authService.createQCAuthorizationHeader();

    return this.http.post(`${this.uriBadges}`, obj, { headers: headers } ).
    pipe(
       map((data: any) => {
         return data;
       }), catchError( error => {
         return throwError( 'Something went wrong!' );
       })
    )
  }

  addBadgeToUser(obj: Object) {
    let headers = this.authService.createQCAuthorizationHeader();

    return this.http.post(`${this.uriUser}/badges`, obj, { headers: headers } ).
    pipe(
       map((data: any) => {
         return data;
       }), catchError( error => {
         return throwError( 'Something went wrong!' );
       })
    )
  }
 
  getBadgesByUser(userId: Number) {
    let headers = this.authService.createQCAuthorizationHeader();

    return this.http.get(`${this.uriUser}/badges?userid=${userId}`, { headers: headers } ).
    pipe(
       map((data: any) => {
         return data;
       }), catchError( error => {
         return throwError( 'Something went wrong!' );
       })
    )
  }
 
  deleteBadgeOfUser(userId: Number, badgeId: Number) {
    let headers = this.authService.createQCAuthorizationHeader();

    return this.http.delete(`${this.uriUser}/badges?badge_id=${badgeId}&user_id=${userId}`, { headers: headers } )
    .pipe(
       map((data: any) => {
         return data;
       }), catchError( error => {
         return throwError( 'Something went wrong!' );
       })
    )
  }  

  addBadgeToCourse(obj: Object) {
    let headers = this.authService.createQCAuthorizationHeader();

    return this.http.post(`${this.uriCourse}/badges`, obj, { headers: headers } ).
    pipe(
       map((data: any) => {
         return data;
       }), catchError( error => {
         return throwError( 'Something went wrong!' );
       })
    )
  }

  getBadgesByCourseId(courseId: Number) {
    let headers = this.authService.createQCAuthorizationHeader();

    return this.http.get(`${this.uriCourse}/badges?courseid=${courseId}`, { headers: headers } ).
    pipe(
       map((data: any) => {
         return data;
       }), catchError( error => {
         return throwError( 'Something went wrong!' );
       })
    )
  }

  deleteBadgeToCourse(courseId: Number, badgeId: Number) {
    let headers = this.authService.createQCAuthorizationHeader();

    return this.http.delete(`${this.uriCourse}/badges?badge_id=${badgeId}&course_id=${courseId}`, { headers: headers } )
    .pipe(
       map((data: any) => {
         return data;
       }), catchError( error => {
         return throwError( 'Something went wrong!' );
       })
    )
  }  

}