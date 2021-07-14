import { Component, OnInit, ɵConsole, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {ElementRef, ViewChild} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatAutocompleteSelectedEvent, MatAutocomplete} from '@angular/material/autocomplete';
import {MatChipInputEvent} from '@angular/material/chips';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { CVService } from '../../../_services/cv.service';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import {TranslateService} from '@ngx-translate/core';
import { AuthService } from '../../../_services';

import * as d3 from 'd3';
import * as d3Sankey from 'd3-sankey';
import { UsersService } from '../../../_services/users.service';
import { BadgesService } from '../../../_services/badges.service';

import User from '../../../_models/user';
//import { MatSnackBar, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { MatDialog } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { awardDialog_modal } from '../../../_components/award-smart-badge/award-smart-badge.component';
import { OUService } from '../../../_services/ou.service';
import { CoursesService } from '../../../_services/courses.service';
import { UtilsService } from '../../../_services/utils.service';
import { JobsService } from '../../../_services/jobs.service';
import Course from '../../../_models/course';
import { exit } from 'process';
import { AppComponent } from '../../../app.component';

import { UploadService } from '../../../_services/upload.service';
import { environment } from '../../../../environments/environment';
import { ConfirmDialogModel, ConfirmDialogComponent } from '../../utils/confirm-dialog/confirm-dialog.component';
import { ConditionalExpr } from '@angular/compiler';
const downloadUrl = environment.downloadFilesUrl;
import { SkillsService } from '../../../_services/skills.service';
import {  MatAutocompleteTrigger } from '@angular/material/autocomplete';
//MatOptionSelectionChange

import { Subscription } from 'rxjs';
import { withLatestFrom } from 'rxjs/operators';
import { SpecializationsService } from '../../../_services/specializations.service';

@Component({
  selector: 'app-profiles-view',
  templateUrl: './profiles-view.component.html',
  styleUrls: ['./profiles-view.component.css']
})
export class ProfilesViewComponent implements OnInit {

  smartBadgesByUser: any[];
  currentUser: User;
  dynamicForm: FormGroup;
  dynamicFormWorks: FormGroup;
  dynamicFormEducations: FormGroup;

  submitted = false;


  //userdata: User;
  userdata: any;

/* 
  userdata: {
    id: number;
    name: string;
    surname: string;
    email: string;
    username: string;
    avatar_path?: string;
    university?: string;
    role?: string
};
*/
  years: {};
  currentJustify: string;
  //listOfCoursesByUser: {};
  listOfCoursesByUser: Course[]=[];
  listOfCompletedCoursesByUser: any[]=[];

  //selectedCourse: {};
  emptyCourseSelected: {
    courseid: number, 
    name: string, 
    description: string, 
    related_skills: object, 
    course_badges: object
  };
  
  selectedCourse: any;
  /*
  selectedCourse: {
    courseid: number, 
    name: string, 
    description: string, 
    related_skills: object, 
    course_badges: object
  };
  */
  
  userId = '';
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  skillCtrl = new FormControl();
  filteredSkills: Observable<string[]>;
  skills: string[] = ['Java'];
  allSkills: string[] = ['Angular', 'Java', 'Nodejs', 'Pyhton', 'C#'];
  canViewCV: boolean = false;
  canEditCV: boolean = false;
  skillsCV: any = [];
  workHistoryCV: any = [];
  educationHistoryCV: any = [];
  skillsByCourseInfo: any = [];
  currentJobPosition: string = null;

  @ViewChild('skillInput', {static: false}) skillInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto', {static: false}) matAutocomplete: MatAutocomplete;


  listOfSmartAwardsOU: any =[];
  profileAvatarImg: string = 'assets/img/no_avatar.jpg';
  _reload: boolean = true;
  
  constructor(
    public dialog: MatDialog,
    private js: JobsService,
    private uploads: UploadService,
    private appcomponent: AppComponent,
    private ous: OUService,
    private cs: CoursesService,
    public CVDialog: MatDialog,
    private router: Router, public awardDialog: MatDialog, private bs: BadgesService, private us: UsersService, public authservice: AuthService, private route: ActivatedRoute, private formBuilder: FormBuilder, private cvs: CVService, private translate: TranslateService) { 

    this.authservice.currentUser.subscribe(x => this.currentUser = x);
    
    this.filteredSkills = this.skillCtrl.valueChanges.pipe(
      startWith(null),
      map((skill: string | null) => skill ? this._filter(skill) : this.allSkills.slice()));

  }

  isLogged = this.appcomponent.isLogged;
  isAdmin = this.appcomponent.isAdmin;
  isRecruiter = this.appcomponent.isRecruiter;
  //isTeacher = this.appcomponent.isTeacher;
  isProfessor = this.appcomponent.isProfessor;
  isStudent = this.appcomponent.isStudent;
  isEmployee = this.appcomponent.isEmployee;

  completenessColor: string = "";
  public chartType = 'pie';

  public chartLabels: Array<any> = [this.translate.instant('PROFILES.COMPLETENESS'), this.translate.instant('PROFILES.NOT_COMPLETENESS')];

  public chartOptions: any = {
    responsive: true,
    tooltips: {
      enabled: true,
      mode: 'single',
      callbacks: {
        label: function (tooltipItems, data) {
          return data.labels[tooltipItems.index]+": "+data.datasets[0].data[tooltipItems.index] + ' %';
          //return data.datasets[0].data[tooltipItems.index] + ' %';
        }
      }
    },
      plugins: {
      datalabels: {
        display: true,
        align: 'top',
        anchor: 'end',
        //color: "#2756B3",
        color: "#222",
        font: {
          family: 'FontAwesome',
          size: 14
        },
      
      },
      deferred: false,
      legend: false,
    },

  };
  
  CvPercentatge; number = 0;

  openAwardDialogInUserProfile(userId: number, element: any) {
     
    const dialogRef = this.awardDialog.open(awardDialog_modal, {
      width: '550px',
      data: {userId: userId, element: element, source: 'profile'}
    });

    dialogRef.afterClosed().subscribe(result => {

      //console.log(result);
      this.getSmartBadgesByUser(userId);
    });
    
  }
  

  uploadUserCVKG(userId: number) {
     
    const dialogRef = this.CVDialog.open(UPLOAD_CV_KG_Dialog_modal, {
      disableClose: true,
      width: '550px',
      data: {userId: userId}
    });

    dialogRef.afterClosed().subscribe(result => {
    });
    
  }


  openUserCV(userId: number) {
     
    const dialogRef = this.CVDialog.open(CVDialog_modal, {
      disableClose: true,
      width: '550px',
      data: {userId: userId, isAdmin: this.isAdmin, isRecruiter: this.isRecruiter}
    });

    dialogRef.afterClosed().subscribe(result => {
      //console.log(result);
      if (result) {
        //console.log(this.router.url);
        //this.router.navigate([this.router.url])
        //location.reload();
        this.getPercentageCVByUser(userId);
        setTimeout(() => this._reload = false);
        setTimeout(() => this._reload = true);

      }
    });
    
  }


  add(event: MatChipInputEvent): void {
    // Add fruit only when MatAutocomplete is not open
    // To make sure this does not conflict with OptionSelected Event
    if (!this.matAutocomplete.isOpen) {
      const input = event.input;
      const value = event.value;

      // Add our fruit
      if ((value || '').trim()) {
        this.skills.push(value.trim());
      }

      // Reset the input value
      if (input) {
        input.value = '';
      }

      this.skillCtrl.setValue(null);
    }
  }

  remove(fruit: string): void {
    const index = this.skills.indexOf(fruit);

    if (index >= 0) {
      this.skills.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.skills.push(event.option.viewValue);
    this.skillInput.nativeElement.value = '';
    this.skillCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allSkills.filter(skill => skill.toLowerCase().indexOf(filterValue) === 0);
  }

  getPercentageCVByUser(id) {
    this.cvs
    .getPercentatgeCompletenessCV(id)
    .subscribe((dataPercentatgeCompletenessCV: any) => {

      //color it like red for lower numbers from 0 to 20, 
      //and blue for 20 to 70
      // and green for 70 to 100 is perferct
      this.CvPercentatge = dataPercentatgeCompletenessCV.completeness;

      this.completenessColor= 'rgba(30, 144, 255, 1)';
      if (this.CvPercentatge < 20) {
        this.completenessColor= '#d9534f';
      }
      else if (this.CvPercentatge < 70) {
        this.completenessColor= '#337ab7';
      }
      else if (this.CvPercentatge >= 70) {
        this.completenessColor= '#4cae4c';
      }

      
    },
    error => {            
      console.log("error recovering getPercentatgeCompletenessCV")
    })
  }

  getSmartBadgesByUser(id) {
    //console.log("getSmartBadgesByUser userid:"+id);    
    this.smartBadgesByUser = [];
    /*
          this.bs
          .getBadgesByUser(id)
          .subscribe((dataSB: any) => {
            console.log(dataSB);
            this.smartBadgesByUser = dataSB;
          });        
    */
  }


  openAwardDialogCourse(courseId: number, element: any) {
    console.log(courseId)
    
    const dialogRef = this.awardDialog.open(awardDialog_modal, {
      disableClose: true,
      width: '550px',
      data: {courseId: courseId, element: element, source: 'award_list', type: 'course'}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
    });
    
  }
  ngOnInit() {
    

    if(!this.currentUser) {
    //if(!this.currentUser.hasOwnProperty('id')){
      this.currentUser={id:0,role:'', userName:'', name:'', surname:'', email:'', gender:''};
    }


    this.userdata= {
      id: 0,
      name: '',
      surname: '',
      email: '',
      userName: '',
      avatar_path: 'assets/img/no_avatar.jpg',
      university: '',
      role: '',
      roles: [],
      gender: ''
  };


    this.dynamicForm = this.formBuilder.group({
      Skills: new FormArray([])
    });
    this.dynamicFormWorks = this.formBuilder.group({
      workHistory: new FormArray([])
    });
    this.dynamicFormEducations = this.formBuilder.group({
      Education: new FormArray([])
    });
    
    let id:any = 0;
    this.route.params.subscribe(params => {
      
      //console.log(params['id']);
 
            
      if(params.hasOwnProperty('id')){
        //id = +params.id;
        id = params.id;
        this.userId = params.id;        
      }
      else {        
        if(this.currentUser.hasOwnProperty('id')) { 
          id = this.currentUser.id.toString();
          this.userId = id;        
        }
      }

      
      let authorizedViewOwnProfile =  this.authservice.checkIfPermissionsExistsByUserRoles(['view_own_profile']);
      let authorizedViewOtherProfile =  this.authservice.checkIfPermissionsExistsByUserRoles(['view_other_profile']);

      if (authorizedViewOtherProfile || (authorizedViewOwnProfile && (id.toString() == this.currentUser.id.toString()))) {

        //recover smart badges of the user
        //if (id>0) {
        if (id) {
          this.getSmartBadgesByUser(id);

          this.getPercentageCVByUser(id);

        }

        //load demo data for testing proposes
        //let listOfUsers = [];      
        this.years = [1,2,3,4,5];
        this.currentJustify = 'fill';
        //this.listOfCoursesByUser = listOfCoursesByUser;
        /*
        this.cs
        .getCourses()
        .subscribe((data: Course[]) => {
          //console.log(data);
          data.forEach((element, index) => {         
            if (index<5) {
              this.listOfCoursesByUser.push(element);
            }          
          });
        });
        */     

        if (id>0) {

          //recover current job position
          this.getUserCurrentJobPosition(id.toString());

          //recover list completed courses by user id
          this.cs
          .getCompletedCourseByUserId(id)
          .subscribe((coursesData: Course[]) => {
            //console.log(coursesData);
            this.listOfCompletedCoursesByUser = coursesData;
            //this.listOfCompletedCoursesByUser = [{'course':{'id':1,'name':'test'}}]
          },
          error => {            
            console.log("error getting courses by user id")
          }
          );

          //recover teached coursed by user id
          this.cs
          .getTeachingCourseByUserId(id)
          .subscribe((data: any[]) => {
            //console.log(data);
            data.forEach((element, index) => {         
              //if (index<5) {              
                this.listOfCoursesByUser.push(element.course);
                //getSkillsByCourseId
                this.cs
                .getSkillsByCourseId(element.course.courseid)
                .subscribe((dataSkillsByCourse: any[]) => {
                  //console.log(dataSkillsByCourse);
                  this.skillsByCourseInfo[element.course.courseid] = dataSkillsByCourse;
                  
                });
              //}
              
            });
          });
        }


      }
      else {
        this.router.navigate(["/access_denied"]);
      }

       


      
      /*
      this.emptyCourseSelected = {
        courseid: 0, 
        name: '', 
        description: '', 
        related_skills: [], 
        course_badges: []
      };

      this.selectedCourse = {
        courseid: 0, 
        name: '', 
        description: '', 
        related_skills: [], 
        course_badges: []
      };
      */
     this.selectedCourse = null;


      //const id = +params.id;
      if (this.userId) {
        //this.userId=String(id);

        //if ((this.userId.toString()==this.currentUser.id.toString()) || (this.currentUser.role.toLowerCase()=='administrator')) {

        let authorizedEditOwnProfile =  this.authservice.checkIfPermissionsExistsByUserRoles(['edit_own_profile']);
        let authorizedEditOtherProfile =  this.authservice.checkIfPermissionsExistsByUserRoles(['edit_other_profile']);
        let authorizedViewRecruitment =  this.authservice.checkIfPermissionsExistsByUserRoles(['view_recruitment']);

        //if ((this.userId.toString()==this.currentUser.id.toString()) || (this.isAdmin)) {
        if (authorizedEditOtherProfile || (authorizedEditOwnProfile && (id.toString() == this.currentUser.id.toString()))) {
          this.canEditCV = true;
          this.canViewCV = true;
        }
        //else if (this.isRecruiter) {
        else if (authorizedViewRecruitment) {
          this.canViewCV = true;
        }
        //this.canViewCV = false;
        

        this.us
        .getUser(this.userId).subscribe(
          data => {
            //console.log("user in db");
            this.userdata = data;
            
            //console.log("curent user id:"+this.currentUser.id);
            //console.log("id user rec:"+this.userId);
            //console.log(this.currentUser);
            if (this.userId.toString()==this.currentUser.id.toString()) {
              this.userdata['roles'] = this.currentUser['roles'];
            }

            if (this.userdata) {
              if ((this.userdata.avatar_path=='') || (!this.userdata.avatar_path)){
                this.userdata.avatar_path = 'assets/img/no_avatar.jpg';              
              }
            }
            if (data) {
              this.uploads.getUserFiles(data.id).subscribe(
                res => {                
                  res.files.forEach(element => {
                    var index = element.filename.indexOf(data.id+"_avatar_" ); 
                    if (index==0) {                
                      this.userdata.avatar_path =  downloadUrl+"/file/"+element.file_id;
                      let finalURL = downloadUrl+"/file/"+element.file_id;
                      //console.log(finalURL);
                      this.uploads.getFileURL(finalURL).subscribe(
                        (response: any) =>{
                          //console.log(response);
                            let dataType = response.type;
                            let binaryData = [];
                            binaryData.push(response);
                            let url = window.URL.createObjectURL(new Blob(binaryData, {type: dataType}));
                            this.profileAvatarImg = url;
                        }
                      )
                    }
                  });
                                  
                },
                error => {
                  console.log("Error recovering files");                
                }
              );
            }

            //Start OU connexion 
            //this.connectToOU();
            //End OU connexion 

          },
          error => {     
            if (this.userId.toString()==this.currentUser.id.toString()){
              this.userdata.id= this.currentUser.id.toString();
            }
            else {
              this.router.navigate(["/not_found"]);
            }
            
          }
        );


      }

    });


  }

  confirmDialog() {
    //console.log("delete own profile");
    const message = this.translate.instant('PROFILES.DELETE_OWN_PROFILE');
    const message2 = this.translate.instant('PROFILES.DELETE_OWN_PROFILE_HELP_MESSAGE');

    const dialogData = new ConfirmDialogModel(this.translate.instant('PROFILES.CONFIRM_ACTION'), message+"<br>"+message2);

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "400px",
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      //this.result = dialogResult;
     

      if (dialogResult) {
        //console.log(dialogResult);
        this.us.deleteUser(+this.userId).subscribe(
          data => {
            //console.log("profile deleted!!");
            //localStorage.removeItem('userdataQC');
            //localStorage.removeItem('currentUserQC');
            //localStorage.removeItem('token');
            this.authservice.logout();
            //this.router.navigate(['/login']);
            window.location.reload();
            
          },
          error => {
            alert("Error deleting own profile");
          }
        );
      }
    });

  }

  getUserCurrentJobPosition(id:string) {
    //console.log("getUserCurrentJobPosition-"+id);
    this.us.getUserProfileInJobEndPoint(+id).subscribe(
      data => {
        //console.log(data);
        if ( data ) {
          if ( data.hasOwnProperty('currentJobURI') ) {
            if (data.currentJobURI) {
              //console.log(data.currentJobURI);
              var splitted = data.currentJobURI.split(":"); 
              //console.log(splitted[splitted.length-1]);
              let jobId = splitted[splitted.length-1];
              
              this.js.getJob(jobId).subscribe(
                (jobData:any) => {
                  //console.log(jobData);
                  this.currentJobPosition = jobData.label;
                },
                error => {
                  console.log("error recovering job data - jid:"+jobId);                  
                }
              );
              
            }
          }
        }
      },
      error => {
        console.log("error recovering user data from job endpoint - uid:"+id);
      }
    );

  }  

connectToOU() {
  this.ous
  .getOUToken()
  .subscribe((
    dataOU: any) => {
    if (dataOU.token) {
      this.ous
      .getRecipientsList(dataOU.token)
      .subscribe((dataSBOU: any) => {
        
        //console.log(dataSBOU);
        //this.listOfSmartAwards = dataSBOU.badges;
        dataSBOU.recipients.forEach(element => {
          //console.log(element.email+"--"+this.userdata.email);
          if (element.email.toLowerCase()==this.userdata.email.toLowerCase()) {
            //console.log(element);
            
            this.ous
            .getOUToken()
            .subscribe((
              dataOU: any) => {
        
              if (dataOU.token) {
                this.ous
                .getBadgesList(dataOU.token)
                .subscribe((dataSBOU: any) => {          
                  //console.log(dataSBOU);
                  //this.listOfSmartAwards = dataSBOU.badges;
                  dataSBOU.badges.forEach(elementB => {
  //                  console.log(elementB);
                    this.listOfSmartAwardsOU.push(
                      {
                      id: elementB.id,
                      name: elementB.title,
                      description: elementB.description,
                      issuer: elementB.issuerid,
                      imageurl: elementB.imageurl,
                      assigned: false,
                      status: '',
                      awardedId: ''
                      }
                    );
        
                  });
        
                  this.ous
                  .getAssertionsList(dataOU.token)
                  .subscribe((dataAssertions: any) => {          
                    //console.log(dataAssertions);
                    //this.listOfSmartAwards = dataSBOU.badges;
                    dataAssertions.items.forEach((elementA, index) => {
                      if (elementA.recipientid==element.id) {
                        //console.log(elementA);
                        
                        this.listOfSmartAwardsOU.forEach((elementBadge, indexBadge) => {
                          if (elementBadge.id==elementA.badgeid) {
                            //console.log(indexBadge+"--"+elementBadge.id+"--"+elementA.badgeid+"---"+elementA.status);                            
                            this.smartBadgesByUser.push(
                              {
                                'id': elementBadge.id, 
                                'badge': {
                                  'name': elementBadge.name, 
                                  'description': elementBadge.description, 
                                  'image': elementBadge.imageurl,
                                  'status': elementA.status
                                }
                              })
                          }
                        });

        
                      }
                      
                    });
                    
                    //console.log(this.listOfSmartAwards);
            
                  });
        
                });
        
        
        
        
              }
              
              //console.log(this.selectedUserAwards);
            },
            error => {
              console.log("error recovering token");
            }
            );

            

          }                
        });

    });

    }
    
    //console.log(this.selectedUserAwards);
  },
  error => {
    console.log("error recovering token");
  }
  );   
}


  ngAfterViewChecked () {
    //this.DrawChart();
  }

  private DrawChart() {
    var elementExists = document.getElementById("sankey");
    if (elementExists) {
      document.getElementById("sankey").innerHTML = "";

      var svg = d3.select("#sankey"),
          width = +svg.attr("width"),
          height = +svg.attr("height");

      var formatNumber = d3.format(",.0f"),
          //format = function (d: any) { return formatNumber(d) + " TWh"; },
          format = function (d: any) { return formatNumber(d) },
          color = d3.scaleOrdinal(d3.schemeCategory10);

      var sankey = d3Sankey.sankey()
          .nodeWidth(15)
          .nodePadding(10)
          .extent([[1, 1], [width - 1, height - 6]]);

      var link = svg.append("g")
          .attr("class", "links")
          .attr("fill", "none")
          .attr("stroke", "#000")
          .attr("stroke-opacity", 0.2)
          .selectAll("path");

      var node = svg.append("g")
          .attr("class", "nodes")
          .attr("font-family", "sans-serif")
          .attr("font-size", 10)
          .selectAll("g");

      //d3.json("./energy.json", function (error, energy: any) {
          //if (error) throw error;

      const jobposition: DAG = {
      //var JOBPOSITIONS = {
          nodes: [{
              nodeId: 0,
              name: "Programmer"
          }, {
              nodeId: 1,
              name: "Senior Developer"
          }, {
              nodeId: 2,
              name: "Lead Developer"
          }, {
              nodeId: 3,
              name: "Software Architect"
          }, {
              nodeId: 4,
              name: "Development Manager"
          }, {
            nodeId: 5,
            name: "Project Manager"
          }, {
            nodeId: 6,
            name: "Product Manager"
          }, {
            nodeId: 7,
            name: "CTO"
          }],
          links: [{
              source: 0,
              target: 1,
              value: 4,
              uom: 'Widget(s)'
          }, {
              source: 1,
              target: 2,
              value: 2,
              uom: 'Widget(s)'
          }, {
              source: 1,
              target: 3,
              value: 2,
              uom: 'Widget(s)'
          }, {
              source: 2,
              target: 4,
              value: 1,
              uom: 'Widget(s)'
          }, {
              source: 3,
              target: 5,
              value: 2,
              uom: 'Widget(s)'
          }, {
              source: 4,
              target: 7,
              value: 1,
              uom: 'Widget(s)'
          }, {
              source: 3,
              target: 6,
              value: 2,
              uom: 'Widget(s)'
          }, {
            source: 5,
            target: 7,
            value: 1,
            uom: 'Widget(s)'
        }
        ]
      };


          sankey(jobposition);

          link = link
              .data(jobposition.links)
              .enter().append("path")
              .attr("d", d3Sankey.sankeyLinkHorizontal())
              .attr("stroke-width", function (d: any) { return Math.max(1, d.width); });

          link.append("title")
              .text(function (d: any) { return d.source.name + " → " + d.target.name + "\n" + format(d.value); });

          node = node
              .data(jobposition.nodes)
              .enter().append("g");

          node.append("rect")
              .attr("x", function (d: any) { return d.x0; })
              .attr("y", function (d: any) { return d.y0; })
              .attr("height", function (d: any) { return d.y1 - d.y0; })
              .attr("width", function (d: any) { return d.x1 - d.x0; })
              .attr("fill", function (d: any) { return color(d.name.replace(/ .*/, "")); })
              .attr("stroke", "#000");

          node.append("text")
              .attr("x", function (d: any) { return d.x0 - 6; })
              .attr("y", function (d: any) { return (d.y1 + d.y0) / 2; })
              .attr("dy", "0.35em")
              .attr("text-anchor", "end")
              .text(function (d: any) { return d.name; })
              .filter(function (d: any) { return d.x0 < width / 2; })
              .attr("x", function (d: any) { return d.x1 + 6; })
              .attr("text-anchor", "start");

          node.append("title")
              .text(function (d: any) { return d.name + "\n" + format(d.value); });
      //});

    }
  }  

  getBase64ImageFromURL(url) {  
    if (url=='') {
      url = 'assets/img/no_avatar.jpg';
    }
    
      return new Promise((resolve, reject) => {
        var img = new Image();
        img.setAttribute("crossOrigin", "anonymous");
        img.onload = () => {
          var canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          var ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0);
          var dataURL = canvas.toDataURL("image/png");
          resolve(dataURL);
        };
        img.onerror = error => {
          console.log("Error recovering "+url);
          console.log(error);          
          //img.src="data:image/png;base64,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";
          img.src="assets/img/no_avatar.jpg";
          //console.log(img.src);
          //reject(error);
        };
        img.src = url;
      });
  
  }
  

  async completePDF(action, cvDataIn) {

    let cvDescription = "";
    let targetSector = ""
    
    let skills= [];
    let WH = [];
    let education = [];
    let targetSectorLabel = "";
    let cvDescriptionLabel = "";
    let skillsHeaderLabel = "";
    let WHHeaderLabel = "";
    let educationHeaderLabel = ""
    if (cvDataIn != null) {

      if (cvDataIn.description) {
        cvDescription = cvDataIn.description;
      }
      cvDescriptionLabel = this.translate.instant('CV.DESCRIPTION.LABEL');
      console.log(cvDataIn);
      if (cvDataIn.targetSector) {
        targetSector = cvDataIn.targetSector;
      }
      targetSectorLabel = this.translate.instant('CV.TARGET_SECTOR.LABEL');

      skillsHeaderLabel = this.translate.instant('CV.SKILLS');
      WHHeaderLabel = this.translate.instant('CV.WORK_HISTORY');
      educationHeaderLabel = this.translate.instant('CV.EDUCATION_HISTORY');

      if (cvDataIn.skills.length>0) {
        skills.push([ this.translate.instant('CV.SKILL_LABEL') ,this.translate.instant('CV.SKILL_PROFIENCY_LEVEL'), this.translate.instant('CV.SKILL_COMMENT')]);
        cvDataIn.skills.forEach(element => {
          skills.push([element.skillRefLabel, element.proficiencyLevel, element.skillRefComment])
        });
      }

      if (cvDataIn.workHistory.length>0) {
        WH.push([ this.translate.instant('CV.WORK_POSITION') ,this.translate.instant('CV.WORK_FROM'), this.translate.instant('CV.WORK_TO')]);
        cvDataIn.workHistory.forEach(element => {
          WH.push([element.position, element.from, element.to])
        });
      }
      
      if (cvDataIn.education.length>0) {
        education.push([ this.translate.instant('CV.EDUCATION_TITLE') ,this.translate.instant('CV.EDUCATION_FROM'), this.translate.instant('CV.EDUCATION_TO')]);
        cvDataIn.education.forEach(element => {
          education.push([element.label, element.from, element.to])
        });
      }

    }

    function tableCVData() {

      let returnValue :any;
      //returnValue = {text: " "};

      returnValue = {columns: [
        [
          {
            text: " "
          }       
        ]]
      };
      
      if (targetSector!="") {
        returnValue['columns'][0].push({text: targetSectorLabel+': ' + targetSector, color: '#0e3664'});        
      }

      if (cvDescription!="") {
        returnValue['columns'][0].push({text: cvDescriptionLabel+': ', color: '#0e3664'});
        returnValue['columns'][0].push({text: cvDescription, color: '#0e3664'});
      }
      

      if (skills.length>0) {
        let $tmpText = skillsHeaderLabel;
        returnValue['columns'][0].push({text: " "});
        returnValue['columns'][0].push({text: $tmpText+": ", color: '#0e3664'});
        returnValue['columns'][0].push({
          table: {
              headerRows: 1,
              widths: [ '*', '*', '*'],
              body: skills
          }
        });
      }
      
      if (WH.length>0) {
        let $tmpText = WHHeaderLabel;
        returnValue['columns'][0].push({text: " "});
        returnValue['columns'][0].push({text: $tmpText+": ", color: '#0e3664'});
        returnValue['columns'][0].push({
          table: {
              headerRows: 1,
              widths: [ '*', '*', '*'],
              body: WH
          }
        });
      }
      
      if (education.length>0) {
        let $tmpText = educationHeaderLabel;
        returnValue['columns'][0].push({text: " "});
        returnValue['columns'][0].push({text: $tmpText+": ", color: '#0e3664'});
        returnValue['columns'][0].push({
          table: {
              headerRows: 1,
              widths: [ '*', '*', '*'],
              body: education
          }
        });
      }
  
      return returnValue;
  }

    let docDefinition = {
      footer: function(currentPage, pageCount) {
        return {
            margin:10,
            columns: [          
            {
                fontSize: 9,
                text:[
                {
                text: '--------------------------------------------------------------------------' +
                '\n',
                margin: [0, 20]
                },
                {
                text: '© QualiChain. ' + currentPage.toString() + ' of ' + pageCount,
                }
                ],
                alignment: 'center',
                color: '#0e3664'
            }
            ]
        };
    },
      header: {
        margin: 10,
        columns: [
            {
                // usually you would use a dataUri instead of the name for client-side printing
                // sampleImage.jpg however works inside playground so you can play with it
                image: await this.getBase64ImageFromURL(
                  '/assets/img/qualichain-icon-white.png'
                ),
                width: 20,
                margin: [40, 0, 0, 0],
            },
            {
                margin: [0, 0, 40, 0],
                text: 'QualiChain',
                color: '#0e3664',
                alignment: 'right',
            }
        ]
    },
      content: [      
        {
          text: this.translate.instant('PROFILES.PROFILE'),
          bold: true,
          fontSize: 20,
          alignment: 'center',
          margin: [0, 0, 0, 20],
          color: '#0e3664'
        },
        {
          canvas: [
              {
                  type: 'line',
                  lineColor: '#0e3664',
                  x1: 0,
                  y1: -10,
                  x2: 520,
                  y2: -10,
                  lineWidth: 5,
              }
          ]
      },
        {
          columns: [
            [
              {
                text: " "
             },
            {
              text: this.translate.instant('PROFILES.USERNAME')+' : ' + this.userdata.userName, color: '#0e3664'
            },
            {
              text: this.translate.instant('PROFILES.NAME')+': ' + this.userdata.name, color: '#0e3664'
            },
            {
              text: this.translate.instant('PROFILES.SURNAME')+': ' + this.userdata.surname, color: '#0e3664'
            },      
            {
              text: this.translate.instant('PROFILES.EMAIL')+': ' + this.userdata.email, color: '#0e3664'
            },
            {
              text: this.translate.instant('PROFILES.GENDER')+': ' + this.userdata.gender, color: '#0e3664'
            }
          ],
            [ 
              {image: await this.getBase64ImageFromURL(
                this.userdata.avatar_path
              ),
              height: 130,
              width: 130            
              }
            ]
           ]      
        },
        await tableCVData() 
      ],
      defaultStyle: {
        color: '#0e3664'
      }
    };


    


    //pdfMake.createPdf(docDefinition).open();
    switch (action) {
      case 'open': pdfMake.createPdf(docDefinition).open();    
      break;
      case 'print': pdfMake.createPdf(docDefinition).print(); 
      break;
      case 'download':     
      pdfMake.createPdf(docDefinition).download(); 
      break;
      default: pdfMake.createPdf(docDefinition).open(); 
      break;
    }
  }
 
async generatePdf(action = 'open') {
  //console.log(this.userdata.avatar_path);
  if (!this.userdata.avatar_path) {
    this.userdata.avatar_path = 'assets/img/no_avatar.jpg';
  }
  //console.log(this.userdata);
  let CVData = {};
  this.cvs
  .getCV(this.userdata.id)
  .subscribe((data: any) => {   
    this.completePDF(action, data);    
  },
  error => {            
    this.completePDF(action, null);
  });  
  
}



}

interface SNodeExtra {
  nodeId: number;
  name: string;
}

interface SLinkExtra {
  source: number;
  target: number;
  value: number;
  uom: string;
}
type SNode = d3Sankey.SankeyNode<SNodeExtra, SLinkExtra>;
type SLink = d3Sankey.SankeyLink<SNodeExtra, SLinkExtra>;

interface DAG {
  nodes: SNode[];
  links: SLink[];
}

/**********/
interface CompetencyLevelValues {
  value: string;
  viewValue: string;
}

export interface Specialization {
  title: string;
  id: number;
}

/************************/
@Component({
  selector: 'CVDialog',
  templateUrl: './CVDialog.html',
  styleUrls: ['./profiles-view.component.css']
})
export class CVDialog_modal implements OnInit {
  
  loadingSpinner: Boolean= true;
  currentUser: User;
  userdata: User;
  dynamicForm: FormGroup;
  dynamicFormWorks: FormGroup;
  dynamicFormEducations: FormGroup;

  label: string;
  description: string;
  targetSector: string;

  canViewCV: boolean = false;
  canEditCV: boolean = false;
  skillsCV: any = [];
  workHistoryCV: any = [];
  educationHistoryCV: any = [];
  showError: boolean = false;
  fieldDisabled: boolean = true;
  userHasCV: boolean = false;
  uriCV: string = ""

  allSpecialisations: Specialization[] = [];

  competencies: CompetencyLevelValues[] = [
    {value: 'basic', viewValue: 'Basic'},
    {value: 'medium', viewValue: 'Medium'},
    {value: 'advanced', viewValue: 'Advanced'}
  ];

  //private appcomponent: AppComponent,
  constructor(            
    private ss: SpecializationsService,
    private router: Router,  
    private us: UsersService, private authservice: AuthService,
    private cvs: CVService,
    private formBuilder: FormBuilder,
    public CVDialog: MatDialog,
    public dialogRef: MatDialogRef<CVDialog_modal>,
    @Inject(MAT_DIALOG_DATA) public data: CVDialogData) {

      this.authservice.currentUser.subscribe(x => this.currentUser = x);

    }
    
    isLogged = false;
    isAdmin = false;
    isRecruiter = false;
    isProfessor = false;
    isStudent = false;
    isEmployee = false;
    
    /*
    isLogged = this.appcomponent.isLogged;
    isAdmin = this.appcomponent.isAdmin;
    isRecruiter = this.appcomponent.isRecruiter;
    //isTeacher = this.appcomponent.isTeacher;
    isProfessor = this.appcomponent.isProfessor;
    isStudent = this.appcomponent.isStudent;
    isEmployee = this.appcomponent.isEmployee;
    */
    getUserData(id:string) {
      
      this.us.getUser(id).subscribe(
        data => {
          //console.log("user in db");
          this.userdata = data;
        },
        error => {            
          this.router.navigate(["/not_found"]);            
        }
      );
    }
    
    getUserCV(id:string) {
      this.cvs
      .getCV(id)
      .subscribe((data: any) => {
          this.userHasCV = true;
          this.uriCV = data.uri;

          this.label = data.label;
          this.description = data.description;
          this.targetSector = data.targetSector;
          this.skillsCV = data.skills;
          this.workHistoryCV = data.workHistory;
          this.educationHistoryCV = data.education;
          if(data.skills){
           data.skills.forEach(element => {
            //console.log(element);
            if (element.proficiencyLevel) {
              this.t.push(this.formBuilder.group({
                skillID: [element.skillID, [Validators.required]],
                skillURI: [element.skillURI, [Validators.required]],
                label: [element.label, [Validators.required]],
                evalDate: [element.evalDate],
                acquiredDate: [element.acquiredDate],
                progress: [element.progress],
                proficiencyLevel: [element.proficiencyLevel, Validators.required],
                comment: [element.skillRefComment, [Validators.required]],      
              }));
            }
            else {
              this.t.push(this.formBuilder.group({
                skillID: [element.skillID, [Validators.required]],
                skillURI: [element.skillURI, [Validators.required]],
                label: [element.label, [Validators.required]],
                evalDate: [element.evalDate],
                acquiredDate: [element.acquiredDate],
                progress: [element.progress],
                proficiencyLevel: [element.skillLevel, Validators.required],
                comment: [element.skillRefComment, [Validators.required]],      
              }));
            }
            });
          }
          if(data.workHistory){
            data.workHistory
            .forEach(element => {
              this.w.push(this.formBuilder.group({
                position: [element.position, Validators.required],
                from: [element.from, [Validators.required]],
                to: [element.to, [Validators.required]],
                employer: [element.employer, [Validators.required]],
              }));
            });
          }
          if(data.education){
            data.education
            .forEach(element => {
              this.e.push(this.formBuilder.group({
                //title: [element.title, Validators.required],
                label: [element.label, Validators.required],
                from: [element.from, [Validators.required]],
                to: [element.to, [Validators.required]],
                //organisation: [element.organisation, [Validators.required]],
                organization: [element.organization, [Validators.required]],
                description: [element.description, [Validators.required]],
              }));
            });  
          }
          this.loadingSpinner = false;
        //}      
      },
      error => {            
        this.loadingSpinner = false;
      });
    }

  ngOnInit() {

    //console.log(this.data.userId);
    this.userdata = {id:0,role:'', userName:'', name:'', surname:'', email:'', gender:''}

    if(!this.currentUser) {
        this.currentUser={id:0,role:'', userName:'', name:'', surname:'', email:'', gender:''};
    }

    this.dynamicForm = this.formBuilder.group({
      Skills: new FormArray([])
    });
    this.dynamicFormWorks = this.formBuilder.group({
      workHistory: new FormArray([])
    });
    this.dynamicFormEducations = this.formBuilder.group({
      Education: new FormArray([])
    });

    this.getUserData(this.data.userId.toString());
    this.getUserCV(this.data.userId.toString());
    

    //console.log(this.data.userId+"----"+this.currentUser.id)
    //if ((this.data.userId.toString()==this.currentUser.id.toString()) || (this.currentUser.role.toLowerCase()=='administrator')) {
    if ((this.data.userId.toString()==this.currentUser.id.toString()) || (this.isAdmin)) {      
      this.canEditCV = true;
      this.canViewCV = true;
    }
    //else if (this.currentUser.role.toLowerCase()=='recruiter') {
    else if (this.isRecruiter) {
      this.canViewCV = true;
    }


    this.ss.getSpecializations().subscribe(
      dataSpecializations => { 
        //console.log(dataSpecializations);
        dataSpecializations.forEach(element => {
          this.allSpecialisations.push({id:element.id, title: element.title});
        }); 

        this.allSpecialisations.sort((a, b) => (a.title > b.title) ? 1 : -1);

        //console.log(this.allSpecialisations);
      },
      error => {            
        console.log("Error recovering specializations list")
      }
    );

  }

  
  
  onSubmitAwardsModal() {
    console.log("bb CV ");
  }

  onNoClick(): void {
    this.dialogRef.close();
  }


// convenience getters for easy access to form fields
get fC() { return this.dynamicForm.controls; }  
get t() { return this.fC.Skills as FormArray; }

get wC() { return this.dynamicFormWorks.controls; }
get w() { return this.wC.workHistory as FormArray; }

get eC() { return this.dynamicFormEducations.controls; }
get e() { return this.eC.Education as FormArray; }

deleteFormGroupItem(e, i, type) {
  if (type=='skillitem') {
    this.t.removeAt(i);    
  } 
  else if (type=='workitem') {
    this.w.removeAt(i);    
  }
  else if (type=='educationitem') {
    this.e.removeAt(i);    
  }
}



openAddNewItem(e, type) {
     
  const dialogRef = this.CVDialog.open(AddItemDialog_modal, {
    disableClose: true,
    width: '550px',
    data: {type: type, isAdmin: this.isAdmin, isRecruiter: this.isRecruiter}
  });

  dialogRef.afterClosed().subscribe(result => {
    //console.log(result);
    if (result!=false) {
      if (type=='skillitem') {
        let newItem = {
          skillID: [result.id.replace(":",""), [Validators.required]],
          skillURI: [result.id, [Validators.required]],
          label: [result.label, [Validators.required]],
          proficiencyLevel: [result.proficiencyLevel, Validators.required],
          comment: [result.comment, [Validators.required]],      
        };
        
        this.t.push(this.formBuilder.group(newItem));
      }
      else if (type=='workitem') {
        this.w.push(this.formBuilder.group({
          position: [result.position, Validators.required],
          from: [result.from, [Validators.required]],
          to: [result.to, [Validators.required]],
          employer: [result.employer, [Validators.required]],
        }));
      }
      else if (type=='educationitem') {
        this.e.push(this.formBuilder.group({
          //title: [result.title, Validators.required],
          label: [result.label, Validators.required],
          from: [result.from, [Validators.required]],
          to: [result.to, [Validators.required]],
          //organisation: [result.organisation, [Validators.required]],
          organization: [result.organization, [Validators.required]],
          description: [result.description, [Validators.required]],
        }));
      }
    }
  });
  
}

addFormGroupItem(e, type) {
  if (type=='skillitem') {
    this.t.push(this.formBuilder.group({
      skillID: ['', [Validators.required]],
      skillURI: ['', [Validators.required]],
      label: ['', [Validators.required]],
      proficiencyLevel: ['', Validators.required],
      comment: ['', [Validators.required]],      
    }));
  }
  else if (type=='workitem') {
    this.w.push(this.formBuilder.group({
      position: ['', Validators.required],
      from: ['', [Validators.required]],
      to: ['', [Validators.required]],
      employer: ['', [Validators.required]],
    }));
  }
  else if (type=='educationitem') {
    this.e.push(this.formBuilder.group({
      //title: ['', Validators.required],
      label: ['', Validators.required],
      from: ['', [Validators.required]],
      to: ['', [Validators.required]],
      //organisation: ['', [Validators.required]],
      organization: ['', [Validators.required]],
      description: ['', [Validators.required]],
    }));
  }


}  


onSubmit() {
  //console.log(this.userHasCV);
  this.showError = false;
  this.loadingSpinner = true;
  var userId: string = this.data.userId.toString();
  var re = /:/gi;
  var newsUserId: string = userId.replace(re, "");

  var dataToSend = {
    'personURI': ":"+newsUserId,
    'label':this.label,
    'targetSector': this.targetSector,
    'description': this.description,
    'skills': this.dynamicForm.value.Skills,
    'workHistory': this.dynamicFormWorks.value.workHistory,
    'education': this.dynamicFormEducations.value.Education
  };

  //console.log(this.data.userId);
  //console.log(dataToSend);

  if (this.userHasCV) {

    dataToSend['uri']=this.uriCV;

    this.cvs.updateCVByUserId(this.data.userId, dataToSend).subscribe(
      res => {
        //console.log(res);
        //console.log("CV sended correctly");
        //alert('Success!!');
        this.loadingSpinner = false;
        this.showError = false;
        this.dialogRef.close(true);
      },
      error => {
        //console.log("error sending CV data");
        //alert('Error sending data!!!');
        this.loadingSpinner = false;
        this.showError = true;
      }
    );
  }
  else {
    this.cvs.postCV(this.data.userId, dataToSend).subscribe(
      res => {
        //console.log(res);
        //console.log("CV sended correctly");
        //alert('Success!!');
        this.loadingSpinner = false;
        this.showError = false;
        this.dialogRef.close(true);
      },
      error => {
        //console.log("error sending CV data");
        //alert('Error sending data!!!');
        this.loadingSpinner = false;
        this.showError = true;
      }
    );
  }


  
}



}

/*******************/ 
@Component({
  selector: 'UPLOAD_CV_KG_Dialog_modal',
  templateUrl: './uploadCVTOKG.html',
  styleUrls: ['./profiles-view.component.css']
})
export class UPLOAD_CV_KG_Dialog_modal implements OnInit {
  
  dobieResult: string = null;
  uploadFinished: boolean = false;
  errorLoadingData: boolean = false;

  constructor(
    private us: UtilsService,
    public dialogRef: MatDialogRef<UPLOAD_CV_KG_Dialog_modal>,
    @Inject(MAT_DIALOG_DATA) public data: CVDialogData) {}
  
    
  
  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
    
    //console.log(this.data.userId);

  }

  myCallbackFunctionKG = (args: any): void => {
    //callback code here 
    //console.log(args);
    this.dobieResult = args.message;
    if (args.status=='ok') {
      this.us.sendTextTriples(args.message).subscribe(
        res => {
          //console.log("Tripleted created");
          //console.log(res);
          this.uploadFinished = true;        
        },
        error => {
          console.log("Error sending triplete!!");
          console.log(error);
          this.uploadFinished = true;
          this.errorLoadingData = true;
        }
      );
    }
    else {
      this.uploadFinished = true;
      this.errorLoadingData = true;
    }


  }

}

export interface CVDialogData {
  userId: number;
}


export interface AddItemDialogData {
  type: string;
}

/************* */
@Component({
  selector: 'AddItemDialog',
  templateUrl: './modalAddItem.html',
  styleUrls: ['./profiles-view.component.css']
})
export class AddItemDialog_modal implements OnInit {
  
  //skill
  skill_id: string = "";
  skill_label: string = "";
  skill_profiency_level: string = "";
  skill_comment: string = "";
  
  //work
  work_position: string = "";
  work_from: string = "";
  work_to: string = "";
  work_employer: string = "";

  //education
  //education_title: string = "";
  education_label: string = "";
  education_from: string = "";
  education_to: string = "";
  //education_organisation: string = "";
  education_organization: string = "";
  education_description: string = "";

  competencies: CompetencyLevelValues[] = [
    {value: 'basic', viewValue: 'Basic'},
    {value: 'medium', viewValue: 'Medium'},
    {value: 'advanced', viewValue: 'Advanced'}
  ];

  //myControl = new FormControl();
  myControl: FormControl;
  filteredStates: any;
  options: any[] = [];
  filteredOptions: Observable<string[]>;
  autocompletOption :any;
  @ViewChild(MatAutocompleteTrigger) trigger: MatAutocompleteTrigger;
  subscription: Subscription;

  constructor(
    private ss: SkillsService,
    private cs: CVService,
    private us: UtilsService,
    public dialogRef: MatDialogRef<AddItemDialog_modal>,
    @Inject(MAT_DIALOG_DATA) public data: AddItemDialogData) {

      this.myControl = new FormControl();
      this.filteredStates = this.myControl.valueChanges
      .pipe(
      startWith(null),
      map(name => this._filter(name))
      );

    }

    private _filter(value: string): string[] {
    
      const filterValue = value.toString().toLowerCase();   
  
      return this.options.filter(option => option.name.toLowerCase().includes(filterValue));
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
  
     });    
      
    }

    OptionSelected($event: MatAutocompleteSelectedEvent){
      //console.log($event);
      this.skill_id = $event.option.id;
      this.skill_label = $event.option.value;
      this.myControl.setValue($event.option.value);
    }
  

    ngAfterViewInit() {
      this._subscribeToClosingActions();
    }
  
    ngOnDestroy() {
      if (!!this.subscription && !this.subscription.closed) {
        this.subscription.unsubscribe();
      }
    }

    private _subscribeToClosingActions() {
      if (!!this.subscription && !this.subscription.closed) {
        this.subscription.unsubscribe();
      }

      this.subscription = this.trigger.panelClosingActions
          .subscribe(e => {
            if (!(e && e.source)) {
              this.myControl.setValue("")
              this.skill_label = "";
              this.trigger.closePanel()
            }
          })
    }

    ngOnInit() {
      //console.log(this.data.type.toString());
      this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );

      this.getSkillsList();

    }

    onSubmit() {
      //console.log("submit!!");

      var dataToReturn = {};

      if (this.data.type=='skillitem') {
        dataToReturn = {
          'id': this.skill_id,
          "label": this.skill_label,
          "proficiencyLevel": this.skill_profiency_level,
          "comment": this.skill_comment
        }
      }
      else if (this.data.type=='workitem') {
        dataToReturn = {
          "position": this.work_position,
          "from": this.work_from,
          "to": this.work_to,
          "employer": this.work_employer
        }
      }
      else if (this.data.type=='educationitem') {
        dataToReturn = {
          //"title": this.education_title,
          "label": this.education_label,
          "from": this.education_from,
          "to": this.education_to,
          //"organisation": this.education_organisation,
          "organization": this.education_organization,
          "description": this.education_description
        }
      }

      this.dialogRef.close(dataToReturn);
      

    }

}