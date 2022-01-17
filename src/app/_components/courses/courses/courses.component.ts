import {Component, OnInit, ViewChild, Inject, Input, HostListener } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';


import Course from '../../../_models/course';
import { CoursesService } from '../../../_services/courses.service';
import { ExcelServiceService } from '../../../_services/excel/excel-service.service';
import { ConfirmDialogModel, ConfirmDialogComponent } from '../../utils/confirm-dialog/confirm-dialog.component';
import { TranslateService } from '@ngx-translate/core';
//import { MatSnackBar, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { MatDialog } from '@angular/material/dialog';
//import { MatDialogRef } from '@angular/material/dialog';
//import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { AuthService } from '../../../_services';
import { UsersService } from '../../../_services/users.service';
import User from '../../../_models/user';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponent } from '../../../app.component';
import AcademicOrganisation from '../../../_models/academicorganisation';
import { AcademicOrganisationService } from '../../../_services/academicorganisation.services';

export interface AvailableCourses {
  id: number;
  
}

//const ELEMENT_DATA: Course[] = [];
//let ELEMENT_DATA: Course[] = [];
let ELEMENT_DATA: any[] = [];

@Component({
  selector: 'app-coursess',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})


export class CoursesComponent implements OnInit {
  //displayedColumns: string[] = ['courseid', 'name', 'semester', 'action'];
  displayedColumns: string[] = ['name', 'semester', 'academic_organisation', 'action'];

  searchedTerm: string = null;
  showDescription: any[] = [];

  //matSortActiveValue: string = "name";
  //matSortDirectionValue: string = "asc";
  matSortActiveValue: string = localStorage.getItem('QC_course_search_sort_name');
  matSortDirectionValue: string = localStorage.getItem('QC_course_search_sort_direction');

  //dataSource = ELEMENT_DATA;
  dataSource = new MatTableDataSource(ELEMENT_DATA);
  currentUser: User;
  canEditCourse = [];

  @ViewChild(MatPaginator, {static: true}) 
  paginator: MatPaginator;  
  
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  changeDefaultSort() {
    //console.log("changeDefaultSort");
    localStorage.setItem('QC_course_search_sort_name', this.sort.active);
    localStorage.setItem('QC_course_search_sort_direction', this.sort.direction);
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (filterValue) {
      localStorage.setItem('QC_course_search_term', filterValue);
    }
    else {
      localStorage.removeItem('QC_course_search_term');
    }
    
  }

  courses: Course[];
  listAllAcademicOrganizations: AcademicOrganisation[] = [];

  showLoading : boolean = true;
  constructor(
    public aos: AcademicOrganisationService,
    private appcomponent: AppComponent,
    private router: Router, private us: UsersService, public authservice: AuthService, private cs: CoursesService, private excelService:ExcelServiceService, public dialog: MatDialog, private translate: TranslateService) { 
    
    this.authservice.currentUser.subscribe(x => this.currentUser = x);

  }

  isLogged = this.appcomponent.isLogged;
  isAdmin = this.appcomponent.isAdmin;
  isRecruiter = this.appcomponent.isRecruiter;
  //isTeacher = this.appcomponent.isTeacher;
  isProfessor = this.appcomponent.isProfessor;
  isStudent = this.appcomponent.isStudent;
  isEmployee = this.appcomponent.isEmployee;


  confirmDialog(id, title): void {
    
    //const message = `Are you sure you want to do this?`;
    const message = this.translate.instant('COURSES.DELETE_MESSAGE') + " ("+title+")";
    
    const dialogData = new ConfirmDialogModel(this.translate.instant('COURSES.CONFIRM_ACTION'), message);

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "400px",
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      //this.result = dialogResult;

      if (dialogResult) {
         //console.log("Under construction");

         this.cs
         .deleteCourse(id).subscribe(
           data => {
             //console.log("course deleted!!");
             let posI = this.dataSource.data.findIndex(function(course){ return course.courseid === id })
             if (posI>0) {
               this.dataSource.data.splice(posI, 1);
               this.courses.splice(posI, 1);
               this.dataSource._updateChangeSubscription();
              }
              //this.router.navigate(["/courses"]);
           },
           error => {
             alert("Error deleting the course");                      
           }
         );

      }
    });
  }
  


  coursesList = [];

  filterByProfessorStatus(element, index, array) 
  {  
       return element.course_status==='taught'; 
  }
  
  paginatorAction(event: any) {
    localStorage.setItem('QC_course_search_pagination_index', event.pageIndex);
    localStorage.setItem('QC_course_search_pagination_size', event.pageSize);
  }

  ngOnInit() {

    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    

    if(!this.currentUser) {
      //if(!this.currentUser.hasOwnProperty('id')){
        this.currentUser={id:0,role:'', userName:'', name:'', surname:'', email:''};
      }

      this.aos.getAcademicOrganizations().subscribe(
        academicOrganizationsData => {
          //console.log(academicOrganizationsData);
          academicOrganizationsData.sort((a,b) => (a.title.toUpperCase() > b.title.toUpperCase()) ? 1 : ((b.title.toUpperCase() > a.title.toUpperCase()) ? -1 : 0))
          this.listAllAcademicOrganizations = academicOrganizationsData;
        },
        error => {
          console.log("error getting academic organisations data");
        }
      );

    this.cs.getTeachingCourseByUserId(this.currentUser.id).subscribe((myTeachingCourses: any[]) => {
      //console.log(myTeachingCourses);
      myTeachingCourses.forEach(element => {
        this.canEditCourse[element.course.courseid] = true;
      });

    });

    this.dataSource.data = [];
    this.cs
      .getCourses()
      .subscribe((data: Course[]) => {
        //console.log(data);
        let dataToPush: any[] =[];
        
        data.forEach(element => {
                    
          let orgName = "";

          if (element.academic_organisation_id) {
              let orgObject = this.listAllAcademicOrganizations.find(i => i.id === element.academic_organisation_id);
              if (orgObject) {
                orgName = orgObject['title'];
              }
          }
          
          dataToPush.push({courseid:element.courseid, name:element.name, semester: element.semester, description:element.description, academic_organisation: orgName});
          //console.log(element);
        });
        
        this.courses = dataToPush;                
        this.dataSource.data = dataToPush;        
        ELEMENT_DATA = dataToPush;
        
        

        this.searchedTerm = localStorage.getItem('QC_course_search_term');
        if (this.searchedTerm) {
          this.applyFilter(this.searchedTerm);          
        }
        let defaultPage = localStorage.getItem('QC_course_search_pagination_index');
        if (defaultPage) {
          this.paginator.pageIndex = +(defaultPage);
        }
        else {
          this.paginator.pageIndex = 0;
        }
        
        let defaultSize = localStorage.getItem('QC_course_search_pagination_size');
        if (defaultSize) {
          this.paginator.pageSize = +(defaultSize);
        }
        
        

        this.showLoading = false;
        /*
        data.forEach(element => {
          //console.log(element.courseid);
          this.cs
          .getEnrolledUserByCourseId(element.courseid).subscribe(
          (dataEnrolledUsers: any[]) => {
            //console.log(dataEnrolledUsers);

            let professorList = (dataEnrolledUsers.filter(this.filterByProfessorStatus));
            console.log(professorList);
            professorList.forEach(professorInList => {

              console.log(this.currentUser.id);
              console.log(professorInList.user.id);
              if (professorInList.user.id==this.currentUser.id) {

              }

            });

          },
          error => {
            console.log("error recovering enrolled users by course id")
          });
        
        });
        */
    },
           error => {
            console.log("Error loading courses"); 
             this.showLoading = false;                     
           });
   

  }

  exportExcel(){    
    this.excelService.exportAsExcelFile(ELEMENT_DATA, 'list_of_coursess');
  }

}


@Component({
  selector: 'app-coursess-touch-by-user',
  templateUrl: './coursesTouchByUser.html',
  styleUrls: ['./courses.component.css']
})


export class CoursesTouchByUserComponent implements OnInit {

  @Input() userId: number;
  myCourses : any[] = [];
  lodingspinner : boolean = false;
  constructor(
    private cs: CoursesService
  ) { }

  ngOnInit(): void {

    if (this.userId) {

      this.cs.getTeachingCourseByUserId(+this.userId).subscribe(
        coursesByUser => {
          
          //console.log(badgesByUser);
          this.myCourses = coursesByUser;
          this.lodingspinner = false;
          
        },
        error => {
          this.lodingspinner = false;
          console.log("error getting courses per user");
        }
      );

    }
  }
}

@Component({
  selector: 'app-courses-enrollment-by-user',
  templateUrl: './coursesEnrollmentByUser.html',
  styleUrls: ['./courses.component.css']
})

export class CoursesEnrollmentByUserComponent implements OnInit {

  @Input() userId: number;
  myCourses : any[] = [];
  lodingspinner : boolean = false;
  constructor(
    private cs: CoursesService
  ) { }

  ngOnInit(): void {

    if (this.userId) {

      
      this.cs.getEnrolledCourseByUserId(+this.userId).subscribe(
        coursesEnrolledByUser => {
          
          //console.log(coursesEnrolledByUser);
          //this.myCourses = coursesEnrolledByUser;
          coursesEnrolledByUser.forEach((elementCourse, index) => {
            this.myCourses.push(elementCourse);
          });
          this.myCourses.sort((a, b) => (a.course.name.toUpperCase() > b.course.name.toUpperCase()) ? 1 : -1)
          this.lodingspinner = false;
          
        },
        error => {
          this.lodingspinner = false;
          console.log("error getting enrolled courses per user");
        }
      );

      this.cs.getCompletedCourseByUserId(+this.userId).subscribe(
        coursesCompletedByUser => {
          
          //console.log(coursesCompletedByUser);
          //this.myCourses = coursesCompletedByUser;
          coursesCompletedByUser.forEach((elementCourse, index) => {
            this.myCourses.push(elementCourse)
          });
          this.myCourses.sort((a, b) => (a.course.name.toUpperCase() > b.course.name.toUpperCase()) ? 1 : -1)
          this.lodingspinner = false;
          
        },
        error => {
          this.lodingspinner = false;
          console.log("error getting completted courses per user");
        }
      );

    }
  }
}