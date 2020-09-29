import { Component, OnInit, ɵConsole, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CoursesService } from '../../../_services/courses.service';
import Course from '../../../_models/course';
import User from '../../../_models/user';
//import { MatDialog } from '@angular/material';

import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../../_services';

import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';


export interface DialogData {
  grade: number;
}

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

  isUserAsEnrolled: boolean = false;
  isUserAsDone: boolean = false;
  isUserAsTaught: boolean = false;

  grade: Number;

  constructor(
    private router: Router,
    private authservice: AuthService,
    public dialogModal: MatDialog, 
    private route: ActivatedRoute,
    private cs: CoursesService,
    private translate: TranslateService,
    public dialog: MatDialog
  ) { }

  openDialogGrade(courseId: number): void {
    const dialogRef = this.dialog.open(DialogOverviewGradeDialog, {
      width: '350px',
      disableClose: true,
      data: {grade: this.grade}
    });

    dialogRef.afterClosed().subscribe(result => {
      //console.log('The dialog was closed');      
      this.grade = result;

      if (result>=0) {
        this.relationUserCourse(courseId, 'add' ,'done')
      }
    });
  }

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

            this.reloadUserStatus(id);

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
              
              this.getEnrolledUsersByCourse(id);
              
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

  reloadUserStatus(courseId: Number) {
    this.cs.getUserEnrollmentStatusByCourseId(courseId, this.currentUser.id, 'enrolled').subscribe(
      dataEnrolled => {
        this.isUserAsEnrolled = dataEnrolled;
      },
      error => {
        this.isUserAsEnrolled = false;    
      });
  }

  getEnrolledUsersByCourse(courseId: Number) {
    this.cs
    .getEnrolledUserByCourseId(courseId).subscribe(
    dataEnrolledUsers => {
      //console.log(dataEnrolledUsers);
      this.enrolledUsers = dataEnrolledUsers;
    },
    error => {
      console.log("error recovering enrolled users by course id")
    });
    

    this.cs.getUserEnrollmentStatusByCourseId(courseId, this.currentUser.id, 'done').subscribe(
      dataDone => {
        this.isUserAsDone = dataDone;
      },
      error => {
        this.isUserAsDone = false;    
      });

    this.cs.getUserEnrollmentStatusByCourseId(courseId, this.currentUser.id, 'taught').subscribe(
      dataTaught => {
        this.isUserAsTaught = dataTaught;
      },
      error => {
        this.isUserAsTaught = false;    
      });
  }

  relationUserCourse(courseId: number, action: string, type: string): void {
    //console.log("courseId:"+courseId);
    //console.log("action:"+action);
    //console.log("type:"+type);
    this.loadSpinner = true;
    this.errorRelation = false;
    

    if (action=='add'){
      
      let validInput =  false;

      let dataToPost = {
        "course_id": courseId,
        "course_status": type
        };

      if (type=='done') { 
        
        console.log(this.grade);
        if (this.grade>=0) {
          validInput = true;
          dataToPost['grade'] = this.grade;
        }
      }
      else {
        validInput = true;
      }
      
      

      this.cs
      .enrollUser(this.currentUser.id, dataToPost).subscribe(
        data => {
          //console.log("enroll user!!");
          this.getEnrolledUsersByCourse(courseId);
          this.loadSpinner = false;
          if (type=='enrolled'){
            this.isUserAsEnrolled = true;
          }
          else if (type=='taught'){
            this.isUserAsTaught = true;
          }
          else if (type=='done'){
            this.isUserAsDone = true;
          }
        },
        error => {
          console.log("Error enrolling user");                      
          this.errorRelation = true;
          this.loadSpinner = false;
        }
      );
      
    }
    else if (action=='delete'){

      this.cs
      .deleteEnrollUser(this.currentUser.id, courseId).subscribe(
        data => {
          //console.log("enroll user deleted!!");
          this.getEnrolledUsersByCourse(courseId);
          this.loadSpinner = false;
          if (type=='enrolled'){
            this.isUserAsEnrolled = false;
          }
          else if (type=='taught'){
            this.isUserAsTaught = false;
          }
          else if (type=='done'){
            this.isUserAsDone = false;
          }
        },
        error => {
          console.log("Error deleting enrolling user");                      
          this.errorRelation = true;
          this.loadSpinner = false;
        }
      );
      
          
    }

  }


  
}


@Component({
  selector: 'dialog-overview-grade-dialog',
  templateUrl: 'dialog-overview-grade-dialog.html',
  styleUrls: ['./courses-get.component.css']
})
export class DialogOverviewGradeDialog {

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewGradeDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}