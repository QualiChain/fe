import { Component, OnInit, ɵConsole, Inject, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CoursesService } from '../../../_services/courses.service';
import Course from '../../../_models/course';
import User from '../../../_models/user';
//import { MatDialog } from '@angular/material';

import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../../_services';

import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {FormControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
//import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';
import { UsersService } from '../../../_services/users.service';
//import { FilterArrayByValueGetListPipe } from '../../../_pipes/FilterArrayByValueGetList/filterArrayByValueGetList.pipe';
import { AppComponent } from '../../../app.component';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator'
import { awardDialog_modal } from '../../../_components/award-smart-badge/award-smart-badge.component';
import AcademicOrganisation from '../../../_models/academicorganisation';
import { AcademicOrganisationService } from '../../../_services/academicorganisation.services';

export interface DialogData {
  grade: number;
  courseId: number;
  userId: number;
}

export interface DialogDataEnrollment {
  enrollment: string ;
  usersSelected: [];
  grade: number;
  courseId: number;
}

@Component({
  selector: 'app-courses-get',
  templateUrl: './courses-get.component.html',
  styleUrls: ['./courses-get.component.css']
})
export class CoursesGetComponent implements OnInit {

  displayedColumnsProfessors: string[] = ['surname', 'name', 'aqcuired_badges', 'action'];
  displayedColumnsEnrolled: string[] = ['surname', 'name', 'aqcuired_badges', 'action'];
  displayedColumnsDoneBy: string[] = ['surname', 'name', 'course_grade', 'aqcuired_badges', 'action'];
  //@ViewChild(MatSort, {static: true}) sort: MatSort;

  @ViewChild('paginatorProfessor', {static: true, read: MatPaginator}) paginatorProfessor: MatPaginator;
  @ViewChild('paginatorUsersStatusEnrolled', {static: true, read: MatPaginator}) paginatorUsersStatusEnrolled: MatPaginator;
  @ViewChild('paginatorUsersStatusDone', {static: true, read: MatPaginator}) paginatorUsersStatusDone: MatPaginator;

  @ViewChild('ProfessorSort', {static: true}) ProfessorSort: MatSort;
  @ViewChild('EnrolledSort', {static: true}) EnrolledSort: MatSort;
  @ViewChild('DoneSort', {static: true}) DoneSort: MatSort;
  
  currentUser: User;
  enrolledUsers: any[] = [];
  enrolledProfessors: any[] = [];
  professorList = new MatTableDataSource([]);
  enrolledUsersStatusEnrolled = new MatTableDataSource([]);
  enrolledUsersStatusDone = new MatTableDataSource([]);
  loadSpinner: boolean = false;
  errorRelation: boolean = false;

  isUserAsEnrolled: boolean = false;
  isUserAsDone: boolean = false;
  userGrade: Number = null;
  isUserAsTaught: boolean = false;

  grade: Number;
  canEditCourse = [];
  courseId: number;
  nameAcademicOrganisation: string = null;
  descriptionAcademicOrganisation: string = null;

  constructor(
    public aos: AcademicOrganisationService,
    private appcomponent: AppComponent,
    private router: Router,
    private authservice: AuthService,
    public dialogModal: MatDialog, 
    private route: ActivatedRoute,
    private cs: CoursesService,
    private translate: TranslateService,
    public dialog: MatDialog,
    public awardDialog: MatDialog,
  ) { 
    this.authservice.currentUser.subscribe(x => this.currentUser = x);

  }

  isLogged = this.appcomponent.isLogged;
  isAdmin = this.appcomponent.isAdmin;
  isRecruiter = this.appcomponent.isRecruiter;
  //isTeacher = this.appcomponent.isTeacher;
  isProfessor = this.appcomponent.isProfessor;
  isStudent = this.appcomponent.isStudent;
  isEmployee = this.appcomponent.isEmployee;

  openAwardDialog(userId: number, element: any) {
     
    const dialogRef = this.awardDialog.open(awardDialog_modal, {
      width: '550px',
      data: {userId: userId, element: element, source: 'profile'}
    });

    dialogRef.afterClosed().subscribe(result => {

      this.getEnrolledUsersByCourse(this.courseId);
    });
    
  }

  openDialogUserSelection(courseId: number, userId: number): void {
    const dialogRef = this.dialog.open(DialogSelectUser, {
      width: '450px',
      disableClose: true,
      data: {courseId: courseId}
    });

    dialogRef.afterClosed().subscribe(result => {
      //console.log('The dialog was closed');  
      //console.log(result);
/*
      if (result) {

        let dataToPost = {
          "course_id": courseId,
          "course_status": result.enrollment
        };
        if (result.enrollment=='done') {          
            dataToPost['grade'] = +result.grade;          
        }

        result.usersSelected.forEach(element => {
          
          this.cs
          .enrollUser(element, dataToPost).subscribe(
            data => {
              //console.log("enroll user!!");
              this.getEnrolledUsersByCourse(courseId);

            },
            error => {
              console.log("Error enrolling user");                      

            }
          );          
          
        });
      }
      */
      
    });
  }

  openDialogGrade(courseId: number, userId: number): void {    
    
    const dialogRef = this.dialog.open(DialogOverviewGradeDialog, {
      width: '450px',
      disableClose: true,
      data: {courseId: courseId, userId: userId, grade: this.grade}
    });

    dialogRef.afterClosed().subscribe(result => {
      //console.log('The dialog was closed');      
      
      //console.log(result);      

      if (result>=0) {
        //console.log(result);  
        this.getEnrolledUsersByCourse(courseId);
        this.isUserAsDone = true;
        this.userGrade = result;
        //this.userGrade = ;
        //this.relationUserCourse(courseId, 'add' ,'done', userId);
      }

      
      this.loadSpinner = false;
    });
  }

  //courseData: Course;
  courseData: any;
  
  ngOnInit() {
    
    this.professorList.sortingDataAccessor = (item, property) => {
      switch(property) {
        case 'name': return item.user_id.name;
        case 'surname': return item.user_id.surname;
        default: return item[property];
      }
    };    
    this.professorList.sort = this.ProfessorSort;
    this.professorList.paginator = this.paginatorProfessor;

    this.enrolledUsersStatusEnrolled.sortingDataAccessor = (item, property) => {
      switch(property) {
        case 'name': return item.user.name;
        case 'surname': return item.user.surname;
        default: return item[property];
      }
    };
    //this.enrolledUsersStatusEnrolled.sort = this.sort;
    this.enrolledUsersStatusEnrolled.sort = this.EnrolledSort;
    this.enrolledUsersStatusEnrolled.paginator = this.paginatorUsersStatusEnrolled;

    this.enrolledUsersStatusDone.sortingDataAccessor = (item, property) => {
      switch(property) {
        case 'name': return item.user.name;
        case 'surname': return item.user.surname;
        default: return item[property];
      }
    };
    //this.enrolledUsersStatusDone.sort = this.sort;
    this.enrolledUsersStatusDone.sort = this.DoneSort;
    this.enrolledUsersStatusDone.paginator = this.paginatorUsersStatusDone;


    this.authservice.currentUser.subscribe(x => this.currentUser = x);
    this.courseData = {courseid: 0, name: "", description: "", semester: "", startDate: "", endDate: "", updateDate: "", skills: [], events: [] };

    this.route.params.subscribe(params => {

      let id:number = 0;      
      if(params.hasOwnProperty('id')){
        id = +params.id;
        this.courseId = id;
      }

      if (id>0) {
        //console.log(id);

        this.cs.getTeachingCourseByUserId(this.currentUser.id).subscribe((myTeachingCourses: any[]) => {
          //console.log(myTeachingCourses);
          myTeachingCourses.forEach(element => {
            this.canEditCourse[element.course.courseid] = true;
          });
    
        });

        //get the list of courses done by the user to know if he is in the list (used to hide/show buttons)
        this.cs
        .getCompletedCourseByUserId(this.currentUser.id)
        .subscribe((coursesData: any[]) => {
            //console.log(coursesData);
            coursesData.forEach(element => {              
              if (element.course.courseid==id) {
                //this.userDoneThisCourse = true;
                this.isUserAsDone = true;
                this.userGrade = element.grade;
                //console.log(element);
              }
            });
        },
        error => {            
          console.log("error getting courses by user id")
        });

        //get list of couses teached by the user to know if he is in the list
        this.cs
          .getTeachingCourseByUserId(this.currentUser.id)
          .subscribe((data: any[]) => {
            //console.log(data);
            data.forEach((element, index) => {         
                //console.log(element);
                if (element.course.courseid==id) {
                  this.isUserAsTaught = true;
                }
            });                        
          },
          error => {            
            console.log("error getting courses toght by user id")
          });
          
                
        this.cs
        .getCourse(id).subscribe(
          dataCourse => {
            //console.log("course in db");
            //console.log(dataCourse);            
            this.courseData = dataCourse;

            this.reloadUserStatus(id);

            if (this.courseData.academic_organisation_id) {
              this.aos
                .getAcademicOrganization(this.courseData.academic_organisation_id).subscribe(
                dataAcademicOrganisation => {
                  //console.log(dataAcademicOrganisation);
                  this.nameAcademicOrganisation = dataAcademicOrganisation.title;
                  this.descriptionAcademicOrganisation = dataAcademicOrganisation.description;
              },
              error => {
                console.log("error recovering data academic organisation by id")
              });

            }

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

  
  filterByDoneStatus(element, index, array) 
  {  
       return element.course_status==='done'; 
  }
  filterByEnrolledStatus(element, index, array) 
  {  
       return element.course_status==='enrolled'; 
  }
  filterByProfessorStatus(element, index, array) 
  {  
       return element.course_status==='taught'; 
  }
  
  getEnrolledUsersByCourse(courseId: Number) {

    this.cs.
    getTeachersOfACourse(courseId).subscribe(
      (dataProfessors: any[]) => {
        //console.log(dataProfessors);   
        this.professorList.data = dataProfessors;
      },
      error => {
        console.log("error recovering enrolled users by course id")
      });
    
      if (this.isProfessor || this.isAdmin) {
        this.cs
        .getEnrolledUserByCourseId(courseId).subscribe(
        (dataEnrolledUsers: any[]) => {
          //console.log(dataEnrolledUsers);
          this.enrolledUsers = dataEnrolledUsers;
          this.enrolledUsersStatusDone.data = (dataEnrolledUsers.filter(this.filterByDoneStatus));
          this.enrolledUsersStatusEnrolled.data = (dataEnrolledUsers.filter(this.filterByEnrolledStatus));
          //this.professorList.data = (dataEnrolledUsers.filter(this.filterByProfessorStatus));
        },
        error => {
          console.log("error recovering enrolled users by course id")
        });
      }
/*
    this.cs.getUserEnrollmentStatusByCourseId(courseId, this.currentUser.id, 'done').subscribe(
      dataDone => {
        this.isUserAsDone = dataDone;
      },
      error => {
        this.isUserAsDone = false;    
      });
*/
/*
    this.cs.getUserEnrollmentStatusByCourseId(courseId, this.currentUser.id, 'taught').subscribe(
      dataTaught => {
        this.isUserAsTaught = dataTaught;
      },
      error => {
        this.isUserAsTaught = false;    
      });
*/      
  }

  relationUserCourse(courseId: number, action: string, type: string, userId: number): void {
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
        
        //console.log(this.grade);
        if (+this.grade>=0) {
          validInput = true;
          dataToPost['grade'] = +this.grade;
        }
      }
      else {
        validInput = true;
      }
      
      

      this.cs
      .enrollUser(userId, dataToPost).subscribe(
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
      .deleteEnrollUser(userId, courseId).subscribe(
        data => {
          //console.log("enroll user deleted!!");
          this.getEnrolledUsersByCourse(courseId);
          this.loadSpinner = false;
          this.isUserAsEnrolled = false;
          this.isUserAsTaught = false;
          this.isUserAsDone = false;
          this.userGrade = null;
          /*
          if (type=='enrolled'){
            this.isUserAsEnrolled = false;
          }
          else if (type=='taught'){
            this.isUserAsTaught = false;
          }
          else if (type=='done'){
            this.isUserAsDone = false;
          }
          */
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

  showErrorMessage: boolean = false;
  errorMessage: string = null;
  showSpinner: boolean = false;

  constructor(
    private cs: CoursesService,
    public dialogRef: MatDialogRef<DialogOverviewGradeDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

    setGradeToUser(courseId: number, userId: number): void {
      console.log("setGradeToUser");
      this.showSpinner = true;
      this.errorMessage = null;
      this.showErrorMessage = false;
      let dataToPost = {
          "course_id": courseId,
          "course_status": "done",
          "grade": +this.data.grade
      };
                    
        this.cs
        .enrollUser(userId, dataToPost).subscribe(
          data => {
            //console.log("enroll user!!");      
            this.showSpinner = false;
            this.dialogRef.close(this.data.grade); 
          },
          error => {
            console.log("Error enrolling user");                      
            console.log(error);
            this.showSpinner = false;
            this.showErrorMessage = true;
            this.errorMessage = error;
          }
        );
  
    }

    sendGradeData() {
      //console.log("sendGradeData");
      //console.log(this.data.userId);
      //console.log(this.data.courseId);
      this.setGradeToUser(this.data.courseId, this.data.userId);      
    }

  onNoClick(): void {
    this.dialogRef.close();
  }

}

@Component({
  selector: 'dialog-select-user',
  templateUrl: 'dialog-select-user.html',
  styleUrls: ['./courses-get.component.css'],
  //providers: [{
  //  provide: STEPPER_GLOBAL_OPTIONS, useValue: {showError: true}
  //}]
})
export class DialogSelectUser {

  //enrollment: string = "";
  //usersSelected = [];
  usersList: User[] = [];
  dataFiltered: User[] = [];
  listOfEnrolledUsers = [];

  toppings = new FormControl();

  constructor(
    //private FilterArrayByValueGetListPipe: FilterArrayByValueGetListPipe,
    private us: UsersService,
    private cs: CoursesService,
    private _formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<DialogSelectUser>,
    @Inject(MAT_DIALOG_DATA) public data: DialogDataEnrollment) {}
  
  
  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
    
    

  }


  enrollmentSelected(value) {
    //console.log(this.data.courseId);
    this.dataFiltered = [];
    this.data.usersSelected = [];
    this.data.grade = null;

      this.cs
      .getEnrolledUserByCourseId(this.data.courseId).subscribe(
      dataEnrolledUsers => {

        dataEnrolledUsers.forEach(element => {
          this.listOfEnrolledUsers.push(element.user.id);
        });

        this.us
        .getUsers()
        .subscribe((data: User[]) => {

          data.forEach(element => {

            let indexPos = this.listOfEnrolledUsers.indexOf(element.id);

            if (indexPos<0) {
              if ((value=='taught') && (element.role=="professor")) {
                this.dataFiltered.push(element);
              }
              //else if ((value=='enrolled') && (element.role=="student")) {
              else if (value=='enrolled') {
                this.dataFiltered.push(element);
              }
              //else if ((value=='done') && (element.role=="student")) {
              else if (value=='done') {
                this.dataFiltered.push(element);
              }
            }

          });

          this.dataFiltered.sort((a,b) => a.surname.toUpperCase().localeCompare(b.surname.toUpperCase()));
          this.usersList = this.dataFiltered;

        });      
      
    },
    error => {
      console.log("error recovering enrolled users by course id")
    });

    

  }

}