import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RecomendationsService } from '../../_services/recomendations.service';

import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';

@Component({
  selector: 'app-recomended-jobs',
  templateUrl: './recomended-jobs.component.html',
  styleUrls: ['./recomended-jobs.component.css']
})
export class RecomendedJobsComponent implements OnInit {

  @Input() userId: number = null;

  //displayedColumns: string[] = ['title', 'job_description', 'rating', 'action'];
  displayedColumns: string[] = ['label', 'jobDescription', 'action'];
  
  dataSource = new MatTableDataSource(ELEMENT_DATA);

  @ViewChild(MatPaginator, {static: true}) 
  paginator: MatPaginator;  

  @ViewChild(MatSort, {static: true}) sort: MatSort;

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  recomendedJobs = [];

  constructor( 
    private router: Router,
    private route: ActivatedRoute,
    private rs: RecomendationsService ) { }
  
  ngOnInit() {

    //console.log(this.userId);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;    

    if (!this.userId) {
      this.route.params.subscribe(params => {
      if(params.hasOwnProperty('id')){
        this.userId = +params.id;
      }
    });
    }


    

    if (this.userId) {
      this.rs
      .getRecomendationsJobs(this.userId).subscribe(
        data => {
          //console.log("list of recomended jobs");
          //console.log(data);
          this.recomendedJobs = data;

          //console.log(this.userId);    
          
          let tmpData = [];
          /*
          for (let index = 0; index < 12; index++) {
            this.recomendedJobs.push({'job':{'id':index,'title': 'title '+index,'job_description': 'description ' +index, 'rating': 70+index}});            
          }
          */

          this.recomendedJobs.forEach(element => {
            //tmpData.push(element.job);
            tmpData.push(element);
          });
          this.dataSource.data = tmpData;
          //console.log(this.recomendedJobs);
          //console.log(this.dataSource);

        },
        error => {
          console.log("recomended jobs not found in db");                        
        }
      );
    }

  }

}

let ELEMENT_DATA: any[] = [];

// another component with a different view.
@Component({
  selector: 'app-recomended-jobs-page',
  templateUrl: './recomended-jobs-page.component.html',
  styleUrls: ['./recomended-jobs.component.css']
})
export class RecomendedJobsComponentPage extends RecomendedJobsComponent{




}