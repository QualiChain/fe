import { Component, OnInit, Input } from '@angular/core';
import { BadgesService } from '../../../_services/badges.service';
import { SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { awardDialog_modal } from '../../../_components/award-smart-badge/award-smart-badge.component';
import { OUService } from '../../../_services/ou.service'
import { AppComponent } from '../../../app.component';

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

  constructor(
    private appcomponent: AppComponent,
    private bs: BadgesService,
    public awardDialog: MatDialog,
    private ous: OUService
  ) { }

  isAdmin = this.appcomponent.isAdmin;
  isProfessor = this.appcomponent.isProfessor;
  isAcademicOrganisation = this.appcomponent.isAcademicOrganisation;

  intialerts() {
    this.errorMessage = "";
    this.showErrorMessage = false;
    this.loadingLoginSpinner = false;
    this.validationSuccess = false;
  }

  loadUserBadges() {
    this.lodingspinnerid = true;
    this.bs.getBadgesByUser(+this.userId).subscribe(
      badgesByUser => {
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

  createBadgeDataToSend(smartBadgeData) {

    let dataBadgetStored = {
      "badge": smartBadgeData.badge.oubadge,
      "metadata": smartBadgeData.ou_metadata
    };

    //console.log("dataBadgetStored");
    //console.log(dataBadgetStored); 
    
    let recipient = smartBadgeData.oubadge_user.recipient;
    let signature = smartBadgeData.oubadge_user.signature;

    //console.log("recipient");
    //console.log(recipient);     
    //console.log("signature");
    //console.log(signature);     
    //console.log("this.userId");
    //console.log(this.userId);

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

    //console.log("--data to post to validate signature---");
    return dataToPost;
  }

  verifySmartBadge(smartBadgeData) {
    this.loadingLoginSpinner = true;
    this.validationSuccess = false;
    //console.log("verifySmartBadge");
    //console.log("data In:");
    //console.log(smartBadgeData);

    let dataToPost = this.createBadgeDataToSend(smartBadgeData);
    
    console.log(dataToPost);
    this.ous
          .verifySmartBadgeV2(dataToPost).subscribe(
          res => {

            this.loadingLoginSpinner = false;
            console.log("smart badget verification finished, status:"+res);
            if (res) {
              this.validationSuccess = true;
              this.showErrorMessage = false;
            }
            else {
              this.errorMessage = "The validation cannot be done!!!";
              this.validationSuccess = false;
              this.showErrorMessage = true;
              
            }
          },
          error => {
            console.log(error);
            this.loadingLoginSpinner = false;
            this.errorMessage = error.message;
            this.validationSuccess = false;
            this.showErrorMessage = true;
          }
        );

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

  downloadBadgeAsPNG(smartBadgeData) {
    this.downloadPNGImage = null;
    this.showErrorDowloadingPNG = false;
    let dataToPost = this.createBadgeDataToSend(smartBadgeData);

    this.ous
            .addSmartBadgeToImage(dataToPost, this.fileToUploadDetails).subscribe(
            (res:any) => {
              //console.log("res OK!!!");
              //console.log(res);      
              this.downloadPNGImage = res;   
              
              var newBlob = new Blob([res], { type: "image/png" });

              // IE doesn't allow using a blob object directly as link href
              // instead it is necessary to use msSaveOrOpenBlob
              if (window.navigator && window.navigator.msSaveOrOpenBlob) {
                window.navigator.msSaveOrOpenBlob(newBlob);
                return;
              }

              const data = window.URL.createObjectURL(newBlob);

              var link = document.createElement('a');
              link.href = data;
              //link.download = "smartBadge.png";
              link.download = this.fileToUploadDetails?.name;
              // this is necessary as link.click() does not work on the latest firefox
              link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
  
              setTimeout(function () {
                  // For Firefox it is necessary to delay revoking the ObjectURL
                  window.URL.revokeObjectURL(data);
                  link.remove();
              }, 100);
            },
            error => {
              console.log("ERROR!!!");
              this.downloadPNGImage = null;
              console.log(error);           
              this.showErrorDowloadingPNG = true;
            }
          );  


  }

  formatBytes(bytes, decimals = 2) {
    if (bytes === 0) {
      return "0 Bytes";
    }
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  }

  handleFile(files: FileList) {
    this.invalidDetailsFile = false;
    this.messageErrorDetailsFile = null;
    this.uploadedDetails = false;
    //console.log(files[0].type);
    if (files[0].type=="image/png") {
      //console.log("if");
      this.fileToUploadDetails = files.item(0);
      this.uploadedDetails = true;
    }
    else {
      //console.log("else");
      this.invalidDetailsFile = true;
      this.messageErrorDetailsFile = files[0].name;
      this.fileToUploadDetails = null;
    }
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
