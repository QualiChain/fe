import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { BadgesService } from '../../../_services/badges.service';
import { SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { awardDialog_modal } from '../../../_components/award-smart-badge/award-smart-badge.component';
import { OUService } from '../../../_services/ou.service'
import { AppComponent } from '../../../app.component';
import { QCMatomoConnectorService} from '../../../_services/qc-matomo-connector.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import { createAwardDialog_modal } from '../../../_components/award-smart-badge/award-smart-badge.component';
import { AuthService } from '../../../_services';
import User from '../../../_models/user';
import { FormControl } from '@angular/forms';

let ELEMENT_DATA: any[] = [];

@Component({
  selector: 'app-qc-smart-badges-list',
  templateUrl: './qc-smart-badges-list.html',
  styleUrls: ['./qc-smart-badges-list.css']
})
export class QcSmartBadgesListComponent implements OnInit {

  //@Input() userId: string;
  @Input() formatOutput: string;

  displayedColumns: string[] = ['id', 'name', 'issuer', 'action'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);
  
  @ViewChild(MatPaginator, {static: true}) 
  paginator: MatPaginator;  
  
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  createdByMe : boolean = false;
  currentUser: User;

  nameFilter = new FormControl('');

  filterValues = { 
    name: '',
    creator_email: null
  };

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  onChangeCreatedByMeCheckbox(checked: boolean) {
    //console.log("ddddddddddddd");
    this.createdByMe = checked;
    //console.log(this.currentUser);
    //console.log(this.dataSource.data);
    if (this.createdByMe) {
      this.filterValues.creator_email = this.currentUser.email;
    }
    else {
      this.filterValues.creator_email = null;
    }
    //console.log(this.filterValues);
    this.dataSource.filter = JSON.stringify(this.filterValues);
  }

  lodingspinnerid: boolean = true;
  aqcuired_badges_by_user: any[] = [];

  errorMessage: string = "";
  showErrorMessage: boolean = false;
  loadingLoginSpinner: boolean = false;
  validationSuccess: boolean = false;

  fileToUploadDetails: File = null;
  uploadedDetails: boolean = false;
  invalidDetailsFile: boolean = false;
  messageErrorDetailsFile: string = null;

  downloadPNGImage: any = null;
  showErrorDowloadingPNG: boolean = false;
  searchedTerm: string = null;

  constructor(
    public authservice: AuthService,
    public createAwardDialog: MatDialog,
    private mc: QCMatomoConnectorService,
    private appcomponent: AppComponent,
    private bs: BadgesService,
    public awardDialog: MatDialog,
    private ous: OUService
  ) { 

    this.authservice.currentUser.subscribe(x => this.currentUser = x);
    this.dataSource.filterPredicate = this.createFilter();

  }

  isAdmin = this.appcomponent.isAdmin;
  isProfessor = this.appcomponent.isProfessor;
  isAcademicOrganisation = this.appcomponent.isAcademicOrganisation;

  intialerts() {
    this.errorMessage = "";
    this.showErrorMessage = false;
    this.loadingLoginSpinner = false;
    this.validationSuccess = false;
  }
  modalClass: string = "";
/*
  whatClassIsIt= function(transactionhash: string){
    //element_badge.oubadge_user.signature.account    
    if ((transactionhash=="0xB6b4BD366c8985318FF3aE46a4B73085E0fEf8E1") || transactionhash=="0")
           return "studentBadge"
    else if ((transactionhash=="0x121F308D181183571775d651eB1D006Cb328E4CE") || transactionhash=="1")
        return "recruiterBadge";
    else if ((transactionhash=="0x4EcA68c7D114396F78ACE6672666CDbcf5Ce7943") || transactionhash=="2")
        return "professorBadge";
    else if ((transactionhash=="0xB2017b2e31759180B9848A140A58FBE1309B8189") || transactionhash=="3")
        return "administratorBadge";        
    else if ((transactionhash=="0x080618F2B190070fB8ad2C7BAf41418C6159ac34") || transactionhash=="4")
        return "defaultBadge";        
    else
        return "defaultBadge";
   }
*/
  loadAllBadges() {
    this.lodingspinnerid = true;
    this.bs.getBadges().subscribe(
      badges => {
        badges.sort((a, b) => a.name.localeCompare(b.name));
        
        
        this.aqcuired_badges_by_user = badges;

        this.dataSource.data = badges;        
        ELEMENT_DATA = badges;
        

        /*
        badges.forEach((badge, index) => {  
          console.log(badge);
          let newBadgeData = {};
          newBadgeData = badge;

          var index = this.aqcuired_badges_by_user.map(function(e) { return e.id; }).indexOf(badge.id);
          console.log(index);

          newBadgeData['creator_email'] = badge.oubadge.issuer.email;
          this.aqcuired_badges_by_user.push(newBadgeData);
          this.dataSource.data.push(newBadgeData);
          ELEMENT_DATA.push(newBadgeData);
          this.dataSource.data = this.dataSource.data.slice();
          

        });
        */
        //console.log(this.dataSource.data)
        this.lodingspinnerid = false;
      },
      error => {
        console.log("error getting badges per user");
        this.lodingspinnerid = false;
      }
    );
  }




  createFilter(): (data: any, filter: string) => boolean {
    let filterFunction = function(data, filter): boolean {
      //console.log(filter);
      let searchTerms = JSON.parse(filter);

      let dataToReturn : boolean = true;

      if (searchTerms.name) {
        dataToReturn = data.name.toString().toLowerCase().indexOf(searchTerms.name.toLowerCase()) !== -1;
      }
      

      if (dataToReturn) {
        if (searchTerms.creator_email) {
          if (data.oubadge.issuer.email.toString().toLowerCase()==searchTerms.creator_email.toString().toLowerCase()) {
            dataToReturn = true;
          }
          else {
            dataToReturn = false;
          }
        }
      }

      return dataToReturn;
       
    }
    return filterFunction;
  }  
  ngOnInit(): void {
    
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;

    this.nameFilter.valueChanges
    .subscribe(
      label => {
        this.filterValues.name = label;
        this.dataSource.filter = JSON.stringify(this.filterValues);
      }
    )


      this.loadAllBadges();

  }

  openCreateAwardDialog() {

    const dialogRef = this.createAwardDialog.open(createAwardDialog_modal, {
      disableClose: true,
      width: '550px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {

      this.loadAllBadges();
    });
    
  }  

  


}

