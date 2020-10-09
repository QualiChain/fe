import { Component, OnInit, OnDestroy } from '@angular/core';

import { Location } from '@angular/common';
import { Router } from '@angular/router';

import {TranslateService} from '@ngx-translate/core';

import { Subscription } from 'rxjs';

import { MessageService } from '../../../_services/index';

import { AppComponent } from '../../../app.component';

import { AuthService } from '../../../_services';
import User from '../../../_models/user';
import { Role } from '../../../_models/role';
//import { isAdmin } from '../_services/auth.service.isA';
import { interval } from 'rxjs';
//import { MatSnackBar, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MatDialog } from '@angular/material/dialog';

import { createChangePasswordDialog_modal } from '../../../_components/profiles/profiles/profiles.component';
import { PilotsService, HEADER_MENU } from '../../../_services/pilots.services';
import { UsersService } from '../../../_services/users.service';

import { DomSanitizer } from '@angular/platform-browser';
import {GlobalApp, StorageService} from '../../../_helpers/global';

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
  avatarImage: any;
  imagePath : any;

  menuOptionsPerPilot: HEADER_MENU;

  messages: messageType[]=[];
  subscription: Subscription;

  menuOptions =ELEMENT_DATA;

  

  constructor(
    public globalApp: GlobalApp,
    public storageService: StorageService,
    private _sanitizer: DomSanitizer,
    private ps: PilotsService,
    public createChangePasswordDialog: MatDialog,
    private appcomponent: AppComponent,
    private authservice: AuthService,
    private us: UsersService,
    location: Location, public router: Router, public translate: TranslateService, private messageService: MessageService) {
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
        item.read = !item.read;
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




  recoverUserAvatar(userdataId: number): void  {
    this.us.getUserAvatar(1).subscribe(
      data => {
        console.log("user avatar ");
        //console.log(data.avatar_in_bytes);
        let imageBinaryString = data.avatar_in_bytes; //image binary data response from api
        console.log(imageBinaryString);
        console.log("----------1");
        var imageBinaryString2 = imageBinaryString.substring(2);
        imageBinaryString2 = imageBinaryString2.slice(0, -1)
        console.log(imageBinaryString2);
        console.log("----------2");

        var splitted = imageBinaryString2.split("\'", ); 
        //console.log(splitted);
        var imageBinaryString2 = splitted.join("");       
        console.log(imageBinaryString2);
        console.log("----------3");



        /*

        let imageBase64String= btoa(unescape(encodeURIComponent(imageBinaryString)));
        this.imagePath = 'data:image/jpeg;base64,' + imageBase64String;
        console.log(imageBase64String);
        */
      },
      error => {
        console.log("error recovering user avatar image");
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
            this.messageService.sendMessage(value.id, value.message, value.read);
          }          
        }        
      },
      error => {
        //console.log("no notification for this user in db");        
      }
    );
  }

  ngOnInit() {

    this.storageService.watchStorage().subscribe((data:string) => {
      // this will call whenever your localStorage data changes
      // use localStorage code here and set your data here for ngFor
      let userdata = JSON.parse(localStorage.getItem('userdata'));
      //console.log(userdata);
      if (userdata) {
        if (userdata.avatar_path!=this.currentUser.avatar_path) {            
          this.currentUser.avatar_path = userdata.avatar_path;
        }
      }
    })

    //todo , replace this by the pilotid of the user
    //console.log(this.currentUser);
    if (this.currentUser) {
      //console.log(this.currentUser);
      /*
      if (this.currentUser.pilotId) {
        this.menuOptionsPerPilot = this.ps.getPilot(this.currentUser.pilotId);
      }
      */
      if (this.currentUser.authenticated) {
        this.menuOptionsPerPilot = this.ps.getPilot(1);
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

      if (userdata.avatar_path=='') {
        this.currentUser.avatar_path = 'assets/img/no_avatar.jpg';              
      }
      else {
        this.currentUser.avatar_path = userdata.avatar_path;
      }

      this.userdata = userdata;

      this.reloadNotifications(userdata.id);
      //this.recoverUserAvatar(userdata.id);

      //reload nortifications
      interval(60000).subscribe(x => {
        // something
        this.reloadNotifications(userdata.id);
      });

      //reload avatar image
      /*
      interval(3000).subscribe(x => {
        // something
        let userdata = JSON.parse(localStorage.getItem('userdata'));
        if (userdata) {
          if (userdata.avatar_path!=this.currentUser.avatar_path) {            
            this.currentUser.avatar_path = userdata.avatar_path;
          }
        }
      });
      */
      
    }
    else {
      this.userdata = {'authenticated': false ,'role': 'anonymous'};
    }
    
  }

  displayActivenessSubMenuOption(currentRoute: string, subMenuRoute: string, itemType: string) {

   if (this.router.url===subMenuRoute){
      if (itemType=='a') {
        return 'selectedItem';
      }
      else if (itemType=='li') {
        return 'current_page_parent';
      }
      else {
        return 'current_page_parent';
      }     
    }
    else {
     return 'current_page_parent_2';     
    }
     
 }

  displayActivenessMenuOption(currentRoute: string, menuRoute: string, itemType: string) {

    if (this.router.url.split("/")[1]==menuRoute.split("/")[1]){
      if (itemType=='a') {
        return 'selectedItem';
      }
      else if (itemType=='li') {
        return 'current_page_parent';
      }
      else {
        return 'current_page_parent';
      }
      
     }
     else {
      return '';
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
  read: boolean;
  user_id: number
}