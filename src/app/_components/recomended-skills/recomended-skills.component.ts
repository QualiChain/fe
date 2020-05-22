import { Component, OnInit, Input } from '@angular/core';
import { RecomendationsService } from '../../_services/recomendations.service';

@Component({
  selector: 'app-recomended-skills',
  templateUrl: './recomended-skills.component.html',
  styleUrls: ['./recomended-skills.component.css']
})
export class RecomendedSkillsComponent implements OnInit {

  @Input() userId: number = null;
  
  recomendedSkills = [];

  constructor( private rs: RecomendationsService ) { }
  
  ngOnInit() {

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
