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
import { CVService } from '../_services/cv.service';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import {TranslateService} from '@ngx-translate/core';
import { AuthService } from '../_services';
import { User } from '../_models/user';

@Component({
  selector: 'app-profiles-view',
  templateUrl: './profiles-view.component.html',
  styleUrls: ['./profiles-view.component.css']
})
export class ProfilesViewComponent implements OnInit {

  currentUser: User;
  dynamicForm: FormGroup;
  dynamicFormWorks: FormGroup;
  dynamicFormEducations: FormGroup;

  submitted = false;

  //userdata: {};
  /*
  userdata: {name: '', surname: '', email: '', username: '', id: 0 , avatar_path: '', university:'', role:''};
  */
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

  years: {};
  currentJustify: string;
  listOfCoursesByUser: {};
  //selectedCourse: {};
  selectedCourse: {
    id: number, 
    title: string, 
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

  @ViewChild('skillInput', {static: false}) skillInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto', {static: false}) matAutocomplete: MatAutocomplete;

  constructor(private authservice: AuthService, private route: ActivatedRoute, private formBuilder: FormBuilder, private cvs: CVService, private translate: TranslateService) { 

    this.authservice.currentUser.subscribe(x => this.currentUser = x);

    this.filteredSkills = this.skillCtrl.valueChanges.pipe(
      startWith(null),
      map((skill: string | null) => skill ? this._filter(skill) : this.allSkills.slice()));

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
    

    this.route.params.subscribe(params => {
      const id = +params.id;
      if (id && id > 0) {
        this.userId=String(id);
      }
    });

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
      let listOfUsers = 
      [
        {name: 'Dilbert', surname: 'Adams', email: 'dilbert.adams@qualichain-project.eu', username: 'dilbert.adams', id: 1 , avatar_path: 'assets/img/dilbert.jpg', university:'National University of Athens', role:'Student'},
        {name: 'Pointy-Haired Boss', surname: 'Adams', email: 'phb@qualichain-project.eu', username: 'phb'         , id: 2 , avatar_path: 'assets/img/pointy-haired_boss.jpg', university: 'University of Vic', role:'Teacher'},
        {name: 'Dogbert', surname: 'Adams', email: 'dogbert.adams@qualichain-project.eu', username: 'dogbert.adams', id: 3 , avatar_path: 'assets/img/dogbert.png', university:'University of Barcelona', role:'Student'},
        {name: 'Ratbert', surname: 'Adams', email: 'ratbert.adams@qualichain-project.eu', username: 'ratbert.adams', id: 4 , avatar_path: '', university:'UPC', role:'Student'},
        {name: 'Recruiter', surname: 'demo', email: 'recruiter.demo@qualichain-project.eu', username: 'recruiter.demo', id: 5 , avatar_path: 'assets/img/recruiter.png', university:'', role:'Recruiter'}
      ];

      let listOfCoursesByUser = [
        {id: 1, title: "An Introduction to Interactive Programming in Python (Part 1)", description: "This two-part course is designed to help students with very little or no computing background learn the basics of building simple interactive applications. Our language of choice, Python, is an easy-to learn, high-level computer language that is used in many of the computational courses offered on Coursera. To make learning Python easy, we have developed a new browser-based programming environment that makes developing interactive applications in Python simple. These applications will involve windows whose contents are graphical and respond to buttons, the keyboard and the mouse.", related_skills: ['Linux', 'Python 2', 'P3'], course_badges: ['b1', 'b2', 'b3']},
        {id: 2, title: "Introduction to Computer Science and Programming Using Python", description: "This course is the first of a two-course sequence: Introduction to Computer Science and Programming Using Python, and Introduction to Computational Thinking and Data Science. Together, they are designed to help people with no prior exposure to computer science or programming learn to think computationally and write programs to tackle useful problems. Some of the people taking the two courses will use them as a stepping stone to more advanced computer science courses, but for many it will be their first and last computer science courses. This run features lecture videos, lecture exercises, and problem sets using Python 3.5. Even if you previously took the course with Python 2.7, you will be able to easily transition to Python 3.5 in future courses, or enroll now to refresh your learning.", related_skills: ['Linux', 'Python 3'], course_badges: ['b1', 'b2', 'b3', 'b4', 'b5']},
        {id: 3, title: "Ruby on Rails: An Introduction", description: "Did you ever want to build a web application? Perhaps you even started down that path in a language like Java or C#, when you realized that there was so much “climbing the mountain” that you had to do? Maybe you have heard about web services being all the rage, but thought they were too complicated to integrate into your web application. Or maybe you wondered how deploying web applications to the cloud works, but there was too much to set up just to get going.", related_skills: ['Linux', 'Windows'], course_badges: ['b2', 'b4', 'b6']},
        {id: 4, title: "Introduction to HTML5", description: "Thanks to a growing number of software programs, it seems as if anyone can make a webpage. But what if you actually want to understand how the page was created? There are great textbooks and online resources for learning web design, but most of those resources require some background knowledge. This course is designed to help the novice who wants to gain confidence and knowledge. We will explore the theory (what actually happens when you click on a link on a webpage?), the practical (what do I need to know to make my own page?), and the overlooked (I have a page, what do I do now?). Throughout the course there will be a strong emphasis on adhering to syntactic standards for validation and semantic standards to promote wide accessibility for users with disabilities. The textbook we use is available online, “The Missing Link: An Introduction to Web Development and Programming” by Michael Mendez from www.opensuny.org.", related_skills: ['CSS','HTML'], course_badges: ['b7', 'b8', 'b9']},
        {id: 5, title: "Introduction to Linux", description: "Develop a good working knowledge of Linux using both the graphical interface and command line, covering the major Linux distribution families.", related_skills: ['Linux'], course_badges: ['b3', 'b5', 'b7'] },
        {id: 6, title: "How to Use Git and GitHub", description: "Effective use of version control is an important and useful skill for any developer working on long-lived (or even medium-lived) projects, especially if more than one developer is involved. This course, built with input from GitHub, will introduce the basics of using version control by focusing on a particular version control system called Git and a collaboration platform called GitHub.", related_skills: ['Linux','SVN'], course_badges: ['b4', 'b5', 'b6']}
      ]

      this.userdata = listOfUsers[params['id']-1];
      if (this.userdata.avatar_path=='') {
        this.userdata.avatar_path = 'assets/img/no_avatar.jpg';
        
      }

            

      this.years = [1,2,3,4,5];
      this.currentJustify = 'fill';
      this.listOfCoursesByUser = listOfCoursesByUser;
      this.selectedCourse = {
        id: 0, 
        title: '', 
        description: '', 
        related_skills: [], 
        course_badges: []
      };

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
            text: this.translate.instant('PROFILES.USERNAME')+' : ' + this.userdata.username, color: '#0e3664'
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
        SkillLabel: ['', [Validators.required]],
        proficiencyLevel: ['', Validators.required],
        SkillComment: ['', [Validators.required]],      
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
  description: string;
  targetSector: string;
  expectedSalary: string;
  JobDescription: string;
  onSubmit() {
    //console.log("onSubmit");
    this.submitted = true;

    // stop here if form is invalid
    if (this.dynamicForm.invalid) {
        return;
    }

    if (this.dynamicFormWorks.invalid) {
      return;
    }

    if (this.dynamicFormEducations.invalid) {
      return;
    }
    
    var dataToSend = {
      'PersonURI': this.userId,
      'title':this.title,
      'description': this.description,
      'targetSector': this.targetSector,
      'expectedSalary': this.expectedSalary,
      'JobDescription': this.JobDescription,
      'Skills': this.dynamicForm.value.Skills,
      'workHistory': this.dynamicFormWorks.value.workHistory,
      'Education': this.dynamicFormEducations.value.Education,
    };
    
    //console.log(JSON.stringify(dataToSend, null, 4));

    this.cvs.sendCV(dataToSend).subscribe(
      res => {
        console.log("CV sended correctly");
        alert('Success!!');
      },
      error => {
        console.log("error sending CV data");
        alert('Error sending data!!!');
      }
    );


    //alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.dynamicForm.value, null, 4) + JSON.stringify(this.dynamicFormWorks.value, null, 4) + JSON.stringify(this.dynamicFormEducations.value, null, 4));
}


}
