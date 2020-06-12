import {Component, OnInit, ViewChild, Inject } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { UsersService } from '../../_services/users.service';
import { BadgesService } from '../../_services/badges.service';
import { AuthService } from '../../_services/auth.service';
import {OUService } from '../../_services/ou.service'

//import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

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
  
  constructor(
    private ous: OUService,
    private us: UsersService,
    private bs: BadgesService,
    private fb: FormBuilder, private route: ActivatedRoute, public awardDialog: MatDialog, public createAwardDialog: MatDialog) { }


  displayedColumns: string[] = ['id', 'student', 'semester', 'grade', 'aqcuired_badges', 'action'];
  //displayedColumns: string[] = ['id', 'student', 'semester', 'grade', 'action'];

  dataSource = new MatTableDataSource(ELEMENT_DATA);
  //dataSource = new MatTableDataSource<listOfStudents>([]);

  @ViewChild(MatPaginator, {static: true}) 
  paginator: MatPaginator;  
  
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  
  ngOnInit() {
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
            //console.log(element);
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
 
  openAwardDialog(userId: number, element: any) {
    //console.log(userId)
    
   // const dialogRef = this.awardDialog.open(awardDialog_modal);

    const dialogRef = this.awardDialog.open(awardDialog_modal, {
      disableClose: true,
      width: '550px',
      data: {userId: userId, element: element, source: 'award_list'}
    });

    dialogRef.afterClosed().subscribe(result => {
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
  templateUrl: './createAwardDialog.html',
  styleUrls: ['./award-smart-badge.component.css']
})
export class createAwardDialog_modal implements OnInit {
  badgelabel: string;
  badgedescription: string;
  badgeissuer: string;

  badgecriterianarrative: string;
  badgeimageurl: string;
  badgeversion: string;

  constructor(
    private ous: OUService,
    private us: UsersService, private bs: BadgesService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}


  ngOnInit() {
    
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
          "criterianarrative": this.badgecriterianarrative,
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
})

export class awardDialog_modal implements OnInit {

  listOfSmartAwards = fulListOfSmartAwards;
  selectedUserAwards: any = [];
  listOfSmartBadgesByUser = [];
  fullDataSmartBadgesByUser = [];
  lodingspinnerid: number = null;
  userDataRec: any = [];
  currentlistOfBadges: any = [];

  constructor(
    private router: Router,
    public createAwardDialog: MatDialog,
    private us: UsersService,
    private bs: BadgesService,
    private as: AuthService,
    private ous: OUService,
    public dialogRef: MatDialogRef<awardDialog_modal>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}


  ngOnInit() {

    this.selectedUserAwards=[];
    
    
    this.listOfSmartAwards=[];

    this.currentlistOfBadges = [];

    this.ous
    .getOUToken()
    .subscribe((
      dataOU: any) => {

      if (dataOU.token) {
        this.ous
        .getBadgesList(dataOU.token)
        .subscribe((dataSBOU: any) => {          
          //console.log(dataSBOU);
          //this.listOfSmartAwards = dataSBOU.badges;
          dataSBOU.badges.forEach(element => {

            this.listOfSmartAwards.push(
              {
              id: element.id,
              name: element.title,
              description: element.description,
              issuer: element.issuerid,
              imageurl: element.imageurl,
              assigned: false,
              status: '',
              awardedId: ''
              }
            );

          });

          this.ous
          .getAssertionsList(dataOU.token)
          .subscribe((dataAssertions: any) => {          
            //console.log(dataAssertions);
            //this.listOfSmartAwards = dataSBOU.badges;
            dataAssertions.items.forEach((element, index) => {
              if (element.recipientid==this.data.userId) {
                //console.log(element);
                this.currentlistOfBadges.push({'badgeid':element});

                this.listOfSmartAwards.forEach((elementBadge, indexBadge) => {
                  if (elementBadge.id==element.badgeid) {
                    //console.log(indexBadge+"--"+elementBadge.id+"--"+element.badgeid+"---"+element.status);
                    this.listOfSmartAwards[indexBadge].status = element.status;
                    this.listOfSmartAwards[indexBadge].awardedId = element.id;
                    if (element.status=='pending') {
                      this.listOfSmartAwards[indexBadge].assigned = true;
                    }
                    
                  }
                });

              }
              
            });
            
            //console.log(this.listOfSmartAwards);
    
          });

        });




      }
      
      //console.log(this.selectedUserAwards);
    },
    error => {
      console.log("error recovering token");
    }
    );
    
   /*
    this.bs
      .getBadges()
      .subscribe((dataFull: any) => {
        //this.jobs = data;
        //console.log("full badges list");
        console.log(dataFull);
        this.listOfSmartAwards = dataFull;

        this.bs
        .getBadgesByUser(this.data.userId)
        .subscribe((data: any) => {
          //this.jobs = data;
          //console.log(dataFull);
          //console.log(data);
          this.fullDataSmartBadgesByUser = data;

          data.forEach(element => {
            let o = dataFull.find((o, i) => {
              if (o.id === element.badge.id) {                
                //console.log(o);
                //console.log(i);
                //console.log(dataFull[i]);
                dataFull[i].assigned =true;
                dataFull[i].item_id=element.id;
                //console.log(dataFull[i]);
               // dataFull.splice(i, 1);
              }
            });

            //console.log(element.badge.id);
            //console.log(element.badge.name);
            //this.selectedUserAwards.push(element);
            //console.log(element.badge.id+"---"+element.badge.name);
            this.selectedUserAwards[element.badge.id]=element.badge;
            this.listOfSmartBadgesByUser.push(element.badge.id);
          });
          //console.log(this.selectedUserAwards);
      });
    });
    */

    
    //console.log(this.data);
    if (this.data.element.student) {
      this.userDataRec.userName = this.data.element.student;
    }
    else {
    
      this.us
        .getUser(this.data.userId).subscribe(
          data => {
            //console.log("user in db");      
            this.userDataRec = data;
          },
          error => {
            console.log("user not found in db");                        
          }
        );
    
    }

  }

  
  updateSmartAwardStatusOU(smartBadgeId, posI, smartAwardBadgeData, action) {
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
  element: any;
  source: string;
  origin: string,
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