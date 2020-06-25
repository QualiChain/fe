import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../_services';

import User from '../../_models/user';

@Component({
  selector: 'app-pilot-home',
  templateUrl: './pilot-home.component.html',
  styleUrls: ['./pilot-home.component.css']
})
export class PilotHomeComponent implements OnInit {

  currentUser: User;

  constructor(private authservice: AuthService) { 
    this.authservice.currentUser.subscribe(x => this.currentUser = x);
  }

  ngOnInit() {
    //console.log("ngOnInit pilot-home");
    if(!this.currentUser) {
      //if(!this.currentUser.hasOwnProperty('id')){
        this.currentUser={id:0,role:'', userName:'', name:'', surname:'', email:'', pilotId:1};
    }

  }

}

@Component({
  selector: 'app-home-pilot-1',
  templateUrl: './home-pilot-1.html',
  styleUrls: ['./pilot-home.component.css']
})
export class HomePilot1Component implements OnInit {

  constructor() {}

  
  ngOnInit() {

    //console.log("ngOnInit HomePilot1Component");

  }

}

@Component({
  selector: 'app-home-pilot-2',
  templateUrl: './home-pilot-2.html',
  styleUrls: ['./pilot-home.component.css']
})
export class HomePilot2Component implements OnInit {

  constructor() { }

  
  ngOnInit() {

    //console.log("ngOnInit HomePilot2Component");

  }

}

@Component({
  selector: 'app-home-pilot-3',
  templateUrl: './home-pilot-3.html',
  styleUrls: ['./pilot-home.component.css']
})
export class HomePilot3Component implements OnInit {
  
  constructor() { }

  
  ngOnInit() {

    //console.log("ngOnInit HomePilot3Component");

  }

}

@Component({
  selector: 'app-home-pilot-4',
  templateUrl: './home-pilot-4.html',
  styleUrls: ['./pilot-home.component.css']
})
export class HomePilot4Component implements OnInit {
  
  constructor() { }

  
  ngOnInit() {

    //console.log("ngOnInit HomePilot4Component");

  }

}

@Component({
  selector: 'app-home-pilot-5',
  templateUrl: './home-pilot-5.html',
  styleUrls: ['./pilot-home.component.css']
})
export class HomePilot5Component implements OnInit {

  constructor() { }

  
  ngOnInit() {

    //console.log("ngOnInit HomePilot5Component");

  }

}
