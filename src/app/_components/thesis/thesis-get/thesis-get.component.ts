import { Component, OnInit } from '@angular/core';
import { ThesisService } from '../../../_services/thesis.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../_services';
import User from '../../../_models/user';

@Component({
  selector: 'app-thesis-get',
  templateUrl: './thesis-get.component.html',
  styleUrls: ['./thesis-get.component.css']
})
export class ThesisGetComponent implements OnInit {

  currentUser: User;

  constructor(
    private ts: ThesisService,
    private route: ActivatedRoute,
    private router: Router,
    private authservice: AuthService,) { 

      this.authservice.currentUser.subscribe(x => this.currentUser = x);

    }

  thesisMainData: any = {};
  
  ngOnInit(): void {

    if(!this.currentUser) {
      this.currentUser={id:0,role:'', userName:'', name:'', surname:'', email:''};
  }


    this.route.params.subscribe(params => {

      let id:number = 0;      
      if(params.hasOwnProperty('id')){
        id = +params.id;
      }
      
      if (id>0) {

        this.ts
        .getThesisById(id).subscribe(
          dataThesis => {
            //console.log(dataThesis);
            this.thesisMainData = dataThesis;
          },
          error => {
            this.router.navigate(["/not_found"]);            
          }
        );   

      }
      else {
        this.router.navigate(["/not_found"]);
      }

    });
  }

}
