import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { from, Observable, BehaviorSubject, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from './../../environments/environment';
import { AuthService } from '../_services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class DSSCurriculumReDesignService {

  uri = environment.CVRecomendationUrl;


  constructor(
    private authService: AuthService,
    private httpClient: HttpClient) {
  }

  getMissingSkillsData(dataIn: object) {
    let headers = this.authService.createQCAuthorizationHeader();

    return this.httpClient.post(`${this.uri}`, JSON.stringify(dataIn), {headers:headers}).
    pipe(
       map((data: any) => {
         return data;
       }), catchError( error => {
         return throwError( 'Something went wrong!' );
       })
    )
  }

}
