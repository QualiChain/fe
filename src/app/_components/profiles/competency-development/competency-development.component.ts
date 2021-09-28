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
//import { SELECT_PANEL_INDENT_PADDING_X } from '@angular/material/select';

import {  MatAutocompleteTrigger } from '@angular/material/autocomplete';
//MatOptionSelectionChange
import { Subscription } from 'rxjs';
import { withLatestFrom } from 'rxjs/operators';
import { QCStorageService } from '../../../_services/QC_storage.services';

class competencyLevel {
  id?: number;
  label: string;
  comment: string;
  skillID: string;
  evalDate: string;
  acquiredDate: string;
  skillName?: string
  proficiencyLevel: string;
  progress: number
}

class competencyLevelToPost {
  "label": string;
  "comment": string;
  "skillURI": string;
  "evalDate": string;
  "acquiredDate": string;
  "proficiencyLevel": string;
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
  //displayedColumns: string[] = ['skillName', 'skillLevel', 'progress', 'acquiredDate', 'evalDate', 'action'];
  displayedColumns: string[] = ['label', 'proficiencyLevel', 'progress', 'acquiredDate', 'evalDate', 'action'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);
  fromURL: boolean = false;

  currentLang = localStorage.getItem('last_language'); 
  

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

    if (!this.currentLang) {
      this.currentLang = 'en';
    }

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
        const filteredData = data.filter(row => row != null);
        //console.log(filteredData);

        /*
        filteredData.forEach(element => {
          console.log(element.translations[this.currentLang]);
          if(element.translations[this.currentLang]) {

          }
        });
        */


        //let dataTmp = data;
        let dataTmp = filteredData;
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
  
  item: competencyLevel = { id:null, label:null, comment:null, skillID:null, evalDate:null, acquiredDate:null, skillName: null, proficiencyLevel: null, progress:null};
  mode: string = null;
  skills: any[];
  myControl = new FormControl();
  //options: string[] = ['One', 'Two', 'Three'];
  options: any[] = [];
  filteredOptions: Observable<string[]>;
  autocompletOption :any;
  label: string = null;
  skillName: string = null;
  skillNameTranslation: string = null;
  competencyItem: string = "";

  itemToPost: competencyLevelToPost = {
    "label": null,
    "comment": null,
    "skillURI": null,
    "evalDate": null,
    "acquiredDate": null,
    "proficiencyLevel": null,
    "progress": null,
  }

  skillsFields: any[] = [];
  skill_field: string = "";
  currentUserLang = localStorage.getItem('last_language');

  competencies: CompetencyLevelValues[] = [
    {value: 'basic', viewValue: 'Basic'},
    {value: 'intermediate', viewValue: 'Intermediate'},
    {value: 'advanced', viewValue: 'Advanced'},
    {value: 'expert', viewValue: 'Expert'}
  ];

  @ViewChild(MatAutocompleteTrigger) trigger: MatAutocompleteTrigger;
  subscription: Subscription;
  loadingSpinner: boolean = true;

  listOfCurrentSkillsByUser: any[] = [];

  constructor(
    private qcStorageService: QCStorageService,
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


  SkillFieldOptionSelected($event) {
    //console.log($event);
    this.competencyItem = "";
    this.options = [];
    localStorage.setItem('last_skillField', $event.value);
    this.getFilteredSkillsList($event.value);
  }

  getSkillsFields() {

    if (JSON.parse(this.qcStorageService.QCDecryptData(localStorage.getItem('last_CompetencesList')))) {
      this.skillsFields = JSON.parse(this.qcStorageService.QCDecryptData(localStorage.getItem('last_CompetencesList')));

      if (localStorage.getItem('last_skillField')) {
        this.skill_field = localStorage.getItem('last_skillField');

        let last_skillsList = JSON.parse(this.qcStorageService.QCDecryptData(localStorage.getItem('last_CompetencesList_'+this.skill_field)))

        if (last_skillsList) {
          //console.log(last_skillsList);

          last_skillsList.sort((a, b) => (a.translations[this.currentUserLang] > b.translations[this.currentUserLang]) ? 1 : -1)

          this.options = [];
          this.options = last_skillsList;
          //console.log(this.options);
          this.loadingSpinner = false;
        }
        else {
          this.getFilteredSkillsList(this.skill_field);
        }  

      }
      
      this.loadingSpinner = false;
    }
    else {
      this.cs
      .getCompetencesSkillFields()
      .subscribe((data: any[]) => {
        console.log(data);
        this.skillsFields = data;
        

        if (localStorage.getItem('last_skillField')) {
          this.skill_field = localStorage.getItem('last_skillField');
          
          let last_skillsList = JSON.parse(this.qcStorageService.QCDecryptData(localStorage.getItem('last_skillsList')))
          if (last_skillsList) {
            //console.log(last_skillsList);

            last_skillsList.sort((a, b) => (a.translations[this.currentUserLang] > b.translations[this.currentUserLang]) ? 1 : -1)

            //console.log(last_skillsList);
            let competencesList = [];
            for (let i in last_skillsList) {

              if (last_skillsList[i].id) {
                //console.log(listOfCurrentSkillsIds);
                //console.log(data[i].uri);
                //only skill we don't have      
                //console.log(last_skillsList[i].id);
                if (!this.listOfCurrentSkillsByUser.includes(last_skillsList[i].id.replace("saro:",""))) {     
                  competencesList.push({'id':last_skillsList[i].id, 'name':last_skillsList[i].name, 'translation': last_skillsList[i].translations[this.currentUserLang], 'translations': last_skillsList[i].translations}) 
                }
              }

            }

            this.options = [];
            //this.options = last_skillsList;
            this.options = competencesList;
            //console.log(this.options);
            this.loadingSpinner = false;
          }
          else {
            this.getFilteredSkillsList(this.skill_field);
          }          
        }
        else {
          this.loadingSpinner = false;
        }
      },
      error => {
        console.log("Error getting skills fields");
        this.loadingSpinner = false;
      });

    }
  }

  getFilteredSkillsList(textToFilter: string) {

    localStorage.removeItem('last_skillsList');
    //console.log(this.listOfCurrentSkillsByUser);
    this.loadingSpinner = true;
    this.options = [];
    let currentLang = localStorage.getItem('last_language'); 
    if (!currentLang) {
      currentLang = 'en';
    }
    //console.log("currentLang: "+currentLang);

    let last_skillsList = JSON.parse(this.qcStorageService.QCDecryptData(localStorage.getItem('last_CompetencesList_'+textToFilter)))

    if (last_skillsList) {
      //console.log(last_skillsList);

      last_skillsList.sort((a, b) => (a.translations[this.currentUserLang] > b.translations[this.currentUserLang]) ? 1 : -1)

      this.options = [];
      this.options = last_skillsList;
      //console.log(this.options);
      this.loadingSpinner = false;
    }
    else {

      this.cs
      .getCompetencesSkillsByField(textToFilter)
      .subscribe((data: any[]) => {
        let competencesList = [];
        for (let i in data) {
          
          //console.log(data[i].uri);
          //console.log(data[i].label);
          
          if (data[i].uri) {
            //console.log(listOfCurrentSkillsIds);
            //console.log(data[i].uri);
            //only skill we don't have      
            //console.log(data[i].uri);
            if (!this.listOfCurrentSkillsByUser.includes(data[i].uri.replace("saro:",""))) {     
              competencesList.push({'id':data[i].uri, 'name':data[i].label, 'translation': data[i].translations[currentLang], 'translations': data[i].translations}) 
            }
          }
          
        }
        competencesList.sort((a, b) => (a.translation > b.translation) ? 1 : -1)
        //console.log("sorted list")
        //console.log(competencesList);
        this.options = competencesList;

        let encryptedData = this.qcStorageService.QCEncryptData(JSON.stringify(competencesList));      
        localStorage.setItem('last_skillsList', encryptedData);

        
        this.loadingSpinner = false;
      },
      error => {
        console.log("Error getting filtered list of skills. Filtering by "+textToFilter);
        this.loadingSpinner = false;
      });
    }
    
  }  

  getFinalSkillsList(listOfCurrentSkillsIds) {
    console.log(listOfCurrentSkillsIds);
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
          /*
         if (!listOfCurrentSkillsIds.includes(i.replace(":",""))){
           //console.log("in if");
           competencesList.push({'id':i, 'name':data[i]}) 
         }
         */
         if (!listOfCurrentSkillsIds.includes(i.replace("saro:",""))) {
           //console.log("in if");
           competencesList.push({'id':i, 'name':data[i]}) 
         }
          
        }
        
      }
      competencesList.sort((a, b) => (a.name > b.name) ? 1 : -1)

      this.options = competencesList;

      this.loadingSpinner = false;

  },
  error => {
    console.log("Error loading competences skills list");  
    this.loadingSpinner = false;                  
  }); 
  }

  
  getSkillsList() {

    this.cs.getCompetencesByUser(this.data.userId)
    .subscribe((data: any[]) => {
      //console.log(data);
      let listOfCurrentSkillsIds = [];
      this.listOfCurrentSkillsByUser = [];
      for (let i in data) {
        //console.log(data[i]['skillID']);
        //console.log(data[i]['skillID']);
        listOfCurrentSkillsIds.push(data[i]['skillID']);
        this.listOfCurrentSkillsByUser.push(data[i]['skillID']);
      }

      /*
      this.ss
        .getSkills()
        .subscribe((data: any[]) => {        
          this.options = data;
          //console.log(data);
      });
      */

      //this.getFinalSkillsList(listOfCurrentSkillsIds);
      this.getSkillsFields();
    

    },
    error => {
      console.log("Error loading personal skills");  
      //this.getFinalSkillsList([]);                  
      this.getSkillsFields();  
    }); 

    
  }

  OptionSelected(event){
    //console.log(event);
    this.item.label = event.option.value;
    this.itemToPost.label = event.option.value;
    this.itemToPost.skillURI = event.option.id;
  }

  ngAfterViewInit() {
    if (this.data.action=='create') {
      this._subscribeToClosingActions();
    }
  }

  ngOnDestroy() {
    if (!!this.subscription && !this.subscription.closed) {
      this.subscription.unsubscribe();
    }
  }

  private _subscribeToClosingActions() {
    if (!!this.subscription && !this.subscription.closed) {
      this.subscription.unsubscribe();
    }

    this.subscription = this.trigger.panelClosingActions
        .subscribe(e => {
          if (!(e && e.source)) {
            this.myControl.setValue("")
            
            this.item.label = "";
            this.itemToPost.label = "";
            this.itemToPost.skillURI = "";

            this.trigger.closePanel()
          }
        })
  }

  numberFormControl = new FormControl('', [
    Validators.min(0),
    Validators.max(100),
 ]);

  OptionChanged(event){  
    //console.log(event.source.value, event.source.selected);
  }

  ngOnInit() {



    let currentLang = localStorage.getItem('last_language'); 
    if (!currentLang) {
      currentLang = 'en';
    }

    if (!this.currentUserLang) {
      this.currentUserLang = 'en';
    }
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

      //console.log(currentLang);
      //console.log(dataAPI);
      if (dataAPI.skillName) {
        //this.myControl.setValue('greek');
        this.myControl.setValue(dataAPI.skillName);
      }

      this.skillNameTranslation  = dataAPI.label;
      if (dataAPI.translations[currentLang]) {
        this.skillNameTranslation = dataAPI.translations[currentLang];
      }     

      //this.itemToPost.label = dataAPI.label;

      this.label = dataAPI.label;
      this.skillName = dataAPI.label;
      this.itemToPost.label = dataAPI.label;
      //this.itemToPost.skillURI = ":"+dataAPI.skillID;
      this.itemToPost.skillURI = dataAPI.uri;

      this.item.proficiencyLevel = dataAPI.proficiencyLevel;
      this.item.progress = dataAPI.progress;
      //this.item.comment = dataAPI.comment;
      this.item.comment = dataAPI.skillRefComment;
      this.item.label = dataAPI.label;

      //set default dsate in acquiredDate
      //let newDate = '31/01/2021'; 
      //console.log("-----acquiredDate---------")  
      let newDateAcquiredDate = dataAPI.acquiredDate;
      //var splitted = newDateAcquiredDate.split("/"); 
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
      //var splitted2 = newDateEvalDate.split("/"); 
      //console.log(newDateEvalDate);
      //newDateEvalDate = splitted2[1]+"/"+splitted2[0]+"/"+splitted2[2];
      //console.log(newDateEvalDate);
      //console.log(this.datepipe.transform(newDateEvalDate, 'yyyy-MM-dd'));
      this.item.evalDate = this.datepipe.transform(newDateEvalDate, 'yyyy-MM-dd');     
      //console.log(this.item.evalDate);

      this.loadingSpinner = false;
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
      
      this.itemToPost.proficiencyLevel = this.item.proficiencyLevel;
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
      //itemToPut.skillID = this.data.element['skillID'];
      //itemToPut.id = this.data.element['id'];
      //itemToPut.skillURI = this.data.element['uri'];
      itemToPut.id = this.data.element['skillID'];
      itemToPut.skillURI = this.data.element['skillURI'];

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
      itemToPut.proficiencyLevel = this.item.proficiencyLevel;
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