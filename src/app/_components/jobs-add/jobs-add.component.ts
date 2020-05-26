import { Component, OnInit } from '@angular/core';
import { FormGroup,  FormBuilder, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { JobsService } from '../../_services/jobs.service';
import { ConfirmDialogModel, ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material';
import {TranslateService} from '@ngx-translate/core';
import { Job, JobSkill } from '../../_models/Job';
import {formatDate} from '@angular/common';

//import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-jobs-add',
  templateUrl: './jobs-add.component.html',
  styleUrls: ['./jobs-add.component.css']
})
export class JobsAddComponent implements OnInit {

    angForm: FormGroup;
    result: string = '';
    control: FormArray;
    jobId: string = '';
    mode: string = '';
    dataIn : Job;

    constructor(private route: ActivatedRoute, private router: Router, private fb: FormBuilder, private js: JobsService, public dialog: MatDialog, private translate: TranslateService) {
      this.createForm();      
    }

    confirmDialog(): void {
      //const message = `Are you sure you want to do this?`;
      const message = this.translate.instant('JOBS.CANCEL_MESSAGE');
      
      const dialogData = new ConfirmDialogModel(this.translate.instant('JOBS.CONFIRM_ACTION'), message);
  
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        maxWidth: "400px",
        data: dialogData
      });
  
      dialogRef.afterClosed().subscribe(dialogResult => {
        this.result = dialogResult;
  
        if (dialogResult) {
          //window.location.href="/jobs";
          this.router.navigate(['/jobs']);
        }
      });
    }

    createForm() {
      /*
      this.angForm = this.fb.group({
        title: ['', Validators.required ],
        department: ['', Validators.required ],
        employmentType: ['', Validators.required ],
        level: ['', Validators.required ],
        JobDescription: ['', Validators.required ],
        SkillReq: this.fb.array([ this.initSkill() ])
      });
      */
    
    }

    initSkill(): FormGroup {
      return this.fb.group({
          SkillLabel: ['', Validators.required ],
          proficiencyLevel:  ['', Validators.required ],
          skillPriority:  ['', Validators.required ]
      });
    }

    addSkill() {
      // add skill to the skills list
      //this.control = <FormArray>this.angForm.controls['SkillReq'];
      //this.control.push(this.initSkill());
      let newJobSkill = {} as JobSkill;
      newJobSkill.SkillLabel = "";
      newJobSkill.assign = "";
      newJobSkill.priority = "";
      newJobSkill.proficiencyLevel = ""; 
      if (!this.dataIn.skills)  {
        this.dataIn.skills = [newJobSkill];
      } else {
        this.dataIn.skills.push(newJobSkill);
      }
      
      
    }

    removeSkill(i: number) {
      // remove address from the list
      //this.control = <FormArray>this.angForm.controls['SkillReq'];
      //this.control.removeAt(i);
      this.dataIn.skills.splice(i, 1);
    }

    addJob() {
      let userdata = JSON.parse(localStorage.getItem('userdata'));
      let dateToday = formatDate(new Date(), 'dd-MM-yyyy', 'en');
      
     let dataToSend = {
        "title": this.dataIn.title,
        "jobDescription": this.dataIn.job_description,
        "level": this.dataIn.level,
        "date": dateToday,
        "startDate": this.dataIn.start_date,
        "endDate": this.dataIn.end_date,
        "creatorId": userdata.id,
        "employmentType": this.dataIn.employment_type,
        "skills": this.dataIn.skills
    };

      this.js.addJob(dataToSend).subscribe(
        res => {
          //console.log("Job created");
          //console.log(res);
          //after update the job
          //window.location.href="/jobs";
          this.router.navigate(["/jobs"]);
        },
        error => {
          alert("Error creating the job!!");
        }
      );

    }
    
    updateJob(jobId: number) {

      this.js.updateJob(jobId, this.dataIn).subscribe(
        res => {
          //console.log("Job updated");
          //console.log(res);
          //after update the job
          //window.location.href="/jobs";
          this.router.navigate(["/jobs"]);
        },
        error => {
          alert("Error updating the job!!");
        }
      );

    }

    loadDataJob(dataObject) {
      //console.log("loadDataJob");
      /*
      if (!dataObject) {
        this.dataIn = {id: 111, creator_id: 1, date: "24-4-2020", start_date: "24-4-2020", end_date: "24-4-2020", title:"DEMO FE developer", job_description:"department1", employment_type:"4", level:"5", skills: [{SkillLabel: "skillA", assign: "True", priority: "high", proficiencyLevel: "expert"}]};
      }
      else {
        this.dataIn = dataObject;
      }
      */
      this.dataIn = dataObject;


/*
      for (let i=1; i<dataIn.skills.length;i++) {
        console.log(i);
        this.control = <FormArray>this.angForm.controls['SkillReq'];
        this.control.push(this.initSkill());
      }
*/
      //this.angForm.setValue(dataIn);

    }


  ngOnInit() {

    this.dataIn = {id: null, creator_id: null, date: "", start_date: "", end_date: "", title:"", job_description:"", employment_type:"", level:"",
    skills: [{SkillLabel: "", assign: "", priority: "", proficiencyLevel: ""}] };
    this.route.params.subscribe(params => {
      const id = +params.id;
      this.mode = "";
      if (id && id > 0) {
        this.mode = "Edit";
        this.jobId=String(id);
        //console.log(this.jobId);  

        this.js.getJob(this.jobId).subscribe(
          res => {
            //console.log("Request OK");
            this.loadDataJob(res);
          },
          error => {
            //console.log("Error getting data");
            this.loadDataJob(null);
          }
        );        
      }
      else {
        this.mode = "Create";
      }

    });

  }

}
