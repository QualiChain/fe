import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { from, Observable, BehaviorSubject, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DSSCurriculumReDesignService {

  uri = environment.CVRecomendationUrl;


  constructor(private httpClient: HttpClient) {
  }

  getMissingSkillsData(dataIn: object) {
    
    return this.httpClient.post(`${this.uri}`, JSON.stringify(dataIn)).
    pipe(
       map((data: any) => {
         return data;
       }), catchError( error => {
         return throwError( 'Something went wrong!' );
       })
    )
  }

}
