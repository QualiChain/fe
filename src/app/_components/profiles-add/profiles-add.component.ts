import { Component, OnInit, ɵConsole } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {ElementRef, ViewChild} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatAutocompleteSelectedEvent, MatAutocomplete} from '@angular/material/autocomplete';
import {MatChipInputEvent} from '@angular/material/chips';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
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

@Component({
  selector: 'app-profiles-add',
  templateUrl: './profiles-add.component.html',
  styleUrls: ['./profiles-add.component.css']
})
export class ProfilesAddComponent implements OnInit {

  pilotId: string ="";
  role: string ="";
  userName: string;
  fullName: string;
  name: string;
  surname: string;
  gender: string;
  birthDate: string;
  country: string;
  city: string;
  address: string;
  zipCode: string;
  mobilePhone: string;
  homePhone: string;
  email: string;

  constructor(private us: UsersService, private authservice: AuthService, private route: ActivatedRoute, private formBuilder: FormBuilder, private cvs: CVService, private translate: TranslateService) { 

  }
 

  ngOnInit() {

  }


  
  processForm() {

    const obj = {
      "userPath": "",
      "role": this.role,
      "pilotId": this.pilotId,
      "userName": this.userName,
      "fullName": this.fullName,
      "name": this.name,
      "surname": this.surname,
      "gender": this.gender,
      "birthDate": this.birthDate,
      "country": this.country,
      "city": this.city,
      "address": this.address,
      "zipCode": this.zipCode,
      "mobilePhone": this.mobilePhone,
      "homePhone": this.homePhone,
      "email": this.email
    };
    
    
    this.us.addUser(obj).subscribe(
        res => {
          //console.log("User created");
          window.location.href="/profiles";
        },
        error => {
          alert("Error creating user!!");
        }
      );

  }
  




}
