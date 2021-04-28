import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { JobsService } from '../../_services/jobs.service';
import { ConfirmDialogModel, ConfirmDialogComponent } from '../utils/confirm-dialog/confirm-dialog.component';
//import { MatDialog } from '@angular/material';
import { MatDialog } from '@angular/material/dialog';

import {TranslateService} from '@ngx-translate/core';
import { Job, JobSkill, Education, WorkHistory } from '../../_models/Job';
import {formatDate} from '@angular/common';
import { AuthService } from '../../_services';
import User from '../../_models/user';
import { QCStorageService } from '../../_services/QC_storage.services';
import {Observable} from 'rxjs';
import { CVService } from '../../_services/cv.service';
import {map, startWith} from 'rxjs/operators';
import { SpecializationsService } from '../../_services/specializations.service'

import RecruitmentOrganisation from '../../_models/recruitmentorganisation';
import { RecruitmentOrganisationService } from '../../_services/recruitmentorganisation.services';

//import { tap } from 'rxjs/operators';
export interface Specialization {
  title: string;
  id: number;
}

@Component({
  selector: 'app-jobs-add',
  templateUrl: './jobs-add.component.html',
  styleUrls: ['./jobs-add.component.css']
})
export class JobsAddComponent implements OnInit {

    myControl = new FormControl();
    form: FormGroup;

    options: any[] = [];
    filteredOptions: Observable<string[]>;

    showError: boolean = false;
    errorMessage: string = '';

    currentUser: User;  
    angForm: FormGroup;
    result: string = '';
    control: FormArray;
    jobId: string = '';
    mode: string = '';
    dataIn : Job;
    jobDataToPost = {};
    allSpecializations: Specialization[] = [];
    selectedSpecializationValue: string = null;
    listAllRecruitmentOrganizations: RecruitmentOrganisation[] = [];
    jobRecruitmentOrganization: number = null;

    constructor(      
      private ros: RecruitmentOrganisationService,
      private ss: SpecializationsService,
      private cs: CVService,
      private qcStorageService: QCStorageService,
      private authservice: AuthService,
      private route: ActivatedRoute, private router: Router, private fb: FormBuilder, private js: JobsService, public dialog: MatDialog, private translate: TranslateService) {

        this.authservice.currentUser.subscribe(x => this.currentUser = x);
        this.createForm();      
    }

    private _filter(value: string): string[] {
    
      const filterValue = value.toString().toLowerCase();   
  
      return this.options.filter(option => option.name.toLowerCase().includes(filterValue));
    }

    
    OptionSelected(event, i){
      //console.log(event);
      console.log(event.option.id);
      this.dataIn.skillReq[i]['label']=event.option.value;
    }

    SelectionChanged(value, i){

      for (let j=1; j<this.options.length;j++) {
        if (this.options[j].id==value) {
          this.dataIn.skillReq[i]['label']=this.options[j].name;
        }

      }
      
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
          uri: ['', Validators.required ],
          label: ['', Validators.required ],
          proficiencyLevel:  ['', Validators.required ],
          priorityLevel:  ['', Validators.required ]
      });
    }

    addSkill() {
      // add skill to the skills list
      //this.control = <FormArray>this.angForm.controls['skillReq'];
      //this.control.push(this.initSkill());
      let newJobSkill = {} as JobSkill;
      newJobSkill.label = "";
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

    addEducation() {
      let newJobEducation = {} as Education;
      newJobEducation.label = "";
      newJobEducation.description = ""; 
      if (!this.dataIn.educationReq)  {
        this.dataIn.educationReq = [newJobEducation];
      } else {
        this.dataIn.educationReq.push(newJobEducation);
      }
      
      
    }

    removeEducation(i: number) {
      this.dataIn.educationReq.splice(i, 1);
    }

    addExperience() {
      let newExperience = {} as WorkHistory;
      newExperience.label = "";
      newExperience.position = "";
      newExperience.duration = ""; 
      if (!this.dataIn.workExperienceReq)  {
        this.dataIn.workExperienceReq = [newExperience];
      } else {
        this.dataIn.workExperienceReq.push(newExperience);
      }
      
      
    }

    removeExperience(i: number) {
      this.dataIn.workExperienceReq.splice(i, 1);
    }


    addJob() {
      this.showError = false;
      this.errorMessage = '';

      //let userdata = JSON.parse(localStorage.getItem('userdata'));
      let userdata = JSON.parse(this.qcStorageService.QCDecryptData(localStorage.getItem('userdataQC')));
      let dateToday = formatDate(new Date(), 'dd-MM-yyyy', 'en');
     
      let dataToSend = this.dataIn;
      dataToSend.creator_id =  ":"+this.currentUser.id.toString();

      
      delete dataToSend.id;
      

/*	  
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
*/


      this.jobDataToPost = dataToSend;
      //console.log(dataToSend);

      this.js.getLastJobId().subscribe(
        res => {
          console.log("get last job id");
          console.log(res);
          dataToSend['id']= res;
          console.log(dataToSend);
          this.js.addJob(dataToSend).subscribe(
            res => {
              console.log("Job created");
              //console.log(res);
              //after update the job
              //window.location.href="/jobs";
              this.router.navigate(["/jobs"]);
            },
            error => {
              console.log("Error creating the job!!");
              console.log(error);
              this.showError = true;
              this.errorMessage = error;
              //this.router.navigate(["/jobs"]);          
            }
          );
        },
        error => {          
          console.log("Error getting last job id!!");
          console.log(error);
		      //this.router.navigate(["/jobs"]);          
        }
      );



    }
    
    updateJob(jobId: any) {
      //console.log(jobId);
      delete this.dataIn.coursesReq;

      console.log(this.dataIn);

      this.js.updateJob(jobId, this.dataIn).subscribe(
        res => {
          //console.log("Job updated");
          //console.log(res);
          //after update the job
          //window.location.href="/jobs";
          this.router.navigate(["/jobs"]);
        },
        error => {
          this.router.navigate(["/jobs"]);
          //alert("Error updating the job!!");
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
      let skillsData = [];
      if (dataObject.skillReq.length>0) {
        for (let i=0; i<dataObject.skillReq.length; i++) {
          let newJobSkill = {} as JobSkill;
          newJobSkill.label = dataObject.skillReq[i].label;
          newJobSkill.priorityLevel = dataObject.skillReq[i].priorityLevel;
          newJobSkill.proficiencyLevel = dataObject.skillReq[i].proficiencyLevel;
          if ( dataObject.skillReq[i].hasOwnProperty('uri') ) {
            newJobSkill.skillURI = dataObject.skillReq[i].uri;
          }
          else if ( dataObject.skillReq[i].hasOwnProperty('skillURI') ) {
            newJobSkill.skillURI = dataObject.skillReq[i].skillURI;
          }
          skillsData.push(newJobSkill);
          //dataObject.skillReq[i] = newJobSkill;
        }

        dataObject.skillReq = [];
        dataObject['skillReq'] = skillsData;

      }

      this.dataIn = dataObject;


/*
      for (let i=1; i<dataIn.skills.length;i++) {
        console.log(i);
        this.control = <FormArray>this.angForm.controls['skillReq'];
        this.control.push(this.initSkill());
      }
*/
      //this.angForm.setValue(dataIn);

    }


    getSkillsList() {

      this.cs
     .getCompetencesSkills()
     .subscribe((data: any[]) => {       
       //this.options = data;
       //console.log(data);
       //console.log(typeof data);
       let competencesList = [];
       for (let i in data) {
         //console.log(i);
         //console.log(data[i]);
         if (data[i]) {
           //console.log(listOfCurrentSkillsIds);
           //console.log(i)
           //only skill we don't have          
            competencesList.push({'id':i, 'name':data[i]})           
         }
         
       }
       competencesList.sort((a, b) => (a.name > b.name) ? 1 : -1)

       this.options = competencesList;
       //console.log(this.options);

    });
  }

  getSpecializations() {
    //this.selectedSpecializationValue = "Mobile Developer";
    this.allSpecializations = [];
        this.ss.getSpecializations().subscribe(
        resSpecializations => {
          //console.log("Request OK");
          //console.log(resSpecializations); 
        
          resSpecializations.forEach(element => {
            //console.log(element.title);
            let data: Specialization = {title:element.title, id:element.id};
            this.allSpecializations.push(data)                           
          });       
          this.allSpecializations.sort((a,b) => (a.title > b.title) ? 1 : ((b.title > a.title) ? -1 : 0))
          //console.log(this.allSpecializations);
        },
        error => {
            console.log("Error getting data");            
        });
  }

  ngOnInit() {

    
    this.ros.getRecruitmentOrganisations().subscribe(
      recruitmentOrganizationsData => {
        //console.log(recruitmentOrganizationsData);
        recruitmentOrganizationsData.sort((a,b) => (a.title.toUpperCase() > b.title.toUpperCase()) ? 1 : ((b.title.toUpperCase() > a.title.toUpperCase()) ? -1 : 0))
        this.listAllRecruitmentOrganizations = recruitmentOrganizationsData;
      },
      error => {
        console.log("error getting recruitment organisations data");
      }
    );
    
    if(!this.currentUser) {
      //if(!this.currentUser.hasOwnProperty('id')){
        this.currentUser={id:0,role:'', userName:'', name:'', surname:'', email:''};
      }  
    
      this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );

    this.getSkillsList();
    this.getSpecializations();

    this.dataIn = {id: null, startDate: "", endDate: "", label:"", jobDescription:"",jobLocation:"", contractType:"", seniorityLevel:"",
    skillReq: [], workExperienceReq:[], educationReq:[]};
    this.route.params.subscribe(params => {
      const id = params.id;
      this.mode = "";
      if (id) {
        this.mode = "Edit";
        this.jobId=String(id);
        //console.log(this.jobId);  

        this.js.getJob(this.jobId).subscribe(
          res => {
            //console.log("Request OK");
            this.loadDataJob(res);
            //console.log(res);
          },
          error => {
            //console.log("Error getting data");
            this.loadDataJob(null);
            this.router.navigate(["/not_found"]);  
          }
        );        
      }
      else {
        this.mode = "Create";
      }

    });

  }

}
