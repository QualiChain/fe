import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-career-advisor',
  templateUrl: './career-advisor.component.html',
  styleUrls: ['./career-advisor.component.css']
})



export class CareerAdvisorComponent implements OnInit {

  userid: number;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {

    this.route.params.subscribe(params => {
      
      //console.log(params['id']);
      this.userid=params['id'];
    });
  }

}
