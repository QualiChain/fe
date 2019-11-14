import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-carrer-advisor',
  templateUrl: './carrer-advisor.component.html',
  styleUrls: ['./carrer-advisor.component.css']
})



export class CarrerAdvisorComponent implements OnInit {

  userid: number;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {

    this.route.params.subscribe(params => {
      
      //console.log(params['id']);
      this.userid=params['id'];
    });
  }

}
