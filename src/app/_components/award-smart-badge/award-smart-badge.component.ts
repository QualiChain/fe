import {Component, OnInit, ViewChild, Inject } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
//import { MatSnackBar, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { MatDialog } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import {FormControl, FormGroupDirective, NgForm, Validators} from '@angular/forms';

import { UsersService } from '../../_services/users.service';
import { BadgesService } from '../../_services/badges.service';
import { AuthService } from '../../_services/auth.service';
import { OUService } from '../../_services/ou.service'
import { CoursesService } from '../../_services/courses.service';

import Course from '../../_models/course';
//import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import User from '../../_models/user';
import { QCStorageService } from '../../_services/QC_storage.services';
import {PageEvent} from '@angular/material/paginator';


@Component({
  selector: 'app-award-smart-badge',
  templateUrl: './award-smart-badge.component.html',
  styleUrls: ['./award-smart-badge.component.css']
})
/*
export class AwardSmartBadgeComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
}
*/

export class AwardSmartBadgeComponent implements OnInit {
 
  //@ViewChild('closebutton') closebutton;
 
  form: FormGroup;
  /*
  listOfSmartAwards = [
    {id: 1 , title: 'Operating System-Laboratory Exercise'},
    {id: 2 , title: 'Operating Systems-Written Reports'},
    {id: 3 , title: 'Operating Systems-Hackathon'},
    {id: 4 , title: 'Operating Systems-Begginer'},
    {id: 5 , title: 'Operating Systems-Master'}
  ];
  */
  listOfSmartAwards = fulListOfSmartAwards;

  selectedUserAwards: any = [];
  selectedUSer: number;
  courseId: number;
  showLoading: boolean = true;

  constructor(
    private router: Router,
    private cs: CoursesService,
    private ous: OUService,
    private us: UsersService,
    private bs: BadgesService,
    private fb: FormBuilder, private route: ActivatedRoute, public awardDialog: MatDialog, public createAwardDialog: MatDialog) { }


  //displayedColumns: string[] = ['id', 'student', 'semester', 'grade', 'aqcuired_badges', 'action'];
  //displayedColumns: string[] = ['id', 'student', 'grade', 'action'];
  displayedColumns: string[] = ['student', 'grade', 'aqcuired_badges', 'action'];

  dataSource = new MatTableDataSource(ELEMENT_DATA);
  //dataSource = new MatTableDataSource<listOfStudents>([]);

  @ViewChild(MatPaginator, {static: true}) 
  paginator: MatPaginator;  
  
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  
  courseData: Course;

  loadData() {
    this.showLoading = true;
    this.courseData = {courseid: 0, name: "", description: "", semester: "", startDate: "", endDate: "", updateDate: "", skills: [], events: [] };
    this.route.params.subscribe(params => {

      let id:number = 0;      
      if(params.hasOwnProperty('id')){
        id = +params.id;
      }

      if (id>0) {
        console.log(id);

        this.cs
        .getCourse(id).subscribe(
          dataCourse => {
            //console.log("course in db");
            //console.log(dataCourse);
            this.courseData = dataCourse;
          },
          error => {
            this.router.navigate(["/not_found"]);            
          }
        );            
      }

    });

    //this.dataSource.data = ELEMENT_DATA;
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    //this.userAwards.push(0);

    this.route.params.subscribe(params => {
      const id = +params.id;
      //console.log(id);
      this.courseId = id;
    });

    let dataListUsers = [];

    this.cs
    .getEnrolledUserByCourseId(this.courseId).subscribe(
    dataEnrolledUsers => {
      //console.log(dataEnrolledUsers);
      dataEnrolledUsers.forEach(element => {
        if ((element.course_status=='done')) {
         
            let aqcuired_badges_by_user = [];

            /*
            this.bs.getBadgesByUser(element.user.id).subscribe(
              baggesByUser => {
                console.log(element.user.id);
                console.log(baggesByUser);
                
                let dataToPlot = {id: element.user.id , student: element.user.surname+", "+element.user.name, semester: '-', grade: (0+element.course_grade), origin: 'external', aqcuired_badges: baggesByUser}

                dataListUsers.push(dataToPlot);
                ELEMENT_DATA.push(dataToPlot);
                this.dataSource.data = dataListUsers;
                
              },
              error => {
                console.log("error getting badges per user");
              }
            );
            */

            let dataToPlot = {id: element.user.id , student: element.user.surname+", "+element.user.name, semester: '-', grade: (0+element.course_grade), origin: 'external', aqcuired_badges: []}

            dataListUsers.push(dataToPlot);
            ELEMENT_DATA.push(dataToPlot);
            this.dataSource.data = dataListUsers;

            this.showLoading = false;
            /*
            dataListUsers.push({id: element.user.id , student: element.user.surname+", "+element.user.name, semester: '-', grade: (0+element.course_grade), origin: 'external', aqcuired_badges: aqcuired_badges_by_user});
            ELEMENT_DATA.push({id: element.user.id , student: element.user.surname+", "+element.user.name, semester: '-', grade: (0+element.course_grade), origin: 'external', aqcuired_badges: aqcuired_badges_by_user});
            this.dataSource.data = dataListUsers;*/

        }
        
      });

      this.showLoading = false;
    },
    error => {
      this.showLoading = false;
      console.log("error loading data")
    });
  
    
/*      
    this.ous
    .getOUToken()
    .subscribe((
      dataOU: any) => {
      if (dataOU.token) {
        this.ous
        .getRecipientsList(dataOU.token)
        .subscribe((dataSBOU: any) => {
          
          //console.log(dataSBOU);
          //this.listOfSmartAwards = dataSBOU.badges;
          dataSBOU.recipients.forEach(element => {
            console.log(element);
            let aqcuired_badges_by_user = [];
            dataListUsers.push({id: element.id , student: element.name, semester: '-', grade: '-', origin: 'external', aqcuired_badges: aqcuired_badges_by_user});
            ELEMENT_DATA.push({id: element.id , student: element.userName, semester: '-', grade: '-', origin: 'external', aqcuired_badges: aqcuired_badges_by_user});
            this.dataSource.data = dataListUsers;
            
          });

      });

      }
      
      //console.log(this.selectedUserAwards);
    },
    error => {
      console.log("error recovering token");
    }
    );    
*/

    /*
    this.us
      .getUsers()
      .subscribe((data: any) => {
        //this.jobs = data;
        
        
        data.forEach(element => {
          //console.log(element);          

          //dataListUsers.push({id: element.id , student: element.userName, semester: '-', grade: '-', aqcuired_badges: []});
          //this.dataSource.data = dataListUsers;

          
          let aqcuired_badges_by_user = [];
          this.bs
          .getBadgesByUser(element.id)
          .subscribe((data: any) => {
            data.forEach(elementB => {
              aqcuired_badges_by_user.push(elementB.badge);
            });
            dataListUsers.push({id: element.id , student: element.userName, semester: '-', grade: '-', origin: 'internal', aqcuired_badges: aqcuired_badges_by_user});
            ELEMENT_DATA.push({id: element.id , student: element.userName, semester: '-', grade: '-', origin: 'internal', aqcuired_badges: aqcuired_badges_by_user});
            this.dataSource.data = dataListUsers;
          });          
          
        });
        //this.dataSource.data = dataListUsers;
    });
    */

  }

  ngOnInit() {
        
    this.loadData();
    
  }
 
  openAwardDialog(userId: number, element: any) {
    //console.log(userId)
    
   // const dialogRef = this.awardDialog.open(awardDialog_modal);

    const dialogRef = this.awardDialog.open(awardDialog_modal, {
      disableClose: true,
      width: '550px',
      data: {userId: userId, element: element, source: 'award_list', type: 'user'}
    });

    dialogRef.afterClosed().subscribe(result => {

      this.loadData();
    });
    
  }

  openCreateAwardDialog() {

    const dialogRef = this.createAwardDialog.open(createAwardDialog_modal, {
      disableClose: true,
      width: '550px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
    });
    
  }  

}

export interface listOfStudents {
  id: number;
  student: string;
  semester: string,
  grade: string,
  origin: string,
  aqcuired_badges: any
}

const ELEMENT_DATA: listOfStudents[] = [];
/*
const ELEMENT_DATA: listOfStudents[] = [
  {id: 1 , student: 'Dilbert Adams', semester: '6', grade: '-', aqcuired_badges: []},
  {id: 2 , student: 'Dogbert Adams', semester: '8', grade: '9', aqcuired_badges: [1,2,3,4]},
  {id: 3 , student: 'Ratbert Adams', semester: '6', grade: '8', aqcuired_badges: [1,4]},
  {id: 4 , student: 'student X', semester: '3', grade: '2', aqcuired_badges: [2]}
];
*/


@Component({
  selector: 'createAwardDialog',
  //templateUrl: './createAwardDialog.html',
  templateUrl: './createAwardDialogV2.html',
  styleUrls: ['./award-smart-badge.component.css']
})
export class createAwardDialog_modal implements OnInit {
  badgelabel: string;
  badgetitle: string = null;
  badgedescription: string = null;
  badgeissuer: string;

  //badgecriterianarrative: string;
  badgeimageurl: string = null;
  badgeskills: string = null;
  badgeversion: string = null;

  badgeissuername: string = null;
  badgeissuerurl: string = null;
  badgeissueremail: string = null;
  badgeissuertelephone: string = null;
  badgeissuerdescription: string = null;
  badgeissuerimageurl: string = null;

  showErrorMessage: boolean = false;
  errorMessage: string = null;
  currentUser: User;

  smartBadgesTypes = [
    {value: 'PHD', viewValue: 'PHD'},
    {value: 'Undergraduate', viewValue: 'Undergraduate'},
    {value: 'Postgraduate', viewValue: 'Postgraduate'},
    {value: 'Other', viewValue: 'Other'}
  ];
  smartBadgeType = '';

  
  //public myreg = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';
  public myreg = /(^|\s)((https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)/gi;

    
  constructor(
    private ous: OUService,
    private us: UsersService, private bs: BadgesService,
    public authservice: AuthService,
    private qcStorageService: QCStorageService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {

      this.authservice.currentUser.subscribe(x => this.currentUser = x);
      
    }

    getUserData(id:string) {
      
      let currentUserData = JSON.parse(this.qcStorageService.QCDecryptData(localStorage.getItem('currentUserQC')));
      //console.log(currentUserData);
      
      this.badgeissuername = currentUserData.name;
      this.badgeissueremail = currentUserData.email;
      this.badgeissuerimageurl = currentUserData.avatar_path;

      /*
      this.us.getUser(id).subscribe(
        data => {
          let currentUserData = JSON.parse(this.qcStorageService.QCDecryptData(localStorage.getItem('currentUserQC')));
          console.log(currentUserData.avatar_path);
          console.log("user in db");
          console.log(data);
          this.badgeissuername = data.fullName;
          this.badgeissuerurl = "";
          this.badgeissueremail = data.email;
          this.badgeissuertelephone = "";
          this.badgeissuerdescription = "";
          this.badgeissuerimageurl = currentUserData.avatar_path;
        },
        error => {            
          console.log("user not found")            
        }
      );
      */
    }

  ngOnInit() {

    if(!this.currentUser) {    
        this.currentUser={id:0,role:'', userName:'', name:'', surname:'', email:'', gender:''};
    }

    if (this.currentUser.id!=0) {
      this.getUserData(this.currentUser.id.toString());
    }
    
    
  }

  onSubmitCreateNewAwardsModal() {

    this.errorMessage = null;
    this.showErrorMessage = false;

    let smartBadgetData = {
      "title": this.badgetitle,
      "description": this.badgedescription,
      "issuer":{
         "issuername": this.badgeissuername,
         "issuerurl": this.badgeissuerurl,
         "issueremail": this.badgeissueremail,
         "issuertelephone": this.badgeissuertelephone,
         "issuerdescription": this.badgeissuerdescription,
         "issuerimageurl": this.badgeissuerimageurl
      },
      "skills": this.badgeskills,
      "version": this.badgeversion,
      "imageurl": this.badgeimageurl
   }
   
   //console.log(smartBadgetData);

   this.ous
        .createBadgeV2(smartBadgetData).subscribe(
          res => {
            console.log("Badge created");
            console.log(res);
            console.log("We need to send the response to the NTUA's API")

            let smartDadgeData = {
              'type': this.smartBadgeType,
              'oubadge': res
            }
            this.bs.addBadge(smartDadgeData).subscribe(
              resSBNTUA => {
                console.log(resSBNTUA);
                var splitted = resSBNTUA.split("="); 
                var splitted2 = splitted[1].split(" "); 

                let sbId = splitted2[0];
                let mainDataSB = {
                  id: sbId,
                  version: this.badgeversion,
                  name: this.badgetitle,
                  type: this.smartBadgeType,
                  description: this.badgedescription,
                  issuer: this.badgeissuername,
                  image: this.badgeimageurl,
                  oubadge: res,
                  assigned: false,
                  status: '',
                  awardedId: '',
                  ou_metadata: {}
                  }
                console.log(mainDataSB);
                fulListOfSmartAwards.push(mainDataSB);
                if (this.data.badgesList) {
                  this.data.badgesList.push(mainDataSB);
                }
              
              
              document.getElementById("closeCreateAwardModalWindow").click();

              },
              error => {
                //console.log(error);
                this.errorMessage = error.message;
                this.showErrorMessage = true;
                
              });
            
              

              
          },
          error => {
            //console.log(error);
            this.errorMessage = error.message;
            this.showErrorMessage = true;
            
          }
        );

  }

  onSubmitCreateAwardsModal() {

    let dataToSend  = {
      "name": this.badgelabel, 
      "issuer": this.badgeissuer,
      "description": this.badgedescription
    };
  
    this.ous
    .getOUAdminToken()
    .subscribe((
      dataOU: any) => {
      //console.log(dataOU);
      //console.log(dataOU.token);
      if (dataOU.token) {       
        //"issuerid": this.badgeissuer,
        //"version": this.badgeversion
        let dataToSendOU  = {
          "title": this.badgelabel, 
          "issuerid": 7,
          "description": this.badgedescription,
          //"criterianarrative": this.badgecriterianarrative,
          "imageurl": this.badgeimageurl,
          "version": 1
        };

        this.ous
        .createBadge(dataOU.token, dataToSendOU).subscribe(
          res => {
            //console.log("Badge created");
            //console.log(res);
                
            fulListOfSmartAwards.push({id: res.id , name: this.badgelabel, description: this.badgedescription, issuer: this.badgeissuer});
            if (this.data.badgesList) {
              this.data.badgesList.push({id: res.id , name: this.badgelabel, description: this.badgedescription, issuer: this.badgeissuer});
            }
            
            
            document.getElementById("closeCreateAwardModalWindow").click();
          },
          error => {
            alert("Error creating the Badge!!");
          }
        );

        
      }
    }
    );
    
    /*
    this.bs.addBadge(dataToSend).subscribe(
      res => {
        console.log("Badge created");
        var splitted = res.split("=", 2); 
        var splitted2 = splitted[1].split(" ", 2); 

        fulListOfSmartAwards.push({id: splitted2[0] , name: this.badgelabel, description: this.badgedescription, issuer: this.badgeissuer});
        this.data.badgesList.push({id: splitted2[0] , name: this.badgelabel, description: this.badgedescription, issuer: this.badgeissuer});
        
        document.getElementById("closeCreateAwardModalWindow").click();
      },
      error => {
        alert("Error creating the Badge!!");
      }
    );
      */
    

  }
}

@Component({
  selector: 'awardDialog',
  templateUrl: './awardDialog.html',
  styleUrls: ['./award-smart-badge.component.css']
})

export class awardDialog_modal implements OnInit {

  listOfSmartAwards = fulListOfSmartAwards;
  selectedUserAwards: any = [];
  listOfSmartBadgesByUser = [];
  fullDataSmartBadgesByUser = [];
  lodingspinnerid: number = null;
  userDataRec: any = [];
  courseDataRec: any = [];
  pageTitle: string = null;
  currentlistOfBadges: any = [];

  errorMessage: string = null;
  showErrorMessage: boolean = false;
  itemSelected: number = null;

  SBList = [];
  lengthSB: number = 0;
  pageSizeSB: number = 5;
  pagedListSB = [];
  pageSizeOptionsSB: number[] = [this.pageSizeSB];
  
  constructor(
    private router: Router,
    public createAwardDialog: MatDialog,
    private us: UsersService,
    private bs: BadgesService,
    private as: AuthService,
    private ous: OUService,
    private cs: CoursesService,
    public dialogRef: MatDialogRef<awardDialog_modal>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

    OnPageChangeSB(event: PageEvent){
      let startIndex = event.pageIndex * event.pageSize;
      let endIndex = startIndex + event.pageSize;
      if(endIndex > this.lengthSB){
        endIndex = this.lengthSB;
      }
      this.pagedListSB = this.SBList.slice(startIndex, endIndex);
      
      
    }
    
  ngOnInit() {

    this.selectedUserAwards=[];
    
    
    this.listOfSmartAwards=[];

    this.currentlistOfBadges = [];

    //console.log(this.data);
    //getBadgesByUser
    this.bs.getBadges()
      .subscribe(( dataSmatBadges: any) => {
        //console.log (dataSmatBadges);

        dataSmatBadges.forEach(element => {
          //console.log(element);
          this.listOfSmartAwards.push(
            {
            id: element.id,
            name: element.name,
            type: element.type,
            description: element.description,
            issuer: element.issuer,
            image: element.oubadge.image,
            oubadge: element.oubadge,
            assigned: false,
            status: '',
            awardedId: '',
            oubadge_user: {},
            ou_metadata: {}
            }
          );

          this.SBList = this.listOfSmartAwards;
          this.lengthSB = this.SBList.length;
          this.pagedListSB = this.SBList.slice(0, this.pageSizeSB);

        });

        //recover the list of smart badges of the user
        this.bs.getBadgesByUser(this.data.userId)
        .subscribe((assignedSmartBadges: any) => {

          //console.log(assignedSmartBadges);
          assignedSmartBadges.forEach((element, index) => {
            
              //console.log(element);
              this.currentlistOfBadges.push({'badgeid':element});

              this.listOfSmartAwards.forEach((elementBadge, indexBadge) => {
                if (elementBadge.id==element.badge.id) {
                  //console.log(indexBadge+"--"+elementBadge.id+"--"+element.badge.id+"---"+element.status);
                  //this.listOfSmartAwards[indexBadge].status = element.status;
                  this.listOfSmartAwards[indexBadge].status = 'issued';
                  //this.listOfSmartAwards[indexBadge].awardedId = element.id;

                  //console.log(element);
                  //if (element.status=='pending') {
                    this.listOfSmartAwards[indexBadge].assigned = true;

                    this.listOfSmartAwards[indexBadge].oubadge_user = element.oubadge_user;
                    this.listOfSmartAwards[indexBadge].ou_metadata = element.ou_metadata;
                  //}
                  
                }
              });

            
            
          });

        }, 
        error => {
          console.log("error recovering list of smart badges per user")
        });
        
      },
      error => {
        console.log("error recovering smart badges")
      }
    );    
    

    //console.log(this.data);
    if (this.data.element.student) {
      this.userDataRec.userName = this.data.element.student;      
      
    }

      if (this.data.userId) {
        this.us
        .getUser(this.data.userId).subscribe(
          data => {
            //console.log("user in db");      
            this.userDataRec = data;
            this.pageTitle = this.userDataRec.userName;
          },
          error => {
            console.log("user not found in db");                        
          }
        );
      }
      else if (this.data.courseId) {
        this.cs
        .getCourse(this.data.courseId).subscribe(
          data => {
            this.courseDataRec = data;
            this.pageTitle = this.courseDataRec.name;
          },
          error => {
            console.log("couse not found in db");                        
          }
        );
      }
      
    
    

  }

  resetErrorMessages(i) {
    this.errorMessage = null;
    this.showErrorMessage = false;
    this.itemSelected = null;
    this.lodingspinnerid = i;
  }

  verifySmartBadge(smartBadgeData, i) { 
    console.log("verifySmartBadge");
    console.log("data In:");
    console.log(smartBadgeData);
    //let dataBadgetStored = {"badge":{"@context":["https://w3id.org/openbadges/v2",{"@vocab":"https://blockchain.open.ac.uk/vocab/"}],"type":"Assertion","recipient":{"type":"email","hashed":true,"salt":"deadsea","name":"Dan Brown","email":"dan.brown@outlook.com","identity":"sha256$584ea33cdc8032a02642bae032c578dd97471b537bb82059f943b1a74c4b45da"},"badge":{"type":"BadgeClass","name":"qwerty","description":"description querty","image":"https://qualichain-project.eu/quali-data/uploads/2019/04/lightbulb-150x150.png","version":"33","criteria":{"type":"Criteria","narrative":"The holder of this badge has achieved great things in QualiChain","skills":"skills"},"issuer":{"type":"Issuer","name":"professor","description":"this is my desscription","url":"https://qualichain-project.eu/news/","email":"professor@tecnico.ulisboa.pt","image":"https://qualichain-project.eu/quali-data/themes/qualichain/assets/img/qualichain-icon-white.png","telephone":"935558789"}},"issuedOn":1612257596363,"verification":{"type":"MerQLVerification2020"},"signature":{"type":"ETHMerQL","address":"0xBa3883d8e6397919656dFE9a63cF96235eC5349d","account":"0x1cf67BCCD5377aF1a69BadA19D699BCBa805E3f6","indexhash":"828d71d36fdb50b5b5d6cd4829852ca5cf19f044cb1bd941c0c14f48752bc75b","settings":{"quadHash":"KECCAK-256","treeHash":"KECCAK-256","indexHash":"KECCAK-256","lsd":2,"indexType":"object","divisor":"0xa"},"transactionhash":"0x82d7b911d2fb8572166cb6b7bb9025a99b89534a1f0133f777b39dcb8620e9af"}},"metadata":{"@context":{"@vocab":"https://blockchain.open.ac.uk/vocab/"},"merkletrees":{"indexhash":"828d71d36fdb50b5b5d6cd4829852ca5cf19f044cb1bd941c0c14f48752bc75b","indexhashalg":"KECCAK-256","treesettings":{"quadHash":"KECCAK-256","treeHash":"KECCAK-256","indexHash":"KECCAK-256","lsd":2,"indexType":"object","divisor":"0xa"},"trees":{"@list":[{"merkletreeid":"0","treehashalg":"KECCAK-256","merkleroot":"7ba4aa6057542ca81cf5698c88dc308ba92b44c614cca73320b04fd831e96356","merkleleaves":{"leafhashalg":"KECCAK-256","leaves":{"@list":["7ba4aa6057542ca81cf5698c88dc308ba92b44c614cca73320b04fd831e96356"]}}},{"merkletreeid":"1","treehashalg":"KECCAK-256","merkleroot":"7618aee3dc2df7abd5fec55bfbca87820ea5712eb7d37ca27e0731c0e5ea4a03","merkleleaves":{"leafhashalg":"KECCAK-256","leaves":{"@list":["ce9996c044d81ade6ac770f97930ac01a08436bb530461820ac483748a89f6f5","1cc697889fec46521c92474bd6bdfe5a7081a7a6bf9eaf67be9ba7089730e5e5"]}}},{"merkletreeid":"10","treehashalg":"KECCAK-256","merkleroot":"2ca417a0bb543d63a8c59b1344db70f0bc2f1f7e010ea999148be79913e97bf5","merkleleaves":{"leafhashalg":"KECCAK-256","leaves":{"@list":["2ca417a0bb543d63a8c59b1344db70f0bc2f1f7e010ea999148be79913e97bf5"]}}},{"merkletreeid":"11","treehashalg":"KECCAK-256","merkleroot":"aee99114903a13d184c138f07fe538b8e3eb77db9c4e98c0f6f706fe6c28adff","merkleleaves":{"leafhashalg":"KECCAK-256","leaves":{"@list":["57d9d9dd80192d02d5f8fb76d7f420d5769af19f64e9eb6a01fe5a011a4a0fca","d025fb5e0d891669a05c31ae9f5083ea3a858b75a5bc276c3b358c47da75d51e"]}}},{"merkletreeid":"12","treehashalg":"KECCAK-256","merkleroot":"2ee02d37b8775e7159ddd36ec7a13d45f7bd331cfe3550d365ddd78d184c0f39","merkleleaves":{"leafhashalg":"KECCAK-256","leaves":{"@list":["5c340f2d12ddf6c169edd503899965f12f07e1fb54ef6d7f71d8ac31fe04a35f","6f449db246a58ab319e46ae8b7a771cb306c2c6253bb94eeb0ee58c0895ed108","429aab0c4af69ec8464b9b53752fc668399d8c38b3b8fbbb7fc78b944ed9c0c9"]}}},{"merkletreeid":"13","treehashalg":"KECCAK-256","merkleroot":"1c93c2c4e804f204a8e07f451aaf3be48736d139bb1772290564018f3d598a3c","merkleleaves":{"leafhashalg":"KECCAK-256","leaves":{"@list":["ea297e58e03e342945c7ed07f57bdad211f22fac60a89f4a62c8952d302e02b9","6473500bdf59590d7ea63fb7630f477469a00993d5c01dfeb1bf9d48d6a25d36","0c577aa06bf21496cddd6373b92b2f801a33915a9ff7fe748b7bcb8b6857aa7c"]}}},{"merkletreeid":"15","treehashalg":"KECCAK-256","merkleroot":"a9d9ef7afcd7f11433fecc42d53739719644584ca34a62178f5fbf31ad035286","merkleleaves":{"leafhashalg":"KECCAK-256","leaves":{"@list":["a9d9ef7afcd7f11433fecc42d53739719644584ca34a62178f5fbf31ad035286"]}}},{"merkletreeid":"16","treehashalg":"KECCAK-256","merkleroot":"ba6307002d70b71f78a8153ad7909e10039bc8854ef47c9839071714dc11d20e","merkleleaves":{"leafhashalg":"KECCAK-256","leaves":{"@list":["ba6307002d70b71f78a8153ad7909e10039bc8854ef47c9839071714dc11d20e"]}}},{"merkletreeid":"17","treehashalg":"KECCAK-256","merkleroot":"7a87e8d151da23aec8595a993f8571db2869db10b0a0e350539144858657f527","merkleleaves":{"leafhashalg":"KECCAK-256","leaves":{"@list":["7a87e8d151da23aec8595a993f8571db2869db10b0a0e350539144858657f527"]}}},{"merkletreeid":"18","treehashalg":"KECCAK-256","merkleroot":"14c12a53242a0d22f10e3e66a74d491fbe39aa7f9c22cfdcf2dbcf50a7ba9b32","merkleleaves":{"leafhashalg":"KECCAK-256","leaves":{"@list":["14c12a53242a0d22f10e3e66a74d491fbe39aa7f9c22cfdcf2dbcf50a7ba9b32"]}}},{"merkletreeid":"19","treehashalg":"KECCAK-256","merkleroot":"aa67bf2375a1805d7af6b717bf5bb9d0750144c47a7721d3355d289178079977","merkleleaves":{"leafhashalg":"KECCAK-256","leaves":{"@list":["aa67bf2375a1805d7af6b717bf5bb9d0750144c47a7721d3355d289178079977"]}}},{"merkletreeid":"2","treehashalg":"KECCAK-256","merkleroot":"d9dc27aa379c02a2b72b016aced6f0faea57162180d5fc62bd055ab1c702e64a","merkleleaves":{"leafhashalg":"KECCAK-256","leaves":{"@list":["1479929681ab03c9131f6ec3005b6c87e2cc45b37197aeb314ebbebc3a4f14da","db5771ea2ca20986eb3c37555d064a6796b65be1a036376cc631ac9504bf8632","d9966835410ba6a2cb365399d3877f10cf9ae2afac32d65ac8189ccee90470b3"]}}},{"merkletreeid":"20","treehashalg":"KECCAK-256","merkleroot":"79f8078145cea10ae73250b0a255ade09cdfbb2dbe4da10f2cc057c4ef250b91","merkleleaves":{"leafhashalg":"KECCAK-256","leaves":{"@list":["f9d9447df6cf8f26f0787fce8cb8dac2880c923c537e3d3174749e886f854c6a","76112cb60fedb0331850d221da8b8f5ea661e07b2daf7ab1886f3e0f6b658857"]}}},{"merkletreeid":"21","treehashalg":"KECCAK-256","merkleroot":"be2e6f028bf5ce515e40d41c189293ac6a123ba8ab6ee93953a07ebc5e199b48","merkleleaves":{"leafhashalg":"KECCAK-256","leaves":{"@list":["be2e6f028bf5ce515e40d41c189293ac6a123ba8ab6ee93953a07ebc5e199b48"]}}},{"merkletreeid":"22","treehashalg":"KECCAK-256","merkleroot":"a963893515dd3437ac79865066eecee0da5f0beda68fa010ce8e6017b554d5a1","merkleleaves":{"leafhashalg":"KECCAK-256","leaves":{"@list":["7accc37b4396d50320e032dcb735f909949fe897827caf758e7454bc5b0408c6","e2d342a6aa35eead56c794e058f0b6497c80b9c8f0232c87357601e677fe1918","8b1aac7c8f2b1a090f4c285ab0eab20e2c9c9d5c0cde4571b6b63184bacf6150","98ea81edc314aee8ea8f1b56c820f2f6f51b5edf43930a158d566a8423081006","97ba9467c90a8409e1c5063328a4141c0736c4f955dc95a9c17950f0822f07fb"]}}},{"merkletreeid":"23","treehashalg":"KECCAK-256","merkleroot":"70cee5c2f14913fbccf2c16fa6dc1e1f78143c50617b4190d705356423436627","merkleleaves":{"leafhashalg":"KECCAK-256","leaves":{"@list":["086c9c7b914752a938130e3644112f509a45d895a8f0a61f2fac79198a3fff54","40321df8e2f1bd9bb926b12284965a4ff0f92df116d50f7c9ff2e06048f25d2e"]}}},{"merkletreeid":"24","treehashalg":"KECCAK-256","merkleroot":"52ded73c9b634f8d819dcad4b02db08ddec59d3ebc06c9d9d0ee34b0c84100a3","merkleleaves":{"leafhashalg":"KECCAK-256","leaves":{"@list":["52ded73c9b634f8d819dcad4b02db08ddec59d3ebc06c9d9d0ee34b0c84100a3"]}}},{"merkletreeid":"3","treehashalg":"KECCAK-256","merkleroot":"c7470cfa85de045857925584d98f9295913fb116ff442854859ce2c8073f7b6e","merkleleaves":{"leafhashalg":"KECCAK-256","leaves":{"@list":["c7470cfa85de045857925584d98f9295913fb116ff442854859ce2c8073f7b6e"]}}},{"merkletreeid":"4","treehashalg":"KECCAK-256","merkleroot":"61df1e98e283a4de9e1b885f32ecc000faf5a1f826b64e9d4a8e1a544534ba85","merkleleaves":{"leafhashalg":"KECCAK-256","leaves":{"@list":["61df1e98e283a4de9e1b885f32ecc000faf5a1f826b64e9d4a8e1a544534ba85"]}}},{"merkletreeid":"5","treehashalg":"KECCAK-256","merkleroot":"96e7ea3dbe0f694153576e2683b8f6ebf85c829914bdf8a7010243b38f504511","merkleleaves":{"leafhashalg":"KECCAK-256","leaves":{"@list":["9291675eea0c603b92f18f18b1d117d09907f949a6fa62c1ec39e1c867076bb5","4ade87a2c5b3e96bc2af79dd46db3f25feb9f68ecb3351834015aa585706d87e","db979fa6c74c391fcdf96f3741cf14a4483987fce541f6bafdce3cc459e6095a"]}}},{"merkletreeid":"7","treehashalg":"KECCAK-256","merkleroot":"628bf5f935b0e5ba57f2646f3da5aad28abd5276d9ab72ae20454952625aebd2","merkleleaves":{"leafhashalg":"KECCAK-256","leaves":{"@list":["99aaca89fc7657c4336af88d931aeb9638bf1806e1df773280b5c8c02a7febcc","5d86f60c46161bea340b36322508ad908b7b2f9527aa0e33af0c7ddf5fc8421b"]}}},{"merkletreeid":"8","treehashalg":"KECCAK-256","merkleroot":"b01c28abc7ad668cd60cd5feb21d3b8ee4d4223be0cac48bd82f3f5494517f8d","merkleleaves":{"leafhashalg":"KECCAK-256","leaves":{"@list":["cfe2e341e6b0f6dbf5a57d8baaddf186db91a47190e0bfa5535a736259c899b8","1c1a1d2c78be633d601fcc1a18d8f6a7e0c5386d0c933dace048e1da137fbefa"]}}},{"merkletreeid":"9","treehashalg":"KECCAK-256","merkleroot":"3074f426f0bacc5a6fc280de6a2ee244cacf79bdefed95e0a0b2dd137bf095cc","merkleleaves":{"leafhashalg":"KECCAK-256","leaves":{"@list":["4facf4fb68136a11df2e4df3334c333d71ab810b9970c2924c1a09341ef7b0a1","1234b7118358c3439022dc057f7d2a7626da9fff2ad73f99f2a4a988bf4fc97f"]}}}]},"anchor":{"type":"ETHMerQL","address":"0xBa3883d8e6397919656dFE9a63cF96235eC5349d","account":"0x1cf67BCCD5377aF1a69BadA19D699BCBa805E3f6","indexhash":"828d71d36fdb50b5b5d6cd4829852ca5cf19f044cb1bd941c0c14f48752bc75b","settings":{"quadHash":"KECCAK-256","treeHash":"KECCAK-256","indexHash":"KECCAK-256","lsd":2,"indexType":"object","divisor":"0xa"},"transactionhash":"0x82d7b911d2fb8572166cb6b7bb9025a99b89534a1f0133f777b39dcb8620e9af"}}}};
    //let dataBadgetStored = {"badge":{"@context":["https://w3id.org/openbadges/v2",{"@vocab":"https://blockchain.open.ac.uk/vocab/"}],"type":"Assertion","recipient":{"type":"email","hashed":true,"salt":"deadsea","name":"panagiotis panagiotis","email":"example1@gmail.com","identity":"sha256$a663d3d7423df8fcd82563c6b251b1dcc4634a0f3bf6973941acb295e0a2fce1"},"badge":{"type":"BadgeClass","name":"new test","description":"this is another test","image":"https://qualichain-project.eu/quali-data/uploads/2019/04/training.png","version":"1","criteria":{"type":"Criteria","narrative":"The holder of this badge has achieved great things in QualiChain","skills":"skills"},"issuer":{"type":"Issuer","name":"Miquel","description":"this is the issuer desciption","url":"https://qualichain-project.eu/","email":"professor@tecnico.ulisboa.pt"}},"issuedOn":1612277572247,"verification":{"type":"MerQLVerification2020"},"signature":{"type":"ETHMerQL","address":"0xBEFD92CFefeE5658Ab60478ac28B6b24bA0b0400","account":"0x1cf67BCCD5377aF1a69BadA19D699BCBa805E3f6","indexhash":"834c7978fd0e9f10b8d538865af4d28dd6b9861da8f509f883b645209ca1d982","settings":{"quadHash":"KECCAK-256","treeHash":"KECCAK-256","indexHash":"KECCAK-256","lsd":2,"indexType":"object","divisor":"0xa"},"transactionhash":"0xfa24a90074d14526649b00ee6dff0e92012d09860ae9ef315b61bf1757b8b583"}},"metadata":{"@context":{"@vocab":"https://blockchain.open.ac.uk/vocab/"},"merkletrees":{"indexhash":"834c7978fd0e9f10b8d538865af4d28dd6b9861da8f509f883b645209ca1d982","indexhashalg":"KECCAK-256","treesettings":{"quadHash":"KECCAK-256","treeHash":"KECCAK-256","indexHash":"KECCAK-256","lsd":2,"indexType":"object","divisor":"0xa"},"trees":{"@list":[{"merkletreeid":"0","treehashalg":"KECCAK-256","merkleroot":"355f751f83b41b5d4036034bc2cc42d22f1040c5240b0b44793b0b072f556c31","merkleleaves":{"leafhashalg":"KECCAK-256","leaves":{"@list":["0ceeec7bc26c1f2cf6b76340d0d6f363fb7e41afba1dc2e2af8b175d5b01d688","bbda34ddabd9ebfbb5a86fd9e9bf2dcaf1ef195ba085f317828c877aaa694a81"]}}},{"merkletreeid":"1","treehashalg":"KECCAK-256","merkleroot":"d730826eacc20e727e3d7b5a718091c31404601da545b9abf3696e707519d11e","merkleleaves":{"leafhashalg":"KECCAK-256","leaves":{"@list":["c5a64d52cd58d1d3d47b1073d140450b2b17d3a6ff639f97a6f667995d809ecf","442e65804b0fad3605b490046ae7b35aa0cc94732294ce8501c2681b70876983"]}}},{"merkletreeid":"11","treehashalg":"KECCAK-256","merkleroot":"294f0f9a3d9bd23ca743bf866b873e065889b327382cf7cd65800d3322c7809b","merkleleaves":{"leafhashalg":"KECCAK-256","leaves":{"@list":["10215fd4b29a45ad3aab4cf1ff4b3dbdfc0dfe76e7fb3ebed06828a4d69a4e10","d025fb5e0d891669a05c31ae9f5083ea3a858b75a5bc276c3b358c47da75d51e"]}}},{"merkletreeid":"12","treehashalg":"KECCAK-256","merkleroot":"25eefe06c6a61c445da121ea2455971f92028a6cfc230c2369e78af7c30a76cb","merkleleaves":{"leafhashalg":"KECCAK-256","leaves":{"@list":["389348110eb9a32d2ef6b8ba4b05b05d3b2fd6cf7eb43e4cac3b520c94d32096","352f7d50f035417d753217e8f96409ddf4d43e59795075eedc0ba9b9735ef13b","49aa0a6da2aad1b357a2ac8affdfacd450f1239ebc6a1f895851b1dd7f291338"]}}},{"merkletreeid":"13","treehashalg":"KECCAK-256","merkleroot":"59c35bb8ee047b9024bf40477d6fce9512e7761fdc8616fa3918af914b3e9d9c","merkleleaves":{"leafhashalg":"KECCAK-256","leaves":{"@list":["44abce3fcf8aabb527cbcc7d1be97996b1271e13d225ec0799efe506f2b816ba","8cc97c8787d85942c2bb75820accdefddff5fdecb6234f3e5ccea01c7e6e0ddc","030f2eb04818a730c777a343c8b7f98c9de84cb67db819b459cd0f26541aee05","35090082934682c2bbe6c6a1b9522c7ed08b341b51437a0fc3411c86042d4485"]}}},{"merkletreeid":"17","treehashalg":"KECCAK-256","merkleroot":"debe24cc1cec9cae909f8ce98eb4da0ee55165f9b3851c72ef92d0c3f8d7f02a","merkleleaves":{"leafhashalg":"KECCAK-256","leaves":{"@list":["debe24cc1cec9cae909f8ce98eb4da0ee55165f9b3851c72ef92d0c3f8d7f02a"]}}},{"merkletreeid":"18","treehashalg":"KECCAK-256","merkleroot":"46ce2039f4b00415a3d610440d5347b96729e713e5686466e52e2c9747df2bb5","merkleleaves":{"leafhashalg":"KECCAK-256","leaves":{"@list":["653ea51bcaa5d65293ff58be9f95235c87aec76f5377b3f87735978a45ddd50e","999ea398c37e47b09418cf7b948860d2a8af09b08b048c09631601972b7e314d"]}}},{"merkletreeid":"19","treehashalg":"KECCAK-256","merkleroot":"aa67bf2375a1805d7af6b717bf5bb9d0750144c47a7721d3355d289178079977","merkleleaves":{"leafhashalg":"KECCAK-256","leaves":{"@list":["aa67bf2375a1805d7af6b717bf5bb9d0750144c47a7721d3355d289178079977"]}}},{"merkletreeid":"2","treehashalg":"KECCAK-256","merkleroot":"ec181000c1d861fbdc1c56b0369b8a572cfec474aad03ac1c2c40e4489224e79","merkleleaves":{"leafhashalg":"KECCAK-256","leaves":{"@list":["478cacad279899761d245f46c4be8076b8dda6dcda7bf797dcc8db1382bb2aaa","12cd4d310a1f0b8ecf93df19c1dd84e66d527bc904d3c8568a7b443d95e090e7","7a0e521e74412f97d32f0e0641bc35ca215cd11b2aa9ba9f0ba7ea331b3cdee8","c97413f0e2c57c9657e5e59f13782bead1c010f25261f31399a790c3b7984378","b28ca93012ad0d7d0046945449a47c379e41c93991e09b53eec16fa059ad0d27"]}}},{"merkletreeid":"21","treehashalg":"KECCAK-256","merkleroot":"dc29a39aa3f9a88a17b8842268fbfdbdbf040da13bf89d821bad36a4dc8f366f","merkleleaves":{"leafhashalg":"KECCAK-256","leaves":{"@list":["dc29a39aa3f9a88a17b8842268fbfdbdbf040da13bf89d821bad36a4dc8f366f"]}}},{"merkletreeid":"22","treehashalg":"KECCAK-256","merkleroot":"4dd3b24af700600e5dfe9048574bfb84ddfba41bc025f526e53273c0f92b3e23","merkleleaves":{"leafhashalg":"KECCAK-256","leaves":{"@list":["a53b65f29ce10e7fab4e0050213b42ae81a9f7625a3f64c32f166668f478f1ce","6835ae87d18022c4a1150bb7382b16ec16b9d7b6bd2c1a59cc5dc5ca169065e0","a7ad70274200e016d64be1c01f6d86e7174ea45f8cf2e9070de919f256bc9d2b","586294a303a9dacd3a4764f6078c0819f9ec4dc811713ff5da2ba3949be1c99f"]}}},{"merkletreeid":"23","treehashalg":"KECCAK-256","merkleroot":"996f0bb7526bc28f753c1e52dc343865b4a1e929131d59afbb4b1efef2a8470f","merkleleaves":{"leafhashalg":"KECCAK-256","leaves":{"@list":["3bd8e12e6ae0e538c1bcf1fb063d5887ae5119425df8215e36d2c01f72394214","abc68af0b73aced254fd7dc4c0fadeb28e24f2436ebf41f52542bb76c9dfa01d"]}}},{"merkletreeid":"3","treehashalg":"KECCAK-256","merkleroot":"05f3e5827aef48a8a7d3c36c3bee4ac221dddfae056925736fc533d64cb42d6a","merkleleaves":{"leafhashalg":"KECCAK-256","leaves":{"@list":["05f3e5827aef48a8a7d3c36c3bee4ac221dddfae056925736fc533d64cb42d6a"]}}},{"merkletreeid":"4","treehashalg":"KECCAK-256","merkleroot":"f732f16f097c6c0a95a6b444f150584655652067766d8127f4a48771e957b2dc","merkleleaves":{"leafhashalg":"KECCAK-256","leaves":{"@list":["f732f16f097c6c0a95a6b444f150584655652067766d8127f4a48771e957b2dc"]}}},{"merkletreeid":"5","treehashalg":"KECCAK-256","merkleroot":"4301fd5d785286f92c0103dfe132343c1be9bc394bd29bedddc334be700dae93","merkleleaves":{"leafhashalg":"KECCAK-256","leaves":{"@list":["b25e53f76da1dcf7603d0fe95326a15e0479264c47eef424884abd9485ea4afe","391cf413817a81a5bf3779185f198a0c025ac8a0a2e7fe1497bfaa5824215398","eed58ad02f4a5d7af03106a1af664b5a7fc4f3ead2369a6186dd17c7e4574002","db979fa6c74c391fcdf96f3741cf14a4483987fce541f6bafdce3cc459e6095a"]}}},{"merkletreeid":"7","treehashalg":"KECCAK-256","merkleroot":"4c7962682449f46453f0f49a3e9bac38e1604a869302aa85211dbdc6761e8747","merkleleaves":{"leafhashalg":"KECCAK-256","leaves":{"@list":["4c7962682449f46453f0f49a3e9bac38e1604a869302aa85211dbdc6761e8747"]}}},{"merkletreeid":"8","treehashalg":"KECCAK-256","merkleroot":"a8d866c84397d61ced072fd595c24a25afb036d885becda9076e5838c6ace3b6","merkleleaves":{"leafhashalg":"KECCAK-256","leaves":{"@list":["a8d866c84397d61ced072fd595c24a25afb036d885becda9076e5838c6ace3b6"]}}},{"merkletreeid":"9","treehashalg":"KECCAK-256","merkleroot":"89d2229abc20c9500507365f94e986e03b379b6e4287328105e3c3fb181e7d45","merkleleaves":{"leafhashalg":"KECCAK-256","leaves":{"@list":["cd04043476d6963cb7b85bd22efd116e5053600ee0e74e5826a18d75f0b2bdfb","48f49e5cc9dcc2b8e66012d3b7187fec6e433427cbca8024ac8f7545c3832d5b","98ad5096f466856deeacb97f380484942a54f9290e316bdee7bc19cd9c21e25d"]}}}]},"anchor":{"type":"ETHMerQL","address":"0xBEFD92CFefeE5658Ab60478ac28B6b24bA0b0400","account":"0x1cf67BCCD5377aF1a69BadA19D699BCBa805E3f6","indexhash":"834c7978fd0e9f10b8d538865af4d28dd6b9861da8f509f883b645209ca1d982","settings":{"quadHash":"KECCAK-256","treeHash":"KECCAK-256","indexHash":"KECCAK-256","lsd":2,"indexType":"object","divisor":"0xa"},"transactionhash":"0xfa24a90074d14526649b00ee6dff0e92012d09860ae9ef315b61bf1757b8b583"}}}};
    //let dataBadgetStored = {"badge":{"@context":["https://w3id.org/openbadges/v2",{"@vocab":"https://blockchain.open.ac.uk/vocab/"}],"type":"Assertion","recipient":{"type":"email","hashed":true,"salt":"deadsea","name":"panagiotis panagiotis","email":"example1@gmail.com","identity":"sha256$a663d3d7423df8fcd82563c6b251b1dcc4634a0f3bf6973941acb295e0a2fce1"},"badge":{"type":"BadgeClass","name":"qwerty","description":"description querty","image":"https://qualichain-project.eu/quali-data/uploads/2019/04/lightbulb-150x150.png","version":"33","criteria":{"type":"Criteria","narrative":"The holder of this badge has achieved great things in QualiChain","skills":"skills"},"issuer":{"type":"Issuer","name":"professor","description":"this is my desscription","url":"https://qualichain-project.eu/news/","email":"professor@tecnico.ulisboa.pt","image":"https://qualichain-project.eu/quali-data/themes/qualichain/assets/img/qualichain-icon-white.png","telephone":"935558789"}},"issuedOn":1612340099849,"verification":{"type":"MerQLVerification2020"},"signature":{"type":"ETHMerQL","address":"0xF952774372a8F2FaEE96D9b329887beE79D413EB","account":"0x1cf67BCCD5377aF1a69BadA19D699BCBa805E3f6","indexhash":"1aea24d6d18714cc9a35e91dddc80f45e7fcdc586cf7cf77d046d797bf473f0a","settings":{"quadHash":"KECCAK-256","treeHash":"KECCAK-256","indexHash":"KECCAK-256","lsd":2,"indexType":"object","divisor":"0xa"},"transactionhash":"0x75a7129b6ab1af0ee71b5c8f1befd1c9657007c2b661590d056d337bdd386626"}},"metadata":{"@context":{"@vocab":"https://blockchain.open.ac.uk/vocab/"},"merkletrees":{"indexhash":"1aea24d6d18714cc9a35e91dddc80f45e7fcdc586cf7cf77d046d797bf473f0a","indexhashalg":"KECCAK-256","treesettings":{"quadHash":"KECCAK-256","treeHash":"KECCAK-256","indexHash":"KECCAK-256","lsd":2,"indexType":"object","divisor":"0xa"},"trees":{"@list":[{"merkletreeid":"0","treehashalg":"KECCAK-256","merkleroot":"0a0b8ceacb7b7112702232250a7b0ae04d1a271c009ffd1a55b1f9c9c7fd4fce","merkleleaves":{"leafhashalg":"KECCAK-256","leaves":{"@list":["7ba4aa6057542ca81cf5698c88dc308ba92b44c614cca73320b04fd831e96356","44185216ff01555bc395e9521c3d2efbb11fba5fd1fc68f39087cc094919d4f7"]}}},{"merkletreeid":"1","treehashalg":"KECCAK-256","merkleroot":"b394cbb3a61a733b208abceb113d310710e806acbc10ebb5c1ea9a2e520eee6d","merkleleaves":{"leafhashalg":"KECCAK-256","leaves":{"@list":["ce9996c044d81ade6ac770f97930ac01a08436bb530461820ac483748a89f6f5","ad35d09ce61d7935e18822b17f3548a089e694b81190306abd88d373ee06b27d"]}}},{"merkletreeid":"11","treehashalg":"KECCAK-256","merkleroot":"c705a3f38294595899bbb4f0c622e7a51e445c5b9b54863eb1778ea113292118","merkleleaves":{"leafhashalg":"KECCAK-256","leaves":{"@list":["c705a3f38294595899bbb4f0c622e7a51e445c5b9b54863eb1778ea113292118"]}}},{"merkletreeid":"12","treehashalg":"KECCAK-256","merkleroot":"a30d13102bd2b16f828afa211461d1d800832d0e22922593cf5bc74ba3cc1233","merkleleaves":{"leafhashalg":"KECCAK-256","leaves":{"@list":["5110b33c4bd84450c9be8023607106b99785ffd39911e91433e28014ae73e937","352f7d50f035417d753217e8f96409ddf4d43e59795075eedc0ba9b9735ef13b","49aa0a6da2aad1b357a2ac8affdfacd450f1239ebc6a1f895851b1dd7f291338"]}}},{"merkletreeid":"13","treehashalg":"KECCAK-256","merkleroot":"6c04d074392cd57b861a719e2a75ed19b845f9a3fccdcaf43e9b8bd61000a1e4","merkleleaves":{"leafhashalg":"KECCAK-256","leaves":{"@list":["885ad7f2bb026a474731c31f9af862457cbc7bbb66eb2780c5648c9b8b062c2b","ffdfbdcb90930e415dec17e2237e04504433150e9a6d63af4e776a77863250eb","bace959956491538b8d23f602b543c4fe08f2ea002d7610cddb677754fd69014"]}}},{"merkletreeid":"14","treehashalg":"KECCAK-256","merkleroot":"fd059ee9d2707ffd648aa29cfb45de8323d37c3d3f0c08400f324fba5bf1844f","merkleleaves":{"leafhashalg":"KECCAK-256","leaves":{"@list":["fd059ee9d2707ffd648aa29cfb45de8323d37c3d3f0c08400f324fba5bf1844f"]}}},{"merkletreeid":"15","treehashalg":"KECCAK-256","merkleroot":"e038b856882cd97b7fe8e955fb8fa94c141f9de89d34149f4017fcf913980dc7","merkleleaves":{"leafhashalg":"KECCAK-256","leaves":{"@list":["e038b856882cd97b7fe8e955fb8fa94c141f9de89d34149f4017fcf913980dc7"]}}},{"merkletreeid":"16","treehashalg":"KECCAK-256","merkleroot":"283fefaf5ce6aa83d5deda255be2ea625468004d01204ba115a4782e0e60f39a","merkleleaves":{"leafhashalg":"KECCAK-256","leaves":{"@list":["283fefaf5ce6aa83d5deda255be2ea625468004d01204ba115a4782e0e60f39a"]}}},{"merkletreeid":"17","treehashalg":"KECCAK-256","merkleroot":"517114c1836337f5ddd5a947eaa34b2fdcdc033f2f1ecb894f628b5736653314","merkleleaves":{"leafhashalg":"KECCAK-256","leaves":{"@list":["d1fd030192515cf7430238e6bff8465c529412c4084054bf333d17fe5b61f21e","66b3bccc42e94fd5c7afe8f56b139511b517936c702c7d9c9b00840eb6d608fc"]}}},{"merkletreeid":"18","treehashalg":"KECCAK-256","merkleroot":"bae022e4b0a91990fa181d66d1582ec79990af4a2fb9496b9e37d09bd8d0de4e","merkleleaves":{"leafhashalg":"KECCAK-256","leaves":{"@list":["bae022e4b0a91990fa181d66d1582ec79990af4a2fb9496b9e37d09bd8d0de4e"]}}},{"merkletreeid":"19","treehashalg":"KECCAK-256","merkleroot":"cfc8f46954989267615032ff15ebc66474b6e523ca34c109548f3c4a55f1f45c","merkleleaves":{"leafhashalg":"KECCAK-256","leaves":{"@list":["cfc8f46954989267615032ff15ebc66474b6e523ca34c109548f3c4a55f1f45c"]}}},{"merkletreeid":"2","treehashalg":"KECCAK-256","merkleroot":"90198d5411c4c1fdffa77f7382d2bc29604f6de918606af5bb7305650429fb3f","merkleleaves":{"leafhashalg":"KECCAK-256","leaves":{"@list":["2cfa450eef1b47f80db4443d54876b9948d9127f9304d800989a22eddb6cd8fe","825de2fc0c4e6be64cba6151c0c8a367b0af03bdff0643cbc3fe9b7deaf80548","2572995274426b541ab8c1adc0f8f0ab6a7a44134607e9a6383e764fe8e6721d"]}}},{"merkletreeid":"20","treehashalg":"KECCAK-256","merkleroot":"9d7ef2125e63663628df2dc777b42b54fccbde13b3f262033a97e9b6a9a19458","merkleleaves":{"leafhashalg":"KECCAK-256","leaves":{"@list":["f9d9447df6cf8f26f0787fce8cb8dac2880c923c537e3d3174749e886f854c6a","95377f85c9c4a9cc86d8c549e044a33662e15cde6d31529473c525603d23d4b8","c5817b15611313416ab7f9d0db7b0c1b6d01c884975a385d0b8ec334f90bdb9b"]}}},{"merkletreeid":"21","treehashalg":"KECCAK-256","merkleroot":"be2e6f028bf5ce515e40d41c189293ac6a123ba8ab6ee93953a07ebc5e199b48","merkleleaves":{"leafhashalg":"KECCAK-256","leaves":{"@list":["be2e6f028bf5ce515e40d41c189293ac6a123ba8ab6ee93953a07ebc5e199b48"]}}},{"merkletreeid":"22","treehashalg":"KECCAK-256","merkleroot":"3347ac4d3b7e165f3974fbcec2ea315579b1dd2ee276e78e8956ab0d1d52faa8","merkleleaves":{"leafhashalg":"KECCAK-256","leaves":{"@list":["7accc37b4396d50320e032dcb735f909949fe897827caf758e7454bc5b0408c6","b7ed749e2f282a02c7fe817d7a83686512f28a766c33329ffb894b341b207bb6","6835ae87d18022c4a1150bb7382b16ec16b9d7b6bd2c1a59cc5dc5ca169065e0","a7ad70274200e016d64be1c01f6d86e7174ea45f8cf2e9070de919f256bc9d2b","586294a303a9dacd3a4764f6078c0819f9ec4dc811713ff5da2ba3949be1c99f"]}}},{"merkletreeid":"23","treehashalg":"KECCAK-256","merkleroot":"c032a6cf0c3b1292abbf63d7df71fbf426a0e3226edf27f5f8afd33949d28100","merkleleaves":{"leafhashalg":"KECCAK-256","leaves":{"@list":["8fb5c3479c3e92ff23478f72fe2cb5948a608703b91ea9defd0851453ce6ca2f","95ce128981b28a853fdd1be750b3b0ca75a539d12016009e8af18170dd21f29b"]}}},{"merkletreeid":"3","treehashalg":"KECCAK-256","merkleroot":"086da41bf129c04fa534f3fa940b6e00dd97edc2ab2ccb44cb1a80e867c05a3b","merkleleaves":{"leafhashalg":"KECCAK-256","leaves":{"@list":["086da41bf129c04fa534f3fa940b6e00dd97edc2ab2ccb44cb1a80e867c05a3b"]}}},{"merkletreeid":"4","treehashalg":"KECCAK-256","merkleroot":"cff999620170af701e084faccb4c2b39cfd78fabe3c3f79649a9ece8040d3d89","merkleleaves":{"leafhashalg":"KECCAK-256","leaves":{"@list":["cff999620170af701e084faccb4c2b39cfd78fabe3c3f79649a9ece8040d3d89"]}}},{"merkletreeid":"5","treehashalg":"KECCAK-256","merkleroot":"9e137b10296b8ae4766fce0a0736e3b088a87f40c9c40198ede546efa4268564","merkleleaves":{"leafhashalg":"KECCAK-256","leaves":{"@list":["5144a60fee1cc1f4ebe78b76cc6cad32175f8ed0a0659c2fbd14ec23f3077d97","9cfac5d65797ac2b2fb6a2d0b78db63c79e793b2029764a24c22948d527ed561","e237501ba33b4dd99487b82a3c2d5ade29ef822680db44506394b292866e8e4a","6dd7b129a10260f4842f66ca11c7fb5bf77e21bd2f466865f8958b1c4faaf074"]}}},{"merkletreeid":"7","treehashalg":"KECCAK-256","merkleroot":"5a21ae6c834f01ca91b3f78cde45ebfba94c35d8dd17fe2baa58a583b551fa87","merkleleaves":{"leafhashalg":"KECCAK-256","leaves":{"@list":["37e1db0e382df296ef238186d39267a219f2f98671ffd661daeacd36174b0914","486879105440b827f5ba4477451dabb43eb2320acfa3c171d206d12fbe22d3cc"]}}},{"merkletreeid":"9","treehashalg":"KECCAK-256","merkleroot":"259dff5cdfb45d7ba845928349d1015bc0da5444953bc52ce45d79ddcb6311b4","merkleleaves":{"leafhashalg":"KECCAK-256","leaves":{"@list":["48f49e5cc9dcc2b8e66012d3b7187fec6e433427cbca8024ac8f7545c3832d5b","66f8bb0df4d623f8fd4558f58706d6face687e95e43e3e15ae2ca98e11797814"]}}}]},"anchor":{"type":"ETHMerQL","address":"0xF952774372a8F2FaEE96D9b329887beE79D413EB","account":"0x1cf67BCCD5377aF1a69BadA19D699BCBa805E3f6","indexhash":"1aea24d6d18714cc9a35e91dddc80f45e7fcdc586cf7cf77d046d797bf473f0a","settings":{"quadHash":"KECCAK-256","treeHash":"KECCAK-256","indexHash":"KECCAK-256","lsd":2,"indexType":"object","divisor":"0xa"},"transactionhash":"0x75a7129b6ab1af0ee71b5c8f1befd1c9657007c2b661590d056d337bdd386626"}}}}
    
    let dataBadgetStored = {
      "badge": smartBadgeData.oubadge,
      "metadata": smartBadgeData.ou_metadata
    };

    let recipient = smartBadgeData.oubadge_user.recipient;
/*
    let recipient = {
      "type": "email",       
      "hashed": true,       
      "salt": "deadsea",       
      "name": "Dan Brown",       
      "email": "dan.brown@outlook.com",       
      "identity": "584ea33cdc8032a02642bae032c578dd97471b537bb82059f943b1a74c4b45da"       
      };
      */

      let signature = smartBadgeData.oubadge_user.signature;
      /*
      let signature = {
        "type":"ETHMerQL",
        "address":"0xF952774372a8F2FaEE96D9b329887beE79D413EB",
        "account":"0x1cf67BCCD5377aF1a69BadA19D699BCBa805E3f6",
        "indexhash":"1aea24d6d18714cc9a35e91dddc80f45e7fcdc586cf7cf77d046d797bf473f0a",
        "settings":{
           "quadHash":"KECCAK-256",
           "treeHash":"KECCAK-256",
           "indexHash":"KECCAK-256",
           "lsd":2,
           "indexType":"object",
           "divisor":"0xa"
        },
        "transactionhash":"0x75a7129b6ab1af0ee71b5c8f1befd1c9657007c2b661590d056d337bdd386626"
    };
    */

    console.log("dataBadgetStored");
    console.log(dataBadgetStored);  
    
    this.resetErrorMessages(i); 
    this.us
    .getUser(this.data.userId).subscribe(
      dataUser => {
        console.log(dataUser);
        let dataToPost = {
          "@context": dataBadgetStored.badge['@context'],
          "type":"BadgeClass",
          "name": dataBadgetStored.badge.name,
          "description": dataBadgetStored.badge.description,
          "image":  dataBadgetStored.badge.image,
          "version":  dataBadgetStored.badge.version,
          "criteria":  dataBadgetStored.badge.criteria,
          "issuer": dataBadgetStored.badge.issuer,
          "Assertion": {
            "type": "Assertion",
            "recipient": recipient
          },
          "issuedOn": + new Date(),
          "verification": {
            "type": "MerQLVerification2020" 
            },
          "signature": signature
        };

        console.log("--data to post to validate signature---");
          console.log(dataToPost);
           
          
          this.ous
          .verifySmartBadgeV2(dataToPost).subscribe(
          res => {
            console.log("smart badget verification finished, status:"+res);
            if (res) {
              this.lodingspinnerid = null;
            }
            else {
              this.errorMessage = "The validation cannot be done!!!";
              this.showErrorMessage = true;
              this.itemSelected = i;
              this.lodingspinnerid = null;
            }
          },
          error => {
            console.log(error);
            this.errorMessage = error.message;
            this.showErrorMessage = true;
            this.itemSelected = i;
            this.lodingspinnerid = null;                      
          }
        );
        
          
      },
      error => {
        console.log("user not found in db");  
        this.errorMessage = "User not found";
        this.showErrorMessage = true;
        this.itemSelected = i;
        this.lodingspinnerid = null;                      
      }
    );
  }

  issueSmartBadge(smartBadgeData, i) {
    console.log("issueSmartBadge");
    console.log(smartBadgeData);
    this.resetErrorMessages(i);    
    
    let dataToPost = {};
    if (this.data.userId) {
      
      dataToPost = {
        "badge":smartBadgeData.oubadge,
        "recipient":{"name": this.userDataRec.fullName, "email": this.userDataRec.email}
        };

    }
    else if (this.data.courseId) {

      dataToPost = {
        "badge":smartBadgeData.oubadge,
        "recipient":{"name": this.courseDataRec.name, "email": "qualichain@qualichain.com"}
        };

    }
          console.log(dataToPost);

          this.ous
          .issueSmartBadgeV2(dataToPost).subscribe(
          res => {
            console.log("issue a smart badget");
            console.log(res);
            console.log("-----");
            console.log(res.badge);
            console.log("We need to send the response to the NTUA's API")
            
            if (this.data.userId) {
              

              let userBadgeData = {
                "user_id": this.data.userId,
                "badge_id": smartBadgeData.id,
                "oubadge_user":  res.badge,
                "ou_metadata": res.metadata            
              };

              console.log("------");
              console.log(userBadgeData);
              this.lodingspinnerid = null;

              this.bs.addBadgeToUser(userBadgeData).subscribe(
                resNTUA => {
                  console.log("res assign badge to user NTUAs API")
                  console.log(resNTUA);
                  smartBadgeData.status = 'issued';
                  smartBadgeData.assigned = true;

                  
                  smartBadgeData.ou_metadata = res.ou_metadata;
                  smartBadgeData.oubadge_user = res.badge;
                  
                  console.log(smartBadgeData);

                  this.lodingspinnerid = null;
                },
                error => {
                  console.log(error);
                  this.errorMessage = error.message;
                  this.showErrorMessage = true;
                  this.itemSelected = i;
                  this.lodingspinnerid = null;                      
                })
                ;
            }
            else {
              this.lodingspinnerid = null;
            }
            
          },
          error => {
            console.log(error);
            this.errorMessage = error.message;
            this.showErrorMessage = true;
            this.itemSelected = i;
            this.lodingspinnerid = null;                      
          }
        );
          
      
  
  }

  updateSmartAwardStatusOU(smartBadgeId, posI, smartAwardBadgeData, action) {

    this.resetErrorMessages(posI); 

    this.bs.deleteBadgeOfUser(this.data.userId, smartBadgeId).subscribe(
      (dataDelete: any) => {
        console.log(dataDelete);
        smartAwardBadgeData.status = '';
        smartAwardBadgeData.assigned = false;
        this.lodingspinnerid = null;
      }, 
      error => {
        console.log("error deleting badge from user");
      });

  }

  updateSmartAwardStatusOU_old(smartBadgeId, posI, smartAwardBadgeData, action) {
    //console.log(smartAwardBadgeData);
    //console.log(this.data);
    //console.log(action);
    
    this.lodingspinnerid = smartBadgeId;
    if (action=='delete') {

      //let dataToSendRevoke = {'id': 17};
      let dataToSendRevoke = {id: smartAwardBadgeData.awardedId, revokedreason: 'not valid'};

      this.ous
      .getOUToken()
      .subscribe((
        dataOU: any) => {
        if (dataOU.token) {
          this.ous
          .revokeBadgeIssuance(dataOU.token, dataToSendRevoke)
          .subscribe((dataSBOU: any) => {
            console.log(dataSBOU);
            //falta revisar como cambiarlo del listado
            smartAwardBadgeData.status = 'revoked';
            
            this.lodingspinnerid = null;
          },
          error => {
            console.log("error revoking badge");
            this.lodingspinnerid = null;
          });
  
        }
        
        //console.log(this.selectedUserAwards);
      },
      error => {
        console.log("error recovering token");
      }
      );       
         

    
      
    }
    else if (action=='add') {
      
      //let dataToSend = {"user_id": this.data.userId, "badge_id": smartBadgeId};
      let dataToSend = {"badgeid" : smartBadgeId, "recipientid" : this.data.userId}
      //console.log(dataToSend);

      this.ous
      .getOUToken()
      .subscribe((
        dataOU: any) => {
        if (dataOU.token) {
          this.ous
          .createBadgeIssuance(dataOU.token, dataToSend)
          .subscribe((dataSBOU: any) => {
            
            //console.log(dataSBOU);
            smartAwardBadgeData.status = 'pending';
            
            let dataToSend2 = {"id" : dataSBOU.id}

            this.ous
            .confirmBadgeIssuance(dataOU.token, dataToSend2)
            .subscribe((dataSBOU2: any) => {
              
              console.log(dataSBOU2);     
              this.lodingspinnerid = null;
              smartAwardBadgeData.status = 'issued';
    
            },
            error => {
              console.log("error validating badge");
              this.lodingspinnerid = null;
            });
            
         
  
        },
        error => {
          console.log("error creating bage issuance badge");
          this.lodingspinnerid = null;
        }
        );
  
        }
        
        //console.log(this.selectedUserAwards);
      },
      error => {
        console.log("error recovering token");
      }
      );       
         

    }
    else if (action=='validate') {
      console.log(smartAwardBadgeData);
      
      this.ous
      .getOUToken()
      .subscribe((
        dataOU: any) => {
        if (dataOU.token) {


            let dataToSend2 = {"id" : smartAwardBadgeData.awardedId}

            this.ous
            .confirmBadgeIssuance(dataOU.token, dataToSend2)
            .subscribe((dataSBOU2: any) => {
              
              //console.log(dataSBOU2);        
              smartAwardBadgeData.status = 'issued';  
              this.lodingspinnerid = null;

            },
            error => {
              console.log("error validating badge");
              this.lodingspinnerid = null;
            });


        } 
      },
      error => {
        console.log("error recovering token");
      }
      );             

    }
    

  }

  updateSmartAwardStatus(smartBadgeId, posI, smartAwardBadgeData, action) {
    //console.log(smartAwardBadgeData);
    
    this.lodingspinnerid = smartBadgeId;
    if (action=='delete') {
      
      //console.log(smartAwardBadgeData.item_id);
      this.bs.deleteBadgeOfUser(this.data.userId, smartBadgeId).subscribe(
        res => {
          console.log("Badge deleted");
          smartAwardBadgeData.assigned = false;
          this.lodingspinnerid = null;

          let posBadgeToDelete = -1;
          let cnt_i = 0;
          if (this.data.source=='profile') {
            this.data.element.forEach(element => {
              if (element.badge.id==smartBadgeId) {
                posBadgeToDelete = cnt_i;
              }
              cnt_i = cnt_i +1;
            });
          }
          else if (this.data.source=='award_list') {
            this.data.element.aqcuired_badges.forEach(element => {
              if (element.id==smartBadgeId) {
                posBadgeToDelete = cnt_i;
              }
              cnt_i = cnt_i +1;
            });
          }

          if (posBadgeToDelete>=0) {
            if (this.data.element) {
              if (this.data.source=='profile') {
                this.data.element.splice(posBadgeToDelete, 1);
              }
              else if (this.data.source=='award_list') {
                this.data.element.aqcuired_badges.splice(posBadgeToDelete, 1);
               }
            }
          }

        },
        error => {
          alert("Error deleting badges per user!!");
          this.lodingspinnerid = null;
        }
      );
    }
    else if (action=='add') {
      
      let dataToSend = {"user_id": this.data.userId, "badge_id": smartBadgeId};
      //console.log(dataToSend);
 
      this.bs.addBadgeToUser(dataToSend).subscribe(
       res => {
         console.log("Badge added to user");
         //console.log(res);
         
         smartAwardBadgeData.assigned = true;
         this.lodingspinnerid = null;
         //console.log(smartAwardBadgeData);
         //console.log(this.data.element);
         if (this.data.element) {
           if (this.data.source=='profile') {
            this.data.element.push({id: null, badge: smartAwardBadgeData});
           }
           else if (this.data.source=='award_list') {
            this.data.element.aqcuired_badges.push(smartAwardBadgeData);
           }
            
         }
         
         
       },
       error => {
         alert("Error assigning badges to user!!");
         this.lodingspinnerid = null;
       }
     );      

    }
    

  }


  //openCreateAwardDialog() {
  openCreateAwardDialogInModal() {

    const dialogRef = this.createAwardDialog.open(createAwardDialog_modal, {
      disableClose: true,
      width: '550px',
      data: {badgesList:this.listOfSmartAwards}
    });

    dialogRef.afterClosed().subscribe(result => {
    });
    
  } 

  onSelectItemModalWindow(item: []) {

    if (this.listOfSmartBadgesByUser.indexOf(item['id']) > -1) {
      this.listOfSmartBadgesByUser.splice(this.listOfSmartBadgesByUser.indexOf(item['id']), 1);
    }
    else {
      this.listOfSmartBadgesByUser.push(item['id']);
    }

  }

  onSubmitAwardsModal() {

    //console.log(this.data.userId);
    /*
    ELEMENT_DATA.forEach((element, index) => {
     
      if (element.id==this.selectedUSer) {
        this.selectedUserAwards.sort();
        element.aqcuired_badges = this.selectedUserAwards;
        element.aqcuired_badges;
        ELEMENT_DATA[index]=element;
      }    
      
    });
    */


   this.listOfSmartBadgesByUser.forEach(element => {
     console.log(element);
     let dataToSend = {"user_id": this.data.userId, "badge_id": element};
     console.log(dataToSend);

     this.bs.addBadgeToUser(dataToSend).subscribe(
      res => {
        console.log("Badge added to user");
        //console.log(res);
      },
      error => {
        alert("Error assigning badges to user!!");
      }
    );
   });

/*
   ELEMENT_DATA.forEach((element, index) => {
     
    if (element.id==this.data.userId) {
      this.selectedUserAwards.sort();
      let seletedBadgesData = [];
      this.listOfSmartAwards.forEach(elementSA => {
        
        if (this.selectedUserAwards.indexOf(elementSA.id)!==-1)
        {
          console.log(elementSA);
          seletedBadgesData.push(elementSA);

          element.aqcuired_badges = seletedBadgesData;

          element.aqcuired_badges;
          ELEMENT_DATA[index]=element;
          console.log(ELEMENT_DATA)
        }

      });
      console.log(this.selectedUserAwards);

      //element.aqcuired_badges = this.selectedUserAwards;
      
    }    
    
  });
*/
   // document.getElementById("closeAwardModalWindow").click();
   // this.router.navigate(["/courses",1,"award"]);
    
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}

export interface DialogData {
  userId: number;
  courseId: number;
  element: any;
  source: string;
  origin: string,
  type: string,
  badgesList: any;
}
/*
const fulListOfSmartAwards = [
  {id: 1 , name: 'Operating System-Laboratory Exercise', description:'test 1', issuer: 'issuer1'},
  {id: 2 , name: 'Operating Systems-Written Reports', description:'test 2', issuer: 'issuer2'},
  {id: 3 , name: 'Operating Systems-Hackathon', description:'test 3', issuer: 'issuer3'},
  {id: 4 , name: 'Operating Systems-Begginer', description:'test 4', issuer: 'issuer4'},
  {id: 5 , name: 'Operating Systems-Master', description:'test 5', issuer: 'issuer5'}
];
*/
const fulListOfSmartAwards = [];