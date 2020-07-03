import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { RecomendationsService } from '../../_services/recomendations.service';
import { ActivatedRoute, Router } from '@angular/router';

import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';

@Component({
  selector: 'app-recomended-skills',
  templateUrl: './recomended-skills.component.html',
  styleUrls: ['./recomended-skills.component.css']
})
export class RecomendedSkillsComponent implements OnInit {

  @Input() userId: number = null;

  //displayedColumns: string[] = ['title', 'job_description', 'action'];
  displayedColumns: string[] = ['title'];
  
  dataSource = new MatTableDataSource(ELEMENT_DATA);

  @ViewChild(MatPaginator, {static: true}) 
  paginator: MatPaginator;  

  @ViewChild(MatSort, {static: true}) sort: MatSort;

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  recomendedSkills = [];

  constructor( 
    private router: Router,
    private route: ActivatedRoute,
    private rs: RecomendationsService ) { }
  
  ngOnInit() {

    //console.log(this.userId);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;   

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
          /*
          for (let index = 0; index < 12; index++) {
            this.recomendedSkills.push({'id':index,'title': 'skill '+index,'description': 'description ' +index, 'rating': 70+index});            
          }
          */
          this.dataSource.data = this.recomendedSkills;

        },
        error => {
          console.log("recomended skills not found in db");                        
        }
      );
    }

  }

}



let ELEMENT_DATA: any[] = [];

// another component with a different view.
@Component({
  selector: 'app-recomended-skills-page',
  templateUrl: './recomended-skills-page.component.html',
  styleUrls: ['./recomended-skills.component.css']
})
export class RecomendedSkillsComponentPage extends RecomendedSkillsComponent{




}