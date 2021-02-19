import { Component, OnInit, ViewChild } from '@angular/core';
import { DSSCurriculumReDesignService } from '../../_services/dss-curriculum-re-design.service';
import { TranslateService } from '@ngx-translate/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UsersService } from '../../_services/users.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';

let ELEMENT_DATA: any[] = []

@Component({
  selector: 'app-dss-curriculum-re-design',
  templateUrl: './dss-curriculum-re-design.component.html',
  styleUrls: ['./dss-curriculum-re-design.component.css']
})
export class DSSCurriculumReDesignComponent implements OnInit {

  displayedColumns: string[] = ['skill_title', 'related_courses'];

  dataSource = new MatTableDataSource(ELEMENT_DATA);
  @ViewChild(MatPaginator, {static: true}) 
  paginator: MatPaginator;  
  
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(
    private DSSs: DSSCurriculumReDesignService,
    private translate: TranslateService,
    private route: ActivatedRoute,
    private router: Router,
    private us: UsersService
  ) { }
  
  missingSkills: missingSkillData[] = [];
  selectedSkill: missingSkillData = {skill_title: '', skill_description: '', relevant_skills: [], scored_courses:[]};
  //selectedCourse: related_courses = {course_id: null, course_title: '', suitability_score: null};
  selectedCourse: related_courses = {course_id: null, course_title: '', score: null};
  listOfRelatedCourses: [];
  userId: number = 0;      

  // ADD CHART OPTIONS. 
  barChartOptions = {};
  
  barLabels = [];
  barChartData = [];
  barChartColors = [];
  dataToSend: object;
  relatedCourses: related_courses[];

  // CHART CLICK EVENT.
  onChartClick(event) {
    console.log(event);
  }

  doughnutChartType: String = 'doughnut';
  doughnutChartLabels: String[] = ['Yes', 'No'];
  doughnutChartData = [];
  pieChartColors : Array<any> = [];

  


  ngOnInit(): void {
    this.relatedCourses = [];
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;

    this.route.params.subscribe(params => {
      
      if(params.hasOwnProperty('id')){
        this.userId = +params.id;        
      }

      if (this.userId>0) {

        this.us
        .getUser(this.userId).subscribe(
          data => {
            //console.log("user in db");
            this.recoverDataDSSCurriculumReDesign()
          },
          error => {            
            this.router.navigate(["/not_found"]);
          }
        );        
      }
      else {
        this.router.navigate(["/not_found"]);
      }

    });      

    


  }

  recoverDataDSSCurriculumReDesign() {


    //piechart

    this.doughnutChartData = [[75, 25]];
  

    this.pieChartColors = [
      {
        backgroundColor: ['#2b69b1', '#F7464A'],
        hoverBackgroundColor: ['#0e3664', '#F7464A'],
        borderWidth: 2,
      }
    ];

    //missing skills
    this.DSSs
    .getMissingSkillsData(this.dataToSend).subscribe(
      dataMissingSkills => {
        //console.log("Mising skillss");
        this.missingSkills = dataMissingSkills.recommended_skills;
      },
      error => {
        console.log("Error getting missing skills data!!");
      }
    );

  }

  exportAnalyticalReport() {

  }

  selectCourseBySkill(courseSelected: related_courses) {

       

  }

  selectMissingSkill(missingSkill: missingSkillData) {
    this.barLabels = [];
    // CHART COLOR.
    this.barChartColors = [
      {
        backgroundColor: '#2b69b1'
      }
    ]; 

    let dataToPlot = [];
    let labelsToPlot = [];
    this.relatedCourses = [];

    //console.log(missingSkill);
    for (let i = 0; i < missingSkill.scored_courses.length; i++) {
      dataToPlot.push(missingSkill.scored_courses[i].score);
      labelsToPlot.push(missingSkill.scored_courses[i].course_title);
      this.relatedCourses.push(missingSkill.scored_courses[i]);      
    }
    
    this.dataSource.data = missingSkill.relevant_skills;

    /*
    for (let i = 0; i < missingSkill.relevant_skills.length; i++) {
      
      for (let j = 0; j < missingSkill.relevant_skills[i].related_courses.length; j++) {
        //console.log(missingSkill.relevant_skills[i].related_courses[j]);
        //var n = labelsToPlot.includes(missingSkill.relevant_skills[i].related_courses[j].course_title);
        //if (!n) {
          //dataToPlot.push(missingSkill.relevant_skills[i].related_courses[j].suitability_score);
          dataToPlot.push(missingSkill.relevant_skills[i].related_courses[j].course_id);
          labelsToPlot.push(missingSkill.relevant_skills[i].related_courses[j].course_title);

          this.relatedCourses.push(missingSkill.relevant_skills[i].related_courses[j]);

        //}
      }
    }
    */
    
    let chartLabel = this.translate.instant('DSS_CV_RE_DESIGN.FOOTER_BAR_CHART', { skill_title: missingSkill.skill_title });

    this.barChartOptions = {
      title: {
        text: chartLabel,
        display: true
      },
      legend: {
        position: 'top',
      },
    hover: {
        mode: 'label'
    },
    scales: {
        yAxes: [{
                display: true,
                ticks: {
                    beginAtZero: true,
                    steps: 10,
                    stepValue: 0.1,
                    max: 1,
                    min: 0,
                }
            }]
    },
      responsive: true    // THIS WILL MAKE THE CHART RESPONSIVE (VISIBLE IN ANY DEVICE).
    }    
    
    let chartLabel2 = this.translate.instant('COURSES.TITLE');
    //this.barChartData = [{data: dataToPlot, label: chartLabel2}];
    this.barChartData = dataToPlot;

    this.barLabels = labelsToPlot;
    /*
    this.barLabels =  ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

    // STATIC DATA FOR THE CHART IN JSON FORMAT.
    this.barChartData = [
      {
        label: '1st Year',
        data: [21, 56, 4, 31, 45, 15, 57, 61, 9, 17, 24, 59] 
      },
      { 
        label: '2nd Year',
        data: [47, 9, 28, 54, 77, 51, 24]
      }
    ];

    // CHART COLOR.
    this.barChartColors = [
      { // 1st Year.
        backgroundColor: 'rgba(77,83,96,0.2)'
      },
      { // 2nd Year.
        backgroundColor: 'rgba(30, 169, 224, 0.8)'
      }
    ] 
*/    
  } 

  

}

export interface missingSkillData {
  skill_title: string;
  skill_description: string;
  relevant_skills: relevant_skills[];
  scored_courses: scored_courses[]; 
}

export interface scored_courses {
  course_id: number;
  course_title: string;  
  score : number;
}

export interface relevant_skills {
  skill_title: string;
  skill_description: string;  
  related_courses : related_courses[]
}

export interface related_courses {
  course_id: number,
  course_title: string,
  score: number
}
