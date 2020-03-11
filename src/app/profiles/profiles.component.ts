import {Component, OnInit, ViewChild } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';

@Component({
  selector: 'app-profiles',
  templateUrl: './profiles.component.html',
  styleUrls: ['./profiles.component.css']
})
/*
export class ProfilesComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
}
*/

export class ProfilesComponent implements OnInit {

  constructor(  ) { }

  displayedColumns: string[] = ['id', 'username', 'name', 'surname', 'role', 'action'];

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

export interface listOfUsers {
  name: string;
  surname: string,
  email: string,
  username: string;
  id: number;
  avatar_path: string,
  university: string,
  role: string
}

const ELEMENT_DATA: listOfUsers[] = [
  {name: 'Dilbert', surname: 'Adams', email: 'dilbert.adams@qualichain-project.eu', username: 'dilbert.adams', id: 1 , avatar_path: 'assets/img/dilbert.jpg', university:'National University of Athens', role:'Student'},
  {name: 'Pointy-Haired Boss', surname: 'Adams', email: 'phb@qualichain-project.eu', username: 'phb'         , id: 2 , avatar_path: 'assets/img/pointy-haired_boss.jpg', university: 'University of Vic', role:'Teacher'},
  {name: 'Dogbert', surname: 'Adams', email: 'dogbert.adams@qualichain-project.eu', username: 'dogbert.adams', id: 3 , avatar_path: 'assets/img/dogbert.png', university:'University of Barcelona', role:'Student'},
  {name: 'Ratbert', surname: 'Adams', email: 'ratbert.adams@qualichain-project.eu', username: 'ratbert.adams', id: 4 , avatar_path: '', university:'UPC', role:'Student'},
  {name: 'Recruiter', surname: 'demo', email: 'recruiter.demo@qualichain-project.eu', username: 'recruiter.demo', id: 5 , avatar_path: 'assets/img/recruiter.png', university:'', role:'Recruiter'}
];

