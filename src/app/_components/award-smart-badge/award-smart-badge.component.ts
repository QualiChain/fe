import {Component, OnInit, ViewChild, Inject } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { UsersService } from '../../_services/users.service';

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
  /*
  listOfSmartAwards = [
    {id: 1 , title: 'Operating System-Laboratory Exercise'},
    {id: 2 , title: 'Operating Systems-Written Reports'},
    {id: 3 , title: 'Operating Systems-Hackathon'},
    {id: 4 , title: 'Operating Systems-Begginer'},
    {id: 5 , title: 'Operating Systems-Master'}
  ];
  */
  listOfSmartAwards = fulListOfSmartAwards;

  selectedUserAwards: any = [];
  selectedUSer: number;
  courseId: number;
  
  constructor(private fb: FormBuilder, private route: ActivatedRoute, public awardDialog: MatDialog, public createAwardDialog: MatDialog) { }


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
 
  openAwardDialog(userId: number, element: any) {
    //console.log(userId)
    
   // const dialogRef = this.awardDialog.open(awardDialog_modal);

    const dialogRef = this.awardDialog.open(awardDialog_modal, {
      width: '550px',
      data: {userId: userId, element: element}
    });

    dialogRef.afterClosed().subscribe(result => {
    });
    
  }

  openCreateAwardDialog() {

    const dialogRef = this.createAwardDialog.open(createAwardDialog_modal, {
      width: '550px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
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

@Component({
  selector: 'createAwardDialog',
  templateUrl: './createAwardDialog.html',
  styleUrls: ['./award-smart-badge.component.css']
})
export class createAwardDialog_modal implements OnInit {
  badgelabel: string;
  badgedescription: string;

  constructor() {}


  ngOnInit() {
    
  }

  onSubmitCreateAwardsModal() {
    
    fulListOfSmartAwards.push({id: fulListOfSmartAwards.length+1 , title: this.badgelabel, description: this.badgedescription });
    document.getElementById("closeCreateAwardModalWindow").click();

  }
}

@Component({
  selector: 'awardDialog',
  templateUrl: './awardDialog.html',
})

export class awardDialog_modal implements OnInit {

  listOfSmartAwards = fulListOfSmartAwards;
  selectedUserAwards: any = [];

  constructor(
    public createAwardDialog: MatDialog,
    private us: UsersService,
    public dialogRef: MatDialogRef<awardDialog_modal>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}


  ngOnInit() {

    this.selectedUserAwards = [];
    this.data.element.aqcuired_badges.forEach((element, index) => {      
      //console.log("index:"+index+"---element:"+element);
      this.selectedUserAwards.push(element);      
    });

    this.us
        .getUser(this.data.userId).subscribe(
          data => {
            console.log("user in db");            
          },
          error => {
            console.log("user not found in db");
            
            
          }
        );

  }

  openCreateAwardDialog() {

    const dialogRef = this.createAwardDialog.open(createAwardDialog_modal, {
      width: '550px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
    });
    
  } 

  onSelectItemModalWindow(item: []) {
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

  onSubmitAwardsModal() {

    //console.log(this.data.userId);
    /*
    ELEMENT_DATA.forEach((element, index) => {
     
      if (element.id==this.selectedUSer) {
        this.selectedUserAwards.sort();
        element.aqcuired_badges = this.selectedUserAwards;
        element.aqcuired_badges;
        ELEMENT_DATA[index]=element;
      }    
      
    });
    */

   ELEMENT_DATA.forEach((element, index) => {
     
    if (element.id==this.data.userId) {
      this.selectedUserAwards.sort();
      element.aqcuired_badges = this.selectedUserAwards;
      element.aqcuired_badges;
      ELEMENT_DATA[index]=element;
    }    
    
  });

    document.getElementById("closeAwardModalWindow").click();
    
    
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}

export interface DialogData {
  userId: number;
  element: any;
}

const fulListOfSmartAwards = [
  {id: 1 , title: 'Operating System-Laboratory Exercise', description:'test 1'},
  {id: 2 , title: 'Operating Systems-Written Reports', description:'test 2'},
  {id: 3 , title: 'Operating Systems-Hackathon', description:'test 3'},
  {id: 4 , title: 'Operating Systems-Begginer', description:'test 4'},
  {id: 5 , title: 'Operating Systems-Master', description:'test 5'}
];

