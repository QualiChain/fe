import { Component, OnInit, ElementRef } from '@angular/core';
import { ModalService } from '../../_modal';
import { Router } from '@angular/router';
//import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../_services/auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  name: string;
  password: string;
  email: string;
  invalidCredentials: boolean;
  requestPasswordError: boolean;
  requestPasswordConfirmation: boolean;
  loginData : {}
  hidePassword: boolean = true;
  loadingLoginSpinner: boolean = false;
  loadingRequestPasswordSpinner: boolean = false;
  
  constructor(private modalService: ModalService, private el: ElementRef, private router: Router, private ls: AuthService) { 
    
  }
  
  ngOnInit() {
    this.invalidCredentials = false;

  }

  validCredentials(data) {
    //console.log(data);
    //console.log(this.name);
    let myObj = {};
    this.invalidCredentials = false;   
       
    
      //console.log("else");
      if (data) {
        myObj = { authenticated: true, name: data.name, surname: data.surname, email: data.email, username: data.userName, id: data.id , 'avatar_path': '', role: data.role};
      }
    
    //console.log(myObj);
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

  processFormRequestPassword() {
    this.loadingRequestPasswordSpinner = true;
    this.requestPasswordError = false;
    this.requestPasswordConfirmation = false;
    this.ls.requestpassword(this.email).subscribe(
      res => {
        console.log("Request OK");
        this.requestPasswordConfirmation = true;
        this.loadingRequestPasswordSpinner = false;
      },
      error => {
        console.log("Error requesting password");
        this.requestPasswordError = true;
        this.loadingRequestPasswordSpinner = false;
      }
    );
  }

  processForm() {
    //const allInfo = `My name is ${this.name}. My email is ${this.password}.`;
    //alert(allInfo); 
    this.loadingLoginSpinner = true;
    this.invalidCredentials = false;

    this.ls.login(this.name, this.password).subscribe(
        res => {
          console.log("Valid credentials for the auth service");
          this.invalidCredentials = false;
          this.validCredentials(res);
          //this.loadingLoginSpinner = false;
        },
        error => {
          this.invalidCredentials = true;
          
          this.loadingLoginSpinner = false;
          
        }
      );

  }



}
