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

      this.userdata = listOfUsers[params['id']-1];
      this.years = [1,2,3,4,5];
      this.currentJustify = 'fill';

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
