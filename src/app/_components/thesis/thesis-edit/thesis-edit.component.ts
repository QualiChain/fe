import { Component, OnInit } from '@angular/core';
import { ThesisService } from '../../../_services/thesis.service';
import { ActivatedRoute, Router } from '@angular/router';
import User from '../../../_models/user';
import { UsersService } from '../../../_services/users.service';
import {FormControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
//import { ValueConverter } from '@angular/compiler/src/render3/view/template';
import { AuthService } from '../../../_services';

class Thesis {
  id: number;
  title: string;
  description: string;
  professor_id: number;
  student_id: number;
  status: string;
}

@Component({
  selector: 'app-thesis-edit',
  templateUrl: './thesis-edit.component.html',
  styleUrls: ['./thesis-edit.component.css']
})
export class ThesisEditComponent implements OnInit {

  mode: string = '';
  thesis: Thesis = {id: null, title: null, description: null, professor_id: null, student_id: null, status: null};
  usersList: User[] = [];
  dataFiltered: User[] = [];
  currentUser: User;
  toppings = new FormControl();

  constructor(
    private authservice: AuthService,
    private us: UsersService,
    private ts: ThesisService,
    private route: ActivatedRoute,
    private router: Router,) { 

      this.authservice.currentUser.subscribe(x => this.currentUser = x);

    }

  ngOnInit(): void {

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

        this.ts
        .getThesisById(id).subscribe(
          (dataThesis: Thesis) => {
            //console.log(dataThesis);
            this.thesis = dataThesis;

            this.us
            .getUsers()
            .subscribe((data: User[]) => {
              //console.log(data)
              //this.usersList = data;              
              data.forEach(element => {
                if (element.role=="student") {
                  this.dataFiltered.push(element);
                }
              });

              this.dataFiltered.sort((a,b) => a.surname.toUpperCase().localeCompare(b.surname.toUpperCase()));
              this.usersList = this.dataFiltered;

            });
          },
          error => {
            this.router.navigate(["/not_found"]);            
          }
        );

      }
    });

  }

  redirectToURL(url: string) {
    this.router.navigate([url]);
  }  

  processForm() {
    
    if (this.mode=="Create") {
      
      let obj = {
        "title": this.thesis.title,
        "description": this.thesis.description,
        "professor_id": this.currentUser.id
        };     

      this.ts.addThesis(obj).subscribe(
        res => {
          this.router.navigate(["/thesis"]);
        },
        error => {
          alert("Error creating thesis!!");
        }
      );


    }
    else if (this.mode=="Edit") {

      let objUpdate = {
        "title": this.thesis.title,
        "description": this.thesis.description,
        "status": this.thesis.status,
        "student_id": this.thesis.student_id
        };  

        this.ts.updateThesis(this.thesis.id.toString(), objUpdate).subscribe(
          res => {
            this.router.navigate(["/thesis"]);
          },
          error => {
            alert("Error updating thesis!!");
          }
        );        

    }
  }

}
