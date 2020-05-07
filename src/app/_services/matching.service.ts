import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MatchingService {

  //private serverurl = 'http://localhost:8000/jobmatching';
  private serverurl = environment.jobmatchingUrl;
  constructor(private httpClient: HttpClient) { }

  public matchJob (jobID): Observable<any> {

    // const  params = new  HttpParams().set('jobid', jobID);
    // return this.httpClient.get(this.serverurl, {responseType: 'json', params});
    return this.httpClient.get(`${this.serverurl}/${jobID}/candidates`, {responseType: 'json'});

  }

}
