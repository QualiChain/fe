import { Component, OnInit, ViewChild, Input, Inject } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { AppComponent } from '../../../app.component';
//import { ThesisService } from '../../../_services/thesis.service';
import { SkillsService } from '../../../_services/skills.service';
import { AuthService } from '../../../_services';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmDialogModel, ConfirmDialogComponent } from '../../utils/confirm-dialog/confirm-dialog.component';
import User from '../../../_models/user';

class competencyLevel {
  id: number;
  competency: string;
  level: number;
  progress: number;
  next_evaluation: string;
}

let ELEMENT_DATA: competencyLevel[] = [];

@Component({
  selector: 'app-competency-development',
  templateUrl: './competency-development.component.html',
  styleUrls: ['./competency-development.component.css']
})
export class CompetencyDevelopmentComponent implements OnInit {

  @Input() userId: number = null;
  currentUser: User;

  showLoading : boolean = true;
  displayedColumns: string[] = ['competency', 'level', 'progress', 'next_evaluation', 'action'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) 
  paginator: MatPaginator;  

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  constructor(
    private appcomponent: AppComponent,
    private ss: SkillsService,
    private authservice: AuthService,
    public dialog: MatDialog, 
    private translate: TranslateService,
    public ItemDialog: MatDialog,
  ) { 

    this.authservice.currentUser.subscribe(x => this.currentUser = x);
  }

  ngOnInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    
    if(!this.currentUser) {
      this.currentUser={id:0,role:'', userName:'', name:'', surname:'', email:''};
    }
    

    this.recoverComptetences();

     
    
  }

  recoverComptetences() {
    this.showLoading = true;
    //if userId is not null we must use this uid
    //console.log("input user id: "+this.userId);
    //console.log("current UserId: "+this.currentUser.id);
    this.ss.getSkills()
        .subscribe((data: any[]) => {
          //console.log(data);
/*
          this.dataSource.data = data;        
          ELEMENT_DATA = data; 
*/
          let dataTmp = [
            {id: 1, competency: 'competency 1', level: 2, progress: 54, next_evaluation: '2021-09-14T22:00:00.000Z'},
            {id: 2, competency: 'competency 2', level: 3, progress: 32, next_evaluation: '2022-09-14T22:00:00.000Z'},
            {id: 3, competency: 'competency 3', level: 1, progress: 28, next_evaluation: '2022-01-12T22:00:00.000Z'}
          ];
          this.dataSource.data = dataTmp;        
          ELEMENT_DATA = dataTmp; 
          this.showLoading = false;

          //this.dataSource._updateChangeSubscription();
          this.showLoading = false;
        },
        error => {
          this.showLoading = false;
          alert("Error loading personal skills");                      
        }); 
  }

  openItem(itemId): void {

    const dialogRef = this.ItemDialog.open(ItemCDDialog_modal, {
      disableClose: true,
      width: '550px',
      data: {itemId: itemId}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result) {
        this.recoverComptetences();
      }
    });

  }

  confirmDialog(id, title): void {
    
    //const message = `Are you sure you want to do this?`;
    const message = this.translate.instant('COMPETENCY_LEVEL.DELETE_MESSAGE') + " ("+title+")";
    
    const dialogData = new ConfirmDialogModel(this.translate.instant('COMPETENCY_LEVEL.CONFIRM_ACTION'), message);

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "400px",
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      //this.result = dialogResult;

      if (dialogResult) {
         console.log("Under construction");

         /*
         this.cs
         .deleteCompetency(id).subscribe(
           data => {
             */
             console.log("competency deleted!!");
             let posI = this.dataSource.data.findIndex(function(competency){ return competency.id === id })

             if (posI>=0) {
               this.dataSource.data.splice(posI, 1);               
               this.dataSource._updateChangeSubscription();
              }
              //this.router.navigate(["/courses"]);
              /*
           },
           error => {
             alert("Error deleting the competency");                      
           }
         );
         */

      }
    });
  }
}


/************************/
@Component({
  selector: 'ItemDialog',
  templateUrl: './itemDialog.html',
  styleUrls: ['./competency-development.component.css']
})
export class ItemCDDialog_modal implements OnInit {
  
  item: competencyLevel = { id:null, competency:null, level:null, progress:null, next_evaluation:null };
  mode: string = null;

  constructor(
    public dialogRef: MatDialogRef<ItemCDDialog_modal>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  ngOnInit() {

    //console.log(this.data.itemId.toString());
    if (this.data.itemId==0) {
      this.mode = "Create";
    }
    else {
      this.mode = "Edit";
      let dataTmp = [
        {id: 1, competency: 'competency 1', level: 2, progress: 54, next_evaluation: '2021-09-14T22:00:00.000Z'},
        {id: 2, competency: 'competency 2', level: 3, progress: 32, next_evaluation: '2022-09-14T22:00:00.000Z'},
        {id: 3, competency: 'competency 3', level: 1, progress: 28, next_evaluation: '2022-01-12T22:00:00.000Z'}
      ];

      this.item = dataTmp[this.data.itemId-1];

    }


  }
  
  onSubmit() {
    //console.log("submit");
    if (this.data.itemId==0) {
      console.log("create new");
    }
    else {
      console.log("update item "+this.data.itemId.toString());
    }
    //this.dialogRef.close();
    this.dialogRef.close(true);
  }
}

export interface DialogData {
  itemId: number;
}