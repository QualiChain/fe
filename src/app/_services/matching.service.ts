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


    /*
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json'}),
      params:  new  HttpParams().set('jobid', jobID)
    };
    */
console.log(jobID)
    const  params = new  HttpParams().set('jobid', jobID);
    console.log(params);
    console.log(this.serverurl);
    return this.httpClient.get(this.serverurl, {responseType: 'json', params});
  }

}
