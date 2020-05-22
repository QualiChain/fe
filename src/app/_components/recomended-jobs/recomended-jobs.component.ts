import { Component, OnInit, Input } from '@angular/core';
import { RecomendationsService } from '../../_services/recomendations.service';

@Component({
  selector: 'app-recomended-jobs',
  templateUrl: './recomended-jobs.component.html',
  styleUrls: ['./recomended-jobs.component.css']
})
export class RecomendedJobsComponent implements OnInit {

  @Input() userId: number = null;

  recomendedJobs = [];

  constructor( private rs: RecomendationsService ) { }
  
  ngOnInit() {

    if (this.userId) {
      this.rs
      .getRecomendationsJobs(this.userId).subscribe(
        data => {
          //console.log("list of recomended jobs");
          //console.log(data);
          this.recomendedJobs = data;
        },
        error => {
          console.log("recomended jobs not found in db");                        
        }
      );
    }

  }

}
