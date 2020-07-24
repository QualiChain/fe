import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { RecomendationsService } from '../../_services/recomendations.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CVService } from '../../_services/cv.service';
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
    private rs: RecomendationsService,
    private cvss: CVService ) { }
  
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



      this.cvss
      .getCV(this.userId).subscribe(
        dataCVs => {
          //console.log("user CV");
          //console.log(dataCVs);
          
            let datatCVToSend = dataCVs;
            //console.log(datatCVToSend);
            let skillsCV = [];
            dataCVs['skills'].forEach(element => {
              //console.log(element);
              skillsCV.push({
                "label":element.label,
                "comment":element.comment,
                "proficiencyLevel":element.proficiencyLevel, 
                "priorityLevel": element.priorityLevel,                
                "uri": element.uri, 
                "id": element.id});
            });
            //console.log(skillsCV);

            let educationCV = [];
            dataCVs['education'].forEach(element => {
              educationCV.push({"title":element.title,"from":element.from,"to":element.to,"organisation":element.organisation,"description":element.description});
            });
            //console.log(educationCV);

            let workHistoryCV = [];
            dataCVs['workHistory'].forEach(element => {
              workHistoryCV.push({"title":element.position,"from":element.from,"to":element.to,"organisation":element.employer,"description":""});
            });
            //console.log(workHistoryCV);

            datatCVToSend = {
              "source":{
                "PersonURI": dataCVs['personURI'],
                "Label": dataCVs['label'],
                "targetSector": dataCVs['targetSector'],
                "expectedSalary": "",
                "Description": dataCVs['description'],
                "skills": skillsCV,
                "workHistory": workHistoryCV,
                "Education": educationCV
              },
              "source_type": "cv",
              "recommendation_type": "courses"
            };
            
            //console.log(datatCVToSend);

            this.rs
            .getRecomendationsByCV(datatCVToSend).subscribe(
              dataRecommendationByCV => {
                //console.log("list of recomended courses by CV");
                //console.log(dataRecommendationByCV);      
                
                dataRecommendationByCV['recommended_skills'].forEach(element => {
                  
                  this.recomendedSkills.push({'id':element,'title': element ,'description': element, 'rating': null});                            

                });

                //this.recomendedSkills = dataRecommendationByCV['recommended_skills'];

                this.dataSource.data = this.recomendedSkills;
                //console.log(this.dataSource.data);

                //this.recomendedSkills.push({'id':index,'title': 'skill '+index,'description': 'description ' +index, 'rating': 70+index});                            
                

              },
              error => {
                console.log("recomended courses by CV not found in db");                        
              }
            );
          
          
        },
        error => {
          console.log("user CVs not found in db");                        
        }
      );  

            
/*
      this.rs
      .getRecomendationsSkills(this.userId).subscribe(
        data => {
          //console.log("list of recomended skills");
          //console.log(data);
          this.recomendedSkills = data;
          
          //for (let index = 0; index < 12; index++) {
          //  this.recomendedSkills.push({'id':index,'title': 'skill '+index,'description': 'description ' +index, 'rating': 70+index});            
          //}
          
          this.dataSource.data = this.recomendedSkills;

        },
        error => {
          console.log("recomended skills not found in db");                        
        }
      );
*/      
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