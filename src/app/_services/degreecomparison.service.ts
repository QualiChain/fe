import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
//import { AuthService } from '../_services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class DegreecomparisonService {

    
    private degreeComparisoinURL = environment.degreComparison;

    constructor(
        //private authService: AuthService,
        private http: HttpClient) { }

        getDegreeComparison(formData) {
            
            //'/compare/similarity'

            return this.http.post(this.degreeComparisoinURL, formData, { observe: 'events',  reportProgress: true }).pipe(          
            //return this.http.get(this.degreeComparisoinURL, { observe: 'events',  reportProgress: true }).pipe(          
              map((res: any) => {
                //console.log(res)
                return res;
              }), catchError( error => {
                //console.log(error);                
                let messageToReturn : string = 'Something went wrong!'
                if (error.hasOwnProperty('message')) {
                    messageToReturn = error['message'];
                } else if (error.hasOwnProperty('error')) {
                    messageToReturn = error['error'];
                }

                return throwError( messageToReturn );
              })
           );
        }
    

}    