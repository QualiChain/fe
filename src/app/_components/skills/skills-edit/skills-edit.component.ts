import { Component, OnInit } from '@angular/core';

import { SkillsService } from '../../../_services/skills.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-skills-edit',
  templateUrl: './skills-edit.component.html',
  styleUrls: ['./skills-edit.component.css']
})
export class SkillsEditComponent implements OnInit {

  mode: string = '';
  skillId: number = null;
  skill: Skill;

  constructor(
    private ss: SkillsService,
    private route: ActivatedRoute, private router: Router, private fb: FormBuilder
  ) { }

  ngOnInit(): void {

    this.skill = {id: null, name: null, type: null, hard_skill: null};

    this.route.params.subscribe(params => {
    this.mode = "Create";
      let id : number;

      if(params.hasOwnProperty('id')){
        id = +params.id;
      }
      else {
        id = 0;
      }


      if (id && id > 0) {
        this.mode = "Edit";
        this.skillId = id;

        this.ss.getSkill(+id).subscribe(
          res => {
            //console.log("Request OK");
            //console.log(res);
            this.skill = res;            
          },
          error => {
            console.log("Error getting data");
            this.router.navigate(["/not_found"]);
            
          }
        );        

      }
      else {
        this.mode = "Create";
      }

    });

  }      
  
  redirectToSkillsList() {
    this.router.navigate(['/skills']);
  }

  processForm() {

    console.log(this.skill);
    if (this.mode=='Create') {

      this.ss.addSkill(this.skill).subscribe(
        res => {
          //console.log("skill created");
          //console.log(res);
          var splitted = res.split("=", 2); 
          //console.log(splitted[1]);
          //after create the user 
          //window.location.href="/profiles";
          //this.router.navigate(["/profiles/"+this.userdata.id]);
          this.router.navigate(["/skills"]);
        },
        error => {
          alert("Error creating skill!!");
        }
      );

    }
    else {
      let dataToPost = {name: this.skill.name, type: this.skill.type, hard_skill: this.skill.hard_skill};
      this.ss.updateSkill(this.skillId, dataToPost).subscribe(
        res => {
          //console.log("skill updated");
          //console.log(res);
          var splitted = res.split("=", 2); 
          //console.log(splitted[1]);
          //after create the user 
          //window.location.href="/profiles";
          //this.router.navigate(["/profiles/"+this.userdata.id]);
          this.router.navigate(["/skills"]);
        },
        error => {
          alert("Error updating skill!!");
        }
      );
      
        
    }


  }




}


export class Skill {
  id: number;
  name: string;
  type: string;
  hard_skill: boolean;
}
