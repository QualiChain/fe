import { Component, OnInit, Input } from '@angular/core';
import { BadgesService } from '../../../_services/badges.service';
import { SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { awardDialog_modal } from '../../../_components/award-smart-badge/award-smart-badge.component';

@Component({
  selector: 'app-qc-smart-badges-list-by-user',
  templateUrl: './qc-smart-badges-list-by-user.component.html',
  styleUrls: ['./qc-smart-badges-list-by-user.component.css']
})
export class QcSmartBadgesListByUserComponent implements OnInit {

  @Input() userId: string;
  @Input() formatOutput: string;
  
  
  lodingspinnerid: boolean = true;
  aqcuired_badges_by_user: any[] = [];
  constructor(
    private bs: BadgesService,
    public awardDialog: MatDialog,
  ) { }

  loadUserBadges() {
    this.lodingspinnerid = true;
    this.bs.getBadgesByUser(+this.userId).subscribe(
      badgesByUser => {
  
        //console.log(badgesByUser);
        this.aqcuired_badges_by_user = badgesByUser;
        this.lodingspinnerid = false;
        
      },
      error => {
        console.log("error getting badges per user");
        this.lodingspinnerid = false;
      }
    );
  }
  ngOnInit(): void {
    //console.log("this.userId:"+this.userId);
    //console.log("this.formatOutput:"+this.formatOutput);

    if (this.userId) {
      this.loadUserBadges();
      
    }

  }

  openAwardDialogInUserProfile(userId: number, element: any) {
     
    const dialogRef = this.awardDialog.open(awardDialog_modal, {
      width: '550px',
      data: {userId: userId, element: element, source: 'profile'}
    });

    dialogRef.afterClosed().subscribe(result => {

      //console.log(result);
      this.loadUserBadges();
    });
    
  }

}



@Component({
  selector: 'app-qc-smart-badge-card',
  templateUrl: './qc-smart-badge-card.component.html',
  styleUrls: ['./qc-smart-badges-list-by-user.component.css']
})
export class QcSmartBadgeCardComponent implements OnInit {

  @Input() awardId: number;

  
  lodingspinner: boolean = true;
  itemBadgeData: any = {};

  constructor(
    private bs: BadgesService
  ) { }

  loadDatraSmartBadge() {
    this.bs.getBadge(+this.awardId).subscribe(
      badgeData => {
        //console.log(badgeData);
        this.itemBadgeData = badgeData;
        this.lodingspinner = false;
      },
      error => {
        console.log("error getting badge data");
        this.lodingspinner = false;
      }
    );
  }

  ngOnInit(): void {
    //console.log("this.awardId:"+this.awardId);

    if (this.awardId) {
      this.loadDatraSmartBadge();
    } else {
      this.lodingspinner = false;
    }


  }

  ngOnChanges(changes: SimpleChanges) {
    //console.log(changes);
    if (this.awardId) {
      this.loadDatraSmartBadge();
    } else {
      this.lodingspinner = false;
    }

  }

}
