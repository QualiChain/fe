import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { UsersService } from '../../_services/users.service';
import { CoursesService } from '../../_services/courses.service'
import Course from '../../_models/course';
import {PageEvent} from '@angular/material/paginator';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';

let completedCoursesByUser: any[] = [];

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
  


  recommendedCourses = [];
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

  constructor(
    private route: ActivatedRoute, 
    private translate: TranslateService,
    private router: Router,
    private us: UsersService,
    private cs: CoursesService
    ) { }

  ngOnInit() {

    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;

    this.route.params.subscribe(params => {
      
      //console.log(params['id']);
      this.userid=params['id'];
      
      if (this.userid>0) {

        //load demo data
        for (let index = 1; index <=18 ; index++) {
          this.recommendedCourses.push({
            id:index,
            title: 'recommended course demo '+String(index), 
            description: 'This is a demo course to test the CA recommendation engine, course:'+String(index), 
            rating1: 80-index, 
            rating2: 60-(index*1.5), 
            skills:['c','java','html','html5','git','python','javascript','css', 'skill '+index]
          });
        }
        this.lengthRC = this.recommendedCourses.length;
        this.pagedListRC = this.recommendedCourses.slice(0, 4);
        
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
        this.lengthRS = this.recommendedSkills.length;
        this.pagedListRS = this.recommendedSkills.slice(0, 4);

        this.us
        .getUser(this.userid).subscribe(
          data => {
            //console.log("user in db");
            this.plotPieChart();
            this.plotBarChart();
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
    this.pagedListRC = this.recommendedCourses.slice(startIndex, endIndex);
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
  
  showCarrerAdvisorRecommended() {
    this.showRecommend = true;
  }

  hideCarrerAdvisorRecommended() {
    this.showRecommend = false;
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
