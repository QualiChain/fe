import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import User from '../_models/user';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AwardsService {

  
  private uriAwards = environment.badgesV2Url;
  
  constructor(
    private authService: AuthService,
    private http: HttpClient) { }

  
    getListBadgesAllowedToAward(userId: Number, awardedId:Number) {
    let headers = this.authService.createQCAuthorizationHeader();

    return this.http.get(`${this.uriAwards}/awardable/badges?user_id=${userId}&awarder_id=${awardedId}`, { headers: headers }).
    pipe(
       map((data: [any]) => {
         return data;
       }), catchError( error => {
         return throwError( 'Something went wrong!' );
       })
    )
  }

  awardASmartBadge(obj: {}) {

    let headers = this.authService.createQCAuthorizationHeader();


    return this.http.post(`${this.uriAwards}/user/awards`, obj, {headers: headers}).
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


  getUsersBagesWithCounters(userId: Number) {
    let headers = this.authService.createQCAuthorizationHeader();

    return this.http.get(`${this.uriAwards}/aggregate/awards?user_id=${userId}`, { headers: headers }).
    pipe(
       map((data: [any]) => {
         return data;
       }), catchError( error => {
         return throwError( 'Something went wrong!' );
       })
    )
  }

  getAggregatedDataForUserAndBadgeId(userId: Number, badgeId:Number) {
    let headers = this.authService.createQCAuthorizationHeader();

    return this.http.get(`${this.uriAwards}/details/awards?user_id=${userId}&badge_id=${badgeId}`, { headers: headers }).
    pipe(
       map((data: [any]) => {
         return data;
       }), catchError( error => {
         return throwError( 'Something went wrong!' );
       })
    )
  }

  getAwwardingsForUserAndBadgeId(userId: Number, badgeId:Number) {
    let headers = this.authService.createQCAuthorizationHeader();

    return this.http.get(`${this.uriAwards}/user/awards?user_id=${userId}&badge_id=${badgeId}`, { headers: headers }).
    pipe(
      map((data: [any]) => {
        return data;
      }), catchError( error => {
        return throwError( 'Something went wrong!' );
      })
    )
  }

  
}