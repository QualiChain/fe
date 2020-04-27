import {Component, OnInit, ViewChild } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import { UsersService } from '../../_services/users.service';
import User from '../../_models/User';

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

  users: User[];
  isLoadingResults = false;
  constructor(private us: UsersService) { }

  displayedColumns: string[] = ['id', 'username', 'name', 'surname', 'role', 'action'];

  dataSource = new MatTableDataSource(ELEMENT_DATA);
  //dataSource = new MatTableDataSource();
  

  @ViewChild(MatPaginator, {static: true}) 
  paginator: MatPaginator;  
  
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  
  ngOnInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;

    this.us
      .getUsers()
      .subscribe((data: User[]) => {
        
        ELEMENT_DATA.forEach(element => {
          data.push(element);
        });
        this.dataSource.data = data;

    });

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
/*
const ELEMENT_DATA: listOfUsers[] = [
  {name: 'Dilbert', surname: 'Adams', email: 'dilbert.adams@qualichain-project.eu', username: 'dilbert.adams', id: 1 , avatar_path: 'assets/img/dilbert.jpg', university:'National University of Athens', role:'Student'},
  {name: 'Pointy-Haired Boss', surname: 'Adams', email: 'phb@qualichain-project.eu', username: 'phb'         , id: 2 , avatar_path: 'assets/img/pointy-haired_boss.jpg', university: 'University of Vic', role:'Teacher'},
  {name: 'Dogbert', surname: 'Adams', email: 'dogbert.adams@qualichain-project.eu', username: 'dogbert.adams', id: 3 , avatar_path: 'assets/img/dogbert.png', university:'University of Barcelona', role:'Student'},
  {name: 'Ratbert', surname: 'Adams', email: 'ratbert.adams@qualichain-project.eu', username: 'ratbert.adams', id: 4 , avatar_path: '', university:'UPC', role:'Student'},
  {name: 'Recruiter', surname: 'demo', email: 'recruiter.demo@qualichain-project.eu', username: 'recruiter.demo', id: 5 , avatar_path: 'assets/img/recruiter.png', university:'', role:'Recruiter'}
];
*/
const ELEMENT_DATA: User[] = [
  {name: 'Dilbert', surname: 'Adams', email: 'dilbert.adams@qualichain-project.eu', userName: 'dilbert.adams', id: 11 , avatar_path: 'assets/img/dilbert.jpg', role:'Student'},
  {name: 'Pointy-Haired Boss', surname: 'Adams', email: 'phb@qualichain-project.eu', userName: 'phb'         , id: 22 , avatar_path: 'assets/img/pointy-haired_boss.jpg', role:'Teacher'},
  {name: 'Dogbert', surname: 'Adams', email: 'dogbert.adams@qualichain-project.eu', userName: 'dogbert.adams', id: 32 , avatar_path: 'assets/img/dogbert.png', role:'Student'},
  {name: 'Ratbert', surname: 'Adams', email: 'ratbert.adams@qualichain-project.eu', userName: 'ratbert.adams', id: 44 , avatar_path: '',  role:'Student'},
  {name: 'Recruiter', surname: 'demo', email: 'recruiter.demo@qualichain-project.eu', userName: 'recruiter.demo', id: 55 , avatar_path: 'assets/img/recruiter.png', role:'Recruiter'}
];


//const ELEMENT_DATA: User[] = [];