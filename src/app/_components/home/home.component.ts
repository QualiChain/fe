import { Component, OnInit } from '@angular/core';
import { MessageService } from '../../_services/index';
import { QCStorageService } from '../../_services/QC_storage.services';
import { PilotsService, HEADER_MENU } from '../../_services/pilots.services';
import { trigger, animate, transition, style, state } from '@angular/animations';
import { AppComponent } from '../../app.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  animations: [
    // this here is our animation trigger that
    // will contain our state change animations.
    trigger('myTriggerName', [
      // the styles defined for the `on` and `off`
      // states declared below are persisted on the
      // element once the animation completes.
      state('on', style({ opacity: 1, transform: 'translateX(0)' })),
      state('off', style({ opacity: 0, transform: 'translateX(+80%)' })),

      // this here is our animation that kicks off when
      // this state change jump is true
      transition('off => on', [animate('0.5s ease-out')])
    ])
  ]
})
export class HomeComponent implements OnInit {
  userdata: {id:'', authenticated: false};
  isauthenticated: boolean = false;
  menuOptionsPerPilot: HEADER_MENU;
  menuOptionsToPlot: HEADER_MENU;
  menuOptionSelected: any[] = [];
  selectedSubmenu: boolean = false;

  state = 'off';

  isLogged = this.appcomponent.isLogged;
  isAdmin = this.appcomponent.isAdmin;
  isRecruiter = this.appcomponent.isRecruiter;
  isProfessor = this.appcomponent.isProfessor;
  isStudent = this.appcomponent.isStudent;
  isEmployee = this.appcomponent.isEmployee;  

  ngAfterViewInit() {
    setTimeout(() => {
      this.state = 'on';
    });
  }

  constructor(
    private appcomponent: AppComponent,
    private ps: PilotsService,
    private qcStorageService: QCStorageService,
    private messageService: MessageService) { }

  sendMessage(): void {
    // send message to subscribers via observable subject
    let currentdate = new Date();
    //this.messageService.sendMessage(0, 'This is a test message ! Date:'+currentdate, false);


    this.messageService.sendNotification({"message": 'This is a test message ! Date:'+currentdate,"user_id": this.userdata.id}).subscribe(
      res => {
        console.log("Notification created");
        //after create the user 
        //window.location.href="/profiles";
      },
      error => {
        alert("Error creating notification!!");
      }
    );

  }

  clearMessages(): void {
    // clear messages
    this.messageService.clearMessages();
  } 


  selectSubMenu(option: any): void {
    this.selectedSubmenu = false;
    this.state = 'off';   
    
    if (option == 'home') {
      this.selectedSubmenu = false;
      this.menuOptionsToPlot = this.jsonCopy(this.menuOptionsPerPilot);
      setTimeout(() => {
        this.state = 'on';
      });
    }
    else {
      this.selectedSubmenu = true;
      this.menuOptionsToPlot.menu = this.jsonCopy(option.submenu);
      setTimeout(() => {
        this.state = 'on';
      });
    }
  }

  jsonCopy(src) {
    return JSON.parse(JSON.stringify(src));
  }
  
  ngOnInit() {

    //let userdata = JSON.parse(localStorage.getItem('userdata'));
    let userdata = JSON.parse(this.qcStorageService.QCDecryptData(localStorage.getItem('userdataQC')));

    if (userdata) {
      this.userdata = userdata;

      if(userdata.hasOwnProperty('authenticated')){
        this.isauthenticated = userdata.authenticated;

        this.menuOptionsPerPilot = this.ps.getPilot(1);

        this.menuOptionsToPlot = this.jsonCopy(this.menuOptionsPerPilot);
      }
    }
    else {
      //if(userdata.hasOwnProperty('authenticated')){
        userdata = {id:0, authenticated:false};
        //userdata.authenticated=false;
      //}
      //this.userdata = {'authenticated': false};
      this.userdata = userdata;
    }

  }

}
