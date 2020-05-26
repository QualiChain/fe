import { Component, OnInit, ɵConsole } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { JobsService } from '../../_services/jobs.service';
import { Job, JobSkill } from '../../_models/Job';
import { applyJobDialog_modal } from '../../_components/jobs/jobs.component'
import { MatDialog } from '@angular/material';

import { ConfirmDialogModel, ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-jobs-get',
  templateUrl: './jobs-get.component.html',
  styleUrls: ['./jobs-get.component.css']
})
export class JobsGetComponent implements OnInit {

  constructor(
    public dialogModal: MatDialog, 
    private route: ActivatedRoute,
    private js: JobsService,
    private translate: TranslateService
  ) { }


  deleteThisApply(jobId: number, userId: number, posI: number): void {

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
            this.jobCandidates.splice(posI, 1);        
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
  //jobData: any;
  //jobData = {};
  
  ngOnInit() {

    this.jobData = {id:0,creator_id: 0,date: "",employment_type: "",end_date: "",job_description: "",level: "",start_date: "",title: ""};

    this.route.params.subscribe(params => {

      let id:number = 0;      
      if(params.hasOwnProperty('id')){
        id = +params.id;
      }

      if (id>0) {
        //console.log(id);
        this.js
        .getJobCandidats(id)
        .subscribe((jobCandidates: any) => {

          //console.log(jobCandidates);  
          this.jobCandidates = jobCandidates;  

        });


        this.js
        .getJob(id)
        .subscribe((dataJob: Job) => {

          //console.log(dataJob);
          this.jobData = dataJob;

        });


      }

    });

  }

  
  
  openApllyJobDialog(jobId: number, element: any): void {
    //console.log(jobId);
    
    const dialogRef = this.dialogModal.open(applyJobDialog_modal, {
      width: '550px',
      data: {jobId: jobId, element: element}
    });

    dialogRef.afterClosed().subscribe(result => {
    });    
    

  }

}
