import { Component, OnInit, Input } from '@angular/core';
import { RecomendationsService } from '../../_services/recomendations.service';

@Component({
  selector: 'app-recomended-courses',
  templateUrl: './recomended-courses.component.html',
  styleUrls: ['./recomended-courses.component.css']
})
export class RecomendedCoursesComponent implements OnInit {

  @Input() userId: number = null;

  recomendedCourses = [];

  constructor( private rs: RecomendationsService ) { }

  ngOnInit() {

    if (this.userId) {
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
    }    

  }

}
