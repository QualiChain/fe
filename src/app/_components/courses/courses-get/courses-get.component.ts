import { Component, OnInit, ɵConsole } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CoursesService } from '../../../_services/courses.service';
import Course from '../../../_models/course';
import User from '../../../_models/user';
//import { MatDialog } from '@angular/material';
import { MatDialog } from '@angular/material/dialog';

import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../../_services';

@Component({
  selector: 'app-courses-get',
  templateUrl: './courses-get.component.html',
  styleUrls: ['./courses-get.component.css']
})
export class CoursesGetComponent implements OnInit {

  currentUser: User;
  enrolledUsers: any[] = [];

  loadSpinner: boolean = false;
  errorRelation: boolean = false;

  constructor(
    private router: Router,
    private authservice: AuthService,
    public dialogModal: MatDialog, 
    private route: ActivatedRoute,
    private cs: CoursesService,
    private translate: TranslateService
  ) { }


  //courseData: Course;
  courseData: any;
  
  ngOnInit() {

    this.authservice.currentUser.subscribe(x => this.currentUser = x);
    this.courseData = {courseid: 0, name: "", description: "", semester: "", startDate: "", endDate: "", updateDate: "", skills: [], events: [] };

    this.route.params.subscribe(params => {

      let id:number = 0;      
      if(params.hasOwnProperty('id')){
        id = +params.id;
      }

      if (id>0) {
        //console.log(id);

        this.cs
        .getCourse(id).subscribe(
          dataCourse => {
            //console.log("course in db");
            //console.log(dataCourse);
            this.courseData = dataCourse;
            if (!this.courseData.hasOwnProperty("skills")) {
              this.courseData['skills'] = [];
              //getSkillsByCourseId
              
              this.cs
              .getSkillsByCourseId(id).subscribe(
              dataCourseSkills => {

                dataCourseSkills.forEach(element => {
                  //let tmp = {id:element.skill.id, name: element.skill.name};
                  let tmp = element;
                  this.courseData['skills'].push(tmp);
                }); 

                
              },
              error => {
                console.log("error recovering skills by course id")
              });
              
              this.cs
              .getEnrolledUserByCourseId(id).subscribe(
              dataEnrolledUsers => {
                this.enrolledUsers = dataEnrolledUsers;
              },
              error => {
                console.log("error recovering enrolled users by course id")
              });                        
            }
            if (!this.courseData.hasOwnProperty("events")) {
              this.courseData['events'] = [];
            }
          },
          error => {
            this.router.navigate(["/not_found"]);            
          }
        );            
        /*
        this.cs
        .getCourse(id)
        .subscribe((dataCourse: Course) => {
          //console.log(dataCourse);
          this.courseData = dataCourse;
        });
        */
      }

    });

  }


  relationUserCourse(courseId: number, action: string, type: string): void {
    console.log("courseId:"+courseId);
    console.log("action:"+action);
    console.log("type:"+type);
    this.loadSpinner = true;
    this.errorRelation = false;
    if (action=='add'){
           
      let dataToPost = {
      "course_id": courseId,
      "course_status": type
      };

      this.cs
      .enrollUser(this.currentUser.id, dataToPost).subscribe(
        data => {
          console.log("enroll user!!");
          this.loadSpinner = false;
        },
        error => {
          console.log("Error enrolling user");                      
          this.errorRelation = true;
          this.loadSpinner = false;
        }
      );
      
    }

  }

}