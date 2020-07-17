import { Component, OnInit, ɵConsole } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { JobsService } from '../../_services/jobs.service';
import { Job, JobSkill } from '../../_models/Job';
import { applyJobDialog_modal } from '../../_components/jobs/jobs.component'
//import { MatDialog } from '@angular/material';
import { MatDialog } from '@angular/material/dialog';

import { ConfirmDialogModel, ConfirmDialogComponent } from '../utils/confirm-dialog/confirm-dialog.component';
import { TranslateService } from '@ngx-translate/core';
import { UsersService } from 'src/app/_services/users.service';
import { AuthService } from '../../_services';
import User from '../../_models/user';

@Component({
  selector: 'app-jobs-get',
  templateUrl: './jobs-get.component.html',
  styleUrls: ['./jobs-get.component.css']
})
export class JobsGetComponent implements OnInit {

  constructor(
    private router: Router,
    public dialogModal: MatDialog, 
    private route: ActivatedRoute,
    private js: JobsService,
    private us: UsersService,
    private translate: TranslateService,
    private authservice: AuthService
  ) { 

    this.authservice.currentUser.subscribe(x => this.currentUser = x);

  }


  deleteThisApply(jobId: any, userId: number, posI: number): void {
  

    const message = this.translate.instant('JOB.DELETE_APPLY_MESSAGE');
    
    const dialogData = new ConfirmDialogModel(this.translate.instant('JOBS.CONFIRM_ACTION'), message);

    const dialogRef = this.dialogModal.open(ConfirmDialogComponent, {
      maxWidth: "400px",
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      //this.result = dialogResult;

      if (dialogResult) {
        this.js.deleteJobApply(jobId, userId).subscribe(
          res => {
            //console.log("Request OK");
            if (posI<0) {
              this.getCandidates(jobId);
            }
            else {
              this.jobCandidates.splice(posI, 1);
            }
            
            this.userHasAnApply = false;
          },
          error => {
            //console.log("Error deletring job apply data");
            
          }
        ); 
      }
    });
  }

  jobData: Job;
  jobCandidates: any =[]
  userHasAnApply: boolean = false;
  currentUser: User;

  //jobData: any;
  //jobData = {};
  
  ngOnInit() {

    this.jobData = {id: null, startDate: "", endDate: "", label:"", jobDescription:"",jobLocation:"", contractType:"", seniorityLevel:"",skillReq: [],workExperienceReq:[],educationReq:[]};

    this.route.params.subscribe(params => {

      let id:number = 0;      
      if(params.hasOwnProperty('id')){
        id = params.id;
      }

      if (id) {
        //console.log(id);

        this.us
        .getJobApplisByUser(this.currentUser.id)
        .subscribe((appliesByuser: any[]) => {

          appliesByuser.forEach(element => {
            //console.log(element.jobURI);
            if (element.jobURI==id) {
              this.userHasAnApply = true;
            }
          });
          

        });

        this.getCandidates(id);


        this.js
        .getJob(id).subscribe(
          (dataJob: Job) => {
            //console.log("job in db");
            //console.log(dataCourse);
            this.jobData = dataJob;
          },
          error => {
            this.router.navigate(["/not_found"]);            
          }
        );         
          /*
        this.js
        .getJob(id)
        .subscribe((dataJob: Job) => {

          //console.log(dataJob);
          this.jobData = dataJob;

        });
        */


      }

    });

  }

  getCandidates(jobId: any): void {
    this.js
    .getJobCandidats(jobId)
    .subscribe((jobCandidates: any) => {

      //console.log(jobCandidates);  
      this.jobCandidates = jobCandidates;  

    });
  }

  openApllyJobDialog(jobId: any, element: any): void {
    //console.log(jobId);
    
    const dialogRef = this.dialogModal.open(applyJobDialog_modal, {
      width: '550px',
      data: {jobId: jobId, element: element}
    });

    dialogRef.afterClosed().subscribe(result => {
      //this.userHasAnApply = true;
      if (result) {
        this.userHasAnApply = result;
        this.getCandidates(jobId);
      }
      console.log(result);
    });    
    

  }

}
