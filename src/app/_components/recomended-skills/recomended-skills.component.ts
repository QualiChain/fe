import { Component, OnInit, Input } from '@angular/core';
import { RecomendationsService } from '../../_services/recomendations.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-recomended-skills',
  templateUrl: './recomended-skills.component.html',
  styleUrls: ['./recomended-skills.component.css']
})
export class RecomendedSkillsComponent implements OnInit {

  @Input() userId: number = null;
  
  recomendedSkills = [];

  constructor( 
    private router: Router,
    private route: ActivatedRoute,
    private rs: RecomendationsService ) { }
  
  ngOnInit() {

    //console.log(this.userId);

    if (!this.userId) {
      this.route.params.subscribe(params => {
      if(params.hasOwnProperty('id')){
        this.userId = +params.id;
      }
    });
    }

    //console.log(this.userId);     

    if (this.userId) {
      this.rs
      .getRecomendationsSkills(this.userId).subscribe(
        data => {
          //console.log("list of recomended skills");
          //console.log(data);
          this.recomendedSkills = data;
        },
        error => {
          console.log("recomended skills not found in db");                        
        }
      );
    }

  }

}
