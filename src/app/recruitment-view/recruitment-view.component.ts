import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {ElementRef, ViewChild} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatAutocompleteSelectedEvent, MatAutocomplete} from '@angular/material/autocomplete';
import {MatChipInputEvent} from '@angular/material/chips';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

@Component({
  selector: 'app-recruitments-view',
  templateUrl: './recruitment-view.component.html',
  styleUrls: ['./recruitment-view.component.css']
})
export class RecruitmentViewComponent implements OnInit {

  jobdata: {};
  listOfCandidatesByJobs: {};

  constructor(private route: ActivatedRoute) { 


  }

  

  ngOnInit() {

    this.route.params.subscribe(params => {
      
      //console.log(params['id']);
      let listOfJobs = 
      [
        {title: 'Solutions Architect', id: 1},
        {title: 'Tech Lead/ Software Architect', id: 2},
        {title: 'Senior Software Engineer', id: 3},
        {title: 'Blockchain Engineer', id: 4},
        {title: 'Backend developer', id: 5},
        {title: 'PHP Senior Developer', id: 6}
      ];

      let listOfCandidatesByJobs = 
      {
        1:[
          {userid: 1, name: 'Dilbert'},
          {userid: 2, name: 'Pointy-Haired Boss'}
        ],
        2:[
          {userid: 3, name: 'Dogbert'},
          {userid: 4, name: 'Ratbert'}
        ],
        3:[
          {userid: 1, name: 'Dilbert'},
          {userid: 5, name: 'Recruiter'}          
        ],
        4:[
          {userid: 3, name: 'Dogbert'},
          {userid: 4, name: 'Ratbert'},
          {userid: 5, name: 'Recruiter'}
        ],  
        5:[
          {userid: 1, name: 'Dilbert'},
          {userid: 4, name: 'Ratbert'}
        ]              
      }
      ;
    

      this.jobdata = listOfJobs[params['id']-1];
      this.listOfCandidatesByJobs = listOfCandidatesByJobs;
      

    });


  }

}
