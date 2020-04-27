import {Component, OnInit, ViewChild } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-award-smart-badge',
  templateUrl: './award-smart-badge.component.html',
  styleUrls: ['./award-smart-badge.component.css']
})
/*
export class AwardSmartBadgeComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
}
*/

export class AwardSmartBadgeComponent implements OnInit {
 
  //@ViewChild('closebutton') closebutton;
 
  form: FormGroup;
  listOfSmartAwards = [
    {id: 1 , title: 'Operating System-Laboratory Exercise'},
    {id: 2 , title: 'Operating Systems-Written Reports'},
    {id: 3 , title: 'Operating Systems-Hackathon'},
    {id: 4 , title: 'Operating Systems-Begginer'},
    {id: 5 , title: 'Operating Systems-Master'}
  ];

  selectedUserAwards: any = [];
  selectedUSer: number;
  courseId: number;
  
  constructor(private fb: FormBuilder, private route: ActivatedRoute) { }
  
  onSubmitAwards() {


    ELEMENT_DATA.forEach((element, index) => {
     
      if (element.id==this.selectedUSer) {
        this.selectedUserAwards.sort();
        element.aqcuired_badges = this.selectedUserAwards;
        element.aqcuired_badges;
        ELEMENT_DATA[index]=element;
      }    
      
    });

    document.getElementById("closeAwardModal").click();
    

//    this.dataSource.data = ELEMENT_DATA;

    //this.closebutton.nativeElement.click();
    
  }

  

  awardUser(userId, userData): void {
    //const message = `Are you sure you want to do this?`;
    //console.log(userId);
    //console.log(userData);
    this.selectedUSer = userId;

    this.selectedUserAwards = [];
    userData.aqcuired_badges.forEach((element, index) => {      
      //console.log("index:"+index+"---element:"+element);
      this.selectedUserAwards.push(element);      
    });

    //this.selectedUserAwards = userData.aqcuired_badges;
  }
  
  onSelectItem(item: []) {
    //console.log(item['id']);
    //this.userAwards = item['id'];
    //console.log(this.selectedUserAwards.indexOf(item['id']) > -1);

    if (this.selectedUserAwards.indexOf(item['id']) > -1) {
      this.selectedUserAwards.splice(this.selectedUserAwards.indexOf(item['id']), 1);
    }
    else {
      //this.selectedUserAwards[item['id']] = item['id'];
      this.selectedUserAwards.push(item['id']);
    }
    
    //console.log(this.selectedUserAwards);
  }

  displayedColumns: string[] = ['id', 'student', 'semester', 'grade', 'aqcuired_badges', 'action'];

  dataSource = new MatTableDataSource(ELEMENT_DATA);
  //dataSource = new MatTableDataSource<listOfStudents>([]);

  @ViewChild(MatPaginator, {static: true}) 
  paginator: MatPaginator;  
  
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  
  ngOnInit() {
    //this.dataSource.data = ELEMENT_DATA;
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    //this.userAwards.push(0);

    this.route.params.subscribe(params => {
      const id = +params.id;
      //console.log(id);
      this.courseId = id;
    });


  }
 

}

export interface listOfStudents {
  id: number;
  student: string;
  semester: string,
  grade: string,
  aqcuired_badges: any
}

const ELEMENT_DATA: listOfStudents[] = [
  {id: 1 , student: 'Dilbert Adams', semester: '6', grade: '-', aqcuired_badges: []},
  {id: 2 , student: 'Dogbert Adams', semester: '8', grade: '9', aqcuired_badges: [1,2,3,4]},
  {id: 3 , student: 'Ratbert Adams', semester: '6', grade: '8', aqcuired_badges: [1,4]},
  {id: 4 , student: 'student X', semester: '3', grade: '2', aqcuired_badges: [2]}
];
