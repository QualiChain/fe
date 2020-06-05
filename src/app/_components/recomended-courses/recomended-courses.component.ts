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
          console.log("list of user CVs");
          console.log(dataCVs);
          var size = Object.keys(dataCVs).length;
          if (size>0) {
            let datatCVToSend = dataCVs[size-1];
            //console.log(datatCVToSend);
            datatCVToSend = {
              "source":{
                "PersonURI": dataCVs[size-1]['person_URI'],
                "Label": dataCVs[size-1]['label'],
                "targetSector": dataCVs[size-1]['target_sector'],
                "expectedSalary": dataCVs[size-1]['expected_salary'],
                "Description": dataCVs[size-1]['description'],
                "Skills": dataCVs[size-1]['skills'],
                "workHistory": dataCVs[size-1]['work_history'],
                "Education": dataCVs[size-1]['education']
              },
              "source_type": "cv",
              "recommendation_type": "courses"
            };
                        
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
          }
          
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
