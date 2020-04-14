import { Component, OnInit } from '@angular/core';
import { FormGroup,  FormBuilder, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { JobsService } from '../_services/jobs.service';
import { ConfirmDialogModel, ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material';
import {TranslateService} from '@ngx-translate/core';

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
      
      this.angForm = this.fb.group({
        Label: ['', Validators.required ],
        department: ['', Validators.required ],
        employmentType: ['', Validators.required ],
        level: ['', Validators.required ],
        JobDescription: ['', Validators.required ],
        SkillReq: this.fb.array([ this.initSkill() ])
      });
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
      this.control = <FormArray>this.angForm.controls['SkillReq'];
      this.control.push(this.initSkill());
    }

    removeSkill(i: number) {
      // remove address from the list
      this.control = <FormArray>this.angForm.controls['SkillReq'];
      this.control.removeAt(i);
    }

    addJob(Label, department, employmentType, level, JobDescription, SkillReq) {
      this.js.addJob(Label, department, employmentType, level, JobDescription, SkillReq);
    }
    
    updateJob(Label, department, employmentType, level, JobDescription, SkillReq) {
      this.js.updateJob(Label, department, employmentType, level, JobDescription, SkillReq, this.jobId);
    }

    loadDataJob() {
      console.log("loadDataJob");
      let dataIn = {"Label":"Job1","department":"department1","employmentType":"4","level":"5","JobDescription":"This is the main description of the job","SkillReq":[{"SkillLabel":"skill1","proficiencyLevel":"2","skillPriority":"3"},{"SkillLabel":"skill2","proficiencyLevel":"1","skillPriority":"2"}]};

      console.log(dataIn.SkillReq.length);

      for (let i=1; i<dataIn.SkillReq.length;i++) {
        console.log(i);
        this.control = <FormArray>this.angForm.controls['SkillReq'];
        this.control.push(this.initSkill());
      }

      this.angForm.setValue(dataIn);

    }


  ngOnInit() {

    this.route.params.subscribe(params => {
      const id = +params.id;
      this.mode = "";
      if (id && id > 0) {
        this.mode = "Edit";
        this.jobId=String(id);
        console.log(this.jobId);  

        this.js.getJob(this.jobId).subscribe(
          res => {
            console.log("Request OK");
            this.loadDataJob();
          },
          error => {
            console.log("Error getting data");
            this.loadDataJob();
          }
        );        
      }
      else {
        this.mode = "Create";
      }

    });

  }

}
