import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RecomendationsService } from '../../_services/recomendations.service';
import { CVService } from '../../_services/cv.service';
import { CoursesService } from '../../_services/courses.service';

@Component({
  selector: 'app-recomended-courses',
  templateUrl: './recomended-courses.component.html',
  styleUrls: ['./recomended-courses.component.css']
})
export class RecomendedCoursesComponent implements OnInit {

  @Input() userId: number = null;

  recomendedCourses = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private rs: RecomendationsService, private cvss: CVService, private cs: CoursesService ) { }

  ngOnInit() {

    //console.log(this.userId);  

    if (!this.userId) {
      this.route.params.subscribe(params => {
      if(params.hasOwnProperty('id')){
        this.userId = +params.id;
      }
    });
    }

    //console.log(this.userId);    

    if (this.userId) {

      this.cvss
      .getCV(this.userId).subscribe(
        dataCVs => {
          //console.log("user CV");
          //console.log(dataCVs);
          
            let datatCVToSend = dataCVs;
            //console.log(datatCVToSend);
            let skillsCV = [];
            dataCVs['skills'].forEach(element => {
              console.log(element);
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

            this.rs
            .getRecomendationsByCV(datatCVToSend).subscribe(
              dataRecommendationByCV => {
                //console.log("list of recomended courses by CV");
                //console.log(dataRecommendationByCV);                   
                this.recomendedCourses = dataRecommendationByCV['recommended_courses'];
                dataRecommendationByCV['recommended_courses'].forEach(element => {
                  //console.log(element.course_id);
                  this.cs
                  .getCourse(element.course_id).subscribe(
                    courseData => {
                      //console.log("courseData");
                      //console.log(courseData);
                      element.course_decription = courseData.description;
                    },
                    error => {
                      console.log("course not found in db");                        
                    }
                  );                  


                });

              },
              error => {
                console.log("recomended courses by CV not found in db");                        
              }
            );
          
          
        },
        error => {
          console.log("user CVs not found in db");                        
        }
      );  

      /*      
      this.rs
      .getRecomendationsCourses(this.userId).subscribe(
        data => {
          //console.log("list of recomended courses");
          //console.log(data);
          this.recomendedCourses = data;
        },
        error => {
          console.log("recomended courses not found in db");                        
        }
      );
      */
    }    

  }

}
