import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { UsersService } from '../../_services/users.service';
import { CoursesService } from '../../_services/courses.service'
import Course from '../../_models/course';
import {PageEvent} from '@angular/material/paginator';

@Component({
  selector: 'app-curriculum-gap-analysis',
  templateUrl: './curriculum-gap-analysis.component.html',
  styleUrls: ['./curriculum-gap-analysis.component.css']
})
export class CurriculumGapAnalysisComponent implements OnInit {

  userid: number;

  constructor(
    private route: ActivatedRoute, 
    private translate: TranslateService,
    private router: Router,
    private us: UsersService,
    private cs: CoursesService
    ) { }

  ngOnInit(): void {

    this.route.params.subscribe(params => {
      
      //console.log(params['id']);
      this.userid=params['id'];
      
      if (this.userid>0) {

        this.us
        .getUser(this.userid).subscribe(
          data => {
            console.log(data);
          },
          error => {            
            this.router.navigate(["/not_found"]);
          }
        )

      }
      else {
        this.router.navigate(["/not_found"]);
      }

    });            
  }

}
