import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AuthService } from '../_services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class JobsService {

  //uri = 'http://localhost:4000/jobs';
  private jobsURL = environment.jobsUrl;
  private jobsProfilesURL = environment.jobsProfilesUrl;

  constructor(
    private authService: AuthService,
    private http: HttpClient) { }

  addJob(dataIn: any) {
    //let headers = this.authService.createQCAuthorizationHeader();
    let headers = this.authService.createQCAuthorizationHeaderText();

    return this.http.post(`${this.jobsURL}`, JSON.stringify(dataIn), {headers:headers, responseType: 'text'}).
    pipe(
       map((data: any) => {         
         return data;
       }), catchError( error => {
         console.log(error);
         return throwError( 'Something went wrong!' );
       })
    )
  }  

 
  getJobs() {
    let headers = this.authService.createQCAuthorizationHeader();

    return this.http.get(`${this.jobsURL}`, {headers:headers}).
    pipe(
        map((data: any[]) => {
            return data;
        }), catchError( error => {
            return throwError( 'Something went wrong!' );
        })
    )
  }    


    getJob(jobId: any) {
      let headers = this.authService.createQCAuthorizationHeader();

      return this.http.get(`${this.jobsURL}/${jobId}`, {headers:headers}).
      pipe(
          map((data: {}) => {
              return data;
          }), catchError( error => {
              return throwError( 'Something went wrong!' );
          })
      )
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
      //let headers = this.authService.createQCAuthorizationHeader();
      let headers = this.authService.createQCAuthorizationHeaderText();

      return this.http.put(`${this.jobsURL}/${jobId}`, JSON.stringify(dataIn), {headers:headers}).
      pipe(
         map((data: any) => {
           return data;
         }), catchError( error => {
           return throwError( 'Something went wrong!' );
         })
      )
    }


    applyJob(jobId: any, userId: any, dataIn: object) {
      //console.log(userId);
      //console.log(jobId);    
      //let headers = this.authService.createQCAuthorizationHeader();
      let headers = this.authService.createQCAuthorizationHeaderText();

      return this.http.post(`${this.jobsURL}/${jobId}/apply/${userId}`, JSON.stringify(dataIn), {headers:headers, responseType: 'text'}).
      pipe(
         map((data: any) => {
           return data;
         }), catchError( error => {
           //console.log(error);
           if (error.hasOwnProperty('error')) {
            return throwError(error['error']);
           }
           else {
            return throwError( 'Something went wrong!' );
           }
           
         })
      )
    }

    deleteJobApply(jobId: any, userId: any) {   
      //console.log(jobId);console.log(userId);   
      //const headers = new HttpHeaders();
      //let headers = this.authService.createQCAuthorizationHeader();
      let headers = this.authService.createQCAuthorizationHeaderText();

      return this.http.delete(`${this.jobsURL}/${jobId}/apply/${userId}`, { headers:headers, responseType: 'text'}).
      pipe(
         map((data: any) => {
           console.log(data);
           return data;
         }), catchError( error => {
           console.log(error);
           return throwError( 'Something went wrong!' );
         })
      )
    }


    getJobCandidats(jobId: number) {
      let headers = this.authService.createQCAuthorizationHeader();      
      
      return this.http.get(`${this.jobsURL}/${jobId}/candidates`, { headers:headers }).
      pipe(
         map((data: any) => {
           return data;
         }), catchError( error => {
           return throwError( 'Something went wrong!' );
         })
      )
    }

    deleteJob(jobId){
      //let headers = this.authService.createQCAuthorizationHeader();
      let headers = this.authService.createQCAuthorizationHeaderText();

      return this.http.delete(`${this.jobsURL}/${jobId}`, { headers:headers, responseType: 'text'}).      
      pipe(
         map((data: any) => {
           //console.log(data);
           return data;
         }), catchError( error => {
           console.log(error);
           return throwError( 'Something went wrong!' );
         })
      )

    }

    getJobAppliesPerCandidat(userId: number) {
      let headers = this.authService.createQCAuthorizationHeader();

      //return this.http.get(`${this.jobsURL}/${userId}/jobapplies`).
      return this.http.get(`${this.jobsProfilesURL}/${userId}/applications`, { headers:headers }).
      pipe(
         map((data: any) => {
           return data;
         }), catchError( error => {
           return throwError( 'Something went wrong!' );
         })
      )
    }    


    getCompanies() {
      let headers = this.authService.createQCAuthorizationHeader();

      return this.http.get(`${this.jobsURL}/companies`, { headers:headers }).
      pipe(
         map((data: any) => {
           return data;
         }), catchError( error => {
           return throwError( 'Something went wrong!' );
         })
      )
    }


    assignJobtoCandidate(userId: any, jobId: any,) {
      let headers = this.authService.createQCAuthorizationHeader();

      return this.http.post(`${this.jobsProfilesURL}/${userId}/currentJob/${jobId}`, JSON.stringify({}), { headers:headers }).
      pipe(
         map((data: any) => {
           //console.log(data);
           return data;
         }), catchError( error => {
           //console.log(error);
           return throwError( 'Something went wrong!' );
         })
      )
    }

}
