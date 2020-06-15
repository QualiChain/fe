import { Component, OnInit, ɵConsole } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {ElementRef, ViewChild} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatAutocompleteSelectedEvent, MatAutocomplete} from '@angular/material/autocomplete';
import {MatChipInputEvent} from '@angular/material/chips';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { CVService } from '../../_services/cv.service';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import {TranslateService} from '@ngx-translate/core';
import { AuthService } from '../../_services';

import * as d3 from 'd3';
import * as d3Sankey from 'd3-sankey';
import { UsersService } from '../../_services/users.service';
import { BadgesService } from '../../_services/badges.service';

import User from '../../_models/user';
import { MatSnackBar, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { awardDialog_modal } from '../../_components/award-smart-badge/award-smart-badge.component';
import { OUService } from '../../_services/ou.service';
import { CoursesService } from '../../_services/courses.service';
import Course from '../../_models/course';

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

  //selectedCourse: {};
  emptyCourseSelected: {
    courseid: number, 
    name: string, 
    description: string, 
    related_skills: object, 
    course_badges: object
  };
  
  selectedCourse: {
    courseid: number, 
    name: string, 
    description: string, 
    related_skills: object, 
    course_badges: object
  };
  
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

  @ViewChild('skillInput', {static: false}) skillInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto', {static: false}) matAutocomplete: MatAutocomplete;


  listOfSmartAwardsOU: any =[];
  
  constructor(
    private ous: OUService,
    private cs: CoursesService,
    private router: Router, public awardDialog: MatDialog, private bs: BadgesService, private us: UsersService, private authservice: AuthService, private route: ActivatedRoute, private formBuilder: FormBuilder, private cvs: CVService, private translate: TranslateService) { 

    this.authservice.currentUser.subscribe(x => this.currentUser = x);

    this.filteredSkills = this.skillCtrl.valueChanges.pipe(
      startWith(null),
      map((skill: string | null) => skill ? this._filter(skill) : this.allSkills.slice()));

  }

  openAwardDialogInUserProfile(userId: number, element: any) {
     
    const dialogRef = this.awardDialog.open(awardDialog_modal, {
      width: '550px',
      data: {userId: userId, element: element, source: 'profile'}
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

  
/*
    this.route.params.subscribe(params => {
      
    });
*/
    this.dynamicForm = this.formBuilder.group({
      Skills: new FormArray([])
    });
    this.dynamicFormWorks = this.formBuilder.group({
      workHistory: new FormArray([])
    });
    this.dynamicFormEducations = this.formBuilder.group({
      Education: new FormArray([])
    });
    

    this.route.params.subscribe(params => {
      
      //console.log(params['id']);
 
      let id:number = 0;      
      if(params.hasOwnProperty('id')){
        id = +params.id;
        this.userId = params.id;
        
      }

      if (id>0) {
        this.bs
        .getBadgesByUser(id)
        .subscribe((data: any) => {
          //this.jobs = data;
          //console.log(dataFull);
          //console.log(data);
          this.smartBadgesByUser = data;

        });
        
      }

      let listOfUsers = [];
      /*
      let listOfUsers =  
      [
        {name: 'Dilbert', surname: 'Adams', email: 'dilbert.adams@qualichain-project.eu', userName: 'dilbert.adams', id: 11 , avatar_path: 'assets/img/dilbert.jpg', university:'National University of Athens', role:'Student'},
        {name: 'Pointy-Haired Boss', surname: 'Adams', email: 'phb@qualichain-project.eu', userName: 'phb'         , id: 22 , avatar_path: 'assets/img/pointy-haired_boss.jpg', university: 'University of Vic', role:'Teacher'},
        {name: 'Dogbert', surname: 'Adams', email: 'dogbert.adams@qualichain-project.eu', userName: 'dogbert.adams', id: 33 , avatar_path: 'assets/img/dogbert.png', university:'University of Barcelona', role:'Student'},
        {name: 'Ratbert', surname: 'Adams', email: 'ratbert.adams@qualichain-project.eu', userName: 'ratbert.adams', id: 44 , avatar_path: '', university:'UPC', role:'Student'},
        {name: 'Recruiter', surname: 'demo', email: 'recruiter.demo@qualichain-project.eu', userName: 'recruiter.demo', id: 55 , avatar_path: 'assets/img/recruiter.png', university:'', role:'Recruiter'}
      ];
      */
      /*
      let listOfCoursesByUser = [
        {id: 1, title: "An Introduction to Interactive Programming in Python (Part 1)", description: "This two-part course is designed to help students with very little or no computing background learn the basics of building simple interactive applications. Our language of choice, Python, is an easy-to learn, high-level computer language that is used in many of the computational courses offered on Coursera. To make learning Python easy, we have developed a new browser-based programming environment that makes developing interactive applications in Python simple. These applications will involve windows whose contents are graphical and respond to buttons, the keyboard and the mouse.", related_skills: ['Linux', 'Python 2', 'P3'], course_badges: ['b1', 'b2', 'b3']},
        {id: 2, title: "Introduction to Computer Science and Programming Using Python", description: "This course is the first of a two-course sequence: Introduction to Computer Science and Programming Using Python, and Introduction to Computational Thinking and Data Science. Together, they are designed to help people with no prior exposure to computer science or programming learn to think computationally and write programs to tackle useful problems. Some of the people taking the two courses will use them as a stepping stone to more advanced computer science courses, but for many it will be their first and last computer science courses. This run features lecture videos, lecture exercises, and problem sets using Python 3.5. Even if you previously took the course with Python 2.7, you will be able to easily transition to Python 3.5 in future courses, or enroll now to refresh your learning.", related_skills: ['Linux', 'Python 3'], course_badges: ['b1', 'b2', 'b3', 'b4', 'b5']},
        {id: 3, title: "Ruby on Rails: An Introduction", description: "Did you ever want to build a web application? Perhaps you even started down that path in a language like Java or C#, when you realized that there was so much “climbing the mountain” that you had to do? Maybe you have heard about web services being all the rage, but thought they were too complicated to integrate into your web application. Or maybe you wondered how deploying web applications to the cloud works, but there was too much to set up just to get going.", related_skills: ['Linux', 'Windows'], course_badges: ['b2', 'b4', 'b6']},
        {id: 4, title: "Introduction to HTML5", description: "Thanks to a growing number of software programs, it seems as if anyone can make a webpage. But what if you actually want to understand how the page was created? There are great textbooks and online resources for learning web design, but most of those resources require some background knowledge. This course is designed to help the novice who wants to gain confidence and knowledge. We will explore the theory (what actually happens when you click on a link on a webpage?), the practical (what do I need to know to make my own page?), and the overlooked (I have a page, what do I do now?). Throughout the course there will be a strong emphasis on adhering to syntactic standards for validation and semantic standards to promote wide accessibility for users with disabilities. The textbook we use is available online, “The Missing Link: An Introduction to Web Development and Programming” by Michael Mendez from www.opensuny.org.", related_skills: ['CSS','HTML'], course_badges: ['b7', 'b8', 'b9']},
        {id: 5, title: "Introduction to Linux", description: "Develop a good working knowledge of Linux using both the graphical interface and command line, covering the major Linux distribution families.", related_skills: ['Linux'], course_badges: ['b3', 'b5', 'b7'] },
        {id: 6, title: "How to Use Git and GitHub", description: "Effective use of version control is an important and useful skill for any developer working on long-lived (or even medium-lived) projects, especially if more than one developer is involved. This course, built with input from GitHub, will introduce the basics of using version control by focusing on a particular version control system called Git and a collaboration platform called GitHub.", related_skills: ['Linux','SVN'], course_badges: ['b4', 'b5', 'b6']}
      ]
      */

      this.years = [1,2,3,4,5];
      this.currentJustify = 'fill';
      //this.listOfCoursesByUser = listOfCoursesByUser;

      this.cs
      .getCourses()
      .subscribe((data: Course[]) => {
        console.log(data);
        data.forEach((element, index) => {         
          if (index<5) {
            this.listOfCoursesByUser.push(element);
          }
          
        });
    });

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



      //const id = +params.id;
      if (this.userId) {
        //this.userId=String(id);

        if ((this.userId.toString()==this.currentUser.id.toString()) || (this.currentUser.role.toLowerCase()=='administrator')) {
          this.canEditCV = true;
          this.canViewCV = true;
        }
        else if (this.currentUser.role.toLowerCase()=='recruiter') {
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
           this.getUserCV(this.userId);

            //Start OU connexion 
            this.connectToOU();
            //End OU connexion 

          },
          error => {
            //console.log("user not found in db");
            /*
            listOfUsers.forEach(element => {
              //console.log(element.id+"--"+params['id']);
              
              if ((element.hasOwnProperty('id')) && (params.hasOwnProperty('id'))){
                if (element.id==params['id']) {
                  this.userdata = element;
                }
              }
              
            });
            
            //this.userdata = listOfUsers[params['id']-1];
            if (this.userdata.avatar_path=='') {
              this.userdata.avatar_path = 'assets/img/no_avatar.jpg';              
            }
            */
            this.router.navigate(["/not_found"]);
            
          }
        );
/*
        this.us
        .getUser(id)
        .subscribe((data: User[]) => {
          console.log(data);
            this.userdata = data;
  
        });
*/

      }

    });
    /*
    let userdata = JSON.parse(localStorage.getItem('userdata'));
    if (userdata) {
      this.userdata = userdata;
      this.years = [1,2,3,4,5];
      this.currentJustify = 'fill';
      
    }
    */

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

getUserCV(id) {
  this.cvs
  .getCV(id)
  .subscribe((data: any) => {
    //console.log(id);  
    //console.log(data);
    //if (data.length>0) {
      //let posCV = data.length-1;
      this.label = data.label;
      this.description = data.description;
      this.targetSector = data.targetSector;
      //this.expectedSalary = data.application.expectedSalary;
      //this.JobDescription = data.description;
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
    //}      
  });
}
  ngAfterViewChecked () {
    this.DrawChart();
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
  console.log(this.userdata.avatar_path);
  if (!this.userdata.avatar_path) {
    this.userdata.avatar_path = 'assets/img/no_avatar.jpg';
  }
  console.log(this.userdata.avatar_path);
  
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

  PersonURI: string;
  title: string;
  label: string;
  proficiencyLevel: string;
  comment: string;
  description: string;
  targetSector: string;
  //expectedSalary: string;
  //JobDescription: string;
  onSubmit() {
    //console.log("onSubmit");
    //this.submitted = true;

    // stop here if form is invalid
    /*
    if (this.dynamicForm.invalid) {
        return;
    }

    if (this.dynamicFormWorks.invalid) {
      return;
    }

    if (this.dynamicFormEducations.invalid) {
      return;
    }
    */
    //'JobDescription': this.JobDescription,

    var dataToSend = {
      'personURI': this.userId,
      'label':this.label,
      'targetSector': this.targetSector,
      //'expectedSalary': this.expectedSalary,
      'description': this.description,
      'skills': this.dynamicForm.value.Skills,
      'workHistory': this.dynamicFormWorks.value.workHistory,
      'education': this.dynamicFormEducations.value.Education
    };

    //console.log(JSON.stringify(dataToSend, null, 4));

    this.cvs.postCV(this.userId, dataToSend).subscribe(
      res => {
        console.log(res);
        console.log("CV sended correctly");
        alert('Success!!');
      },
      error => {
        //console.log("error sending CV data");
        //alert('Error sending data!!!');
      }
    );


    //alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.dynamicForm.value, null, 4) + JSON.stringify(this.dynamicFormWorks.value, null, 4) + JSON.stringify(this.dynamicFormEducations.value, null, 4));
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