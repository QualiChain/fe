import { Component, OnInit } from '@angular/core';
import { ThesisService } from '../../../_services/thesis.service';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-thesis-get',
  templateUrl: './thesis-get.component.html',
  styleUrls: ['./thesis-get.component.css']
})
export class ThesisGetComponent implements OnInit {

  constructor(
    private ts: ThesisService,
    private route: ActivatedRoute,
    private router: Router,) { }

  thesisMainData: any = {};
  
  ngOnInit(): void {

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
