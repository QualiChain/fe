import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { UsersService } from '../../_services/users.service';
import { CoursesService } from '../../_services/courses.service'
import Course from '../../_models/course';
import {PageEvent} from '@angular/material/paginator';
import { RecomendationsService } from '../../_services/recomendations.service';
import { DSSCurriculumReDesignService } from '../../_services/dss-curriculum-re-design.service';
import { SpecializationsService } from '../../_services/specializations.service'

export interface Specialization {
  title: string;
  id: number;
  translateTitle : string;
}

@Component({
  selector: 'app-curriculum-gap-analysis',
  templateUrl: './curriculum-gap-analysis.component.html',
  styleUrls: ['./curriculum-gap-analysis.component.css']
})
export class CurriculumGapAnalysisComponent implements OnInit {

  userid: number;

  showPieChart: Boolean = false;
  pieChartType: String = 'pie';
  pieChartOptions = {};  
  pieChartLabels: String[] = [];
  pieChartData = [];
  pieChartColors : Array<any> = [];

  
  lineChartType: String = 'line';
  lineChartOptions = {};  
  lineChartLabels: String[] = [];
  lineChartData = [];
  lineChartColors : Array<any> = [];
  
  showRadarChart: Boolean = false;
  radarChartType: String = 'radar';
  radarChartOptions = {};  
  radarChartLabels: String[] = [];
  radarChartData = [];
  radarChartColors : Array<any> = [];
  
  recommendedSkills = [];
  pagedListRS = [];
  lengthRS: number = 0;
  pageSizeRS: number =14;  //displaying three cards each row
  pageSizeOptionsRS: number[] = [1];
  allSpecializations: Specialization[] = [];
  specialization: number = null;
  withPagination = false;
  allRecomendations = [];

  constructor(
    private ss: SpecializationsService,
    private DSSs: DSSCurriculumReDesignService,
    private route: ActivatedRoute, 
    private translate: TranslateService,
    private router: Router,
    private us: UsersService,
    private cs: CoursesService,
    private rs: RecomendationsService
    ) { }

    /* 
    //old version
    public async recomendedSkillsByUserId(userId: number) {
      console.log("------------------recomendedSkillsByUserId---userId:"+userId);
      let dataTest = await this.rs.recomendedDataByCVByUserId(userId, 'skills');      
      //console.log(dataTest);
      //console.log("------------------");
      this.recommendedSkills = dataTest['recommended_skills'];
      this.lengthRS = this.recommendedSkills.length;
      this.pagedListRS = this.recommendedSkills.slice(0, 1);      

    }
    */

    public async recomendedSkillsByUserId(userId: number) {
      //console.log("recomendedSkillsByUserId");
      let dataToSend = {};
      this.DSSs
      .getMissingSkillsData(dataToSend).subscribe(
        dataMissingSkills => {
          //console.log(dataMissingSkills);
          dataMissingSkills['recommended_skills'].sort((a, b) => a.skill_title.localeCompare(b.skill_title));
          //console.log("Missing skills");
          //console.log(dataMissingSkills);
          this.recommendedSkills = dataMissingSkills['recommended_skills'];
          this.allRecomendations = dataMissingSkills['recommended_skills'];
          this.lengthRS = this.recommendedSkills.length;
          this.pagedListRS = this.recommendedSkills.slice(0, 1);
        },
        error => {
          console.log("Error getting missing skills data!!");
        }
      );
    }

    getSpecializations() {
      //this.selectedSpecializationValue = "Mobile Developer";
      this.allSpecializations = [];
          this.ss.getSpecializations().subscribe(
          resSpecializations => {
            //console.log("Request OK");
            //console.log(resSpecializations); 
          
            resSpecializations.forEach(element => {
              //console.log(element.title);
              let translation = element.title;
  
              translation = this.translate.instant('SPECIALIZATIONS.'+translation);
  
              let data: Specialization = {title:element.title, id:element.id, translateTitle: translation};
              this.allSpecializations.push(data)                           
            });       
            this.allSpecializations.sort((a,b) => (a.translateTitle > b.translateTitle) ? 1 : ((b.translateTitle > a.translateTitle) ? -1 : 0))
            //console.log(this.allSpecializations);
          },
          error => {
              console.log("Error getting data");            
          });
    }

  ngOnInit(): void {
    
    this.getSpecializations();
    
    this.route.params.subscribe(params => {
      /*
      this.recommendedSkills.push({id: 354, title: 'Python (Programming Language)', courses:[{title:'Introduction to Programming', relation:72},{title:'Algorithmic Techniques', relation:50},{title:'Software Technology', relation:48}]});
      this.recommendedSkills.push({id: 300, title: 'TypeScript (Programming Language)', courses:[{title:'Introduction to Programming', relation:65},{title:'Algorithmic Techniques', relation:43},{title:'Software Technology', relation:23}]});
      this.recommendedSkills.push({id: 154, title: 'Test 1', courses:[{title:'C 1', relation:65},{title:'C 2', relation:63},{title:'C 3', relation:23}]});
      this.recommendedSkills.push({id: 187, title: 'Test 2', courses:[{title:'C 4', relation:62},{title:'C 5', relation:53},{title:'C 6', relation:23}]});
      this.recommendedSkills.push({id: 111, title: 'Test 3', courses:[{title:'C 7', relation:25},{title:'C 8', relation:22}]});
      this.recommendedSkills.push({id: 222, title: 'Test 4', courses:[{title:'C 9', relation:10},{title:'C 10', relation:12}]});
      */

      
      //console.log(params['id']);
      this.userid=params['id'];
      
      if (this.userid>0) {

        this.recomendedSkillsByUserId(this.userid);

        this.us
        .getUser(this.userid).subscribe(
          data => {
            //console.log(data);

            //this.plotPieChart();
            //this.plotRadarChart();
            //this.plotLineChart();

          },
          error => {            
            this.router.navigate(["/not_found"]);
          }
        )

      }
      else {
        this.router.navigate(["/not_found"]);
      }

    });            
  }

  plotLineChart() {
    let lineChartLabel = this.translate.instant('CV_GAP_ANALYSIS.FOOTER_LINE_CHART');
      
      this.lineChartLabels = [];
      this.lineChartData  = [];

      this.lineChartOptions = {
        title: {
          text: lineChartLabel,
          display: true
        },
        responsive: true    // THIS WILL MAKE THE CHART RESPONSIVE (VISIBLE IN ANY DEVICE).
      }
            

      this.lineChartData = [{
        label: 'line1',
        data: []
      }
      ];

      for (let index = 2000; index <= 2020; index++) {
        this.lineChartLabels.push(String(index));
        this.lineChartData[0]['data'].push(this.getRandomInt(1200));
        
      }

  }

  plotPieChart() {

    let pieChartLabel = this.translate.instant('CV_GAP_ANALYSIS.FOOTER_PIE_CHART');

    this.pieChartOptions = {
      title: {
        text: pieChartLabel,
        display: true
      },
      responsive: true    // THIS WILL MAKE THE CHART RESPONSIVE (VISIBLE IN ANY DEVICE).
    }

    this.pieChartLabels = ['Consumer Goods', 'Hardware', 'Retail', 'Marketing', 'Entrtainment', 'Law', 'Healthcare', 'Finance', 'Software'];
    this.pieChartData = [2, 2, 2, 2, 3, 3, 2, 2, 19];

    this.showPieChart = true;
  }

  plotRadarChart() {

    let radarChartLabel =  this.translate.instant('CV_GAP_ANALYSIS.FOOTER_RADAR_CHART');

    this.radarChartOptions = {
      title: {
        text: radarChartLabel,
        display: true
      },
      responsive: true    // THIS WILL MAKE THE CHART RESPONSIVE (VISIBLE IN ANY DEVICE).
    }

    this.radarChartLabels =  ['Monitoring & Performance Testing', 'Unit Testing', 'Software Engineering & Architecture', 'Typo3 CMS', 'Frontend HTML/CSS', 'JAVA/Python', 'Database Management', 'Integration', 'Javascript', 'Webserver & Proxies', 'Dev Ops', 'Flow & Neos', 'UI/UX', 'Build Tools', 'PHP', 'Ruby'];
    this.radarChartData = [{
      label: 'Skills',
      data: [10, 9, 8, 7, 6, 5, 5, 8, 3, 3, 6, 2, 1, 3, 6, 5]
    },
    ];

    this.radarChartColors = [
      { 
        backgroundColor: '#2b69b1'
      }
    ];

    this.showRadarChart = true;
    
  }  

  getRandomInt(max: number) {
    return Math.floor(Math.random() * Math.floor(max));
  }

  OnPageChangeSkill(event: PageEvent){
    let startIndex = event.pageIndex * event.pageSize;
    let endIndex = startIndex + event.pageSize;
    if(endIndex > this.lengthRS){
      endIndex = this.lengthRS;
    }
    this.pagedListRS = this.recommendedSkills.slice(startIndex, endIndex);
    //this.plotLineChart();
  }

}
