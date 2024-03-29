import { Component, OnInit, ViewChild } from '@angular/core';
import { ThesisService } from '../../../_services/thesis.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../_services';
import User from '../../../_models/user';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator'
import { AppComponent } from '../../../app.component';

@Component({
  selector: 'app-thesis-get',
  templateUrl: './thesis-get.component.html',
  styleUrls: ['./thesis-get.component.css']
})
export class ThesisGetComponent implements OnInit {

  currentUser: User;
  loadSpinner: boolean = false;
  myRequestHasCreated: boolean = false;
  myThesisRequestId = null;
  
  displayedColumns: string[] = ['surname', 'name'];
  listOfThesisRequests = new MatTableDataSource([]);

  @ViewChild(MatPaginator, {static: true}) 
  paginator: MatPaginator;  
  
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  thesisByProfessorId: any[] = [];

  constructor(
    private appcomponent: AppComponent,
    private ts: ThesisService,
    private route: ActivatedRoute,
    private router: Router,
    private authservice: AuthService,) { 

      this.authservice.currentUser.subscribe(x => this.currentUser = x);

    }

  thesisMainData: any = {'professor':{'id':null}};
  
  isStudent = this.appcomponent.isStudent;
  hideApplyForThesis : boolean = false;
  assignedThesisId: number = null;
  userHasAThesisiAssigned : boolean = false;
  thesisId: number = null;

  deleteApplayToThesis(requestThesisId) {
    this.loadSpinner = true;

    this.ts.deleteThesisRequest(requestThesisId).subscribe(
      res => {
        this.loadSpinner = false;
        this.myRequestHasCreated = false;
        this.myThesisRequestId = null;
      },
      error => {        
        alert("Error deleting thesis request!!");
        this.loadSpinner = false;
      }
    );

  }

  applayToThesis(thesisId) {
    //console.log(thesisId);
    this.loadSpinner = true;
    let obj = {
      "thesis_id": thesisId,
      "student_id": this.currentUser.id
      };     

    this.ts.thesisRequest(obj).subscribe(
      res => {
        //console.log(res)
        let dataRes = res.split("=");
        this.loadSpinner = false;
        this.myRequestHasCreated = true;
        this.myThesisRequestId = dataRes[1];
      },
      error => {
        alert("Error creating thesis request!!");
        this.loadSpinner = false;
      }
    );


  }

  ngOnInit(): void {

    if(!this.currentUser) {
      this.currentUser={id:0,role:'', userName:'', name:'', surname:'', email:''};
  }
  
  this.listOfThesisRequests.sortingDataAccessor = (item, property) => {
    switch(property) {
      case 'name': return item.student.name;
      case 'surname': return item.student.surname;
      default: return item[property];
    }
  };    
  
  this.listOfThesisRequests.sort = this.sort;
  this.listOfThesisRequests.paginator = this.paginator;


    this.route.params.subscribe(params => {

      let id:number = 0;      
      if(params.hasOwnProperty('id')){
        id = +params.id;
      }
      
      if (id>0) {

        this.thesisId = id;
        
          this.ts
          .getThesisByStudentId(this.currentUser.id)
          .subscribe((data: any[]) => {
            data.forEach(element => {
              //console.log(element);
              if (element.status=="assigned") {
                this.hideApplyForThesis = true;
                this.userHasAThesisiAssigned = true;
                this.assignedThesisId = element.id;
              }
            });
          },
          error => {
            console.log("Error thesis by user id");
          });
        

        this.ts
        .getAllThesisRequestsByThesisId(id).subscribe(
          (dataRequestsThesis:any) => {
            this.listOfThesisRequests.data = dataRequestsThesis;
            
            //console.log(dataRequestsThesis);
            for (let index = 0; index < dataRequestsThesis.length; index++) {
              
              if (dataRequestsThesis[index]['student']['id']==this.currentUser.id) {
                this.myThesisRequestId = dataRequestsThesis[index]['id'];
                this.myRequestHasCreated = true;
                index = dataRequestsThesis.length;
              }
              
            }
          },
          error => {
            console.log("request thesis not found!!");
          }
        );   

        this.ts
        .getThesisById(id).subscribe(
          dataThesis => {
            //console.log(dataThesis);
            this.thesisMainData = dataThesis;

            this.ts
            .getThesisByProfessorId(this.thesisMainData.professor.id)
            .subscribe((thesisByProfessorId: any[]) => {
              this.thesisByProfessorId = thesisByProfessorId;
            });   

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

}
