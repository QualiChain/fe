import { Component, OnInit } from '@angular/core';
import { MessageService } from '../../../_services/index';
import { QCStorageService } from '../../../_services/QC_storage.services';

@Component({
  selector: 'app-home',
  templateUrl: './access-denied.component.html',
  styleUrls: ['./access-denied.component.css']
})
export class AccessDeniedComponent implements OnInit {
  userdata: {};

  constructor(
    private qcStorageService: QCStorageService,
    private messageService: MessageService) { }

  sendMessage(): void {
    // send message to subscribers via observable subject
    let currentdate = new Date();
    this.messageService.sendMessage(0,'This is a test message ! Date:'+currentdate, false);
  }

  clearMessages(): void {
    // clear messages
    this.messageService.clearMessages();
  } 


  ngOnInit() {

    //let userdata = JSON.parse(localStorage.getItem('userdata'));
    let userdata = JSON.parse(this.qcStorageService.QCDecryptData(localStorage.getItem('userdataQC')))
    
    if (userdata) {
      this.userdata = userdata;
    }
    else {
      this.userdata = {'authenticated': false};
    }

  }

}
