import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { UsersService } from '../../_services/users.service';
import { CoursesService } from '../../_services/courses.service'
import Course from '../../_models/course';
import {PageEvent} from '@angular/material/paginator';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import { RecomendationsService } from '../../_services/recomendations.service';
import { CVService } from '../../_services/cv.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { ThemeService } from 'ng2-charts';
import {FormControl} from '@angular/forms';
import { SpecializationsService } from '../../_services/specializations.service';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';

let completedCoursesByUser: any[] = [];

export interface Specialization {
  title: string;
  id: number;
}

@Component({
  selector: 'app-career-advisor',
  templateUrl: './career-advisor.component.html',
  styleUrls: ['./career-advisor.component.css']
})

export class CareerAdvisorComponent implements OnInit {

  displayedColumns: string[] = ['name', 'grade', 'action'];

  //completedCoursesByUser: Course[] = [];
  

  dataSource = new MatTableDataSource(completedCoursesByUser);
  @ViewChild(MatPaginator, {static: true}) 
  paginator: MatPaginator;  
  
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  userid: number;

  showPieChart: Boolean = false;
  pieChartType: String = 'pie';
  pieChartOptions = {};  
  pieChartLabels: String[] = [];
  pieChartData = [];
  pieChartColors : Array<any> = [];

  showBarChart: Boolean = false;
  barChartType: String = 'bar';
  barChartOptions = {};  
  barChartLabels: String[] = [];
  barChartData = [];
  barChartColors : Array<any> = [];

  showLineChart: Boolean = false;
  lineChartType: String = 'line';
  lineChartOptions = {};  
  lineChartLabels: String[] = [];
  lineChartData = [];
  lineChartColors : Array<any> = [];

  showRecommend: Boolean = false;
  
  showLoadingRecomendedSkills: Boolean = false;
  showLoadingRecomendedCourses: Boolean = false;
  recomendedCourses = [];
  pagedListRC = [];
  recommendedSkills = [];
  pagedListRS = []

  // MatPaginator Output
  pageEventRC: PageEvent;
  breakpointRC: number = 2;  //to adjust to screen
  // MatPaginator Inputs
  lengthRC: number = 0;
  pageSizeRC: number = 4;  //displaying three cards each row
  pageSizeOptionsRC: number[] = [4, 8, 12, 16];

  // MatPaginator Output
  pageEventRS: PageEvent;
  breakpointRS: number = 2;  //to adjust to screen
  // MatPaginator Inputs
  lengthRS: number = 0;
  pageSizeRS: number = 4;  //displaying three cards each row
  pageSizeOptionsRS: number[] = [4, 8, 12, 16];

  selectedCourses: any[] = [];
  selectedSkills: any[] = [];
  selectedTabIndex: number = 0;

  
  specializationCtrl = new FormControl();
  //specializationOptions: string[] = [];
  //filteredSpecializationOptions: Observable<string[]>;

  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  addOnBlur = false;
  specializations: Specialization[] = [];
  selectableSpecializations = true;
  removableSpecializations = true;
  addOnBlurSpecializations = true;
  allSpecialisations: Specialization[] = [];

  filteredSpecializations: Observable<string[]>;
  @ViewChild('specializationInput', {static: false}) specializationInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto', {static: false}) matAutocomplete: MatAutocomplete;

  constructor(
    private router: Router,
    private route: ActivatedRoute, 
    private rs: RecomendationsService,
    private cvss: CVService,
    private cs: CoursesService,
    private translate: TranslateService,    
    private us: UsersService,
    private ss: SpecializationsService    
    ) { 
        
      this.filteredSpecializations = this.specializationCtrl.valueChanges.pipe(
        startWith(null),
        map((specialisation: string | null) => specialisation ? this._filter(specialisation) : this.allSpecialisations.slice())
        );      

    }

    private _filter(value: any): any[] {   
      if ( value.hasOwnProperty('name') ) {
        return this.allSpecialisations;
      }
      else {
        //filter by text
        //console.log(this.allSpecialisations);
        //console.log(value);
        let stringToCompare = "";
        if ( value.hasOwnProperty('title') ) {
          stringToCompare = value.title.toLowerCase();
        }
        else if ( value ) {
          stringToCompare = value.toLowerCase();
        }
        else {
          stringToCompare = "";
        }
        //console.log(stringToCompare);
        let filteredSpecializations: Specialization[] = this.allSpecialisations.filter(specialization => specialization.title.toLowerCase().includes(stringToCompare));
  
        //filter skills we have in the selectd list of skills
        let activeIds = [];
        this.specializations.forEach(element => {
          activeIds.push(element.id);
        });
  
        let arr = filteredSpecializations;
  
        if (activeIds.length>0) {
          arr = arr.filter(function(item){
            return activeIds.indexOf(item.id) === -1;
          });
        }
        
        
        return arr;
      }
  
    }
    

    add(event: MatChipInputEvent): void {
      console.log(event);      
    }

    removeSpecialization(specialization: any, indx: number): void {
      
      const index = indx;
  
      if (index >= 0) {
        this.specializations.splice(index, 1);
      }
    }


    selected(event: MatAutocompleteSelectedEvent): void {
      this.specializations.push(event.option.value);
      this.specializationInput.nativeElement.value = '';
      this.specializationCtrl.setValue(null);  
    } 

    public async recomendedDataByUserId(userId: number) {
      this.showLoadingRecomendedCourses = true;
      this.showLoadingRecomendedSkills = true;
      let datarecommendedData = await this.rs.recomendedDataByCVByUserId(userId, 'courses_and_skills');
      //console.log(datarecommendedData);
      this.recomendedCourses = datarecommendedData['recommended_courses'];
      this.showLoadingRecomendedCourses = false;

      datarecommendedData['recommended_courses'].forEach(element => {

        this.cs
        .getSkillsByCourseId(element.course_id).subscribe(
          dataCourseSkills => {
            //console.log(dataCourseSkills);
            element.skills = dataCourseSkills;
        },
        error => {
          console.log("error recovering skills by course id")
        });
        
        element.rating1 = 80; 
        element.rating2 = 45;

      });


      this.recommendedSkills = datarecommendedData['recommended_skills'];
      this.showLoadingRecomendedSkills = false;
      this.lengthRC = this.recomendedCourses.length;
      this.pagedListRC = this.recomendedCourses.slice(0, 4);

      this.lengthRS = this.recommendedSkills.length;
      this.pagedListRS = this.recommendedSkills.slice(0, 4);
      
    }
    public recomendedCoursesByUserId(userId: number) {

      this.cvss
        .getCV(userId).subscribe(
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
                  this.recomendedCourses = dataRecommendationByCV['recommended_courses'];                  
                  
                  dataRecommendationByCV['recommended_courses'].forEach(element => {
                    //console.log(element.course_id);
                    this.cs
                    .getCourse(element.course_id).subscribe(
                      courseData => {
                        //console.log("courseData");
                        //console.log(courseData);
                        element.course_data = courseData;
                        //element.course_description = courseData.description;
                      },
                      error => {
                        console.log("course not found in db");                        
                      }
                    );            
                    
                    
                    this.cs
                    .getSkillsByCourseId(element.course_id).subscribe(
                      dataCourseSkills => {
                        //console.log(dataCourseSkills);
                        element.skills = dataCourseSkills;
                    },
                    error => {
                      console.log("error recovering skills by course id")
                    });
                    
                    element.rating1 = 80; 
                    element.rating2 = 45;
  
                  });
                  
                                    
                  this.recommendedSkills = dataRecommendationByCV['recommended_skills'];
                  /*
                  dataRecommendationByCV['recommended_skills'].forEach(element => {
                    
                  });
                  */

                  this.lengthRC = this.recomendedCourses.length;
                  this.pagedListRC = this.recomendedCourses.slice(0, 4);

                  this.lengthRS = this.recommendedSkills.length;
                  this.pagedListRS = this.recommendedSkills.slice(0, 4);
  
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
    }    


   

  ngOnInit() {


    const showRecommendationParam: string = this.route.snapshot.queryParamMap.get('showRecommend');
    const typeParam: string = this.route.snapshot.queryParamMap.get('type');
    const idsParam: string = this.route.snapshot.queryParamMap.get('ids');

    if (showRecommendationParam=='true') {
      this.showRecommend = true;
    }
    this.selectedTabIndex = 0;
    if (typeParam=="courses") {
      this.selectedTabIndex = 0;
      if (idsParam) {        
        this.selectedCourses = idsParam.split(",").map(Number);
      }
    }
    else if (typeParam=="skills") {
      this.selectedTabIndex = 1;
      if (idsParam) {        
        this.selectedSkills = idsParam.split(",").map(Number);
        //this.selectedSkills = idsParam.split(",");
      }
    }

    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;

    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
         case 'name': return item.course.name;
         default: return item[property];
      }
    };

    this.route.params.subscribe(params => {
      
      //console.log(params['id']);
      this.userid=params['id'];
      
      if (this.userid>0) {
        this.recomendedDataByUserId(this.userid);
        //this.recomendedCoursesByUserId(this.userid);

        //load demo data
        /*
        for (let index = 1; index <=18 ; index++) {
               
          this.recomendedCourses.push({
            id:index,
            title: 'recommended course demo '+String(index), 
            description: 'This is a demo course to test the CA recommendation engine, course:'+String(index), 
            rating1: 80-index, 
            rating2: 60-(index*1.5), 
            skills:['c','java','html','html5','git','python','javascript','css', 'skill '+index]
          });
        }
        */      
        /*
        for (let index = 1; index <=28 ; index++) {
          this.recommendedSkills.push({
            id:index,
            title: 'recommended skill demo '+String(index), 
            description: 'This is a demo skill to test the CA recommendation engine, skill:'+String(index),
            rating1: 75-index, 
            rating2: 68-(index*1.5), 
            skills:['PostgreSQL','MongoDB','Cassandra','Presto', 'Skill '+index],
            jobs:['Software Enginneer','Data Quality Manager','Database Administrator','Web Developer', 'job '+index],
            courses:['https://www.classcentral.com/tag/mysql', 'https://www.coursera.org/courses?query=mysql']
          });
        }
        */
        
        this.ss.getSpecializations().subscribe(
          dataSpecializations => { 
            //console.log(dataSpecializations);
            dataSpecializations.forEach(element => {
              this.allSpecialisations.push({id:element.id, title: element.title});
            }); 

            this.allSpecialisations.sort((a, b) => (a.title > b.title) ? 1 : -1)
          },
          error => {            
            console.log("Error recovering specializations list")
          }
        );

        this.us
        .getUser(this.userid).subscribe(
          data => {
            //console.log("user in db");
            //this.plotPieChart();
            //this.plotBarChart();
            this.plotLineChart();

            this.cs
              .getCompletedCourseByUserId(this.userid)
              .subscribe((coursesData: Course[]) => {
/*
                this.cs
                .getCourses()
                .subscribe((coursesData: Course[]) => {
*/
                //console.log(coursesData);
                //this.completedCoursesByUser = coursesData;
                this.dataSource.data = coursesData;
                completedCoursesByUser = coursesData;
              },
              error => {            
                console.log("error getting couses by user id")
              }
            );  

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

  OnPageChangeRC(event: PageEvent){
    let startIndex = event.pageIndex * event.pageSize;
    let endIndex = startIndex + event.pageSize;
    if(endIndex > this.lengthRC){
      endIndex = this.lengthRC;
    }
    this.pagedListRC = this.recomendedCourses.slice(startIndex, endIndex);
  }

  OnPageChangeRS(event: PageEvent){
    let startIndex = event.pageIndex * event.pageSize;
    let endIndex = startIndex + event.pageSize;
    if(endIndex > this.lengthRS){
      endIndex = this.lengthRS;
    }
    this.pagedListRS = this.recommendedSkills.slice(startIndex, endIndex);
  }

  changeSelectedCourses(event, value) {
    if (event.checked) {
      this.selectedCourses.push(value)
    }
    else {
      let position = this.selectedCourses.indexOf(value);
      if (position>=0) {
        this.selectedCourses.splice(position, 1);
      }      
    }
  }

  changeSelectedSkills(event, value) {
    if (event.checked) {
      this.selectedSkills.push(value)
    }
    else {
      let position = this.selectedSkills.indexOf(value);
      if (position>=0) {
        this.selectedSkills.splice(position, 1);
      }      
    }
  }
  
  scrollToTop() {
    (function smoothscroll() {
        var currentScroll = document.documentElement.scrollTop || document.body.scrollTop;
        if (currentScroll > 0) {
            window.requestAnimationFrame(smoothscroll);
            window.scrollTo(0, currentScroll - (currentScroll / 8));
        }
    })();
}

  showCarrerAdvisorRecommended() {
    this.showRecommend = true;
    this.scrollToTop();
  }

  hideCarrerAdvisorRecommended() {
    this.showRecommend = false;
    this.scrollToTop();
  }

  plotPieChart() {

    let pieChartLabel = this.translate.instant('CAREER_ADVISOR.FOOTER_PIE_CHART');

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

  plotBarChart() {

    let barChartLabel =  this.translate.instant('CAREER_ADVISOR.FOOTER_BAR_CHART');

    this.barChartOptions = {
      title: {
        text: barChartLabel,
        display: true
      },
      responsive: true    // THIS WILL MAKE THE CHART RESPONSIVE (VISIBLE IN ANY DEVICE).
    }

    this.barChartLabels =  ['A', 'B', 'B', 'D', 'E', 'F'];
    this.barChartData = [{
      label: 'Planned',
      data: [10, 12, 15, 8, 5, 9]
    },
    { 
      label: 'Actual',
      data: [15, 6, 9, 12, 7, 4]
    }];

    this.barChartColors = [
      { 
        backgroundColor: '#2b69b1'
      },
      { 
        backgroundColor: 'red'
      }
    ];

    this.showBarChart = true;
    
  }

  getRandomInt(max: number) {
    return Math.floor(Math.random() * Math.floor(max));
  }

  plotLineChart() {

    let lineChartLabel =  "Mockup";

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
    },
    { 
      label: 'line2',
      data: []
    },
    { 
      label: 'line3',
      data: []
    }
  ];

    for (let index = 2000; index <= 2020; index++) {
      this.lineChartLabels.push(String(index));
      this.lineChartData[0]['data'].push(this.getRandomInt(1200));
      this.lineChartData[1]['data'].push(this.getRandomInt(1200));
      this.lineChartData[2]['data'].push(this.getRandomInt(1200));
    }
    //this.lineChartLabels =  ['2000', '2001', '2002', '2003', '2004', '2005', '2006', '2005'];
    
/*
    this.lineChartColors = [
      { 
        backgroundColor: '#2b69b1'
      },
      { 
        backgroundColor: 'red'
      }
    ];
*/
    this.showLineChart = true;
    
  }  

}
