import {Component, OnInit, ViewChild, Inject } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import { UsersService } from '../../../_services/users.service';
import User from '../../../_models/user';
//import { MatSnackBar, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { MatDialog } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { AuthService } from '../../../_services';
import { ConfirmDialogModel, ConfirmDialogComponent } from '../../utils/confirm-dialog/confirm-dialog.component';
import { TranslateService } from '@ngx-translate/core';
import { AppComponent } from '../../../app.component';
import { CoursesService } from '../../../_services/courses.service';

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

  currentUser: User;
  
  constructor(
    private cs: CoursesService,
    private appcomponent: AppComponent,
    private translate: TranslateService,
    public dialog: MatDialog,
    private authservice: AuthService, private us: UsersService, public createChangePasswordDialog: MatDialog) { 

    this.authservice.currentUser.subscribe(x => this.currentUser = x);

  }

  isLogged = this.appcomponent.isLogged;
  isAdmin = this.appcomponent.isAdmin;
  isRecruiter = this.appcomponent.isRecruiter;
  //isTeacher = this.appcomponent.isTeacher;
  isProfessor = this.appcomponent.isProfessor;
  isStudent = this.appcomponent.isStudent;
  isEmployee = this.appcomponent.isEmployee;
  

  //displayedColumns: string[] = ['id', 'userName', 'name', 'surname', 'role', 'action'];
  displayedColumns: string[] = ['id', 'userName', 'name', 'surname', 'action'];

  dataSource = new MatTableDataSource(ELEMENT_DATA);
  //dataSource = new MatTableDataSource();
  canViewUser = [];

  @ViewChild(MatPaginator, {static: true}) 
  paginator: MatPaginator;  
  
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  
  ngOnInit() {
    //console.log("this.listUsersICanView");
    
    this.canViewUser = this.appcomponent.listUsersICanView();

    if(!this.currentUser) {
      //if(!this.currentUser.hasOwnProperty('id')){
        this.currentUser={id:0,role:'', userName:'', name:'', surname:'', email:''};
    }

    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    

    if (this.isRecruiter) {
      //we need to recover the list of my job posts and their candidates

    }

    this.us
      .getUsers()
      .subscribe((data: User[]) => {
        /*
        data.forEach(element => {
        //  data.push(element);
          //this.canViewUser[element.id] = false;
          if (this.isAdmin) {
            this.canViewUser[element.id] = true;
          }
          //console.log(element);
        });
        */
        this.dataSource.data = data;

    });

  }


  openChangePasswordDialog(userId: Number) {

    const dialogRef = this.createChangePasswordDialog.open(createChangePasswordDialog_modal, {
      width: '550px',
      data: {userId: userId}
    });

    dialogRef.afterClosed().subscribe(result => {
    });
    
  } 

  confirmDialog(id, title): void {
    //const message = `Are you sure you want to do this?`;
    const message = this.translate.instant('PROFILES.DELETE_MESSAGE') + " ("+title+")";
    
    const dialogData = new ConfirmDialogModel(this.translate.instant('PROFILES.CONFIRM_ACTION'), message);

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "400px",
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      //this.result = dialogResult;

      if (dialogResult) {
         //console.log("Under construction");
         this.us.deleteUser(id).subscribe(data => {
          //window.location.reload();

          let posI = this.dataSource.data.findIndex(function(user){ return user.id === id })
             if (posI>0) {
                //console.log(posI);
                this.dataSource.data.splice(posI, 1);               
                this.dataSource._updateChangeSubscription();               
              }
        });
      }
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

const ELEMENT_DATA: User[] = [];


@Component({
  selector: 'createChangePasswordDialog',
  templateUrl: './changeUserPasswordForm.html',
  styleUrls: ['./profiles.component.css']
})
export class createChangePasswordDialog_modal implements OnInit {
  password: string = "";
  repeatPassword: string = "";
  userDataRec: User;
  userName: string = ""
  hidePassword: boolean = true;
  hideRepeatPassword: boolean = true;

  constructor(private us: UsersService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}


  ngOnInit() {
    
    //console.log(this.data.userId);
        
    this.us
        .getUser(this.data.userId).subscribe(
          data => {
            //console.log("user in db");      
            this.userDataRec = data;
            this.userName = data.userName;
          },
          error => {
            console.log("user not found in db");                        
          }
        );

  }

  onSubmitChangePasswordModal() {

    //console.log(this.data.userId+"---"+this.password);

    this.us.changePassword( this.data.userId, this.password).subscribe(
      res => {
        console.log("Password updated");
        
        document.getElementById("closeChangePasswordModalWindow").click();
      },
      error => {
        alert("Error changing user pasword!!");
      }
    );   

  }
}

export interface DialogData {
  userId: number;
}