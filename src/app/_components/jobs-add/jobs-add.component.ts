import { Component, OnInit } from '@angular/core';
import { FormGroup,  FormBuilder, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { JobsService } from '../../_services/jobs.service';
import { ConfirmDialogModel, ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material';
import {TranslateService} from '@ngx-translate/core';
import { Job, JobSkill } from '../../_models/Job';

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
        skillReq: this.fb.array([ this.initSkill() ])
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
      //this.control = <FormArray>this.angForm.controls['skillReq'];
      //this.control.push(this.initSkill());
      let newJobSkill = {} as JobSkill;
      newJobSkill.SkillLabel = "";
      //newJobSkill.assign = "";
      //newJobSkill.priority = "";
      newJobSkill.proficiencyLevel = ""; 
      if (!this.dataIn.skillReq)  {
        this.dataIn.skillReq = [newJobSkill];
      } else {
        this.dataIn.skillReq.push(newJobSkill);
      }
      
      
    }

    removeSkill(i: number) {
      // remove address from the list
      //this.control = <FormArray>this.angForm.controls['skillReq'];
      //this.control.removeAt(i);
      this.dataIn.skillReq.splice(i, 1);
    }

    addJob() {
      //this.dataIn.creator_id = 1;
      //this.dataIn.date = "24-4-2020";
      let dataToSend = this.dataIn;
      delete dataToSend.id;

      this.js.addJob(dataToSend).subscribe(
        res => {
          console.log("Job created");
          //console.log(res);
          //after update the job
          window.location.href="/jobs";
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
          window.location.href="/jobs";
        },
        error => {
          alert("Error updating the job!!");
        }
      );

    }

    loadDataJob(dataObject) {
      console.log("loadDataJob");
      
      if (!dataObject) {
        this.dataIn = {id: null, label: "DEMO FE developer", jobLocation: "department1", employmentType:"", level:"",jobDescription:"",startDate: "",endDate: "",skillReq:[]};

      }
      else {
        console.log(dataObject);
        this.dataIn = dataObject;
      }


/*
      for (let i=1; i<dataIn.skills.length;i++) {
        console.log(i);
        this.control = <FormArray>this.angForm.controls['skillReq'];
        this.control.push(this.initSkill());
      }
*/
      //this.angForm.setValue(dataIn);

    }


  ngOnInit() {
    
    this.dataIn = {id: null, label: null, employmentType:"", level:"",jobDescription:"",jobLocation:"",startDate: "",endDate: "",skillReq:[]};
    this.route.params.subscribe(params => {
      const id = params.id;
      this.mode = "";
      if (id ) {
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
