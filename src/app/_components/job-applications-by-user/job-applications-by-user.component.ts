import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { JobsService } from '../../_services/jobs.service';

import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import { Job } from '../../_models/Job';

@Component({
  selector: 'app-job-applications-by-user',
  templateUrl: './job-applications-by-user.component.html',
  styleUrls: ['./job-applications-by-user.component.css']
})
export class JobApplicationsByUserComponent implements OnInit {

  @Input() userId: number = null;

  displayedColumns: string[] = ['label', 'availability', 'expectedSalary',  'action'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);
  jobData: Job;

  @ViewChild(MatPaginator, {static: true}) 
  paginator: MatPaginator;  

  @ViewChild(MatSort, {static: true}) sort: MatSort;

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  jobsApplies = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private js: JobsService) { }

  ngOnInit(): void {


    if (!this.userId) {
      this.route.params.subscribe(params => {
      if(params.hasOwnProperty('id')){
        this.userId = +params.id;
      }
    });
    }

    if (this.userId) {
      this.js
      .getJobAppliesPerCandidat(this.userId).subscribe(
        data => {
          //console.log("list of jobs applies per user");
          data.forEach(element => {



            this.js
            .getJob(element.jobURI).subscribe(
              (dataJob: Job) => {
                //console.log("job in db");
                //console.log(dataCourse);
                this.jobsApplies.push({'label':dataJob.label, 'jobURI': element.jobURI,'availability':element.availability, 'expectedSalary':element.expectedSalary});
              this.dataSource.data = this.jobsApplies;
              },
              error => {
                console.log("error getting job data");            
              }
            );



          });
        },
        error => {
          console.log("jobs applies not found in db");                        
        }
      );
    }

    
  }

}

let ELEMENT_DATA: any[] = [];

// another component with a different view.
@Component({
  selector: 'app-recomended-jobs-page',
  templateUrl: './job-applications-by-user-page.component.html',
  styleUrls: ['./job-applications-by-user.component.css']
})
export class JobAppliesComponentPage extends JobApplicationsByUserComponent{




}

