import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class JobsService {

  //uri = 'http://localhost:4000/jobs';
  private uriGet = environment.jobpostGet;
  private uriPost = environment.jobpostUrl;

  constructor(private http: HttpClient) { }

  addJob(Label, department, employmentType, level, JobDescription, SkillReq) {
    const obj = {
      Label,
      department,
      employmentType,
      level,
      JobDescription,
      SkillReq
    };
    //console.log(obj);
    this.http.post(`${this.uriPost}`, obj)
        .subscribe(res => console.log('Done'));
  }

  getJobs() {
    return this
           .http
           .get(`${this.uriGet}`);
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
             .get(`${this.uriGet}/${jobId}`);
    }

    editJob(id) {
      /*
      return this
              .http
              .get(`${this.uri}/edit/${id}`);
              */
             return({'id':id,'JobName':'Job name','JobDescription':'Job description','JobPrice':'22'})
    }

      updateJob(Label, department, employmentType, level, JobDescription, SkillReq, id) {
        const obj = {
          Label, department, employmentType, level, JobDescription, SkillReq
        };
        this
          .http
          .post(`${this.uriPost}/${id}`, obj)
          .subscribe(res => console.log('Done'));
    }
}
