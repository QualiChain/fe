import { Component, OnInit } from '@angular/core';
import { MessageService } from '../_services/index';

@Component({
  selector: 'app-home',
  templateUrl: './access-denied.component.html',
  styleUrls: ['./access-denied.component.css']
})
export class AccessDeniedComponent implements OnInit {
  userdata: {};

  constructor(private messageService: MessageService) { }

  sendMessage(): void {
    // send message to subscribers via observable subject
    let currentdate = new Date();
    this.messageService.sendMessage('This is a test message ! Date:'+currentdate);
  }

  clearMessages(): void {
    // clear messages
    this.messageService.clearMessages();
  } 


  ngOnInit() {

    let userdata = JSON.parse(localStorage.getItem('userdata'));
    if (userdata) {
      this.userdata = userdata;
    }
    else {
      this.userdata = {'authenticated': false};
    }

  }

}
