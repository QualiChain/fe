import { Component, OnInit, OnDestroy } from '@angular/core';

import { Location } from '@angular/common';
import { Router } from '@angular/router';

import {TranslateService} from '@ngx-translate/core';

import { Subscription } from 'rxjs';

import { MessageService } from '../../_services/index';

import { AppComponent } from '../../app.component';

import { AuthService } from '../../_services';
import User from '../../_models/user';
import { Role } from '../../_models/role';
//import { isAdmin } from '../_services/auth.service.isA';
import { interval } from 'rxjs';
import { MatSnackBar, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { createChangePasswordDialog_modal } from '../../_components/profiles/profiles.component';
import { PilotsService, HEADER_MENU } from '../../_services/pilots.services';


export interface OPTIONS_MENU {
  id: number;
  label: string;
  route: string;
  public: boolean;
}

//{id: 5, label: 'MENU.LOGIN', route: '/login', public: true},
//{id: 6, label: 'MENU.LOGOUT', route: '/logout', public: false}
const ELEMENT_DATA: OPTIONS_MENU[] =[
  {id: 1, label: 'MENU.HOME', route: '', public: true},
  {id: 2, label: 'MENU.COURSES', route: '/courses', public: false},
  {id: 3, label: 'MENU.JOBS', route: '/jobs', public: false},  
  //{id: 4, label: 'MENU.CVS', route: '/cvs', public: false},
  {id: 5, label: 'MENU.PROFILES', route: '/profiles', public: false}
];


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})




export class HeaderComponent implements OnInit, OnDestroy {
  
  currentUser: User;
  route: string;
  userdata: any = {};
  loadingNotificationSpinnerid: number = null;
  //messages: any[] = [];

  menuOptionsPerPilot: HEADER_MENU;

  messages: messageType[]=[];
  subscription: Subscription;

  menuOptions =ELEMENT_DATA;


  constructor(
    private ps: PilotsService,
    public createChangePasswordDialog: MatDialog,
    private appcomponent: AppComponent,
    private authservice: AuthService,
    location: Location, router: Router, public translate: TranslateService, private messageService: MessageService) {
  //  constructor(location: Location, router: Router) {
    
    this.authservice.currentUser.subscribe(x => this.currentUser = x);

    // subscribe to home component messages
    this.subscription = this.messageService.getMessage().subscribe(message => {
      if (message) {
        this.messages.push(message);
      } else {
        // clear messages when empty message received
        this.messages = [];
      }
    });


    this.route = location.path();


    translate.addLangs(['en', 'pt', 'el']);
    translate.setDefaultLang('en');

    const browserLang = translate.getBrowserLang();
    translate.use(browserLang.match(/en|pt|el/) ? browserLang : 'en');

  }

  deleteItemMessages(index: number): void {
    // clear messages
    this.messageService.deleteItemMessages(index);
  } 

  changeItemStatus(item: any): void {
    // change messages staus
    //console.log(item);
    this.loadingNotificationSpinnerid = item.id;
    this.messageService.changeNotificationStatus(item.id, item).subscribe(
      res => {
        console.log("Notification status changed");
        item.readed = !item.readed;
        this.loadingNotificationSpinnerid = null;
        //after create the user 
        //window.location.href="/profiles";
      },
      error => {
        alert("Error changing notification status!!");
        this.loadingNotificationSpinnerid = null;
      }
    );    
  }   

  deleteNotificationItem(item: any, posI: number): void {
    // delete message
    //console.log(item);
    //console.log(posI);   
    
    this.loadingNotificationSpinnerid = item.id;
    this.messageService.deleteNotification(item.id).subscribe(
      res => {
        console.log("Notification deleted");
        this.loadingNotificationSpinnerid = null;
        //after create the user         
        //window.location.href="/profiles";
        this.messages.splice(posI, 1);
      },
      error => {
        alert("Error deletring notification!!");
        this.loadingNotificationSpinnerid = null;
      }
    );
  }   

  reloadNotifications(userdataId: number): void  {
    this.messageService.getNotificationsByUserId(userdataId).subscribe(
      data => {
        //console.log("user notifications");
        //console.log(data);
        this.messages = [];
        for (let key in data) {
          let value = data[key];
          if (value.user_id==userdataId) {
            this.messageService.sendMessage(value.id, value.message, value.readed);
          }          
        }        
      },
      error => {
        //console.log("no notification for this user in db");        
      }
    );
  }

  ngOnInit() {
    
    //todo , replace this by the pilotid of the user
    //console.log(this.currentUser);
    if (this.currentUser) {
      if (this.currentUser.pilotId) {
        this.menuOptionsPerPilot = this.ps.getPilot(this.currentUser.pilotId);
      }
      else {
        this.menuOptionsPerPilot = this.ps.getPilot(0);  
      }
    }
    else {
      this.menuOptionsPerPilot = this.ps.getPilot(0);
    }
    
    //console.log(this.menuOptionsPerPilot);

    // Read item:
    let userdata = JSON.parse(localStorage.getItem('userdata'));
    if (userdata) {

      if (this.currentUser.avatar_path=='') {
        this.currentUser.avatar_path = 'assets/img/no_avatar.jpg';              
      }

      this.userdata = userdata;

      this.reloadNotifications(userdata.id);

      interval(60000).subscribe(x => {
        // something
        this.reloadNotifications(userdata.id);
      });

      
    }
    else {
      this.userdata = {'authenticated': false ,'role': 'anonymous'};
    }
    
  }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.subscription.unsubscribe();
  }



  openChangePasswordDialogFromHeader(userId: Number) {

    const dialogRef = this.createChangePasswordDialog.open(createChangePasswordDialog_modal, {
      width: '550px',
      data: {userId: userId}
    });

    dialogRef.afterClosed().subscribe(result => {
    });
    
    
  } 

  isLogged = this.appcomponent.isLogged;
  isAdmin = this.appcomponent.isAdmin;
  isRecruiter = this.appcomponent.isRecruiter;
  //isTeacher = this.appcomponent.isTeacher;
  isProfessor = this.appcomponent.isProfessor;
  isStudent = this.appcomponent.isStudent;
  isEmployee = this.appcomponent.isEmployee;
  
  /*
  get isAdmin() {
    return this.currentUser && this.currentUser.role === Role.admin ;
  }

  get isRecruiter() {
    return this.currentUser && ((this.currentUser.role === Role.recruiter) || (this.currentUser.role === Role.admin)) ;
  }
  */


  logout() {
    
    

    //console.log("log out");
    localStorage.removeItem('userdata');
    this.userdata = {};
    this.authservice.logout();

    //window.location.reload();
    window.location.href="/";
    
  }

}


interface messageType {
  id: number;
  message: string;
  readed: boolean;
  user_id: number
}