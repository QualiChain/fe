import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { Component, OnInit, ElementRef, ViewChild} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CoursesService } from '../../../_services/courses.service';
import { SkillsService } from '../../../_services/skills.service';
import Course from '../../../_models/course';

import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';

import {formatDate} from '@angular/common';

import {FormControl} from '@angular/forms'
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { QCStorageService } from '../../../_services/QC_storage.services';

export interface Skill {
  name: string;
  id: number;
}

export interface Event {
  name: string;
}

@Component({
  selector: 'app-courses-edit',
  templateUrl: './courses-edit.component.html',
  styleUrls: ['./courses-edit.component.css']
})
export class CoursesEditComponent implements OnInit {

  courseForm: FormGroup;
  //course: any = {id: 0, name: "", description: "", endDate:"", events: [], semester:"", skills:[], startDate:"", updatedDate:""};
  course: Course;

  /*
  listOfCourses = [
    {id: 0, title: "", description: "", related_skills: [], course_badges: []},
    {id: 1, title: "An Introduction to Interactive Programming in Python (Part 1)", description: "This two-part course is designed to help students with very little or no computing background learn the basics of building simple interactive applications. Our language of choice, Python, is an easy-to learn, high-level computer language that is used in many of the computational courses offered on Coursera. To make learning Python easy, we have developed a new browser-based programming environment that makes developing interactive applications in Python simple. These applications will involve windows whose contents are graphical and respond to buttons, the keyboard and the mouse.", related_skills: ['Linux', 'Python 2', 'P3'], course_badges: ['b1', 'b2', 'b3']},
    {id: 2, title: "Introduction to Computer Science and Programming Using Python", description: "This course is the first of a two-course sequence: Introduction to Computer Science and Programming Using Python, and Introduction to Computational Thinking and Data Science. Together, they are designed to help people with no prior exposure to computer science or programming learn to think computationally and write programs to tackle useful problems. Some of the people taking the two courses will use them as a stepping stone to more advanced computer science courses, but for many it will be their first and last computer science courses. This run features lecture videos, lecture exercises, and problem sets using Python 3.5. Even if you previously took the course with Python 2.7, you will be able to easily transition to Python 3.5 in future courses, or enroll now to refresh your learning.", related_skills: ['Linux', 'Python 3'], course_badges: ['b1', 'b2', 'b3', 'b4', 'b5']},
    {id: 3, title: "Ruby on Rails: An Introduction", description: "Did you ever want to build a web application? Perhaps you even started down that path in a language like Java or C#, when you realized that there was so much “climbing the mountain” that you had to do? Maybe you have heard about web services being all the rage, but thought they were too complicated to integrate into your web application. Or maybe you wondered how deploying web applications to the cloud works, but there was too much to set up just to get going.", related_skills: ['Linux', 'Windows'], course_badges: ['b2', 'b4', 'b6']},
    {id: 4, title: "Introduction to HTML5", description: "Thanks to a growing number of software programs, it seems as if anyone can make a webpage. But what if you actually want to understand how the page was created? There are great textbooks and online resources for learning web design, but most of those resources require some background knowledge. This course is designed to help the novice who wants to gain confidence and knowledge. We will explore the theory (what actually happens when you click on a link on a webpage?), the practical (what do I need to know to make my own page?), and the overlooked (I have a page, what do I do now?). Throughout the course there will be a strong emphasis on adhering to syntactic standards for validation and semantic standards to promote wide accessibility for users with disabilities. The textbook we use is available online, “The Missing Link: An Introduction to Web Development and Programming” by Michael Mendez from www.opensuny.org.", related_skills: ['CSS','HTML'], course_badges: ['b7', 'b8', 'b9']},
    {id: 5, title: "Introduction to Linux", description: "Develop a good working knowledge of Linux using both the graphical interface and command line, covering the major Linux distribution families.", related_skills: ['Linux'], course_badges: ['b3', 'b5', 'b7'] },
    {id: 6, title: "How to Use Git and GitHub", description: "Effective use of version control is an important and useful skill for any developer working on long-lived (or even medium-lived) projects, especially if more than one developer is involved. This course, built with input from GitHub, will introduce the basics of using version control by focusing on a particular version control system called Git and a collaboration platform called GitHub.", related_skills: ['Linux','SVN'], course_badges: ['b4', 'b5', 'b6']}
  ]
  */
  mode: string = '';
  courseName: string = '';
  courseDescription: string = '';
  courseSemester: string = '';
  startDate: string = '';
  endDate: string = '';
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  skills: Skill[] = [];
  visible = true;
  addOnBlur = false;
  selectableSkill = true;
  selectableEvent = true;
  removableSkill = true;
  removableEvent = true;
  addOnBlurSkill = true;
  addOnBlurEvent = true;
  courseId: number = null;
  events: Event[] = [];
  //userdata = JSON.parse(localStorage.getItem('userdata'));
  userdata = JSON.parse(this.qcStorageService.QCDecryptData(localStorage.getItem('userdataQC')));
  
  skillCtrl = new FormControl();
  //allSkills: any = [];
  allSkills: Skill[] = [];
  filteredSkills: Observable<string[]>;
  
  @ViewChild('skillInput', {static: false}) skillInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto', {static: false}) matAutocomplete: MatAutocomplete;

  constructor(
    private qcStorageService: QCStorageService,
    private ss: SkillsService,
    private route: ActivatedRoute, private router: Router, private fb: FormBuilder, private cs: CoursesService) {
    //this.createForm();

    this.filteredSkills = this.skillCtrl.valueChanges.pipe(
      startWith(null),
      map((skill: string | null) => skill ? this._filter(skill) : this.allSkills.slice())
      );

    this.courseForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(10)]]
    });
  }
  
/********************************** */

add(event: MatChipInputEvent): void {
  console.log(event);
  /*
  const input = event.input;
  const value = event.value;

  // Add our fruit
  if ((value || '').trim()) {
    this.skills.push({'name':value.trim()});
  }

  // Reset the input value
  if (input) {
    console.log(input);
    input.value = '';
  }

  this.skillCtrl.setValue(null);
  */
}

remove(skill: string): void {
  console.log(skill);
  /*
  const index = this.skills.indexOf({'name':skill});

  if (index >= 0) {
    this.skills.splice(index, 1);
  }
  */
}

selected(event: MatAutocompleteSelectedEvent): void {
  this.skills.push(event.option.value);
  this.skillInput.nativeElement.value = '';
  this.skillCtrl.setValue(null);  
}

  /*
  private _filter_as_string(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allSkills.filter(skill => skill.toLowerCase().indexOf(filterValue) === 0);
  }
*/
  private _filter(value: any): any[] {   
    if ( value.hasOwnProperty('name') ) {
      return this.allSkills;
    }
    else {
      //filter by text
      let filteredSkills: Skill[] = this.allSkills.filter(skill => skill.name.toLowerCase().includes(value.toLowerCase()));

      //filter skills we have in the selectd list of skills
      let activeIds = [];
      this.skills.forEach(element => {
        activeIds.push(element.id);
      });

      let arr = filteredSkills;

      if (activeIds.length>0) {
        arr = arr.filter(function(item){
          return activeIds.indexOf(item.id) === -1;
        });
      }
      
      
      return arr;
    }

  }
/***********************************/
/*
  createForm() {
    this.courseForm = this.fb.group({
      title: ['', Validators.required ],
      description: ['', Validators.required ]
    });
  }
*/
  ngOnInit() {
        
    if (!this.userdata) {
      this.userdata = {id:0};
    }
 

    this.allSkills = [];
    this.ss.getSkills().subscribe(
      resSkills => {
        //console.log("Request OK");
        //console.log(resSkills); 
        resSkills.forEach(element => {
          //console.log(element.name);
          let data: Skill = {name:element.name, id:element.id};
          this.allSkills.push(data)
          /*
          if (this.allSkills.indexOf(element.name) == -1) {
            this.allSkills.push(element.name);
          }*/
        });       
        
      },
      error => {
        console.log("Error getting data");
        
      }
    );


    //console.log(this.userdata.id);
    this.route.params.subscribe(params => {

      this.mode = "Create";
      let id : number;

      if(params.hasOwnProperty('id')){
        id = +params.id;
      }
      else {
        id = 0;
      }


      if (id && id > 0) {
        this.mode = "Edit";
        this.courseId = id;
        //this.course = this.listOfCourses[(params['id'])];

        this.cs.getCourse(+id).subscribe(
          res => {
            //console.log("Request OK");
            //console.log(res);
            this.course = res;
            this.courseName = res.name;
            this.courseDescription = res.description;
            this.courseSemester = res.semester;
            this.startDate = res.startDate;
            this.endDate = res.endDate;
            this.skills = res.skills;
            this.events = res.events;
            
            if (!res.hasOwnProperty("skills")) {
              this.skills = [];
              //getSkillsByCourseId
              
              this.cs
              .getSkillsByCourseId(id).subscribe(
              dataCourseSkills => {
                
                dataCourseSkills.forEach(element => {
                  this.skills.push({id:element.skill.id,name: element.skill.name});
                });                
                
              },
              error => {
                console.log("error recovering skills by course id")
              }
              );             
            }

          },
          error => {
            console.log("Error getting data");
            this.router.navigate(["/not_found"]);
            
          }
        );

      }
      else {
        this.mode = "Create";
      }
      
      //this.course = {'id': params['id'], 'courseTitle':"tesjob name item "+params['id'], 'courseDescription':"Job Description item "+params['id'], 'JobPrice':params['id']};
      /*
      this.js.editJob(params['id']).subscribe(res => {
        this.job = res;
    });
    */
  });
  }



  addEvent(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add the new skill
    if ((value || '').trim()) {
      this.events.push({name: value.trim()});
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  removeEvent(event: Event): void {
    const index = this.events.indexOf(event);

    if (index >= 0) {
      this.events.splice(index, 1);
    }
  }


  addSkill(event: MatChipInputEvent): void {
    console.log(event);
    const input = event.input;
    const value = event.value;

    alert("Skill "+value+" is not a valid skill");
    /*
    // Add the new skill
    if ((value || '').trim()) {
      this.skills.push({
        id:0,
        name: value.trim()
      });
    }
    */
    // Reset the input value
    if (input) {
      input.value = '';
    }
    
  }

  removeSkill(skill: Skill, indx: number): void {
    //const index = this.skills.indexOf(skill);
    const index = indx;

    if (index >= 0) {
      this.skills.splice(index, 1);
    }
  }

  redirectToURL(url: string) {
    this.router.navigate([url]);
  }
  
  processForm() {
    
    
    let finalSkillList = [];

    this.skills.forEach(element => {
      finalSkillList.push({id: element.id, name: element.name});
    });
    //console.log(this);
    
    let newDateToday = formatDate(new Date(), 'yyyy-MM-dd', 'en')
          
        /*
        const obj = {
          "name": this.courseName,
          "description": this.courseDescription,
          "semester": this.courseSemester,
          "endDate": this.endDate,
          "startDate": this.startDate,
          "updatedDate": dateToday,
          "skills": this.skills,
          "events": this.events
        };
        */
       const obj = {
        "name": this.courseName,
        "description": this.courseDescription,
        "semester": this.courseSemester,
        "skills": finalSkillList,
        "events": this.events,
        "updatedDate": newDateToday
        };       
        //console.log(obj);
        
        if (this.mode=='Create') {
          

          this.cs.addCourse(obj).subscribe(
            res => {
              //console.log("User created");
              //console.log(res);
              var splitted = res.split("=", 2); 
              //console.log(splitted[1]);
              //after create the user 
              //window.location.href="/profiles";
              //this.router.navigate(["/profiles/"+this.userdata.id]);
              this.router.navigate(["/courses"]);
            },
            error => {
              alert("Error creating course!!");
            }
          );
    
        }
        else {
          //console.log(this.courseId);
          this.cs.updateCourse(+this.courseId, obj).subscribe(
            res => {
              console.log("course updated");
              //console.log(res);
              //after update the user 
              //window.location.href="/profiles/"+this.profileId;
              //this.router.navigate(["/profiles/"+this.userdata.id]);
              this.router.navigate(["/courses"]);
            },
            error => {
              alert("Error updating user!!");
            }
          );
          
        }
        

    
      }
      
    
    
    
    



}
