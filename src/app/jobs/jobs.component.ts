import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';

import Job from '../_models/Job';
import { JobsService } from '../_services/jobs.service';

export interface AvailableJobs {
  id: number;
  skill: string;
  required_level: string;
  priority: string
}

const ELEMENT_DATA: AvailableJobs[] = [
  {id: 1, skill: 'Angular', required_level: 'req. level 1', priority: '1'},
  {id: 2, skill: 'Java', required_level: 'req. level 2', priority: '2'},
  {id: 3, skill: 'Nodejs', required_level: 'req. level 3', priority: '3'},
  {id: 4, skill: 'Python', required_level: 'req. level 4', priority: '4'},
  {id: 5, skill: 'Drupal', required_level: 'req. level 5', priority: '3'},  
  {id: 6, skill: 'Javascript', required_level: 'req. level 2', priority: '2'},
  {id: 7, skill: 'C/CPP', required_level: 'req. level 7', priority: '7'},
  {id: 8, skill: 'PHP', required_level: 'req. level 2', priority: '2'},
  {id: 9, skill: 'Swift', required_level: 'req. level 4', priority: '7'},
  {id: 10, skill: 'C#', required_level: 'req. level 3', priority: '8'},
  {id: 11, skill: 'Ruby', required_level: 'req. level 1', priority: '3'},
  {id: 12, skill: 'SQL', required_level: 'req. level 3', priority: '4'}
];


@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.css']
})
/*
export class JobsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
*/

export class JobsComponent implements OnInit {
  displayedColumns: string[] = ['id', 'skill', 'required_level', 'priority', 'action'];
  
  
  //dataSource = ELEMENT_DATA;
  dataSource = new MatTableDataSource(ELEMENT_DATA);

  @ViewChild(MatPaginator, {static: true}) 
  paginator: MatPaginator;  
  
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  jobs: Job[];
  constructor(private js: JobsService) { }
  jobsList = [];

  ngOnInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;


    this.js
      .getJobs()
      .subscribe((data: Job[]) => {
        this.jobs = data;
        
    });

    

  }

}