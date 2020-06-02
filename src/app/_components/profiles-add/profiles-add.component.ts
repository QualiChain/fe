import { Component, OnInit, ɵConsole } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {ElementRef, ViewChild} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatAutocompleteSelectedEvent, MatAutocomplete} from '@angular/material/autocomplete';
import {MatChipInputEvent} from '@angular/material/chips';
import {Observable} from 'rxjs';
import {map, startWith, windowWhen} from 'rxjs/operators';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { CVService } from '../../_services/cv.service';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import {TranslateService} from '@ngx-translate/core';
import { AuthService } from '../../_services';

import * as d3 from 'd3';
import * as d3Sankey from 'd3-sankey';
import { UsersService } from '../../_services/users.service';
import User from '../../_models/user';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-profiles-add',
  templateUrl: './profiles-add.component.html',
  styleUrls: ['./profiles-add.component.css'],
  providers: [DatePipe]
})
export class ProfilesAddComponent implements OnInit {

  pilots: Pilot[] = [
    {value: 1, viewValue: 'Pilot 1'},
    {value: 2, viewValue: 'Pilot 2'},
    {value: 3, viewValue: 'Pilot 3'},
    {value: 4, viewValue: 'Pilot 4'}
  ];

  roles: Role[] = [
    {value: 'student', viewValue: 'Student'},
    {value: 'administrator', viewValue: 'Administrator'},
    {value: 'employee', viewValue: 'Employee'},
    {value: 'teacher', viewValue: 'Teacher'},
    {value: 'recruiter', viewValue: 'Recruiter'}
  ];

  public currentValue: string = null;
  
  hide = true;
  pilotId: number = null;
  role: string ="";
  userName: string;
  fullName: string;
  name: string;
  surname: string;
  gender: string = "";
  birthDate: string;
  //birthDate: Date;
  country: string;
  city: string;
  address: string;
  zipCode: string;
  mobilePhone: string;
  homePhone: string;
  email: string;
  password: string;

  profileId: string = '';
  mode: string = '';
  files: any[] = [];
  
  constructor(
    private router: Router,
    public datepipe: DatePipe, private us: UsersService, private authservice: AuthService, 
    private route: ActivatedRoute, private formBuilder: FormBuilder, private cvs: CVService, private translate: TranslateService) { 

  }
 

  ngOnInit() {

    this.route.params.subscribe(params => {
      const id = +params.id;
      this.mode = "Create";
      if (id && id > 0) {
        let userdata = JSON.parse(localStorage.getItem('userdata'));
        //console.log(userdata.role.toLowerCase());
        if ((String(userdata.id) == String(id)) || (userdata.role.toLowerCase() =='administrator')) {

          this.mode = "Edit";
          this.profileId=String(id);
          //console.log(this.profileId);  
  
          this.us.getUser(+this.profileId).subscribe(
            res => {
              //console.log("Request OK");
              //console.log(res);
              this.pilotId = res.pilotId;
              this.role = res.role;
              this.userName = res.userName;
              this.fullName = res.fullName;
              this.name = res.name;
              this.surname = res.surname;
              this.gender = res.gender;
              this.birthDate = res.birthDate;
              this.country = res.country;
              this.city = res.city;
              this.address = res.address;
              this.zipCode = res.zipCode;
              this.mobilePhone = res.mobilePhone;
              this.homePhone = res.homePhone;
              this.email = res.email;
            },
            error => {
              console.log("Error getting data");
              this.router.navigate(["/not_found"]);
              
            }
          ); 

        }
        else {
          
          //window.location.href="/profiles/"+id;
          //this.router.navigate(["/profiles/"+id]);
          this.router.navigate(["/access_denied"]);

        }
               
      }
      else {
        this.mode = "Create";
      }

    });

  }


  
  processForm() {
console.log(this);

    let birth_date_transform =this.birthDate;
    //let birth_date_transform =this.datepipe.transform(this.birthDate, 'dd-MM-yyyy');

    const obj = {
      "userPath": "/home/"+this.userName,
      "role": this.role,
      "pilotId": this.pilotId,
      "userName": this.userName,
      "fullName": this.fullName,
      "name": this.name,
      "surname": this.surname,
      "gender": this.gender,
      "birthDate": birth_date_transform,
      "country": this.country,
      "city": this.city,
      "address": this.address,
      "zipCode": this.zipCode,
      "mobilePhone": this.mobilePhone,
      "homePhone": this.homePhone,
      "email": this.email
    };
    
    if (this.mode=='Create') {

      this.us.addUser(obj).subscribe(
        res => {
          //console.log("User created");
          console.log(res);
          var splitted = res.split("=", 2); 
          //console.log(splitted[1]);
          let password = this.password;
          
          this.us.requestNewPassword(splitted[1], password).subscribe(
            resPassword => {
              console.log("Password created");
              //console.log(resPassword);              
              //after create the user 
              //window.location.href="/profiles";
              this.router.navigate(["/profiles/"+splitted[1]]);
            },
            error => {
              alert("Error setting user password!!");
            }
          );

          //after create the user 
          //window.location.href="/profiles";
        },
        error => {
          alert("Error creating user!!");
        }
      );

    }
    else {
      //console.log(this.profileId);
      this.us.updateUser(+this.profileId, obj).subscribe(
        res => {
          //console.log("User updated");
          //console.log(res);
          //after update the user 
          //window.location.href="/profiles/"+this.profileId;
          this.router.navigate(["/profiles/"+this.profileId]);
        },
        error => {
          alert("Error updating user!!");
        }
      );
      

    }
    

  }
  


}

interface Pilot {
  value: number;
  viewValue: string;
}

interface Role {
  value: string;
  viewValue: string;
}