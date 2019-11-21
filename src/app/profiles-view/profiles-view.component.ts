import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-profiles-view',
  templateUrl: './profiles-view.component.html',
  styleUrls: ['./profiles-view.component.css']
})
export class ProfilesViewComponent implements OnInit {

  userdata: {};
  years: {};
  currentJustify: string;
  listOfCoursesByUser: {};
  selectedCourse: {};


  constructor(private route: ActivatedRoute) { }

  ngOnInit() {

    this.route.params.subscribe(params => {
      
      //console.log(params['id']);
      let listOfUsers = 
      [
        {name: 'Dilbert', surname: 'Adams', email: 'dilbert.adams@qualichain-project.eu', username: 'dilbert.adams', id: 1 , avatar_path: 'assets/img/dilbert.jpg', university:'National University of Athens', role:'Student'},
        {name: 'Pointy-Haired Boss', surname: 'Adams', email: 'phb@qualichain-project.eu', username: 'phb'         , id: 2 , avatar_path: 'assets/img/pointy-haired_boss.jpg', university: 'University of Vic', role:'Teacher'},
        {name: 'Dogbert', surname: 'Adams', email: 'dogbert.adams@qualichain-project.eu', username: 'dogbert.adams', id: 3 , avatar_path: 'assets/img/dogbert.png', university:'University of Barcelona', role:'Student'},
        {name: 'Ratbert', surname: 'Adams', email: 'ratbert.adams@qualichain-project.eu', username: 'ratbert.adams', id: 4 , avatar_path: '', university:'UPC', role:'Student'}        
      ];

      let listOfCoursesByUser = [
        {id: 1, title: "An Introduction to Interactive Programming in Python (Part 1)", description: "This two-part course is designed to help students with very little or no computing background learn the basics of building simple interactive applications. Our language of choice, Python, is an easy-to learn, high-level computer language that is used in many of the computational courses offered on Coursera. To make learning Python easy, we have developed a new browser-based programming environment that makes developing interactive applications in Python simple. These applications will involve windows whose contents are graphical and respond to buttons, the keyboard and the mouse."},
        {id: 2, title: "Introduction to Computer Science and Programming Using Python", description: "This course is the first of a two-course sequence: Introduction to Computer Science and Programming Using Python, and Introduction to Computational Thinking and Data Science. Together, they are designed to help people with no prior exposure to computer science or programming learn to think computationally and write programs to tackle useful problems. Some of the people taking the two courses will use them as a stepping stone to more advanced computer science courses, but for many it will be their first and last computer science courses. This run features lecture videos, lecture exercises, and problem sets using Python 3.5. Even if you previously took the course with Python 2.7, you will be able to easily transition to Python 3.5 in future courses, or enroll now to refresh your learning."},
        {id: 3, title: "Ruby on Rails: An Introduction", description: "Did you ever want to build a web application? Perhaps you even started down that path in a language like Java or C#, when you realized that there was so much “climbing the mountain” that you had to do? Maybe you have heard about web services being all the rage, but thought they were too complicated to integrate into your web application. Or maybe you wondered how deploying web applications to the cloud works, but there was too much to set up just to get going."},
        {id: 4, title: "Introduction to HTML5", description: "Thanks to a growing number of software programs, it seems as if anyone can make a webpage. But what if you actually want to understand how the page was created? There are great textbooks and online resources for learning web design, but most of those resources require some background knowledge. This course is designed to help the novice who wants to gain confidence and knowledge. We will explore the theory (what actually happens when you click on a link on a webpage?), the practical (what do I need to know to make my own page?), and the overlooked (I have a page, what do I do now?). Throughout the course there will be a strong emphasis on adhering to syntactic standards for validation and semantic standards to promote wide accessibility for users with disabilities. The textbook we use is available online, “The Missing Link: An Introduction to Web Development and Programming” by Michael Mendez from www.opensuny.org."},
        {id: 5, title: "Introduction to Linux", description: "Develop a good working knowledge of Linux using both the graphical interface and command line, covering the major Linux distribution families."},
        {id: 6, title: "How to Use Git and GitHub", description: "Effective use of version control is an important and useful skill for any developer working on long-lived (or even medium-lived) projects, especially if more than one developer is involved. This course, built with input from GitHub, will introduce the basics of using version control by focusing on a particular version control system called Git and a collaboration platform called GitHub."}
      ]

      this.userdata = listOfUsers[params['id']-1];
      this.years = [1,2,3,4,5];
      this.currentJustify = 'fill';
      this.listOfCoursesByUser = listOfCoursesByUser;
      this.selectedCourse = {};

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

}
