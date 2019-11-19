import { Component, OnInit, ElementRef } from '@angular/core';
import { ModalService } from '../_modal';
import { Router } from '@angular/router';
//import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../_services/auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  name: string;
  password: string;
  invalidCredentials: boolean;
  loginData : {}
  
  constructor(private modalService: ModalService, private el: ElementRef, private router: Router, private ls: AuthService) { 
    
  }
  
  ngOnInit() {
    this.invalidCredentials = false;

  }

  validCredentials(data) {
    //console.log(data);
    this.invalidCredentials = false;      
    let myObj = { authenticated: true, name: 'Dilbert', surname: 'Adams', email: 'dilbert.adams@qualichain-project.eu', username: 'dilbert.adams', id: 1 , 'avatar_path': 'assets/img/dilbert.jpg'};
    localStorage.setItem('userdata', JSON.stringify(myObj));
    window.location.href="/";
  }

  openModal(id: string) {
    this.modalService.open(id);
  }

  closeModal(id: string) {
    this.modalService.close(id);
  }



  /**
   * Process the form we have. Send to whatever backend
   * Only alerting for now
   */


  processForm() {
    //const allInfo = `My name is ${this.name}. My email is ${this.password}.`;
    //alert(allInfo); 

    this.ls.login(this.name, this.password).subscribe(
        res => {
          console.log("Valid credentials for the auth service");
          this.validCredentials(res);
        },
        error => {
          console.log("Invalid Credentials for the aut service, let's check if are the demo ones");
          this.invalidCredentials = true;
          if ((this.name=='user') && (this.password=='user')) {
            console.log("Demo credentials valid!!!")
            this.validCredentials(error);
          }
          
          
        }
      );

  }



}
