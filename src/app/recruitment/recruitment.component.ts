import {Component, OnInit, ViewChild } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';

@Component({
  selector: 'app-recruitment',
  templateUrl: './recruitment.component.html',
  styleUrls: ['./recruitment.component.css']
})
/*
export class RecruitmentComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
}
*/

export class RecruitmentComponent implements OnInit {

  constructor(  ) { }

  displayedColumns: string[] = ['id', 'title', 'action'];

  dataSource = new MatTableDataSource(ELEMENT_DATA);

  @ViewChild(MatPaginator, {static: true}) 
  paginator: MatPaginator;  
  
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  
  ngOnInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;

  }
 

}

export interface listOfJobs {
  title: string;
  id: number
}

const ELEMENT_DATA: listOfJobs[] = [
  {title: 'Solutions Architect', id: 1},
  {title: 'Tech Lead/ Software Architect', id: 2},
  {title: 'Senior Software Engineer', id: 3},
  {title: 'Blockchain Engineer', id: 4},
  {title: 'Backend developer', id: 5},
  {title: 'PHP Senior Developer', id: 6}
];

