import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Job } from '../_models/Job';

@Injectable({
  providedIn: 'root'
})
export class JobsService {

  private jobsURL = environment.jobsUrl;
  private uriGet = environment.jobpostGet;
  private uriPost = environment.jobpostUrl;

  constructor(private http: HttpClient) { }

  addJob(dataIn: Job){
    return this.http.post(`${this.jobsURL}`, JSON.stringify(dataIn))
    /*
    .pipe(
       map((data: any) => {
         return data;
       }), catchError( error => {
         return throwError( 'Something went wrong!' );
       })
    )
    */
  }  

  getJobs() {
    return this
           .http
           .get(`${this.jobsURL}`);
  }
  
    getJobs2() {
      /*
      return this
           .http
           .get(`${this.uri}`);
      */
     // return({'id':1,'JobName':'Job name','JobDescription':'Job description','JobPrice':'22'})
      return(
        [{'id': 1, 'skill': 'Angular fff', 'required_level': 'req. level 1', 'priority': '1'},
  {'id': 2, 'skill': 'Java', 'required_level': 'req. level 2', 'priority': '2'},
  {'id': 3, 'skill': 'Nodejs', 'required_level': 'req. level 3', 'priority': '3'},
  {'id': 4, 'skill': 'Python', 'required_level': 'req. level 4', 'priority': '4'},
  {'id': 5, 'skill': 'Drupal', 'required_level': 'req. level 5', 'priority': '3'},  
  {'id': 6, 'skill': 'Javascript', 'required_level': 'req. level 2', 'priority': '2'},
  {'id': 7, 'skill': 'C/CPP', 'required_level': 'req. level 7', 'priority': '7'},
  {'id': 8, 'skill': 'PHP', 'required_level': 'req. level 2', 'priority': '2'},
  {'id': 9, 'skill': 'Swift', 'required_level': 'req. level 4', 'priority': '7'},
  {'id': 10, 'skill': 'C#', 'required_level': 'req. level 3', 'priority': '8'},
  {'id': 11, 'skill': 'Ruby', 'required_level': 'req. level 1', 'priority': '3'},
  {'id': 12, 'skill': 'SQL', 'required_level': 'req. level 3', 'priority': '4'}
      ]);
    }


    getJob(jobId) {
      return this
             .http
             .get(`${this.jobsURL}/${jobId}`);
    }

    editJob(id) {
      /*
      return this
              .http
              .get(`${this.uri}/edit/${id}`);
              */
             return({'id':id,'JobName':'Job name','JobDescription':'Job description','JobPrice':'22'})
    }



    updateJob(jobId: number, dataIn: any) {
      return this.http.put(`${this.jobsURL}/${jobId}`, dataIn).
      pipe(
         map((data: any) => {
           return data;
         }), catchError( error => {
           return throwError( 'Something went wrong!' );
         })
      )
    }


    applyJob(jobId: number, userId: number, dataIn: object) {      
      return this.http.post(`${this.jobsURL}/${jobId}/apply/${userId}`, dataIn).
      pipe(
         map((data: any) => {
           return data;
         }), catchError( error => {
           return throwError( 'Something went wrong!' );
         })
      )
    }

    

}
