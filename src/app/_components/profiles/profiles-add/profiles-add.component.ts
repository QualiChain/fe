import { Component, OnInit, ɵConsole } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {ElementRef, ViewChild} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatAutocompleteSelectedEvent, MatAutocomplete} from '@angular/material/autocomplete';
import {MatChipInputEvent} from '@angular/material/chips';
import {Observable} from 'rxjs';
import {map, startWith, windowWhen} from 'rxjs/operators';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { CVService } from '../../../_services/cv.service';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import {TranslateService} from '@ngx-translate/core';
import { AuthService } from '../../../_services';

import * as d3 from 'd3';
import * as d3Sankey from 'd3-sankey';
import { UsersService } from '../../../_services/users.service';
import User from '../../../_models/user';
import { DatePipe } from '@angular/common';

import { UploadService } from '../../../_services/upload.service';
import { environment } from '../../../../environments/environment';
const downloadUrl = environment.downloadFilesUrl;
import { ConfirmDialogModel, ConfirmDialogComponent } from '../../utils/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { StorageService } from '../../../_helpers/global';
import { QCStorageService } from '../../../_services/QC_storage.services';
//import { FlashMessagesService } from 'angular2-flash-messages';

import RecruitmentOrganisation from '../../../_models/recruitmentorganisation';
import { RecruitmentOrganisationService } from '../../../_services/recruitmentorganisation.services';
import AcademicOrganisation from '../../../_models/academicorganisation';
import { AcademicOrganisationService } from '../../../_services/academicorganisation.services';

@Component({
  selector: 'app-profiles-add',
  templateUrl: './profiles-add.component.html',
  styleUrls: ['./profiles-add.component.css'],
  providers: [DatePipe]
})
export class ProfilesAddComponent implements OnInit {

  user_avatar_path: string = 'assets/img/no_avatar.jpg';
  user_avatar_path_id: number = null;

  public profileForm: FormGroup;

  pilots: Pilot[] = [
    {value: 1, viewValue: 'Pilot 1'},
    {value: 2, viewValue: 'Pilot 2'},
    {value: 3, viewValue: 'Pilot 3'},
    {value: 4, viewValue: 'Pilot 4'}
  ];

  roles: Role[] = [
    {value: 'student', viewValue: 'Student'},
    {value: 'administrator', viewValue: 'Administrator'},
    {value: 'employee', viewValue: 'Employee'},
    {value: 'professor', viewValue: 'Professor'},
    {value: 'recruiter', viewValue: 'Recruiter'},
    {value: 'life long learner', viewValue: 'Life long learner'},
    {value: 'academic organisation', viewValue: 'Academic organisation'},
    {value: 'recruitment organisation', viewValue: 'Recruitment organisation'}
  ];
  /*
  rolesType: RoleType[] = [
    //{value: 'academic organisation', viewValue: 'Academic organisation', type: 'academic'},
    {value: 'administrator', viewValue: 'Administrator', type: ''},
    {value: 'employee', viewValue: 'Employee', type: ''},
    {value: 'life long learner', viewValue: 'Life long learner', type: ''},
    {value: 'professor', viewValue: 'Professor', type: 'academic'},
    {value: 'student', viewValue: 'Student', type: 'academic'},    
    {value: 'recruiter', viewValue: 'Recruiter', type: 'recruitment'},
    //{value: 'recruitment organisation', viewValue: 'Recruitment organisation', type: 'recruitment'}
  ];
  */
  academicRole: boolean = false;
  recruitmentRole: boolean = false;
  employeeRole: boolean = false;
  administratorRole: boolean = false;
  termsAndConditions: boolean = false;
  userAcademicRoles: any;
  userAcademicOrganisation: any;
  userRecruiterRoles: any;
  userRecruiterOrganisation: any;

  public currentValue: string = null;
  
  hide = true;
  pilotId: number = null;
  role: string ="";
  userName: string;
  fullName: string;
  name: string;
  surname: string;
  gender: string = "";
  birthDate: string;
  //birthDate: Date;
  country: string;
  state: string;
  city: string;
  address: string;
  zipCode: string;
  mobilePhone: string;
  homePhone: string;
  email: string;
  password: string;

  profileId: string = '';
  mode: string = '';
  files: any[] = [];
  currentUser: User;
  userId: string = '';

  public selectedOption: any;
  showError: boolean = false;
  errorMessage: string = null;
  profileAvatarImg: string = 'assets/img/no_avatar.jpg';

   constructor(
    //private flashMessage: FlashMessagesService,    
    private ros: RecruitmentOrganisationService,
    private aos: AcademicOrganisationService,
    private qcStorageService: QCStorageService,
    public storageService: StorageService,
    public dialog: MatDialog,
    private us: UploadService,
    private fb: FormBuilder,
    private router: Router,
    public datepipe: DatePipe, private userService: UsersService, private authservice: AuthService, 
    private route: ActivatedRoute, private formBuilder: FormBuilder, private cvs: CVService, private translate: TranslateService) { 

    this.authservice.currentUser.subscribe(x => this.currentUser = x);

    this.profileForm = fb.group({
      // parent's own input
      name: [''],
      // child's component input control, control name is passed via @Input to the child 
      selectCtrl: ['', Validators.required],
      selectCtrlState: ['', Validators.required],
      selectCtrlCity: ['', Validators.required]
    });
    // parent tracks child's input state change
    this.profileForm.controls.selectCtrl.valueChanges.subscribe( value =>
      {
        this.country = value;
      });
    // parent tracks child's input state change  
    this.profileForm.controls.selectCtrlState.valueChanges.subscribe( value =>
    {
      this.state = value;
    });
    // parent tracks child's input state change  
    this.profileForm.controls.selectCtrlCity.valueChanges.subscribe( value =>
    {
      this.city = value;
    });    
    
    this.createForm(); 

  }
 
  createForm() {
  
  }

  


  ngOnInit() {

    if(!this.currentUser) {
      //if(!this.currentUser.hasOwnProperty('id')){
        this.pilotId = null;
        this.currentUser={id:0,role:'', userName:'', name:'', surname:'', email:'', pilotId: null};
      }
    
    let id:any = 0;
    this.route.params.subscribe(params => {

            
      if(params.hasOwnProperty('id')){
        //id = +params.id;
        id = params.id;
        this.userId = params.id;        
      }
      else { 
        //console.log(this.router.url);
        if (this.router.url!='/profiles/add') {
          if(this.currentUser.hasOwnProperty('id')) { 
            id = this.currentUser.id.toString();
            this.userId = id;
          }
        }
      }
   

      //console.log(this.userId );

      this.mode = "Create";
      //if (id && id > 0) {
      if (id) {
        //let userdata = JSON.parse(localStorage.getItem('userdata'));
        let userdata = JSON.parse(this.qcStorageService.QCDecryptData(localStorage.getItem('userdataQC')));
        //console.log(userdata.role.toLowerCase());
        let authorizedEditOwnProfile =  this.authservice.checkIfPermissionsExistsByUserRoles(['edit_own_profile']);
        let authorizedEditOtherProfile =  this.authservice.checkIfPermissionsExistsByUserRoles(['edit_other_profile']);

        if(userdata) {
          if ( (String(userdata.id) == String(id) && (authorizedEditOwnProfile) )  || (authorizedEditOtherProfile) ){
          //if ((String(userdata.id) == String(id)) || (userdata.role.toLowerCase() =='administrator')) {
            this.mode = "Edit";
            this.profileId=String(id);
            //console.log(this.profileId);  
    
            this.userService.getUser(+this.profileId).subscribe(
              res => {
                //console.log("Request OK");
                //console.log(res);
                this.pilotId = res.pilotId;
                this.role = res.role;
                this.userName = res.userName;
                this.fullName = res.fullName;
                this.name = res.name;
                this.surname = res.surname;
                this.gender = res.gender;
                this.birthDate = res.birthDate;
                this.country = res.country;
                this.city = res.city;
                this.address = res.address;
                this.zipCode = res.zipCode;
                this.mobilePhone = res.mobilePhone;
                this.homePhone = res.homePhone;
                this.email = res.email;
              },
              error => {
                console.log("Error getting data");
                this.router.navigate(["/not_found"]);
                
              }
            ); 
            
            this.getAvatarUser(+this.profileId);          

          }
          else {          
            //window.location.href="/profiles/"+id;
            //this.router.navigate(["/profiles/"+id]);
            this.router.navigate(["/access_denied"]);
          }
        }
        else {
          //this.router.navigate(["/access_denied"]);

        }
               
      }
      else {
        this.mode = "Create";
      }

    });

  }


  deleteFile(fileId: number) { 

    this.showError = false;
    this.errorMessage = null;

    this.us.deleteFile(+this.profileId, fileId).subscribe(
      res => {
        //console.log("the file has been deleted");
        this.getAvatarUser(+this.profileId);
      },
      error => {
        console.log("Error deleting file data");
        console.log(error);
        //this.flashMessage.show(this.translate.instant('PERSONAL_FILES_REPOSITORY.ERROR_DELETING_FILE', {fileName:"Avatar"}), {cssClass: 'alert-danger', timeout: 5000});        
        
        this.showError = true;
        this.errorMessage = this.translate.instant('PERSONAL_FILES_REPOSITORY.ERROR_DELETING_FILE', {fileName:"Avatar"});
      }
    );

  }

  confirmDialog(id, title): void {
    //const message = `Are you sure you want to do this?`;
    const message = this.translate.instant('PROFILES.DELETE_AVATAR_MESSAGE') ;
    
    const dialogData = new ConfirmDialogModel(this.translate.instant('PROFILES.CONFIRM_ACTION'), message);

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "400px",
      data: dialogData
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      //this.result = dialogResult;

      if (dialogResult) {
        this.deleteFile(id);
      }
    });
  }



  myCallbackFunction = (args: any): void => {
    //callback code here
    //console.log("hi!!!");
    //console.log(this.profileId);
    this.getAvatarUser(+this.profileId);
        
  }

  getAvatarUser(profileId: number) {
    //console.log("getAvatarUser:"+profileId);
    this.user_avatar_path = null;
    this.user_avatar_path_id = null;

    //let userdata = JSON.parse(localStorage.getItem('userdata'));
    let userdata = JSON.parse(this.qcStorageService.QCDecryptData(localStorage.getItem('userdataQC')));

    //let currentUserData = JSON.parse(localStorage.getItem('currentUser'));
    let currentUserData = JSON.parse(this.qcStorageService.QCDecryptData(localStorage.getItem('currentUserQC')));

    if (+profileId==+userdata['id'])
    {    
        userdata['avatar_path']='assets/img/no_avatar.jpg';
        currentUserData['avatar_path']='assets/img/no_avatar.jpg';
        //localStorage.setItem('userdata', JSON.stringify(userdata));

        let encryptedDataUserData = this.qcStorageService.QCEncryptData(JSON.stringify(userdata));
        let encryptedDataCurrentUserData = this.qcStorageService.QCEncryptData(JSON.stringify(currentUserData));

        this.storageService.setItem('userdataQC', encryptedDataUserData);
        this.storageService.setItem('currentUserQC', encryptedDataCurrentUserData);

        //this.storageService.setItem(currentUser['avatar_path'], 'assets/img/no_avatar.jpg');
    }

    this.us.getUserFiles(+profileId).subscribe(
      res => {                
        res.files.forEach(element => {
          //console.log(res);
          var index = element.filename.indexOf(profileId+"_avatar_" ); 
          if (index==0) {                
            this.user_avatar_path =  downloadUrl+"/file/"+element.file_id;
            this.user_avatar_path_id = element.file_id;

            this.us.getFileURL(this.user_avatar_path).subscribe(
              (response: any) =>{
                  let dataType = response.type;
                  let binaryData = [];
                  binaryData.push(response);
                  let url = window.URL.createObjectURL(new Blob(binaryData, {type: dataType}));                 
                  this.profileAvatarImg = url;
              }
            )
            
            if (+profileId==+userdata['id'])
            {
              if (userdata['avatar_path']!=this.user_avatar_path) {
                userdata['avatar_path']=this.user_avatar_path;
                currentUserData['avatar_path']=this.user_avatar_path;
                //localStorage.setItem('userdata', JSON.stringify(userdata));
                
                let encryptedDataUserData = this.qcStorageService.QCEncryptData(JSON.stringify(userdata));
                let encryptedDataCurrentUserData = this.qcStorageService.QCEncryptData(JSON.stringify(currentUserData));
        
                this.storageService.setItem('userdataQC', encryptedDataUserData);
                this.storageService.setItem('currentUserQC', encryptedDataCurrentUserData);

                //this.storageService.setItem(currentUser['avatar_path'], this.user_avatar_pat);
              }
            }
            
          }
        });
                        
      },
      error => {
        console.log("Error recovering files");                
      }
    );
  }
  
  processForm() {
    //console.log(this);

    let birth_date_transform =this.birthDate;
    //let birth_date_transform =this.datepipe.transform(this.birthDate, 'dd-MM-yyyy');

    const obj = {
      "userPath": "/home/"+this.userName,      
      "pilotId": this.pilotId,      
      "fullName": this.fullName,
      "name": this.name,
      "surname": this.surname,
      "gender": this.gender,
      "birthDate": birth_date_transform,
      "country": this.country,
      "city": this.city,
      "address": this.address,
      "zipCode": this.zipCode,
      "mobilePhone": this.mobilePhone,
      "homePhone": this.homePhone      
    };
    
    if (this.mode=='Create') {

      obj['role'] = this.role;
      obj['password'] = this.password;
      obj['email'] = this.email;
      obj['userName'] = this.userName,

      this.userService.addUser(obj).subscribe(
        res => {
          //console.log("User created");
          console.log(res);
          var splitted = res.split("=", 2); 
          //console.log(splitted[1]);
          let password = this.password;
          
          this.router.navigate(["/profiles/"+splitted[1]]);
          /*
          this.userService.requestNewPassword(splitted[1], password).subscribe(
            resPassword => {
              console.log("Password created");
              //console.log(resPassword);              
              //after create the user 
              //window.location.href="/profiles";
              this.router.navigate(["/profiles/"+splitted[1]]);
            },
            error => {
              alert("Error setting user password!!");
            }
          );
          */
          //after create the user 
          //window.location.href="/profiles";
          this.router.navigate(["/profiles/"]);
        },
        error => {
          this.router.navigate(["/profiles/"]);
          //alert("Error creating user!!");
        }
      );

    }
    else {
      //console.log(this.profileId);
      this.userService.updateUser(+this.profileId, obj).subscribe(
        res => {
          //console.log("User updated");
          //console.log(res);
          //after update the user 
          //window.location.href="/profiles/"+this.profileId;
          this.router.navigate(["/profiles/"+this.profileId]);
        },
        error => {
          alert("Error updating user!!");
        }
      );
      

    }
    

  }
  


}

interface Pilot {
  value: number;
  viewValue: string;
}

interface Role {
  value: string;
  viewValue: string;
}

interface RoleType {
  value: string;
  viewValue: string;
  type: string;
}


@Component({
  selector: 'privacyPolicy_modal',
  templateUrl: './privacyPolicy.html',
  styleUrls: ['./profiles-add.component.css']
})
export class privacyPolicy_modal implements OnInit {

  constructor() {}


  ngOnInit() {

    

  }

}



@Component({
  selector: 'app-profiles-add-IAM-user',
  templateUrl: './profiles-add-IAM-user.component.html',
  styleUrls: ['./profiles-add.component.css'],
  providers: [DatePipe]
})
export class ProfilesAddIAMUserComponent implements OnInit {

  userId: number = 0;
  currentUser: User;
  showUserCreatedMessage: boolean = false;
  loadingLoginSpinnerCreateUserIAM: boolean = false;
  showErrorMessage: boolean = false;
  errorMessage: string = "";
  hidePassword: boolean = true;
  hideRepeatPassword: boolean = true;

  name: string = "";
  userName: string = "";
  password: string = "";
  repeatPassword: string = "";
  email: string = "";  

  //name: string = "testStudent";
  //userName: string = "testStudent";
  //password: string = "12345678";
  //repeatPassword: string = "12345678";
  //email: string = "testStudent@test.com";
  
  academicRole: boolean = false;
  recruitmentRole: boolean = false;
  employeeRole: boolean = false;
  administratorRole: boolean = false;
  termsAndConditions: boolean = false;
  userAcademicRoles: any;
  userAcademicOrganisation: any;
  userRecruiterRoles: any;
  userRecruiterOrganisation: any;

  listAllRecruitmentOrganizations: RecruitmentOrganisation[] = [];
  listAllAcademicOrganizations: AcademicOrganisation[] = [];

  rolesType: RoleType[] = [
    //{value: 'academic organisation', viewValue: 'Academic organisation', type: 'academic'},
    {value: 'administrator', viewValue: 'Administrator', type: ''},
    {value: 'employee', viewValue: 'Employee', type: ''},
    {value: 'life long learner', viewValue: 'Life long learner', type: ''},
    {value: 'professor', viewValue: 'Professor', type: 'academic'},
    {value: 'student', viewValue: 'Student', type: 'academic'},    
    {value: 'recruiter', viewValue: 'Recruiter', type: 'recruitment'},
    //{value: 'recruitment organisation', viewValue: 'Recruitment organisation', type: 'recruitment'}
  ];

  paramRedirectUrl: string;
  showloadingSpinner: boolean = false;
  showErrorAutoLogin: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private qcStorageService: QCStorageService,
    public storageService: StorageService,
    private ups: UploadService,
    private router: Router,
    private authservice: AuthService,
    private ros: RecruitmentOrganisationService,
    private aos: AcademicOrganisationService,
    private userService: UsersService,
    public privacyPolicyDialog: MatDialog
  ) {

    this.authservice.currentUser.subscribe(x => this.currentUser = x);

    this.route.queryParams.subscribe(params => {
      this.paramRedirectUrl = params['returnUrl'];
      
  });

  }

  onChangeTermsAndConditions(checked: boolean) {
    this.termsAndConditions = checked;
    if (checked) {
      this.openPrivacyPolicyDialog();
    }
  }
  onChangeAcademicRoleCheckbox(checked: boolean) {
    this.academicRole = checked;
  }
  onChangeRecruitmentRoleCheckbox(checked: boolean) {
    this.recruitmentRole = checked;
  }
  onChangeEmployeeRoleCheckbox(checked: boolean) {
    this.employeeRole = checked;
  }
  onChangeAdministratorRoleCheckbox(checked: boolean) {
    this.administratorRole = checked;
  }

  openPrivacyPolicyDialog() {
    console.log("openPrivacyPolicyDialog");

    const dialogRef = this.privacyPolicyDialog.open(privacyPolicy_modal, {
      disableClose: false,
      width: '600px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
    });
    
  }


  storeQCUserObject(myObj:{}) {
    //console.log(myObj);
    let encryptedData = this.qcStorageService.QCEncryptData(JSON.stringify(myObj));
    //localStorage.setItem('userdata', encryptedData);
    localStorage.setItem('userdataQC', encryptedData);
    this.storageService.setItem('userdataQC', encryptedData);
    //window.location.href="/";
    if (this.paramRedirectUrl) {
      window.location.href = this.paramRedirectUrl;
    }
    else {
      window.location.reload();
    }
    
    //location.reload();
    //location.href="/";
    //this.router.navigate(["/"]);
  }

  validCredentialsQCUser(data) {
    //console.log(data);
    //console.log(this.name);
    let myObj = {};

    //console.log("else");
      if (data) {

        console.log(data.id);
        myObj = { authenticated: true, name: data.name, surname: data.surname, email: data.email, username: data.userName, id: data.id , 'avatar_path': '', role: data.role, roles: data.roles};
        myObj['avatar_path'] = "assets/img/no_avatar.jpg";
        this.storeQCUserObject(myObj);
      }
      else {
        this.storeQCUserObject(myObj);
      }
  }

  async loginForm() {
    this.showloadingSpinner = true;
    let res:any = await this.authservice.loginIAMAsync(this.email, this.password);
    //console.log(res);
    if (res['authenticated']) {
      //console.log("Valid credentials for the auth service");               
      this.validCredentialsQCUser(res);
    }
    else {            
      this.showloadingSpinner = false;
      this.showErrorAutoLogin = true;
      console.log("invalid credentials")          
    }

  }

  processForm() {
    //console.log(this);
    this.loadingLoginSpinnerCreateUserIAM = true;
    this.showErrorMessage = false;
    this.errorMessage = "";
    
    let userRoles = [];
    let userOrganizations = [];
    if (this.academicRole) {
      if (this.userAcademicRoles){
        this.userAcademicRoles.forEach(element => {
          userRoles.push(element);
        });
      }
      if (this.userAcademicOrganisation) {
        this.userAcademicOrganisation.forEach(element => {
          userOrganizations.push(element);
        });
      }      
    }

    if (this.recruitmentRole) {
      /*
      if (this.userRecruiterRoles){
        this.userRecruiterRoles.forEach(element => {
          userRoles.push(element);
        });
      }
      */
      userRoles.push('recruiter');
      if (this.userRecruiterOrganisation) {
        this.userRecruiterOrganisation.forEach(element => {
          userOrganizations.push(element);
        });
      }

    }
    
    const formData: FormData = new FormData();
    formData.append('name', this.name);
    formData.append('email', this.email);
    formData.append('password', this.password);
    //formData.append('organization', JSON.stringify(userOrganizations));
    formData.append('organization', userOrganizations.toString());
    //formData.append('userType', JSON.stringify(userRoles));
    formData.append('userType', userRoles.toString());

    this.userService.addUserIAM(formData).subscribe(    
      res => {
        //console.log("Add user IAM response");
        //console.log(res);        
        this.loadingLoginSpinnerCreateUserIAM = false;
        if (!res.succeeded) {
          this.showErrorMessage = true;
          this.errorMessage = res.message;  
        }
        else {
          
          if (this.userId>0) {
            this.router.navigate(["/profiles/"]);
          }
          else {
            this.showUserCreatedMessage = true;
            this.loginForm();
          }
        }
      },
      error => {        
        console.log("Error creating user!!");
        this.loadingLoginSpinnerCreateUserIAM = false;
        this.showErrorMessage = true;
        this.errorMessage = error.message;
      }
    );

    

  }

  ngOnInit() {

    this.userId = 0;
    if (this.currentUser) {
      if(this.currentUser.hasOwnProperty('id')) { 
        let id = this.currentUser.id;
        this.userId = id;
      }
    }

    this.ros.getRecruitmentOrganisations().subscribe(
      recruitmentOrganizationsData => {
        //console.log(recruitmentOrganizationsData);
        recruitmentOrganizationsData.sort((a,b) => (a.title.toUpperCase() > b.title.toUpperCase()) ? 1 : ((b.title.toUpperCase() > a.title.toUpperCase()) ? -1 : 0))
        this.listAllRecruitmentOrganizations = recruitmentOrganizationsData;
      },
      error => {
        console.log("error recruitment organisations data");
      }
    );
    
    this.aos.getAcademicOrganizations().subscribe(
      academicOrganizationsData => {
        //console.log(academicOrganizationsData);
        academicOrganizationsData.sort((a,b) => (a.title.toUpperCase() > b.title.toUpperCase()) ? 1 : ((b.title.toUpperCase() > a.title.toUpperCase()) ? -1 : 0))
        this.listAllAcademicOrganizations = academicOrganizationsData;
      },
      error => {
        console.log("error getting academic organisations data");
      }
    );

  }

}