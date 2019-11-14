import { Component, OnInit, ElementRef } from '@angular/core';
import { ModalService } from '../_modal';
import { Router } from '@angular/router';
//import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  name: string;
  password: string;
  invalidCredentials: boolean;
  
  
  constructor(private modalService: ModalService, private el: ElementRef, private router: Router) { 
    
  }
  
  ngOnInit() {
    this.invalidCredentials = false;
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
    if ((this.name=='user') && (this.password=='user')) {
      //alert("Valid credentials");    
      // Create item:
      this.invalidCredentials = false;
      let myObj = { authenticated: true, name: 'Dilbert', surname: 'Adams', email: 'dilbert.adams@qualichain-project.eu', username: 'dilbert.adams', id: 1 , 'avatar_path': 'assets/img/dilbert.jpg'};
      localStorage.setItem('userdata', JSON.stringify(myObj));
      //console.log($window.location.host);
      /*
      this.router.navigate(['/'], {
        
      });
      */
      //window.location.reload();
      window.location.href="/";

    }
    else {
      alert("Invalid credentials");
      this.invalidCredentials = true;
    }

  }



}
