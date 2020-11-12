import { Component, OnInit } from '@angular/core';
import { MessageService } from '../../_services/index';
import { QCStorageService } from '../../_services/QC_storage.services';
import { PilotsService, HEADER_MENU } from '../../_services/pilots.services';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  userdata: {id:'', authenticated: false};
  isauthenticated: boolean = false;
  menuOptionsPerPilot: HEADER_MENU;

  constructor(
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


  ngOnInit() {

    //let userdata = JSON.parse(localStorage.getItem('userdata'));
    let userdata = JSON.parse(this.qcStorageService.QCDecryptData(localStorage.getItem('userdataQC')));

    if (userdata) {
      this.userdata = userdata;

      if(userdata.hasOwnProperty('authenticated')){
        this.isauthenticated = userdata.authenticated;

        this.menuOptionsPerPilot = this.ps.getPilot(1);
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
