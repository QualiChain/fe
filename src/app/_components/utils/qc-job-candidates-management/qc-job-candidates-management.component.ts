import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { JobsService } from '../../../_services/jobs.service';
import { AuthService } from '../../../_services';
import { AppComponent } from '../../../app.component';
import { UsersService } from '../../../_services/users.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort, Sort, SortDirection} from '@angular/material/sort';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmDialogModel, ConfirmDialogComponent } from '../../utils/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
//import { MatDialogRef } from '@angular/material/dialog';
import { CVDialog_modal } from '../../../_components/profiles/profiles-view/profiles-view.component';
import {SelectionModel} from '@angular/cdk/collections';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-qc-job-candidates-management',
  templateUrl: './qc-job-candidates-management.component.html',
  styleUrls: ['./qc-job-candidates-management.component.css']
})
export class QcJobCandidatesManagementComponent implements OnInit {

  @Input() jobId: string;
  @Input() reload: number;

  public chartType = 'pie';
  public chartLabels: Array<any> = ['Match', 'Not Match'];

  public chartOptions: any = {
    responsive: true,
    tooltips: {
      enabled: true,
      mode: 'single',
      callbacks: {
        label: function (tooltipItems, data) {
          return data.datasets[0].data[tooltipItems.index] + ' %';
        }
      }
    },
      plugins: {
      datalabels: {
        display: true,
        align: 'top',
        anchor: 'end',
        //color: "#2756B3",
        color: "#222",
        font: {
          family: 'FontAwesome',
          size: 14
        },
      
      },
      deferred: false,
      legend: false,
    },

  };

  displayedColumns: string[] = ['checkbox', 'candidateSurname', 'candidateName', 'available', 'expsalary', 'score', 'action'];
  dataSource = new MatTableDataSource([]);
  
  selection = new SelectionModel<any>(true, []);

  @ViewChild(MatPaginator, {static: true}) 
  paginator: MatPaginator;  
  pageSize: number = 5;
  pageNumber: number = 0;
  
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  //@ViewChild(MatSort) sort: MatSort;
  searchTxt: string = "";
  showSpinner: boolean = true;

  constructor(
    private appcomponent: AppComponent,
    private us: UsersService,
    private js: JobsService,
    private authservice: AuthService,
    private translate: TranslateService,
    public dialogModal: MatDialog, 
    public CVDialog: MatDialog,
    private route: ActivatedRoute, private router: Router
  ) { }

  isLogged = this.appcomponent.isLogged;
  isAdmin = this.appcomponent.isAdmin;
  isRecruiter = this.appcomponent.isRecruiter;
  //isTeacher = this.appcomponent.isTeacher;
  isProfessor = this.appcomponent.isProfessor;
  isStudent = this.appcomponent.isStudent;
  isEmployee = this.appcomponent.isEmployee;   
  jobCandidates: any =[]
  
  selectedCandidates = [];

  changCheckbox(event, row) {
    if (event.checked) {
      this.selectedCandidates.push(row);
    }
    else {
      let posToDelte = 0;
      let posFosFound = false;
      for (let i = 0; i < this.selectedCandidates.length; i++) {
        if (this.selectedCandidates[i].id==row.id) {
          console.log("delete row")
          posFosFound = true;
          posToDelte = i;
        }
      }
      if (posFosFound) {
        this.selectedCandidates.splice(posToDelte, 1);
      }      
    }
  }

  openMCDSS() {       
    let options = {};
    options['criteria'] = ['salary', 'score'];
    options['alternative'] = [];
    options['values'] = [];

    for (let i=0; i<this.selectedCandidates.length; i++) {
     
      let alternativeValue = "";
      if ((this.selectedCandidates[i].candidateName=="") && (this.selectedCandidates[i].candidateSurname=="")) {
        alternativeValue = this.selectedCandidates[i].name
      }
      else {
        alternativeValue = this.selectedCandidates[i].candidateName+" "+this.selectedCandidates[i].candidateSurname;
      }
      options['alternative'].push(alternativeValue);
      options['values'].push(this.selectedCandidates[i].expsalary+"|"+this.selectedCandidates[i].score);

    }

    this.router.navigate(['/MCDSS'], { queryParams: options });
  }

  openUserCV(userId: number) {
    
    const dialogRef = this.CVDialog.open(CVDialog_modal, {
      disableClose: true,
      width: '550px',
      data: {userId: userId, isAdmin: false, isRecruiter: false}
    });

    dialogRef.afterClosed().subscribe(result => {
    });
    
  }

  sortList(sort: Sort) { 
    let paginator = {};
    let localStorageData = JSON.parse(localStorage.getItem('qc.candidatesList'));
    if (localStorageData) {
      if(localStorageData.hasOwnProperty('paginator')){
        paginator = localStorageData.paginator;
      }
    }
    localStorage.setItem('qc.candidatesList', JSON.stringify({'sort': sort, 'paginator':paginator}));
  }

  ngOnInit(): void {
    
  }
  onChangePage(x) {
    //console.log(x);
    let localStorageData = JSON.parse(localStorage.getItem('qc.candidatesList'));
    let sort = {};
    if(localStorageData.hasOwnProperty('sort')){
      sort = localStorageData.sort;
    }    
    localStorage.setItem('qc.candidatesList', JSON.stringify({'sort': sort, 'paginator': x}));

  }
  ngOnChanges(): void {
    if (this.jobId) {

      this.paginator.page.subscribe(x => this.onChangePage(x));

      this.dataSource.sort = this.sort;

      let orderType: string = 'score';
      let orderDirection: SortDirection = 'desc';
      let localStorageData = JSON.parse(localStorage.getItem('qc.candidatesList'));
      if (localStorageData) {
        if(localStorageData.hasOwnProperty('sort')){
          if(localStorageData.sort.hasOwnProperty('active')){
            orderType = localStorageData.sort.active;
          }
          if(localStorageData.sort.hasOwnProperty('direction')){
            orderDirection = localStorageData.sort.direction;
          }
        }
        //console.log(localStorageData);
        if(localStorageData.hasOwnProperty('paginator')){
          if(localStorageData.paginator.hasOwnProperty('pageSize')){
            this.pageSize = localStorageData.paginator.pageSize;
          }
          
        }
      }

      //const sortState: Sort = {active: orderType, direction: orderDirection};
      const sortState: Sort = {active: 'candidateSurname', direction: 'desc'};
      this.sort.active = sortState.active;
      this.sort.direction = sortState.direction;
      this.sort.sortChange.emit(sortState);

      this.dataSource.paginator = this.paginator;
      this.dataSource.data = [];
      this.getCandidates(this.jobId);
    }
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();    
  }

  getCandidates(jobId: any): void {
    //console.log(jobId);
    this.showSpinner = true;
    //only admin users or recuiters can load candidates list
    //if (this.isAdmin || this.isRecruiter) {
    //if (this.authservice.checkIfPermissionsExistsByUserRoles(['view_recruitment'])) {
      this.js
      .getJobCandidats(jobId)
      .subscribe((jobCandidates: any) => {

        //console.log(jobCandidates);  
        jobCandidates.forEach(element => {

          element.candidateSelected = 0;
          this.us.getUserProfileInJobEndPoint(element.id).subscribe(
            data => {
              if ( data ) {
                if ( data.hasOwnProperty('currentJobURI') ) {
                  if (data.currentJobURI) {
                    var splitted = data.currentJobURI.split(":"); 
                    if (splitted[splitted.length-1]==jobId) {
                      element.candidateSelected = 1;  
                    }
                  }
                }
              }
            },
            error => {
              console.log("error recovering user data from job endpoint - uid:"+element.id);
              element.candidateSelected = 0;
            }
          );

          this.us
          .getUser(element.id).subscribe(
            data => {
              //console.log("user in db");
              //console.log(data);
              element.candidateName = data.name;
              element.candidateSurname = data.surname;
              if (this.searchTxt) {
                this.applyFilter(this.searchTxt);
              }
              
            },
            error => {
              console.log("error recovering user data - uid:"+element.id);
              element.candidateName = "";
              element.candidateSurname = "";
            }
          );
          
        });
        
        this.jobCandidates = jobCandidates;  
        this.dataSource.data = this.jobCandidates;
        
      });
    //}

    this.showSpinner = false;
  }

  assignThisApply(jobId: any, userId: number): void {


    const message = this.translate.instant('JOB.SELECT_USER_APPLY_MESSAGE');
    
    const dialogData = new ConfirmDialogModel(this.translate.instant('JOBS.CONFIRM_ACTION'), message);

    const dialogRef = this.dialogModal.open(ConfirmDialogComponent, {
      maxWidth: "400px",
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      //this.result = dialogResult;

      if (dialogResult) {
        this.js.assignJobtoCandidate(userId, jobId).subscribe(
          res => {
            //console.log("Request OK");
            //console.log(res);     
            this.getCandidates(jobId);
          },
          error => {
            //console.log("Error assigning a job to a user");
            //console.log(error);
          }
        ); 
      }
    });    
  }

  deleteThisApply(jobId: any, userId: number, posI: number): void {
  

    const message = this.translate.instant('JOB.DELETE_APPLY_MESSAGE');
    
    const dialogData = new ConfirmDialogModel(this.translate.instant('JOBS.CONFIRM_ACTION'), message);

    const dialogRef = this.dialogModal.open(ConfirmDialogComponent, {
      maxWidth: "400px",
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      //this.result = dialogResult;

      if (dialogResult) {
        this.js.deleteJobApply(jobId, userId).subscribe(
          res => {
            //console.log("Request OK");
            //console.log(res);
            if (posI<0) {
              this.getCandidates(jobId);
            }
            else {
              /*
              this.jobCandidates.splice(posI, 1);
              //this.dataSource.data.splice(posI, 1);              
              this.dataSource._updateChangeSubscription();
              */
              this.getCandidates(jobId);
              
            }
            
            
          },
          error => {
            console.log("Error deleting job apply data");
            //console.log(error);
          }
        ); 
      }
    });
  }


}
