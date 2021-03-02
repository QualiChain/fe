import { Component, OnInit, ViewChild, Input } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import User from '../../../_models/user';
import { ThesisService } from '../../../_services/thesis.service';
import { AuthService } from '../../../_services';
import { ConfirmDialogModel, ConfirmDialogComponent } from '../../utils/confirm-dialog/confirm-dialog.component';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { AppComponent } from '../../../app.component';

class Thesis {
  id: number;
  title: string;
  description: string;
  professor: any;
  student_id: number;
  status: string;
}

let ELEMENT_DATA: Thesis[] = [];

@Component({
  selector: 'app-thesis',
  templateUrl: './thesis.component.html',
  styleUrls: ['./thesis.component.css']
})
export class ThesisComponent implements OnInit {

  @Input() userId: number = null;

  displayedColumns: string[] = ['title', 'description', 'professorname', 'status', 'action'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);
  currentUser: User;
  @ViewChild(MatPaginator, {static: true}) 
  paginator: MatPaginator;  

  thesisList: Thesis[] = [];
  
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  constructor(
    private appcomponent: AppComponent,
    private ts: ThesisService,
    private authservice: AuthService,
    public dialog: MatDialog, 
    private translate: TranslateService
  ) { 

    this.authservice.currentUser.subscribe(x => this.currentUser = x);
  }

  isAdmin = this.appcomponent.isAdmin;
  isStudent = this.appcomponent.isStudent;
  isProfessor = this.appcomponent.isProfessor;

  newUserId: number = null;

  ngOnInit() {

    this.dataSource.sortingDataAccessor = (item, property) => {
      switch(property) {
        case 'professorname': return item.professor.name;
        case 'status': return this.translate.instant('THESIS.STATUS.OPTIONS.'+item.status.toUpperCase( ));
        default: return item[property];
      }
    }; 

    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;

    if(!this.currentUser) {
        this.currentUser={id:0,role:'', userName:'', name:'', surname:'', email:''};
    }

    //console.log("isAdmin:"+this.isAdmin);
    //console.log("add_and_update_thesis:"+this.authservice.checkIfPermissionsExistsByUserRoles(['add_and_update_thesis']));    
    //console.log(this.userId);

    if (this.userId) {
      //we recover data related with the usedId input
      this.newUserId = this.userId;

      if (this.isProfessor || this.isAdmin) {
        this.ts
        .getThesisByProfessorId(this.newUserId)
        .subscribe((data: any[]) => {
          data.forEach(element => {
            this.thesisList.push(element);
          });
        });   
      }

      if (this.isStudent) {
        this.ts
        .getThesisByStudentId(this.newUserId)
        .subscribe((data: any[]) => {
          data.forEach(element => {
            this.thesisList.push(element);
          });
        });
      }

    }
    else {
      this.newUserId = this.currentUser.id;
    
      if (this.isAdmin) {
        //recover all thesis
        this.ts
        .getAllThesis()
        .subscribe((data: any[]) => {
          //console.log(data);
          this.dataSource.data = data;        
          ELEMENT_DATA = data;
        });      
      }
      else if (this.authservice.checkIfPermissionsExistsByUserRoles(['add_and_update_thesis'])) {
        //only the ones created by the logged user
        this.ts
        //.getThesisByProfessorId(this.newUserId)
        .getAllThesis()
        .subscribe((data: any[]) => {
          //console.log(data);
          this.dataSource.data = data;        
          ELEMENT_DATA = data;
        });      
      }
      else {
        //used for the main tesis page
        this.ts
        .getAllThesis()
        .subscribe((data: any[]) => {
          //console.log(data);
          this.dataSource.data = data;        
          ELEMENT_DATA = data;        
        });      
      }

  }
  }

  confirmDialog(id, title): void {
    
    //const message = `Are you sure you want to do this?`;
    const message = this.translate.instant('THESIS.DELETE_MESSAGE') + " ("+title+")";
    
    const dialogData = new ConfirmDialogModel(this.translate.instant('THESIS.CONFIRM_ACTION'), message);

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "400px",
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      //this.result = dialogResult;

      if (dialogResult) {
         //console.log("Under construction");

         this.ts
         .deleteThesis(id).subscribe(
           data => {
             console.log("Thesis deleted!!");
             let posI = this.dataSource.data.findIndex(function(thesis){ return thesis.id === id })

             if (posI>=0) {
               this.dataSource.data.splice(posI, 1);               
               this.dataSource._updateChangeSubscription();
              }
              //this.router.navigate(["/courses"]);
           },
           error => {
             alert("Error deleting the thesis");                      
           }
         );

      }
    });
  }


}



// another component with a different view.
@Component({
  selector: 'app-thesis-summary',
  templateUrl: './thesis-summary-page.component.html',
  styleUrls: ['./thesis.component.css']
})
export class ThesisComponentSummaryPage extends ThesisComponent{




}