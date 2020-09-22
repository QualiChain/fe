import { Component, OnInit, ɵConsole } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SkillsService } from '../../../_services/skills.service';

import User from '../../../_models/user';
//import { MatDialog } from '@angular/material';
import { MatDialog } from '@angular/material/dialog';

import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../../_services';

@Component({
  selector: 'app-skills-get',
  templateUrl: './skills-get.component.html',
  styleUrls: ['./skills-get.component.css']
})
export class SkillsGetComponent implements OnInit {

  currentUser: User;

  constructor(
    private router: Router,
    private authservice: AuthService,
    public dialogModal: MatDialog, 
    private route: ActivatedRoute,
    private ss: SkillsService,
    private translate: TranslateService    
  ) { }

  skillData: any = {};

  ngOnInit() {

    this.authservice.currentUser.subscribe(x => this.currentUser = x);
  
    if(!this.currentUser) {
        this.currentUser={id:0,role:'', userName:'', name:'', surname:'', email:''};
    }

    this.route.params.subscribe(params => {

      let id:number = 0;      
      if(params.hasOwnProperty('id')){
        id = +params.id;
      }

      if (id>0) {
        //console.log(id);

        this.ss
        .getSkill(id).subscribe(
          dataSkill => {
            //console.log("skille in db");
            //console.log(dataCourse);
            this.skillData = dataSkill;
          },
          error => {
            this.router.navigate(["/not_found"]);            
          }
        );            
        
      }

    });

  }

}
