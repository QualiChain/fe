import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import User from '../_models/user';
import { CVService } from '../_services/cv.service';
import { CoursesService } from '../_services/courses.service';

@Injectable({
  providedIn: 'root'
})
export class RecomendationsService {

  private uriRecomendations = environment.recomendationsUrl;
  private uriRecomendationsByCV = environment.recomendationsUrlByCV;
  private uriRecomendationsJobsByCV = environment.cvUrl


  constructor(private http: HttpClient, private cvss: CVService, private cs: CoursesService) { }

  async recomendedDataByCVByUserId(userId: number, type: string) {

    const dataCVs = await this.cvss.getCV(userId).toPromise();    
    //console.log(dataCVs);
    let datatCVToSend = dataCVs;
    //console.log(datatCVToSend);
    let skillsCV = [];
    dataCVs['skills'].forEach(element => {
    //console.log(element);
    skillsCV.push({
                "label":element.label,
                "comment":element.comment,
                "proficiencyLevel":element.proficiencyLevel, 
                "priorityLevel": element.priorityLevel,                
                "uri": element.uri, 
                "id": element.id});
    });
    //console.log(skillsCV);

    let educationCV = [];
    dataCVs['education'].forEach(element => {
      educationCV.push({"title":element.title,"from":element.from,"to":element.to,"organisation":element.organisation,"description":element.description});
    });
    //console.log(educationCV);

    let workHistoryCV = [];
    dataCVs['workHistory'].forEach(element => {
      workHistoryCV.push({"title":element.position,"from":element.from,"to":element.to,"organisation":element.employer,"description":""});
    });
    //console.log(workHistoryCV);

    datatCVToSend = {
      "source":{
        "PersonURI": dataCVs['personURI'],
        "Label": dataCVs['label'],
        "targetSector": dataCVs['targetSector'],
        "expectedSalary": "",
        "Description": dataCVs['description'],
        "skills": skillsCV,
        "workHistory": workHistoryCV,
        "Education": educationCV
        },
        "source_type": "cv",
        "recommendation_type": "courses"
    };
            
    //console.log(datatCVToSend);

    let dataRecommendationByCV = await this.getRecomendationsByCV(datatCVToSend).toPromise();
    //console.log(dataRecommendationByCV);
    let recomendedData = [];

    if ((type=='courses') || (type=='courses_and_skills')) {
      recomendedData['recommended_courses'] = dataRecommendationByCV['recommended_courses'];
      let posI = 0;
      for (const element of recomendedData['recommended_courses']) {
        try   
        { 
          const courseData = await this.cs.getCourse(element.course_id).toPromise()        
          //console.log(courseData);
          //recomendedData[posI].course_decription = courseData.description; 
          recomendedData['recommended_courses'][posI].data = courseData;
          posI = posI + 1;
        }
        catch (Error)   
        {  
          console.log(Error);  
        }  
      }
    }
    if ((type=='skills') || (type=='courses_and_skills')) {
      recomendedData['recommended_skills'] = [];
      let recomendedDataTmp = dataRecommendationByCV['recommended_skills'];
      let posI = 0;
      for (const element of recomendedDataTmp) {
        recomendedData['recommended_skills'].push({'id':element,'title': element ,'description': element, 'rating': null}); 
        posI = posI + 1;
      }
    }
    return recomendedData;

  }


  getRecomendationsByCV(dataToSend: object) {    
    return this.http.post(`${this.uriRecomendationsByCV}`,dataToSend).
    pipe(
       map((data: any) => {
         return data;
       }), catchError( error => {
         return throwError( 'Something went wrong!' );
       })
    )
  }
  
  getRecomendationsSkills(userId: Number) {    
    return this.http.get(`${this.uriRecomendations}/${userId}/skills`).
    pipe(
       map((data: any) => {
         return data;
       }), catchError( error => {
         return throwError( 'Something went wrong!' );
       })
    )
  }

  getRecomendationsCourses(userId: Number) {    
    return this.http.get(`${this.uriRecomendations}/${userId}/courses`).
    pipe(
       map((data: any) => {
         return data;
       }), catchError( error => {
         return throwError( 'Something went wrong!' );
       })
    )
  }


  getRecomendationsJobs(userId: Number) {    
    return this.http.get(`${this.uriRecomendationsJobsByCV}/${userId}/recommendations/jobs`).
    pipe(
       map((data: any) => {
         return data;
       }), catchError( error => {
         return throwError( 'Something went wrong!' );
       })
    )
  }  

}