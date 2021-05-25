import { Component, ComponentFactoryResolver, OnInit, ViewChild } from '@angular/core';

import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort'
import { AuthService } from '../../_services';
import User from '../../_models/user';

//import AcademicOrganisation from '../../_models/academicorganisation';
import { AcademicOrganisationService } from '../../_services/academicorganisation.services';

//import RecruitmentOrganisation from '../../_models/recruitmentorganisation';
import { RecruitmentOrganisationService } from '../../_services/recruitmentorganisation.services';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

import { awardDialog_modal } from '../../_components/award-smart-badge/award-smart-badge.component';

let ELEMENT_DATA: any[] = [];

@Component({
  selector: 'app-my-colleagues',
  templateUrl: './my-colleagues.component.html',
  styleUrls: ['./my-colleagues.component.css']
})
export class MyColleaguesComponent implements OnInit {

  currentUser: User;
  showLoading = true;
  displayedColumns: string[] = ['name', 'surname', 'organizations', 'aqcuired_badges', 'action'];

  //dataSource = ELEMENT_DATA;
  dataSource = new MatTableDataSource(ELEMENT_DATA);

  @ViewChild(MatPaginator, {static: true}) 
  paginator: MatPaginator;  
  
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  constructor(
    private authservice: AuthService,
    private aos: AcademicOrganisationService,
    private ros: RecruitmentOrganisationService,
    public awardDialog: MatDialog
  ) {
    this.authservice.currentUser.subscribe(x => this.currentUser = x);
   }


   openAwardDialog(userId: number, element: any) {
     
    if (element.hasOwnProperty('user_id')) {
       element['user'] = element['user_id'];
    }
    //console.log("userId:"+userId);
    //console.log(element);

   const dialogRef = this.awardDialog.open(awardDialog_modal, {
     width: '550px',
     data: {userId: userId, element: element, source: 'profile'}
   });

   dialogRef.afterClosed().subscribe(result => {
     this.recoverColleagues();
   });

 }

  recoverColleagues() {
    this.showLoading = true;
    this.dataSource.data = [];
    this.dataSource.data = this.dataSource.data.slice();
    //console.log(this.currentUser);
    let id = this.currentUser.id;

    this.aos
    .getAllUserAcademicOrganizationByUserId(id).subscribe(
      data => {
        //console.log(data);
        data.forEach((element, index) => {
          //console.log(element);
          let oid = element.academic_organisation.id;
          let aoTitle = element.academic_organisation.title;

          this.aos
          .getAllUserAcademicOrganizationByOrganizationId(oid).subscribe(
            dataMembersAcademicOrganization => {
              //console.log(dataMembersAcademicOrganization);
              this.showLoading = false;
              //this.dataSource.data = dataMembersAcademicOrganization;
              
              dataMembersAcademicOrganization.forEach((elementUsersAO, index) => {
                //not me
                if (elementUsersAO.user_id.id!=this.currentUser.id) {
                  //check if user exist in the list
                  //const checkUsername = obj => obj.id === elementUsersAO.user_id.id;
                  const index = this.dataSource.data.findIndex(item=> item.id === elementUsersAO.user_id.id);

                  //if (!this.dataSource.data.some(checkUsername)) {
                  if (index==-1) {
                    
                    let elementToAdd = {
                      'id': elementUsersAO.user_id.id, 
                      'name': elementUsersAO.user_id.name, 
                      'surname': elementUsersAO.user_id.surname,
                      'organizations': [aoTitle],
                      'user_id': elementUsersAO.user_id
                    }
                    this.dataSource.data.push(elementToAdd);

                    this.dataSource.data = this.dataSource.data.slice();
                    //ELEMENT_DATA.push(elementUsersAO.user_id);
                  }
                  else {
                    //console.log(this.dataSource.data[index]);
                    this.dataSource.data[index].organizations.push(aoTitle);
                    this.dataSource.data = this.dataSource.data.slice();
                  }
                }
              });
             
            },
            error => {
              alert("Error getting all academic organisations by user id: "+id);                      
            }
          );

        });
      },
      error => {
        this.showLoading = false;
        alert("Error getting all academic organisations by user id: "+id);                      
      }
    );

    this.ros
    .getAllUserRecruitmentOrganizationByUserId(id).subscribe(
      data => {
        //console.log(data);
        if (data.length==0) {
          this.showLoading = false;
        }
        data.forEach((element, index) => {
          
          let roid = element.recruitment_organisation.id;
          let roTitle = element.recruitment_organisation.title;

          this.ros
          .getAllUserRecruitmentOrganizationByOrganizationId(roid).subscribe(
            dataMembersRecruitmentOrganization => {
              this.showLoading = false;
              //console.log(dataMembersRecruitmentOrganization);
              //this.dataSource.data = dataMembersAcademicOrganization;
              
              dataMembersRecruitmentOrganization.forEach((elementUsersRO, index) => {
                //not me
                if (elementUsersRO.user_id.id!=this.currentUser.id) {
                  //check if user exist in the list
                  //const checkUsername = obj => obj.id === elementUsersRO.user_id.id;
                  const index = this.dataSource.data.findIndex(item=> item.id === elementUsersRO.user_id.id);

                  //if (!this.dataSource.data.some(checkUsername)) {
                  if (index==-1) {
                    //console.log(elementUsersRO.user_id);
                    
                    let elementToAdd = {
                      'id': elementUsersRO.user_id.id, 
                      'name': elementUsersRO.user_id.name, 
                      'surname': elementUsersRO.user_id.surname,
                      'organizations': [roTitle],
                      'user_id': elementUsersRO.user_id
                    }
                    this.dataSource.data.push(elementToAdd);
                    this.dataSource.data = this.dataSource.data.slice();
                    //ELEMENT_DATA.push(elementUsersAO.user_id);
                  }
                  else {
                    //console.log(this.dataSource.data[index]);
                    this.dataSource.data[index].organizations.push(roTitle);
                    this.dataSource.data = this.dataSource.data.slice();
                  }
                }
              });
             
            },
            error => {
              alert("Error getting all academic organisations by user id: "+id);                      
            }
          );

        });
        
      },
      error => {
        this.showLoading = false;
        alert("Error getting all recruitment organisations by user id: "+id);
      }
    );

  }
  ngOnInit(): void {

    if(!this.currentUser) {
      this.currentUser={id:0,role:'', userName:'', name:'', surname:'', email:''};
    }

    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.dataSource.data = [];
    this.recoverColleagues();

  }

}
