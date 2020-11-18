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
import Course from '../../../_models/course';
import { exit } from 'process';
import { AppComponent } from '../../../app.component';

import { UploadService } from '../../../_services/upload.service';
import { environment } from '../../../../environments/environment';
const downloadUrl = environment.downloadFilesUrl;

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

  @ViewChild('skillInput', {static: false}) skillInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto', {static: false}) matAutocomplete: MatAutocomplete;


  listOfSmartAwardsOU: any =[];
  
  constructor(
    private uploads: UploadService,
    private appcomponent: AppComponent,
    private ous: OUService,
    private cs: CoursesService,
    public CVDialog: MatDialog,
    private router: Router, public awardDialog: MatDialog, private bs: BadgesService, private us: UsersService, private authservice: AuthService, private route: ActivatedRoute, private formBuilder: FormBuilder, private cvs: CVService, private translate: TranslateService) { 

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

  openAwardDialogInUserProfile(userId: number, element: any) {
     
    const dialogRef = this.awardDialog.open(awardDialog_modal, {
      width: '550px',
      data: {userId: userId, element: element, source: 'profile'}
    });

    dialogRef.afterClosed().subscribe(result => {
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

      //if (id>0) {
      if (id) {
        this.bs
        .getBadgesByUser(id)
        .subscribe((data: any) => {
          //this.jobs = data;
          //console.log(dataFull);
          //console.log(data);
          this.smartBadgesByUser = data;

        });
        
      }

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


        this.cs
        .getCompletedCourseByUserId(id)
        .subscribe((coursesData: Course[]) => {
          this.listOfCompletedCoursesByUser = coursesData;
        },
        error => {            
          console.log("error getting courses by user id")
        }
        );
                

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
        if ((this.userId.toString()==this.currentUser.id.toString()) || (this.isAdmin)) {
          this.canEditCV = true;
          this.canViewCV = true;
        }
        //else if (this.currentUser.role.toLowerCase()=='recruiter') {
        else if (this.isRecruiter) {
          this.canViewCV = true;
        }
        
        

        this.us
        .getUser(this.userId).subscribe(
          data => {
            //console.log("user in db");
            this.userdata = data;

            if ((this.userdata.avatar_path=='') || (!this.userdata.avatar_path)){
              this.userdata.avatar_path = 'assets/img/no_avatar.jpg';              
            } 

            this.uploads.getUserFiles(data.id).subscribe(
              res => {                
                res.files.forEach(element => {
                  var index = element.filename.indexOf(data.id+"_avatar_" ); 
                  if (index==0) {                
                    this.userdata.avatar_path =  downloadUrl+"/file/"+element.file_id;
                  }
                });
                                
              },
              error => {
                console.log("Error recovering files");                
              }
            );

            //Start OU connexion 
            this.connectToOU();
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
          reject(error);
        };
        img.src = url;
      });
  
  }
  

 
async generatePdf(action = 'open') {
  //console.log(this.userdata.avatar_path);
  if (!this.userdata.avatar_path) {
    this.userdata.avatar_path = 'assets/img/no_avatar.jpg';
  }
  //console.log(this.userdata.avatar_path);
  
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
          }],
          [ 
            {image: await this.getBase64ImageFromURL(
              this.userdata.avatar_path
            ),
            height: 100
            }]
         ]      
      }      
    ]
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

  //private appcomponent: AppComponent,
  constructor(            
    private router: Router,  
    private us: UsersService, private authservice: AuthService,
    private cvs: CVService,
    private formBuilder: FormBuilder,
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

          this.label = data.label;
          this.description = data.description;
          this.targetSector = data.targetSector;
          this.skillsCV = data.skills;
          this.workHistoryCV = data.workHistory;
          this.educationHistoryCV = data.education;
           data.skills.forEach(element => {
            this.t.push(this.formBuilder.group({
              label: [element.label, [Validators.required]],
              proficiencyLevel: [element.proficiencyLevel, Validators.required],
              comment: [element.comment, [Validators.required]],      
            }));
          });
          data.workHistory
          .forEach(element => {
            this.w.push(this.formBuilder.group({
              position: [element.position, Validators.required],
              from: [element.from, [Validators.required]],
              to: [element.to, [Validators.required]],
              employer: [element.employer, [Validators.required]],
            }));
          });
          data.education
          .forEach(element => {
            this.e.push(this.formBuilder.group({
              title: [element.title, Validators.required],
              from: [element.from, [Validators.required]],
              to: [element.to, [Validators.required]],
              organisation: [element.organisation, [Validators.required]],
              description: [element.description, [Validators.required]],
            }));
          });  
          
          this.loadingSpinner = false;
        //}      
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

addFormGroupItem(e, type) {
  if (type=='skillitem') {
    this.t.push(this.formBuilder.group({
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
      title: ['', Validators.required],
      from: ['', [Validators.required]],
      to: ['', [Validators.required]],
      organisation: ['', [Validators.required]],
      description: ['', [Validators.required]],
    }));
  }


}  


onSubmit() {

  this.loadingSpinner = true;

  var dataToSend = {
    'personURI': this.data.userId,
    'label':this.label,
    'targetSector': this.targetSector,
    'description': this.description,
    'skills': this.dynamicForm.value.Skills,
    'workHistory': this.dynamicFormWorks.value.workHistory,
    'education': this.dynamicFormEducations.value.Education
  };

  //console.log(this.data.userId);

  this.cvs.postCV(this.data.userId, dataToSend).subscribe(
    res => {
      //console.log(res);
      //console.log("CV sended correctly");
      //alert('Success!!');
      this.loadingSpinner = false;
    },
    error => {
      //console.log("error sending CV data");
      //alert('Error sending data!!!');
      this.loadingSpinner = false;
    }
  );


  
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
  
  constructor(
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
    console.log(args);
    this.dobieResult = args.message;
  }

}

export interface CVDialogData {
  userId: number;
}