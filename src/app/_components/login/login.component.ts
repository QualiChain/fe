import { Component, OnInit, ElementRef } from '@angular/core';
import { ModalService } from '../../_modal';
import { Router } from '@angular/router';
//import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../_services/auth.service';
import { UploadService } from '../../_services/upload.service';

import { environment } from '../../../environments/environment';
const downloadUrl = environment.downloadFilesUrl;
import { QCStorageService } from '../../_services/QC_storage.services';

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
  customErrorMessageLogin: string = "";

  constructor(
    private qcStorageService: QCStorageService,
    private us: UploadService,
    private modalService: ModalService, private el: ElementRef, private router: Router, private ls: AuthService) { 
    
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
        myObj = { authenticated: true, name: data.name, surname: data.surname, email: data.email, username: data.userName, id: data.id , 'avatar_path': '', role: data.role, roles: data.roles};

        this.us.getUserFiles(data.id).subscribe(
          res => {
            myObj['avatar_path'] = "assets/img/no_avatar.jpg";

            res.files.forEach(element => {
              var index = element.filename.indexOf(data.id+"_avatar_" ); 
              if (index==0) {                
                myObj['avatar_path'] = downloadUrl+"/file/"+element.file_id;
              }
            });
            this.storeUserObject(myObj);
            
          },
          error => {
            console.log("Error recovering files");
            this.storeUserObject(myObj);
          }
        );

      }
      else {
        this.storeUserObject(myObj);
      }
    
    //console.log(myObj);
    //localStorage.setItem('userdata', JSON.stringify(myObj));
    
    //console.log("uncomment next line")
    //window.location.href="/";
  }

  storeUserObject(myObj:{}) {
    //console.log(myObj);
    let encryptedData = this.qcStorageService.QCEncryptData(JSON.stringify(myObj));
    //localStorage.setItem('userdata', encryptedData);
    localStorage.setItem('userdataQC', encryptedData);
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
    console.log(this);
    this.customErrorMessageLogin = "";
    this.loadingRequestPasswordSpinner = true;
    this.requestPasswordError = false;
    this.requestPasswordConfirmation = false;
    this.ls.requestpassword(this.name, this.email).subscribe(
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

  processFormIAM() {
    //const allInfo = `My name is ${this.name}. My email is ${this.password}.`;
    //alert(allInfo); 
    this.customErrorMessageLogin = "";
    this.loadingLoginSpinner = true;
    this.invalidCredentials = false;

    this.ls.loginIAM(this.name, this.password).subscribe(
        res => {          
          if (res['authenticated']) {
            console.log("Valid credentials for the auth service");
            this.invalidCredentials = false;
            this.validCredentials(res);
          }
          else {            
            this.customErrorMessageLogin = res['message'];
            this.invalidCredentials = true;          
            this.loadingLoginSpinner = false;            
          }
          
          //this.loadingLoginSpinner = false;
        },
        error => {
          console.log(error);
          this.invalidCredentials = true;          
          this.loadingLoginSpinner = false;
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
