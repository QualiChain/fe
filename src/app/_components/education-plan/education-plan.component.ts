import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CoursesService } from '../../_services/courses.service';
import { UsersService } from '../../_services/users.service';
import { SkillsService } from '../../_services/skills.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';

@Component({
  selector: 'app-education-plan',
  templateUrl: './education-plan.component.html',
  styleUrls: ['./education-plan.component.css']
})
export class EducationPlanComponent implements OnInit {

  typeURL: string = " ";
  stingIds: string = null;
  userid: number = null;
  itemList: any[] = [];
  displayedColumns: string[] = [];
  dataSource = new MatTableDataSource([]);
  @ViewChild(MatPaginator, {static: true}) 
  paginator: MatPaginator;  
  
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private cs: CoursesService,
    private ss: SkillsService,
    private us: UsersService
  ) { }

  ngOnInit(): void {
    const typeParam: string = this.route.snapshot.queryParamMap.get('type');
    const idsParam: string = this.route.snapshot.queryParamMap.get('ids');
    this.stingIds = idsParam;
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;

    if (typeParam) {
      this.typeURL = typeParam.toUpperCase();
    }

    this.route.params.subscribe(params => {
      
      //console.log(params['id']);
      this.userid=params['id'];
      
      if (this.userid>0) {
        this.us
        .getUser(this.userid).subscribe(
          data => {
            //console.log(data);
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

    //console.log(this.typeURL);
    var ids = [];
    if (idsParam) {
      ids = idsParam.split(","); 
    }
    //console.log(ids);

    ids.forEach(element => {
      //console.log(element);
      if (this.typeURL=='COURSES') {

        //this.displayedColumns = ['name', 'semester', 'rating'];
        this.displayedColumns = ['name', 'semester', 'action'];

        this.cs
          .getCourse(+element).subscribe(
            dataCourse => {
              //console.log(dataCourse);
              let dataToPush = {id:dataCourse.courseid, name:dataCourse.name, semester:dataCourse.semester, rating: Math.floor(Math.random() * (10 - 0 + 1)) + 0};
              this.itemList.push(dataToPush);
              this.dataSource.data = this.itemList;
            },
            error => {
              console.log("course not found!!");
            }
          );
      }
      else if (this.typeURL=='SKILLS') {
        
        this.displayedColumns = ['name', 'rating'];

        this.ss
        .getSkill(+element).subscribe(
          dataSkill => {
            //console.log(dataSkill)
            let dataToPush = {id:dataSkill.courseid, name:dataSkill.name, rating: Math.floor(Math.random() * (10 - 0 + 1)) + 0};
             this.itemList.push(dataToPush);
            this.dataSource.data = this.itemList;
          },
          error => {
            console.log("skill not found!!");
          }
        );

      }

    });
  }

}
