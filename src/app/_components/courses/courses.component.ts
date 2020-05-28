import {Component, OnInit, ViewChild, Inject} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';


import Course from '../../_models/course';
import { CoursesService } from '../../_services/courses.service';
import { ExcelServiceService } from '../../_services/excel/excel-service.service';
import { ConfirmDialogModel, ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { TranslateService } from '@ngx-translate/core';
import { MatSnackBar, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { AuthService } from '../../_services';
import { UsersService } from '../../_services/users.service';
import User from '../../_models/user';
import { ActivatedRoute, Router } from '@angular/router';

export interface AvailableCourses {
  id: number;
  
}

//const ELEMENT_DATA: Course[] = [];
let ELEMENT_DATA: Course[] = [];



@Component({
  selector: 'app-coursess',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})


export class CoursesComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'semester', 'action'];

  //dataSource = ELEMENT_DATA;
  dataSource = new MatTableDataSource(ELEMENT_DATA);
  currentUser: User;

  @ViewChild(MatPaginator, {static: true}) 
  paginator: MatPaginator;  
  
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  courses: Course[];
  constructor(private router: Router, private us: UsersService, private authservice: AuthService, private cs: CoursesService, private excelService:ExcelServiceService, public dialog: MatDialog, private translate: TranslateService) { 
    
    this.authservice.currentUser.subscribe(x => this.currentUser = x);

  }

  

  confirmDialog(id, title): void {
    //const message = `Are you sure you want to do this?`;
    const message = this.translate.instant('JOBS.DELETE_MESSAGE') + " ("+title+")";
    
    const dialogData = new ConfirmDialogModel(this.translate.instant('JOBS.CONFIRM_ACTION'), message);

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "400px",
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      //this.result = dialogResult;

      if (dialogResult) {
         console.log("Under construction");

         this.cs
         .deleteCourse(id).subscribe(
           data => {
             console.log("course deleted!!");
             this.router.navigate(["/courses"]);

             
           },
           error => {
             alert("Error deleting the course");                      
           }
         );

      }
    });
  }
  


  coursesList = [];

  ngOnInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;

    if(!this.currentUser) {
      //if(!this.currentUser.hasOwnProperty('id')){
        this.currentUser={id:0,role:'', userName:'', name:'', surname:'', email:''};
      }

    this.cs
      .getCourses()
      .subscribe((data: Course[]) => {
        this.courses = data;                
        this.dataSource.data = data;        
        ELEMENT_DATA = data;
    });
   

  }

  exportExcel(){    
    this.excelService.exportAsExcelFile(ELEMENT_DATA, 'list_of_coursess');
  }

}
