import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { JobsService } from '../../../_services/jobs.service';
import { AuthService } from '../../../_services';
import { AppComponent } from '../../../app.component';
import { UsersService } from '../../../_services/users.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmDialogModel, ConfirmDialogComponent } from '../../utils/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';

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
      legend: false
    },

  };

  displayedColumns: string[] = ['candidateSurname', 'candidateName', 'available', 'expsalary', 'score', 'action'];
  dataSource = new MatTableDataSource([]);
  @ViewChild(MatPaginator, {static: true}) 
  paginator: MatPaginator;  
  
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  searchTxt: string = "";
 

  constructor(
    private appcomponent: AppComponent,
    private us: UsersService,
    private js: JobsService,
    private authservice: AuthService,
    private translate: TranslateService,
    public dialogModal: MatDialog, 
  ) { }

  isLogged = this.appcomponent.isLogged;
  isAdmin = this.appcomponent.isAdmin;
  isRecruiter = this.appcomponent.isRecruiter;
  //isTeacher = this.appcomponent.isTeacher;
  isProfessor = this.appcomponent.isProfessor;
  isStudent = this.appcomponent.isStudent;
  isEmployee = this.appcomponent.isEmployee;   
  jobCandidates: any =[]

  ngOnInit(): void {
    
  }
  ngOnChanges(): void {
    if (this.jobId) {
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.dataSource.data = [];
      this.getCandidates(this.jobId);
    }
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();    
  }

  getCandidates(jobId: any): void {
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
