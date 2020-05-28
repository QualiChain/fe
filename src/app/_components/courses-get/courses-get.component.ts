import { Component, OnInit, ɵConsole } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CoursesService } from '../../_services/courses.service';
import Course from '../../_models/course';
import User from '../../_models/user';
import { MatDialog } from '@angular/material';

import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../_services';

@Component({
  selector: 'app-courses-get',
  templateUrl: './courses-get.component.html',
  styleUrls: ['./courses-get.component.css']
})
export class CoursesGetComponent implements OnInit {

  currentUser: User;

  constructor(
    private authservice: AuthService,
    public dialogModal: MatDialog, 
    private route: ActivatedRoute,
    private cs: CoursesService,
    private translate: TranslateService
  ) { }


  courseData: Course;
  
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
        .getCourse(id)
        .subscribe((dataCourse: Course) => {
          //console.log(dataCourse);
          this.courseData = dataCourse;
        });
      }

    });

  }

}