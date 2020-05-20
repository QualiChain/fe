import { Component, OnInit } from '@angular/core';
import { MessageService } from '../../_services/index';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  userdata: {id:'', authenticated: false};
  isauthenticated: boolean = false;
  constructor(private messageService: MessageService) { }

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

    let userdata = JSON.parse(localStorage.getItem('userdata'));
    if (userdata) {
      this.userdata = userdata;

      if(userdata.hasOwnProperty('authenticated')){
        this.isauthenticated = userdata.authenticated;
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
