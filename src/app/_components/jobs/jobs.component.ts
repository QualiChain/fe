import {Component, OnInit, ViewChild, Inject} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import { FormControl } from '@angular/forms';
import { Job } from '../../_models/Job';
import { JobsService } from '../../_services/jobs.service';
import { ExcelServiceService } from '../../_services/excel/excel-service.service';
import { ConfirmDialogModel, ConfirmDialogComponent } from '../utils/confirm-dialog/confirm-dialog.component';
import { TranslateService } from '@ngx-translate/core';
//import { MatSnackBar, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { MatDialog } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { AuthService } from '../../_services';
import User from '../../_models/user';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponent } from '../../app.component';
import { V } from '@angular/cdk/keycodes';

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


  matSortActiveValue: string = localStorage.getItem('QC_job_search_sort_name');
  matSortDirectionValue: string = localStorage.getItem('QC_job_search_sort_direction');
  

  //displayedColumns: string[] = ['label', 'employment_type', 'level', 'hiringOrg', 'action'];
  displayedColumns: string[] = ['label', 'contractType', 'level', 'hiringOrganization', 'startDate', 'endDate', 'action'];

  //dataSource = ELEMENT_DATA;
  dataSource = new MatTableDataSource(ELEMENT_DATA);
  currentUser: User;
  companies: any[] = [];

  @ViewChild(MatPaginator, {static: true}) 
  paginator: MatPaginator;  
  
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  changeDefaultSort() {
    //console.log("changeDefaultSort");
    localStorage.setItem('QC_job_search_sort_name', this.sort.active);
    localStorage.setItem('QC_job_search_sort_direction', this.sort.direction);
  }

  paginatorAction(event: any) {
    localStorage.setItem('QC_job_search_pagination_index', event.pageIndex);
    localStorage.setItem('QC_job_search_pagination_size', event.pageSize);
  }

  applyFilter(filterValue: string) {
    //console.log("applyFilter");
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (filterValue) {
      localStorage.setItem('QC_job_search_term', filterValue);
    }
    else {
      localStorage.removeItem('QC_job_search_term');
    }

  }

    jobs: Job[];

  nameFilter = new FormControl('');
  organizationFilter = new FormControl('');
  datesFilter = new FormControl('');

  searchedTerm: string = null;

  filterValues = {
    label: '',
    hiringOrganization: '',
    startDate: '',
    endDate: '',
    creator_id: null
  };

  createdByMe : boolean = false;
  showLoading : boolean = true;
  sortedData: Job[];
  organization : string;
  startDateFilter: any;
  endDateFilter: any;
  
  

  onChangeCreatedByMeCheckbox(checked: boolean) {
    this.createdByMe = checked;
    if (this.createdByMe) {
      this.filterValues.creator_id = this.currentUser.id;
      localStorage.setItem('QC_job_search_createdByMe', this.currentUser.id.toString());
    }
    else {
      this.filterValues.creator_id = null;
      localStorage.removeItem('QC_job_search_createdByMe');
    }
    this.dataSource.filter = JSON.stringify(this.filterValues);
  }

  //dateRangeChange(dateRangeStart: HTMLInputElement, dateRangeEnd: HTMLInputElement) {
  dateRangeChangeStart(dateRangeStart: HTMLInputElement) {
    if (dateRangeStart.value) {
      this.filterValues.startDate = dateRangeStart.value;
      
      localStorage.setItem('QC_job_search_startDate', dateRangeStart.value);
    }
    else {
      this.filterValues.startDate = '';
      localStorage.removeItem('QC_job_search_startDate');
    }
    this.dataSource.filter = JSON.stringify(this.filterValues);
  }
  
  dateRangeChangeEnd(dateRangeEnd: HTMLInputElement) {
    if (dateRangeEnd.value) {
      this.filterValues.endDate = dateRangeEnd.value;

      localStorage.setItem('QC_job_search_endDate', dateRangeEnd.value);
    }
    else {
      this.filterValues.endDate = '';
      localStorage.removeItem('QC_job_search_startDate');
    }
    this.dataSource.filter = JSON.stringify(this.filterValues);
  }

  constructor(
    private appcomponent: AppComponent,
    private router: Router,
    private js: JobsService, public authservice: AuthService, private excelService:ExcelServiceService, public dialog: MatDialog, private translate: TranslateService,
    public applyForAJobDialog: MatDialog) { 

      this.authservice.currentUser.subscribe(x => this.currentUser = x);

      this.dataSource.filterPredicate = this.createFilter();

    }



    sortData(sort: MatSort) {
      const data = this.dataSource.data.slice();
      if (!sort.active || sort.direction === '') {
        this.sortedData = data;
        return;
      }
  
      this.sortedData = data.sort((a, b) => {
        const isAsc = sort.direction === 'asc';
        switch (sort.active) {
          case 'label': return compare(a.label, b.label, isAsc);
          case 'contractType': return compare(this.translate.instant('JOB.EMPLOYMENT_TYPE.OPTIONS.'+a.contractType), this.translate.instant('JOB.EMPLOYMENT_TYPE.OPTIONS.'+b.contractType), isAsc);
          case 'seniorityLevel': return compare(this.translate.instant('JOB.EMPLOYMENT_LEVEL.OPTIONS.'+a.seniorityLevel), this.translate.instant('JOB.EMPLOYMENT_LEVEL.OPTIONS.'+b.seniorityLevel), isAsc);
          case 'hiringOrganization': return compare(a.hiringOrganization, b.hiringOrganization, isAsc);
          case 'startDate': return compare(a.startDate, b.startDate, isAsc);
          case 'endDate': return compare(a.endDate, b.endDate, isAsc);
          default: return 0;
        }
      });
    }



    isLogged = this.appcomponent.isLogged;
    isAdmin = this.appcomponent.isAdmin;
    isRecruiter = this.appcomponent.isRecruiter;
    //isTeacher = this.appcomponent.isTeacher;
    isProfessor = this.appcomponent.isProfessor;
    isStudent = this.appcomponent.isStudent;
    isEmployee = this.appcomponent.isEmployee;



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
         //console.log("Under construction");
         this.js.deleteJob(id).subscribe(data => {
          //window.location.reload();
          let posI = this.dataSource.data.findIndex(function(job){ return job.id === id })
             if (posI>=0) {
               this.dataSource.data.splice(posI, 1);
               this.jobs.splice(posI, 1);
               this.dataSource._updateChangeSubscription();
              }
              //this.router.navigate(["/jobs"]);

        });
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

  createFilter(): (data: any, filter: string) => boolean {
    let filterFunction = function(data, filter): boolean {
      let searchTerms = JSON.parse(filter);

      let dataToReturn : boolean = true;

      if (searchTerms.label) {

        let filterValue = searchTerms.label;
        localStorage.setItem('QC_job_search_term', filterValue);

        dataToReturn = data.label.toString().toLowerCase().indexOf(searchTerms.label.toLowerCase()) !== -1;
      }
      else {
        localStorage.removeItem('QC_job_search_term');
      }
      
      if (dataToReturn) {
        if ( data.hiringOrganization ) {
          if (searchTerms.hiringOrganization) {

            localStorage.setItem('QC_job_search_hiringOrganization', searchTerms.hiringOrganization);

            dataToReturn = (data.hiringOrganization.toString().toLowerCase().indexOf(searchTerms.hiringOrganization.toLowerCase()) !== -1);
            if (data.hiringOrganization?.toString().toLowerCase().indexOf(searchTerms.hiringOrganization.toLowerCase()) !== -1) {
              dataToReturn = true;
            }
            else {
              dataToReturn = false;
            }
          }
          else {
            dataToReturn = true;
          }
        }
        else {
          localStorage.removeItem('QC_job_search_hiringOrganization');

          if (searchTerms.hiringOrganization) {
            dataToReturn = false;
          }
        }
      }
      
      if (dataToReturn) {      
        if (searchTerms.startDate) {  
          localStorage.setItem('QC_job_search_startDate', searchTerms.startDate);
          if ( data.startDate ) {
            if(new Date(data.startDate).getTime() >= new Date(searchTerms.startDate).getTime()){
              dataToReturn = true;
            }
            else {
              dataToReturn = false;
            }
          }      
          else {
            dataToReturn = false;
          }
        }
      }
      if (dataToReturn) {
        if (searchTerms.endDate) {
          if ( data.endDate ) {
            if(new Date(data.endDate).getTime() <= new Date(searchTerms.endDate).getTime()){
              dataToReturn = true;
            }
            else {
              dataToReturn = false;
            }
          }      
          else {
            dataToReturn = false;
          }
        }
      }

      if (dataToReturn) {
        if (searchTerms.creator_id) {
          if (data.creator_id==searchTerms.creator_id) {
            dataToReturn = true;
          }
          else {
            dataToReturn = false;
          }
        }
      }

      return dataToReturn;
      /*
      if ( data.hiringOrganization ) {
        if (searchTerms.hiringOrganization) {
          return data.label.toString().toLowerCase().indexOf(searchTerms.label.toLowerCase()) !== -1
          && data.hiringOrganization.toString().toLowerCase().indexOf(searchTerms.hiringOrganization.toLowerCase()) !== -1;
        }
        else {
          return data.label.toString().toLowerCase().indexOf(searchTerms.label.toLowerCase()) !== -1;
        }        
      }
      else {
        if (searchTerms.hiringOrganization) {
          return data.label.toString().toLowerCase().indexOf(searchTerms.label.toLowerCase()) !== -1
          && (data.hiringOrganization)!= null;
        }
        else {
          return data.label.toString().toLowerCase().indexOf(searchTerms.label.toLowerCase()) !== -1;
        }        
      }    
      */  
    }
    return filterFunction;
  }

  ngOnInit() {
    this.getCompaniesList();
    this.getJobList();

    this.dataSource.sortingDataAccessor = (item, property) => {
      switch(property) {
        case 'employment_type': 
          if (item.contractType) {
            return this.translate.instant('JOB.EMPLOYMENT_TYPE.OPTIONS.'+item.contractType.toUpperCase( ));
          }
          else  {
            return '';
          }
          case 'level': 
          if (item.seniorityLevel) {
            return this.translate.instant('JOB.EMPLOYMENT_LEVEL.OPTIONS.'+item.seniorityLevel.toUpperCase( ));
          }
          else  {
            return '';
          }                  
        default: return item[property];
      }
    }; 

    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;

    this.searchedTerm = localStorage.getItem('QC_job_search_term');
    this.organization = localStorage.getItem('QC_job_search_hiringOrganization');
    
    if (localStorage.getItem('QC_job_search_startDate')) {
      this.startDateFilter = new FormControl(new Date(localStorage.getItem('QC_job_search_startDate')).toISOString());
    }
    if (localStorage.getItem('QC_job_search_endDate')) {
      this.endDateFilter = new FormControl((new Date(localStorage.getItem('QC_job_search_endDate'))).toISOString());
    }
    if (localStorage.getItem('QC_job_search_createdByMe')) {
      this.createdByMe= true;      
    }
    

    if (this.searchedTerm || this.organization || this.startDateFilter || this.endDateFilter || this.createdByMe) {  
      this.createFilter();        
    }

    let defaultPage = localStorage.getItem('QC_job_search_pagination_index');
    if (defaultPage) {
      this.paginator.pageIndex = +(defaultPage);
    }
    else {
      if (this.paginator) {
        this.paginator.pageIndex = 0;
      }
    }

    let defaultSize = localStorage.getItem('QC_job_search_pagination_size');
    if (defaultSize) {
      this.paginator.pageSize = +(defaultSize);
    }

    this.nameFilter.valueChanges
    .subscribe(
      label => {
        this.filterValues.label = label;
        this.dataSource.filter = JSON.stringify(this.filterValues);
      }
    )
  this.organizationFilter.valueChanges
    .subscribe(
      hiringOrganization => {
        this.filterValues.hiringOrganization = hiringOrganization;
        this.dataSource.filter = JSON.stringify(this.filterValues);
      }
    )



    if(!this.currentUser) {
      //if(!this.currentUser.hasOwnProperty('id')){
        this.currentUser={id:0,role:'', userName:'', name:'', surname:'', email:''};
      }  
    }

    selectCompany(value: any) {
      //console.log(value);
    }

    getCompaniesList() {
      this.js
      .getCompanies()
      .subscribe((dataCompanies: any[]) => {
        this.companies = dataCompanies;
      });
    }
    
    getJobList() {
      this.js
      .getJobs()
      .subscribe((data: Job[]) => {        
        this.jobs = data;
        ELEMENT_DATA = data;
        this.dataSource.data = data;
        this.showLoading = false;
      },
      error => {
        console.log("Error loading jobs"); 
        this.showLoading = false;                     
      });
    }

  exportExcel(){    
    this.excelService.exportAsExcelFile(ELEMENT_DATA, 'list_of_jobs');
  }

}

function compare(a: number | string | Date, b: number | string | Date, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}

@Component({
  selector: 'applyJobDialog',
  templateUrl: './applyJobDialog.html',
  styleUrls: ['./jobs.component.css']
})


export class applyJobDialog_modal implements OnInit {

  currentUser: User;

//  role: string;
  available: string;
  expsalary: string;
  //score: string;
  actionResult: boolean = false;
  showErorMessage: boolean = false;
  errorMessage: string = null;

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

    this.showErorMessage = false;
    this.errorMessage = null;

    let objectToSend = {
//      "role": this.role,
      "availableAt": this.available,
      "expectedSalary": this.expsalary//,
      //"score": this.score
    };

    

    this.js.getLastJobApplicationId().subscribe(
      res => {
        //console.log("get last job application id");
        //console.log(res);
        objectToSend['id']= res;
        //console.log(objectToSend);

        this.js
        .applyJob(this.data.jobId, this.currentUser.id, objectToSend).subscribe(
          data => {
            //console.log("Apply done!!");
            this.actionResult=true;
            document.getElementById("closeApplyJobModalWindowTrue").click();
          },
          error => {
            //console.log(error);
            this.showErorMessage = true;
            this.errorMessage = error;
            //document.getElementById("closeApplyJobModalWindowTrue").click();
            //alert("Error appling for the job");                      
          }
        );

      },
      error => {          
        console.log("Error getting last job id!!");
        console.log(error);
        this.showErorMessage = true;
        this.errorMessage = error;
        //this.router.navigate(["/jobs"]);          
      }
    );

}
  

}

  export interface DialogApplyJobData {
    jobId: number;
    element: any;
  }