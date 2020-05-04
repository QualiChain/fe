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
       
    if (this.name=="student") {
       myObj = { authenticated: true, name: 'Dilbert', surname: 'Adams', email: 'dilbert.adams@qualichain-project.eu', username: 'dilbert.adams', id: 11 , 'avatar_path': 'assets/img/dilbert.jpg', role: 'student'};
    }
    else if (this.name=="recruiter") {
      myObj = { authenticated: true, name: 'Recruiter', surname: 'demo', email: 'recruiter.demo@qualichain-project.eu', username: 'recruiter.demo', id: 55 , 'avatar_path': 'assets/img/recruiter.png', role: 'recruiter'};      
    }
    else if (this.name=="teacher") {
      myObj = { authenticated: true, name: 'Pointy-Haired Boss', surname: 'Adams', email: 'phb@qualichain-project.euu', username: 'phb', id: 22 , 'avatar_path': 'assets/img/pointy-haired_boss.jpg', role: 'teacher'};
    }
    else {
      //console.log("else");
      if (data) {
        myObj = { authenticated: true, name: data.name, surname: data.surname, email: data.email, username: data.userName, id: data.id , 'avatar_path': '', role: data.role};
      }
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
    this.requestPasswordError = false;
    this.requestPasswordConfirmation = false;
    this.ls.requestpassword(this.email).subscribe(
      res => {
        console.log("Request OK");
        this.requestPasswordConfirmation = true;
      },
      error => {
        console.log("Error requesting password");
        this.requestPasswordError = true;
      }
    );
  }

  processForm() {
    //const allInfo = `My name is ${this.name}. My email is ${this.password}.`;
    //alert(allInfo); 

    this.ls.login(this.name, this.password).subscribe(
        res => {
          console.log("Valid credentials for the auth service");
          this.invalidCredentials = false;
          this.validCredentials(res);
        },
        error => {
          console.log("Invalid Credentials for the aut service, let's check if are the demo ones");
          this.invalidCredentials = true;
          if ((this.name=='student') && (this.password=='student')) {
            console.log("Demo credentials of a student are valid!!!")
            this.validCredentials(error);
          }
          else if ((this.name=='recruiter') && (this.password=='recruiter')) {
            console.log("Demo credentials of a recruiter are valid!!!")
            this.validCredentials(error);
          }
          else if ((this.name=='teacher') && (this.password=='teacher')) {
            console.log("Demo credentials of a recruiter are valid!!!")
            this.validCredentials(error);
          }
          
        }
      );

  }



}
