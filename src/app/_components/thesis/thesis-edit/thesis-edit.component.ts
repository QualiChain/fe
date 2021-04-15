import { Component, OnInit } from '@angular/core';
import { ThesisService } from '../../../_services/thesis.service';
import { ActivatedRoute, Router } from '@angular/router';
import User from '../../../_models/user';
import { UsersService } from '../../../_services/users.service';
import {FormControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
//import { ValueConverter } from '@angular/compiler/src/render3/view/template';
import { AuthService } from '../../../_services';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { TranslateService } from '@ngx-translate/core';
import { AppComponent } from '../../../app.component';

class Thesis {
  id: number;
  title: string;
  description: string;
  professor: any[];
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
  thesis: Thesis = {id: null, title: null, description: null, professor: [], student_id: null, status: null};
  usersList: User[] = [];
  dataFiltered: User[] = [];
  usersThatHasARequestButAreAssignedInOtherThesis: User[] = [];
  currentUser: User;
  toppings = new FormControl();

  htmlContent = '';
  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '15rem',
    minHeight: '5rem',
    placeholder: this.translate.instant('THESIS.DESCRIPTION.PLACEHOLDER'),
    translate: 'no',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
    toolbarHiddenButtons: [
      ['insertImage','insertVideo','insertHorizontalRule']
      ],
    customClasses: [
      {
        name: "quote",
        class: "quote",
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: "titleText",
        class: "titleText",
        tag: "h1",
      },
    ]
  };

  constructor(
    private appcomponent: AppComponent,
    private authservice: AuthService,
    private us: UsersService,
    private ts: ThesisService,
    private route: ActivatedRoute,
    private router: Router,
    private translate: TranslateService) { 

      this.authservice.currentUser.subscribe(x => this.currentUser = x);

    }

    isAdmin = this.appcomponent.isAdmin;

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
            this.htmlContent = this.thesis.description;
            
            if ((dataThesis.professor['id']!=this.currentUser.id) && !this.isAdmin) {
              this.router.navigate(["/access_denied"]); 
            }
            else {
              this.ts
              .getAllThesisRequestsByThesisId(id).subscribe(
                (dataRequestsThesis:any) => {
                  console.log(dataRequestsThesis);
                  dataRequestsThesis.forEach(element => {

                      //console.log(element.student.id);
                      this.ts
                      .getThesisByStudentId(element.student.id)
                      .subscribe((data: any[]) => {
                        let canAddThisUser = true;
                        data.forEach(elementThesis => {
                          //console.log(elementThesis);
                          
                          if ((elementThesis.status=="assigned") && (elementThesis.id!= id)) {
                            canAddThisUser = false;
                          }
                        });
                        
                        if (canAddThisUser) {
                          this.dataFiltered.push(element.student);
                        }
                        else {
                          this.usersThatHasARequestButAreAssignedInOtherThesis.push(element.student);
                        }
                        
                      },
                      error => {
                        console.log("Error thesis by user id");
                      });


                      
                  });
                  this.dataFiltered.sort((a,b) => a.surname.toUpperCase().localeCompare(b.surname.toUpperCase()));
                  this.usersList = this.dataFiltered;
                },
                error => {
                  console.log("request thesis not found!!");
                }
              );  
            } 
            
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

      if (this.thesis.status=='published') {
        this.thesis.student_id = null;
      }

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
