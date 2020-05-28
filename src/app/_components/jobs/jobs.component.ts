import {Component, OnInit, ViewChild, Inject} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';

import { Job } from '../../_models/Job';
import { JobsService } from '../../_services/jobs.service';
import { ExcelServiceService } from '../../_services/excel/excel-service.service';
import { ConfirmDialogModel, ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { TranslateService } from '@ngx-translate/core';
import { MatSnackBar, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AuthService } from '../../_services';
import User from '../../_models/user';

export interface AvailableJobs {
  id: number;
  Label: string;
  department: string;
  employmentType: string;
  level: string;
  JobDescription: string;
  SkillReq: any
}
/*
const ELEMENT_DATA: AvailableJobs[] = [
  {id: 111, Label:"FE developer",department:"department1",employmentType:"4",level:"5",JobDescription:"This is the main description of the job",SkillReq:[{SkillLabel:"Angular",proficiencyLevel:"2",skillPriority:"3"},{SkillLabel:"css",proficiencyLevel:"1",skillPriority:"2"}]},
  {id: 222, Label:"BE developer",department:"department2",employmentType:"3",level:"2",JobDescription:"description of the job",SkillReq:[{SkillLabel:"Java",proficiencyLevel:"3",skillPriority:"1"}]},
  {id: 333, Label:"FE developer 2",department:"department3",employmentType:"2",level:"1",JobDescription:"Another description test",SkillReq:[{SkillLabel:"SASS",proficiencyLevel:"3",skillPriority:"1"},{SkillLabel:"Javascript",proficiencyLevel:"1",skillPriority:"1"}]},
  {id: 444, Label:"BE developer 2",department:"department4",employmentType:"1",level:"4",JobDescription:"Another description",SkillReq:[{SkillLabel:"Python3",proficiencyLevel:"3",skillPriority:"1"},{SkillLabel:"Python2",proficiencyLevel:"1",skillPriority:"1"}]},  
  {id: 555, Label:"FE developer 3",department:"department5",employmentType:"3",level:"3",JobDescription:"Drupal developer",SkillReq:[{SkillLabel:"Drupal 8",proficiencyLevel:"4",skillPriority:"4"},{SkillLabel:"Drupal 9",proficiencyLevel:"2",skillPriority:"2"}]},
  {id: 666, Label:"Javascript developer",department:"department6",employmentType:"2",level:"1",JobDescription:"JS developer",SkillReq:[{SkillLabel:"JS",proficiencyLevel:"2",skillPriority:"1"},{SkillLabel:"HTML",proficiencyLevel:"3",skillPriority:"3"}]}
];
*/
//const ELEMENT_DATA: Job[] = [];
let ELEMENT_DATA: Job[] = [];
/*
const ELEMENT_DATA: Job[] = [
  {id: 111, creator_id: 1, date: "24-4-2020", start_date: "24-4-2020", end_date: "24-4-2020", title:"DEMO FE developer", job_description:"department1", employment_type:"4", level:"5", skills: [{SkillLabel: "skillA", assign: "True", priority: "high", proficiencyLevel: "expert"}]},
  {id: 222, creator_id: 1, date: "24-4-2020", start_date: "24-4-2020", end_date: "24-4-2020", title:"DEMO BE developer", job_description:"department2", employment_type:"3", level:"2", skills: [{SkillLabel: "skillB", assign: "True", priority: "high", proficiencyLevel: "expert"}]},
  {id: 333, creator_id: 1, date: "24-4-2020", start_date: "24-4-2020", end_date: "24-4-2020", title:"DEMO FE developer 2", job_description:"department3", employment_type:"2", level:"1", skills: [{SkillLabel: "skillC", assign: "True", priority: "high", proficiencyLevel: "expert"}]},
  {id: 444, creator_id: 1, date: "24-4-2020", start_date: "24-4-2020", end_date: "24-4-2020", title:"DEMO BE developer 2", job_description:"department4", employment_type:"1", level:"4", skills: [{SkillLabel: "skillD", assign: "True", priority: "high", proficiencyLevel: "expert"}]},
  {id: 555, creator_id: 1, date: "24-4-2020", start_date: "24-4-2020", end_date: "24-4-2020", title:"DEMO FE developer 3", job_description:"department5", employment_type:"3", level:"3", skills: [{SkillLabel: "skillF", assign: "True", priority: "high", proficiencyLevel: "expert"}]},
  {id: 666, creator_id: 1, date: "24-4-2020", start_date: "24-4-2020", end_date: "24-4-2020", title:"DEMO Javascript developer", job_description:"department6", employment_type:"2", level:"1", skills: [{SkillLabel: "skillD", assign: "True", priority: "high", proficiencyLevel: "expert"}]}
];
*/

/*
const ELEMENT_DATA: AvailableJobs[] = [
  {id: 1, skill: 'Angular', required_level: 'req. level 1', priority: '1'},
  {id: 2, skill: 'Java', required_level: 'req. level 2', priority: '2'},
  {id: 3, skill: 'Nodejs', required_level: 'req. level 3', priority: '3'},
  {id: 4, skill: 'Python', required_level: 'req. level 4', priority: '4'},
  {id: 5, skill: 'Drupal', required_level: 'req. level 5', priority: '3'},  
  {id: 6, skill: 'Javascript', required_level: 'req. level 2', priority: '2'},
  {id: 7, skill: 'C/CPP', required_level: 'req. level 7', priority: '7'},
  {id: 8, skill: 'PHP', required_level: 'req. level 2', priority: '2'},
  {id: 9, skill: 'Swift', required_level: 'req. level 4', priority: '7'},
  {id: 10, skill: 'C#', required_level: 'req. level 3', priority: '8'},
  {id: 11, skill: 'Ruby', required_level: 'req. level 1', priority: '3'},
  {id: 12, skill: 'SQL', required_level: 'req. level 3', priority: '4'}
];
*/

@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.css']
})
/*
export class JobsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
*/

export class JobsComponent implements OnInit {
  displayedColumns: string[] = ['id', 'title', 'employment_type', 'level', 'action'];

  //dataSource = ELEMENT_DATA;
  dataSource = new MatTableDataSource(ELEMENT_DATA);
  currentUser: User;

  @ViewChild(MatPaginator, {static: true}) 
  paginator: MatPaginator;  
  
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  jobs: Job[];
  constructor(private js: JobsService, private authservice: AuthService, private excelService:ExcelServiceService, public dialog: MatDialog, private translate: TranslateService,
    public applyForAJobDialog: MatDialog) { 

      this.authservice.currentUser.subscribe(x => this.currentUser = x);

    }

  confirmDialog(id, title): void {
    //const message = `Are you sure you want to do this?`;
    const message = this.translate.instant('JOBS.DELETE_MESSAGE') + " ("+title+")";
    
    const dialogData = new ConfirmDialogModel(this.translate.instant('JOBS.CONFIRM_ACTION'), message);

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "400px",
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      //this.result = dialogResult;

      if (dialogResult) {
         console.log("Under construction");
      }
    });
  }
  

  openApllyJobDialog(jobId: number, element: any): void {

    const dialogRef = this.applyForAJobDialog.open(applyJobDialog_modal, {
      width: '550px',
      data: {jobId: jobId, element: element}
    });

    dialogRef.afterClosed().subscribe(result => {
    });    

  }

  jobsList = [];

  ngOnInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;

    if(!this.currentUser) {
      //if(!this.currentUser.hasOwnProperty('id')){
        this.currentUser={id:0,role:'', userName:'', name:'', surname:'', email:''};
      }
      
    this.js
      .getJobs()
      .subscribe((data: Job[]) => {
        this.jobs = data;
        ELEMENT_DATA = data;
        //console.log(data);
        /*
        ELEMENT_DATA.forEach(element => {
          data.push(element);
          //console.log(element);
        });
        */
        this.dataSource.data = data;

    });
   

  }

  exportExcel(){    
    this.excelService.exportAsExcelFile(ELEMENT_DATA, 'list_of_jobs');
  }

}


@Component({
  selector: 'applyJobDialog',
  templateUrl: './applyJobDialog.html',
  styleUrls: ['./jobs.component.css']
})


export class applyJobDialog_modal implements OnInit {

  currentUser: User;

  role: string;
  available: string;
  expsalary: string;
  score: string;
  actionResult: boolean = false;

  constructor(
    private js: JobsService,
    private authservice: AuthService,
    public dialogRef: MatDialogRef<applyJobDialog_modal>,
    @Inject(MAT_DIALOG_DATA) public data: DialogApplyJobData) {}

  //

  ngOnInit() {

    this.authservice.currentUser.subscribe(x => this.currentUser = x);

    //console.log(this.data.jobId);
    //console.log(this.currentUser.id);

  }
  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmitApplyJobModal() {
    let objectToSend = {
      "role": this.role,
      "available": this.available,
      "expsalary": this.expsalary,
      "score": this.score
    };

    
    this.js
        .applyJob(this.data.jobId, this.currentUser.id, objectToSend).subscribe(
          data => {
            console.log("Apply done!!");
            this.actionResult=true;
            document.getElementById("closeApplyJobModalWindowTrue").click();
          },
          error => {
            alert("Error appling for the job");                      
          }
        );
    
    

  }
  

}

  export interface DialogApplyJobData {
    jobId: number;
    element: any;
  }