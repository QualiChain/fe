import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './../../environments/environment';
import { AuthService } from '../_services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class MatchingService {

  //private serverurl = 'http://localhost:8000/jobmatching';
  private serverurl = environment.jobmatchingUrl;
  constructor(
    private authService: AuthService, 
    private httpClient: HttpClient) { }

  public matchJob (jobID): Observable<any> {
    let headers = this.authService.createQCAuthorizationHeader();

    /*
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json'}),
      params:  new  HttpParams().set('jobid', jobID)
    };
    */
   // const  params = new  HttpParams().set('jobid', jobID);
   // return this.httpClient.get(this.serverurl, {responseType: 'json', params});
    return this.httpClient.get(`${this.serverurl}/${jobID}/candidates`, {headers:headers, responseType: 'json'});

  }

}
