import { Component, OnInit } from '@angular/core';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-courses-edit',
  templateUrl: './courses-edit.component.html',
  styleUrls: ['./courses-edit.component.css']
})
export class CoursesEditComponent implements OnInit {

  courseForm: FormGroup;
  course: any = {};
  listOfCourses = [
    {id: 0, title: "", description: "", related_skills: [], course_badges: []},
    {id: 1, title: "An Introduction to Interactive Programming in Python (Part 1)", description: "This two-part course is designed to help students with very little or no computing background learn the basics of building simple interactive applications. Our language of choice, Python, is an easy-to learn, high-level computer language that is used in many of the computational courses offered on Coursera. To make learning Python easy, we have developed a new browser-based programming environment that makes developing interactive applications in Python simple. These applications will involve windows whose contents are graphical and respond to buttons, the keyboard and the mouse.", related_skills: ['Linux', 'Python 2', 'P3'], course_badges: ['b1', 'b2', 'b3']},
    {id: 2, title: "Introduction to Computer Science and Programming Using Python", description: "This course is the first of a two-course sequence: Introduction to Computer Science and Programming Using Python, and Introduction to Computational Thinking and Data Science. Together, they are designed to help people with no prior exposure to computer science or programming learn to think computationally and write programs to tackle useful problems. Some of the people taking the two courses will use them as a stepping stone to more advanced computer science courses, but for many it will be their first and last computer science courses. This run features lecture videos, lecture exercises, and problem sets using Python 3.5. Even if you previously took the course with Python 2.7, you will be able to easily transition to Python 3.5 in future courses, or enroll now to refresh your learning.", related_skills: ['Linux', 'Python 3'], course_badges: ['b1', 'b2', 'b3', 'b4', 'b5']},
    {id: 3, title: "Ruby on Rails: An Introduction", description: "Did you ever want to build a web application? Perhaps you even started down that path in a language like Java or C#, when you realized that there was so much “climbing the mountain” that you had to do? Maybe you have heard about web services being all the rage, but thought they were too complicated to integrate into your web application. Or maybe you wondered how deploying web applications to the cloud works, but there was too much to set up just to get going.", related_skills: ['Linux', 'Windows'], course_badges: ['b2', 'b4', 'b6']},
    {id: 4, title: "Introduction to HTML5", description: "Thanks to a growing number of software programs, it seems as if anyone can make a webpage. But what if you actually want to understand how the page was created? There are great textbooks and online resources for learning web design, but most of those resources require some background knowledge. This course is designed to help the novice who wants to gain confidence and knowledge. We will explore the theory (what actually happens when you click on a link on a webpage?), the practical (what do I need to know to make my own page?), and the overlooked (I have a page, what do I do now?). Throughout the course there will be a strong emphasis on adhering to syntactic standards for validation and semantic standards to promote wide accessibility for users with disabilities. The textbook we use is available online, “The Missing Link: An Introduction to Web Development and Programming” by Michael Mendez from www.opensuny.org.", related_skills: ['CSS','HTML'], course_badges: ['b7', 'b8', 'b9']},
    {id: 5, title: "Introduction to Linux", description: "Develop a good working knowledge of Linux using both the graphical interface and command line, covering the major Linux distribution families.", related_skills: ['Linux'], course_badges: ['b3', 'b5', 'b7'] },
    {id: 6, title: "How to Use Git and GitHub", description: "Effective use of version control is an important and useful skill for any developer working on long-lived (or even medium-lived) projects, especially if more than one developer is involved. This course, built with input from GitHub, will introduce the basics of using version control by focusing on a particular version control system called Git and a collaboration platform called GitHub.", related_skills: ['Linux','SVN'], course_badges: ['b4', 'b5', 'b6']}
  ]

  constructor(private route: ActivatedRoute, private router: Router, private fb: FormBuilder) {
    this.createForm();
  }

  createForm() {
    this.courseForm = this.fb.group({
      title: ['', Validators.required ],
      description: ['', Validators.required ]
    });
  }

  ngOnInit() {
    this.route.params.subscribe(params => {

      this.course = this.listOfCourses[(params['id'])];
      //this.course = {'id': params['id'], 'courseTitle':"tesjob name item "+params['id'], 'courseDescription':"Job Description item "+params['id'], 'JobPrice':params['id']};
      /*
      this.js.editJob(params['id']).subscribe(res => {
        this.job = res;
    });
    */
  });
  }

}
