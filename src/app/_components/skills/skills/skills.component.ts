import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

import { SkillsService } from '../../../_services/skills.service';

import { ExcelServiceService } from '../../../_services/excel/excel-service.service';
import { ConfirmDialogModel, ConfirmDialogComponent } from '../../utils/confirm-dialog/confirm-dialog.component';
import { TranslateService } from '@ngx-translate/core';

import { MatDialog } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { AuthService } from '../../../_services';
import User from '../../../_models/user';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponent } from '../../../app.component';

let ELEMENT_DATA: any[] = [];

@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.css']
})
export class SkillsComponent implements OnInit {

  displayedColumns: string[] = ['name', 'type', 'hard_skill', 'action'];

  //dataSource = ELEMENT_DATA;
  dataSource = new MatTableDataSource(ELEMENT_DATA);
  currentUser: User;

  @ViewChild(MatPaginator, {static: true}) 
  paginator: MatPaginator;  
  
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  skills: any[];
  showLoading : boolean = true;
  
  constructor(
    private appcomponent: AppComponent,
    private router: Router,
    private ss: SkillsService, public authservice: AuthService, private excelService:ExcelServiceService, public dialog: MatDialog, private translate: TranslateService,
    public applyForAJobDialog: MatDialog) { 

      this.authservice.currentUser.subscribe(x => this.currentUser = x);

    }

    isLogged = this.appcomponent.isLogged;
    isAdmin = this.appcomponent.isAdmin;
    isRecruiter = this.appcomponent.isRecruiter;
    //isTeacher = this.appcomponent.isTeacher;
    isProfessor = this.appcomponent.isProfessor;
    isStudent = this.appcomponent.isStudent;
    isEmployee = this.appcomponent.isEmployee; 

    confirmDialog(id, title): void {
    
      //const message = `Are you sure you want to do this?`;
      const message = this.translate.instant('SKILLS.DELETE_MESSAGE') + " ("+title+")";
      
      const dialogData = new ConfirmDialogModel(this.translate.instant('SKILLS.CONFIRM_ACTION'), message);
  
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        maxWidth: "400px",
        data: dialogData
      });
  
      dialogRef.afterClosed().subscribe(dialogResult => {
        //this.result = dialogResult;
  
        if (dialogResult) {
         
           this.ss
           .deleteSkill(id).subscribe(
             data => {
               //console.log("skill deleted!!");
               let posI = this.dataSource.data.findIndex(function(skill){ return skill.id === id })
               if (posI>0) {
                 this.dataSource.data.splice(posI, 1);
                 this.skills.splice(posI, 1);
                 this.dataSource._updateChangeSubscription();
                }
                //this.router.navigate(["/courses"]);
             },
             error => {
               alert("Error deleting the skill");                      
             }
           );
  
        }
      });
    }

  ngOnInit(): void {
    this.getSkillsList();
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;

    if(!this.currentUser) {
      //if(!this.currentUser.hasOwnProperty('id')){
        this.currentUser={id:0,role:'', userName:'', name:'', surname:'', email:''};
      } 
  }


  getSkillsList() {
    this.ss
      .getSkills()
      .subscribe((data: any[]) => {
        this.skills = data;
        ELEMENT_DATA = data;
        //console.log(data);
        
        this.dataSource.data = data;
        this.showLoading = false;

    },
    error => {
      console.log("Error loading skills");
      this.showLoading = false;                     
    });
   

  }

  exportExcel(){    
    this.excelService.exportAsExcelFile(ELEMENT_DATA, 'list_of_skills');
  }  

}
