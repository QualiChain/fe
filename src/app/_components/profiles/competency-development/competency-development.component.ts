import { Component, OnInit, ViewChild, Input, Inject } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { AppComponent } from '../../../app.component';
//import { ThesisService } from '../../../_services/thesis.service';
import { SkillsService } from '../../../_services/skills.service';
import { CVService } from '../../../_services/cv.service';
import { AuthService } from '../../../_services';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmDialogModel, ConfirmDialogComponent } from '../../utils/confirm-dialog/confirm-dialog.component';
import User from '../../../_models/user';
import {Observable} from 'rxjs';
import {FormControl} from '@angular/forms';
import {map, startWith} from 'rxjs/operators';

import { MAT_DATE_LOCALE } from '@angular/material/core';
import { DateAdapter } from '@angular/material/core'; 
import { DatePipe } from '@angular/common'
import { Validators} from '@angular/forms';
import { SELECT_PANEL_INDENT_PADDING_X } from '@angular/material/select';

class competencyLevel {
  id?: number;
  label: string;
  comment: string;
  skillID: string;
  evalDate: string;
  acquiredDate: string;
  skillName: string
  skillLevel: string;
  progress: number
}

class competencyLevelToPost {
  "label": string;
  "comment": string;
  "skillURI": string;
  "evalDate": string;
  "acquiredDate": string;
  "skillLevel": string;
  "progress": number;
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
  displayedColumns: string[] = ['skillName', 'skillLevel', 'progress', 'acquiredDate', 'evalDate', 'action'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);
  fromURL: boolean = false;

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
    private route: ActivatedRoute,
    private cs: CVService,
  ) { 

    this.authservice.currentUser.subscribe(x => this.currentUser = x);
  }

  ngOnInit(): void {

    if (!this.userId) {
      this.route.params.subscribe(params => {
      if(params.hasOwnProperty('id')){
        this.userId = +params.id;
        this.fromURL = true;
      }
    });
    }

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
    let sUId: string = null;
    if (this.userId) {
      sUId = this.userId.toString();
    
      this.cs.getCompetencesByUser(sUId)
      .subscribe((data: any[]) => {
        //console.log(data);
        let dataTmp = data;
        this.dataSource.data = dataTmp;        
        ELEMENT_DATA = dataTmp; 
        this.showLoading = false;
      },
      error => {
        this.showLoading = false;
        console.log("Error loading personal skills");                      
      }); 
    }
    else {
      this.showLoading = false;
    }
    
  }

  openItem(action, element): void {
    //console.log(element);
    const dialogRef = this.ItemDialog.open(ItemCDDialog_modal, {
      disableClose: true,
      width: '550px',
      data: {action: action, userId: this.userId.toString(), element: element}
    });

    dialogRef.afterClosed().subscribe(result => {
      //console.log(result);
      if (result) {      
        this.showLoading = true;  
        setTimeout(() => {  this.recoverComptetences(); }, 1000);
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
interface CompetencyLevelValues {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'ItemDialog',
  templateUrl: './itemDialog.html',
  styleUrls: ['./competency-development.component.css'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }
  ]
})
export class ItemCDDialog_modal implements OnInit {
  
  item: competencyLevel = { id:null, label:null, comment:null, skillID:null, evalDate:null, acquiredDate:null, skillName: null, skillLevel: null, progress:null};
  mode: string = null;
  skills: any[];
  myControl = new FormControl();
  //options: string[] = ['One', 'Two', 'Three'];
  options: any[] = [];
  filteredOptions: Observable<string[]>;
  autocompletOption :any;
  label: string = null;
  skillName: string = null;

  itemToPost: competencyLevelToPost = {
    "label": null,
    "comment": null,
    "skillURI": null,
    "evalDate": null,
    "acquiredDate": null,
    "skillLevel": null,
    "progress": null,
  }

  competencies: CompetencyLevelValues[] = [
    {value: 'basic', viewValue: 'Basic'},
    {value: 'medium', viewValue: 'Medium'},
    {value: 'advanced', viewValue: 'Advanced'}
  ];

  constructor(
    private ss: SkillsService,
    private cs: CVService,
    public dialogRef: MatDialogRef<ItemCDDialog_modal>,    
    private dateAdapter: DateAdapter<any>,
    public datepipe: DatePipe,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {

  }

  private _filter(value: string): string[] {
    
    const filterValue = value.toString().toLowerCase();   

    return this.options.filter(option => option.name.toLowerCase().includes(filterValue));
  }

  getSkillsList() {

    this.cs.getCompetencesByUser(this.data.userId)
    .subscribe((data: any[]) => {
      //console.log(data);
      let listOfCurrentSkillsIds = [];
      for (let i in data) {
        //console.log(data[i]['skillID']);
        listOfCurrentSkillsIds.push(data[i]['skillID']);
      }

      /*
      this.ss
        .getSkills()
        .subscribe((data: any[]) => {        
          this.options = data;
          //console.log(data);
      });
      */

     this.cs
     .getCompetencesSkills()
     .subscribe((data: any[]) => {       
       //this.options = data;
       //console.log(data);
       //console.log(typeof data);
       let competencesList = [];
       for (let i in data) {
         //console.log(i);
         //console.log(data[i]);
         if (data[i]) {
           //console.log(listOfCurrentSkillsIds);
           //console.log(i)
           //only skill we don't have
          if (!listOfCurrentSkillsIds.includes(i.replace(":","")))
          {
            //console.log("in if");
            competencesList.push({'id':i, 'name':data[i]}) 
          }
           
         }
         
       }
       competencesList.sort((a, b) => (a.name > b.name) ? 1 : -1)

       this.options = competencesList;

   });    

    },
    error => {
      console.log("Error loading personal skills");                      
    }); 

    
  }

  OptionSelected(event){
    //console.log(event);
    //this.itemToPost.label = event.option.value;
    this.itemToPost.skillURI = event.option.id;
  }

  numberFormControl = new FormControl('', [
    Validators.min(0),
    Validators.max(100),
 ]);

  OptionChanged(event){  
    //console.log(event.source.value, event.source.selected);
  }

  ngOnInit() {
    this.dateAdapter.setLocale('en-GB');
    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );

    this.getSkillsList();

    //console.log(this.data.itemId.toString());
    //console.log(this.data.action);
    if (this.data.action=='create') {
      this.mode = "Create";      
    }
    else {
      this.mode = "Edit";
      //console.log(this.data.element)
      //console.log(this.data.element);
      let dataAPI: any = this.data.element;
     
      if (dataAPI.skillName) {
        //this.myControl.setValue('greek');
        this.myControl.setValue(dataAPI.skillName);
      }
      //this.itemToPost.label = dataAPI.label;

      this.label = dataAPI.label;
      this.skillName = dataAPI.skillName;
      this.itemToPost.label = dataAPI.label;
      this.itemToPost.skillURI = ":"+dataAPI.skillID;

      this.item.skillLevel = dataAPI.skillLevel;
      this.item.progress = dataAPI.progress;
      this.item.comment = dataAPI.comment;
      this.item.label = dataAPI.label;

      //set default dsate in acquiredDate
      //let newDate = '31/01/2021'; 
      //console.log("-----acquiredDate---------")  
      let newDateAcquiredDate = dataAPI.acquiredDate;
      var splitted = newDateAcquiredDate.split("/"); 
      //console.log(newDateAcquiredDate);
      //newDateAcquiredDate = splitted[1]+"/"+splitted[0]+"/"+splitted[2];
      //console.log(newDateAcquiredDate);
      //console.log(this.datepipe.transform(newDateAcquiredDate, 'yyyy-MM-dd'));
      this.item.acquiredDate = this.datepipe.transform(newDateAcquiredDate, 'yyyy-MM-dd');
      //this.item.adquiredDate = dataAPI.acquiredDate;
      //console.log(this.item.acquiredDate);

      //console.log("-----evalDate---------")     
      //set default dsate in evalDate
      //let newDate2 = '29/02/2020';
      let newDateEvalDate = dataAPI.evalDate;
      var splitted2 = newDateEvalDate.split("/"); 
      //console.log(newDateEvalDate);
      //newDateEvalDate = splitted2[1]+"/"+splitted2[0]+"/"+splitted2[2];
      //console.log(newDateEvalDate);
      //console.log(this.datepipe.transform(newDateEvalDate, 'yyyy-MM-dd'));
      this.item.evalDate = this.datepipe.transform(newDateEvalDate, 'yyyy-MM-dd');     
      //console.log(this.item.evalDate);

    }


  }
  
  onSubmit() {
    //console.log("submit");
    
    //if (this.data.itemId==0) {
    if (this.data.action=='create') {
      //console.log("create new");

      this.itemToPost.label = this.item.label;
      this.itemToPost.comment = this.item.comment;
      //let newEvalDate =this.datepipe.transform(this.item.evalDate, 'dd/MM/yyyy');
      let newEvalDate =this.datepipe.transform(this.item.evalDate, 'MM/dd/yy');
      //let newEvalDate =this.item.evalDate;
      this.itemToPost.evalDate = newEvalDate.toString();
      //let newDate = new Date(this.item.acquiredDate);
      //let newDate = this.datepipe.transform(this.item.acquiredDate, 'dd/MM/yyyy');
      let newDate = this.datepipe.transform(this.item.acquiredDate, 'MM/dd/yy');
      //let newDate = this.item.acquiredDate;
      this.itemToPost.acquiredDate = newDate.toString();
      
      this.itemToPost.skillLevel = this.item.skillLevel;
      this.itemToPost.progress = this.item.progress; 

      //console.log(this.itemToPost);
      
      this.cs.addSkilCompetence(this.data.userId, this.itemToPost).subscribe(
        res => {
          //console.log("competence created");
          //console.log(res);
          this.dialogRef.close(true);
        },
        error => {
          console.log("Error creating competence!!");
        }
      );
      
    }
    else {
      //console.log("update item");
      let itemToPut : any = {};
      itemToPut.label = this.item.label;
      itemToPut.comment = this.item.comment;
      itemToPut.skillID = this.data.element['skillID'];
      //let newEvalDate =this.datepipe.transform(this.item.evalDate, 'dd/MM/yyyy');
      //let newEvalDate =this.datepipe.transform(this.item.evalDate, 'MM/dd/yyyy');
      let newEvalDate =this.datepipe.transform(this.item.evalDate, 'MM/dd/yy');
      //let newEvalDate =this.item.evalDate;
      itemToPut.evalDate = newEvalDate.toString();
      //let newDate = new Date(this.item.acquiredDate);
      //let newDate = this.datepipe.transform(this.item.acquiredDate, 'dd/MM/yyyy');
      //let newDate = this.datepipe.transform(this.item.acquiredDate, 'MM/dd/yyyy');
      let newDate = this.datepipe.transform(this.item.acquiredDate, 'MM/dd/yy');
      //let newDate = this.item.acquiredDate;
      itemToPut.acquiredDate = newDate.toString();

      itemToPut.skillName = this.data.element['skillName'];
      itemToPut.skillLevel = this.item.skillLevel;
      itemToPut.progress = this.item.progress.toString() 
      
      //console.log(itemToPut);
      
      this.cs.updateSkilCompetence(this.data.userId, itemToPut).subscribe(
        res => {
          console.log("competence updated");
          //console.log(res);
          this.dialogRef.close(true);
        },
        error => {
          console.log("Error creating competence!!");
        }
      );

    }
    //this.dialogRef.close();
    //this.dialogRef.close(true);
  }
}

export interface DialogData {
  action: string;
  userId: string;
  element: {};
}