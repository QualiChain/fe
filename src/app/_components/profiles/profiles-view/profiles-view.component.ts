import { Component, OnInit, ɵConsole, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {ElementRef, ViewChild} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatAutocompleteSelectedEvent, MatAutocomplete} from '@angular/material/autocomplete';
import {MatChipInputEvent} from '@angular/material/chips';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
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
import { BadgesService } from '../../../_services/badges.service';

import User from '../../../_models/user';
//import { MatSnackBar, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { MatDialog } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { awardDialog_modal } from '../../../_components/award-smart-badge/award-smart-badge.component';
import { OUService } from '../../../_services/ou.service';
import { CoursesService } from '../../../_services/courses.service';
import { UtilsService } from '../../../_services/utils.service';
import { JobsService } from '../../../_services/jobs.service';
import Course from '../../../_models/course';
import { exit } from 'process';
import { AppComponent } from '../../../app.component';

import { UploadService } from '../../../_services/upload.service';
import { environment } from '../../../../environments/environment';
import { ConfirmDialogModel, ConfirmDialogComponent } from '../../utils/confirm-dialog/confirm-dialog.component';
import { ConditionalExpr } from '@angular/compiler';
const downloadUrl = environment.downloadFilesUrl;

@Component({
  selector: 'app-profiles-view',
  templateUrl: './profiles-view.component.html',
  styleUrls: ['./profiles-view.component.css']
})
export class ProfilesViewComponent implements OnInit {

  smartBadgesByUser: any[];
  currentUser: User;
  dynamicForm: FormGroup;
  dynamicFormWorks: FormGroup;
  dynamicFormEducations: FormGroup;

  submitted = false;


  //userdata: User;
  userdata: any;

/* 
  userdata: {
    id: number;
    name: string;
    surname: string;
    email: string;
    username: string;
    avatar_path?: string;
    university?: string;
    role?: string
};
*/
  years: {};
  currentJustify: string;
  //listOfCoursesByUser: {};
  listOfCoursesByUser: Course[]=[];
  listOfCompletedCoursesByUser: any[]=[];

  //selectedCourse: {};
  emptyCourseSelected: {
    courseid: number, 
    name: string, 
    description: string, 
    related_skills: object, 
    course_badges: object
  };
  
  selectedCourse: any;
  /*
  selectedCourse: {
    courseid: number, 
    name: string, 
    description: string, 
    related_skills: object, 
    course_badges: object
  };
  */
  
  userId = '';
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  skillCtrl = new FormControl();
  filteredSkills: Observable<string[]>;
  skills: string[] = ['Java'];
  allSkills: string[] = ['Angular', 'Java', 'Nodejs', 'Pyhton', 'C#'];
  canViewCV: boolean = false;
  canEditCV: boolean = false;
  skillsCV: any = [];
  workHistoryCV: any = [];
  educationHistoryCV: any = [];
  skillsByCourseInfo: any = [];
  currentJobPosition: string = null;

  @ViewChild('skillInput', {static: false}) skillInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto', {static: false}) matAutocomplete: MatAutocomplete;


  listOfSmartAwardsOU: any =[];
  profileAvatarImg: string = 'assets/img/no_avatar.jpg';
  
  constructor(
    public dialog: MatDialog,
    private js: JobsService,
    private uploads: UploadService,
    private appcomponent: AppComponent,
    private ous: OUService,
    private cs: CoursesService,
    public CVDialog: MatDialog,
    private router: Router, public awardDialog: MatDialog, private bs: BadgesService, private us: UsersService, public authservice: AuthService, private route: ActivatedRoute, private formBuilder: FormBuilder, private cvs: CVService, private translate: TranslateService) { 

    this.authservice.currentUser.subscribe(x => this.currentUser = x);
    
    this.filteredSkills = this.skillCtrl.valueChanges.pipe(
      startWith(null),
      map((skill: string | null) => skill ? this._filter(skill) : this.allSkills.slice()));

  }

  isLogged = this.appcomponent.isLogged;
  isAdmin = this.appcomponent.isAdmin;
  isRecruiter = this.appcomponent.isRecruiter;
  //isTeacher = this.appcomponent.isTeacher;
  isProfessor = this.appcomponent.isProfessor;
  isStudent = this.appcomponent.isStudent;
  isEmployee = this.appcomponent.isEmployee;

  openAwardDialogInUserProfile(userId: number, element: any) {
     
    const dialogRef = this.awardDialog.open(awardDialog_modal, {
      width: '550px',
      data: {userId: userId, element: element, source: 'profile'}
    });

    dialogRef.afterClosed().subscribe(result => {

      //console.log(result);
      this.getSmartBadgesByUser(userId);
    });
    
  }
  

  uploadUserCVKG(userId: number) {
     
    const dialogRef = this.CVDialog.open(UPLOAD_CV_KG_Dialog_modal, {
      disableClose: true,
      width: '550px',
      data: {userId: userId}
    });

    dialogRef.afterClosed().subscribe(result => {
    });
    
  }


  openUserCV(userId: number) {
     
    const dialogRef = this.CVDialog.open(CVDialog_modal, {
      disableClose: true,
      width: '550px',
      data: {userId: userId, isAdmin: this.isAdmin, isRecruiter: this.isRecruiter}
    });

    dialogRef.afterClosed().subscribe(result => {
    });
    
  }


  add(event: MatChipInputEvent): void {
    // Add fruit only when MatAutocomplete is not open
    // To make sure this does not conflict with OptionSelected Event
    if (!this.matAutocomplete.isOpen) {
      const input = event.input;
      const value = event.value;

      // Add our fruit
      if ((value || '').trim()) {
        this.skills.push(value.trim());
      }

      // Reset the input value
      if (input) {
        input.value = '';
      }

      this.skillCtrl.setValue(null);
    }
  }

  remove(fruit: string): void {
    const index = this.skills.indexOf(fruit);

    if (index >= 0) {
      this.skills.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.skills.push(event.option.viewValue);
    this.skillInput.nativeElement.value = '';
    this.skillCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allSkills.filter(skill => skill.toLowerCase().indexOf(filterValue) === 0);
  }

  getSmartBadgesByUser(id) {
    console.log("getSmartBadgesByUser userid:"+id);
/*    
          this.bs
          .getBadgesByUser(id)
          .subscribe((data: any) => {
            //this.jobs = data;
            //console.log(dataFull);
            //console.log(data);
            this.smartBadgesByUser = data;
          });        
*/

          this.smartBadgesByUser =  [
          {"badge":{"@context":["https://w3id.org/openbadges/v2",{"@vocab":"https://blockchain.open.ac.uk/vocab/"}],"type":"Assertion","recipient":{"type":"email","hashed":true,"salt":"deadsea","name":"Dan Brown","email":"dan.brown@outlook.com","identity":"sha256$584ea33cdc8032a02642bae032c578dd97471b537bb82059f943b1a74c4b45da"},"badge":{"type":"BadgeClass","name":"smart badge 1","description":"this is the description for the smart badge 1","image":"https://qualichain-project.eu/quali-data/uploads/2019/04/lightbulb-150x150.png","version":"33","criteria":{"type":"Criteria","narrative":"The holder of this badge has achieved great things in QualiChain","skills":"skills"},"issuer":{"type":"Issuer","name":"professor","description":"this is my desscription","url":"https://qualichain-project.eu/news/","email":"professor@tecnico.ulisboa.pt","image":"https://qualichain-project.eu/quali-data/themes/qualichain/assets/img/qualichain-icon-white.png","telephone":"935558789"}},"issuedOn":1612257596363,"verification":{"type":"MerQLVerification2020"},"signature":{"type":"ETHMerQL","address":"0xBa3883d8e6397919656dFE9a63cF96235eC5349d","account":"0x1cf67BCCD5377aF1a69BadA19D699BCBa805E3f6","indexhash":"828d71d36fdb50b5b5d6cd4829852ca5cf19f044cb1bd941c0c14f48752bc75b","settings":{"quadHash":"KECCAK-256","treeHash":"KECCAK-256","indexHash":"KECCAK-256","lsd":2,"indexType":"object","divisor":"0xa"},"transactionhash":"0x82d7b911d2fb8572166cb6b7bb9025a99b89534a1f0133f777b39dcb8620e9af"}},"metadata":{"@context":{"@vocab":"https://blockchain.open.ac.uk/vocab/"},"merkletrees":{"indexhash":"828d71d36fdb50b5b5d6cd4829852ca5cf19f044cb1bd941c0c14f48752bc75b","indexhashalg":"KECCAK-256","treesettings":{"quadHash":"KECCAK-256","treeHash":"KECCAK-256","indexHash":"KECCAK-256","lsd":2,"indexType":"object","divisor":"0xa"},"trees":{"@list":[{"merkletreeid":"0","treehashalg":"KECCAK-256","merkleroot":"7ba4aa6057542ca81cf5698c88dc308ba92b44c614cca73320b04fd831e96356","merkleleaves":{"leafhashalg":"KECCAK-256","leaves":{"@list":["7ba4aa6057542ca81cf5698c88dc308ba92b44c614cca73320b04fd831e96356"]}}},{"merkletreeid":"1","treehashalg":"KECCAK-256","merkleroot":"7618aee3dc2df7abd5fec55bfbca87820ea5712eb7d37ca27e0731c0e5ea4a03","merkleleaves":{"leafhashalg":"KECCAK-256","leaves":{"@list":["ce9996c044d81ade6ac770f97930ac01a08436bb530461820ac483748a89f6f5","1cc697889fec46521c92474bd6bdfe5a7081a7a6bf9eaf67be9ba7089730e5e5"]}}},{"merkletreeid":"10","treehashalg":"KECCAK-256","merkleroot":"2ca417a0bb543d63a8c59b1344db70f0bc2f1f7e010ea999148be79913e97bf5","merkleleaves":{"leafhashalg":"KECCAK-256","leaves":{"@list":["2ca417a0bb543d63a8c59b1344db70f0bc2f1f7e010ea999148be79913e97bf5"]}}},{"merkletreeid":"11","treehashalg":"KECCAK-256","merkleroot":"aee99114903a13d184c138f07fe538b8e3eb77db9c4e98c0f6f706fe6c28adff","merkleleaves":{"leafhashalg":"KECCAK-256","leaves":{"@list":["57d9d9dd80192d02d5f8fb76d7f420d5769af19f64e9eb6a01fe5a011a4a0fca","d025fb5e0d891669a05c31ae9f5083ea3a858b75a5bc276c3b358c47da75d51e"]}}},{"merkletreeid":"12","treehashalg":"KECCAK-256","merkleroot":"2ee02d37b8775e7159ddd36ec7a13d45f7bd331cfe3550d365ddd78d184c0f39","merkleleaves":{"leafhashalg":"KECCAK-256","leaves":{"@list":["5c340f2d12ddf6c169edd503899965f12f07e1fb54ef6d7f71d8ac31fe04a35f","6f449db246a58ab319e46ae8b7a771cb306c2c6253bb94eeb0ee58c0895ed108","429aab0c4af69ec8464b9b53752fc668399d8c38b3b8fbbb7fc78b944ed9c0c9"]}}},{"merkletreeid":"13","treehashalg":"KECCAK-256","merkleroot":"1c93c2c4e804f204a8e07f451aaf3be48736d139bb1772290564018f3d598a3c","merkleleaves":{"leafhashalg":"KECCAK-256","leaves":{"@list":["ea297e58e03e342945c7ed07f57bdad211f22fac60a89f4a62c8952d302e02b9","6473500bdf59590d7ea63fb7630f477469a00993d5c01dfeb1bf9d48d6a25d36","0c577aa06bf21496cddd6373b92b2f801a33915a9ff7fe748b7bcb8b6857aa7c"]}}},{"merkletreeid":"15","treehashalg":"KECCAK-256","merkleroot":"a9d9ef7afcd7f11433fecc42d53739719644584ca34a62178f5fbf31ad035286","merkleleaves":{"leafhashalg":"KECCAK-256","leaves":{"@list":["a9d9ef7afcd7f11433fecc42d53739719644584ca34a62178f5fbf31ad035286"]}}},{"merkletreeid":"16","treehashalg":"KECCAK-256","merkleroot":"ba6307002d70b71f78a8153ad7909e10039bc8854ef47c9839071714dc11d20e","merkleleaves":{"leafhashalg":"KECCAK-256","leaves":{"@list":["ba6307002d70b71f78a8153ad7909e10039bc8854ef47c9839071714dc11d20e"]}}},{"merkletreeid":"17","treehashalg":"KECCAK-256","merkleroot":"7a87e8d151da23aec8595a993f8571db2869db10b0a0e350539144858657f527","merkleleaves":{"leafhashalg":"KECCAK-256","leaves":{"@list":["7a87e8d151da23aec8595a993f8571db2869db10b0a0e350539144858657f527"]}}},{"merkletreeid":"18","treehashalg":"KECCAK-256","merkleroot":"14c12a53242a0d22f10e3e66a74d491fbe39aa7f9c22cfdcf2dbcf50a7ba9b32","merkleleaves":{"leafhashalg":"KECCAK-256","leaves":{"@list":["14c12a53242a0d22f10e3e66a74d491fbe39aa7f9c22cfdcf2dbcf50a7ba9b32"]}}},{"merkletreeid":"19","treehashalg":"KECCAK-256","merkleroot":"aa67bf2375a1805d7af6b717bf5bb9d0750144c47a7721d3355d289178079977","merkleleaves":{"leafhashalg":"KECCAK-256","leaves":{"@list":["aa67bf2375a1805d7af6b717bf5bb9d0750144c47a7721d3355d289178079977"]}}},{"merkletreeid":"2","treehashalg":"KECCAK-256","merkleroot":"d9dc27aa379c02a2b72b016aced6f0faea57162180d5fc62bd055ab1c702e64a","merkleleaves":{"leafhashalg":"KECCAK-256","leaves":{"@list":["1479929681ab03c9131f6ec3005b6c87e2cc45b37197aeb314ebbebc3a4f14da","db5771ea2ca20986eb3c37555d064a6796b65be1a036376cc631ac9504bf8632","d9966835410ba6a2cb365399d3877f10cf9ae2afac32d65ac8189ccee90470b3"]}}},{"merkletreeid":"20","treehashalg":"KECCAK-256","merkleroot":"79f8078145cea10ae73250b0a255ade09cdfbb2dbe4da10f2cc057c4ef250b91","merkleleaves":{"leafhashalg":"KECCAK-256","leaves":{"@list":["f9d9447df6cf8f26f0787fce8cb8dac2880c923c537e3d3174749e886f854c6a","76112cb60fedb0331850d221da8b8f5ea661e07b2daf7ab1886f3e0f6b658857"]}}},{"merkletreeid":"21","treehashalg":"KECCAK-256","merkleroot":"be2e6f028bf5ce515e40d41c189293ac6a123ba8ab6ee93953a07ebc5e199b48","merkleleaves":{"leafhashalg":"KECCAK-256","leaves":{"@list":["be2e6f028bf5ce515e40d41c189293ac6a123ba8ab6ee93953a07ebc5e199b48"]}}},{"merkletreeid":"22","treehashalg":"KECCAK-256","merkleroot":"a963893515dd3437ac79865066eecee0da5f0beda68fa010ce8e6017b554d5a1","merkleleaves":{"leafhashalg":"KECCAK-256","leaves":{"@list":["7accc37b4396d50320e032dcb735f909949fe897827caf758e7454bc5b0408c6","e2d342a6aa35eead56c794e058f0b6497c80b9c8f0232c87357601e677fe1918","8b1aac7c8f2b1a090f4c285ab0eab20e2c9c9d5c0cde4571b6b63184bacf6150","98ea81edc314aee8ea8f1b56c820f2f6f51b5edf43930a158d566a8423081006","97ba9467c90a8409e1c5063328a4141c0736c4f955dc95a9c17950f0822f07fb"]}}},{"merkletreeid":"23","treehashalg":"KECCAK-256","merkleroot":"70cee5c2f14913fbccf2c16fa6dc1e1f78143c50617b4190d705356423436627","merkleleaves":{"leafhashalg":"KECCAK-256","leaves":{"@list":["086c9c7b914752a938130e3644112f509a45d895a8f0a61f2fac79198a3fff54","40321df8e2f1bd9bb926b12284965a4ff0f92df116d50f7c9ff2e06048f25d2e"]}}},{"merkletreeid":"24","treehashalg":"KECCAK-256","merkleroot":"52ded73c9b634f8d819dcad4b02db08ddec59d3ebc06c9d9d0ee34b0c84100a3","merkleleaves":{"leafhashalg":"KECCAK-256","leaves":{"@list":["52ded73c9b634f8d819dcad4b02db08ddec59d3ebc06c9d9d0ee34b0c84100a3"]}}},{"merkletreeid":"3","treehashalg":"KECCAK-256","merkleroot":"c7470cfa85de045857925584d98f9295913fb116ff442854859ce2c8073f7b6e","merkleleaves":{"leafhashalg":"KECCAK-256","leaves":{"@list":["c7470cfa85de045857925584d98f9295913fb116ff442854859ce2c8073f7b6e"]}}},{"merkletreeid":"4","treehashalg":"KECCAK-256","merkleroot":"61df1e98e283a4de9e1b885f32ecc000faf5a1f826b64e9d4a8e1a544534ba85","merkleleaves":{"leafhashalg":"KECCAK-256","leaves":{"@list":["61df1e98e283a4de9e1b885f32ecc000faf5a1f826b64e9d4a8e1a544534ba85"]}}},{"merkletreeid":"5","treehashalg":"KECCAK-256","merkleroot":"96e7ea3dbe0f694153576e2683b8f6ebf85c829914bdf8a7010243b38f504511","merkleleaves":{"leafhashalg":"KECCAK-256","leaves":{"@list":["9291675eea0c603b92f18f18b1d117d09907f949a6fa62c1ec39e1c867076bb5","4ade87a2c5b3e96bc2af79dd46db3f25feb9f68ecb3351834015aa585706d87e","db979fa6c74c391fcdf96f3741cf14a4483987fce541f6bafdce3cc459e6095a"]}}},{"merkletreeid":"7","treehashalg":"KECCAK-256","merkleroot":"628bf5f935b0e5ba57f2646f3da5aad28abd5276d9ab72ae20454952625aebd2","merkleleaves":{"leafhashalg":"KECCAK-256","leaves":{"@list":["99aaca89fc7657c4336af88d931aeb9638bf1806e1df773280b5c8c02a7febcc","5d86f60c46161bea340b36322508ad908b7b2f9527aa0e33af0c7ddf5fc8421b"]}}},{"merkletreeid":"8","treehashalg":"KECCAK-256","merkleroot":"b01c28abc7ad668cd60cd5feb21d3b8ee4d4223be0cac48bd82f3f5494517f8d","merkleleaves":{"leafhashalg":"KECCAK-256","leaves":{"@list":["cfe2e341e6b0f6dbf5a57d8baaddf186db91a47190e0bfa5535a736259c899b8","1c1a1d2c78be633d601fcc1a18d8f6a7e0c5386d0c933dace048e1da137fbefa"]}}},{"merkletreeid":"9","treehashalg":"KECCAK-256","merkleroot":"3074f426f0bacc5a6fc280de6a2ee244cacf79bdefed95e0a0b2dd137bf095cc","merkleleaves":{"leafhashalg":"KECCAK-256","leaves":{"@list":["4facf4fb68136a11df2e4df3334c333d71ab810b9970c2924c1a09341ef7b0a1","1234b7118358c3439022dc057f7d2a7626da9fff2ad73f99f2a4a988bf4fc97f"]}}}]},"anchor":{"type":"ETHMerQL","address":"0xBa3883d8e6397919656dFE9a63cF96235eC5349d","account":"0x1cf67BCCD5377aF1a69BadA19D699BCBa805E3f6","indexhash":"828d71d36fdb50b5b5d6cd4829852ca5cf19f044cb1bd941c0c14f48752bc75b","settings":{"quadHash":"KECCAK-256","treeHash":"KECCAK-256","indexHash":"KECCAK-256","lsd":2,"indexType":"object","divisor":"0xa"},"transactionhash":"0x82d7b911d2fb8572166cb6b7bb9025a99b89534a1f0133f777b39dcb8620e9af"}}}},
          {"badge":{"@context":["https://w3id.org/openbadges/v2",{"@vocab":"https://blockchain.open.ac.uk/vocab/"}],"type":"Assertion","recipient":{"type":"email","hashed":true,"salt":"deadsea","name":"panagiotis panagiotis","email":"example1@gmail.com","identity":"sha256$a663d3d7423df8fcd82563c6b251b1dcc4634a0f3bf6973941acb295e0a2fce1"},"badge":{"type":"BadgeClass","name":"smart badge 2","description":"this is the description for the smart badge 2. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum","image":"https://qualichain-project.eu/quali-data/uploads/2019/04/training.png","version":"1","criteria":{"type":"Criteria","narrative":"The holder of this badge has achieved great things in QualiChain","skills":"skills"},"issuer":{"type":"Issuer","name":"Miquel","description":"this is the issuer desciption","url":"https://qualichain-project.eu/","email":"professor@tecnico.ulisboa.pt"}},"issuedOn":1612277572247,"verification":{"type":"MerQLVerification2020"},"signature":{"type":"ETHMerQL","address":"0xBEFD92CFefeE5658Ab60478ac28B6b24bA0b0400","account":"0x1cf67BCCD5377aF1a69BadA19D699BCBa805E3f6","indexhash":"834c7978fd0e9f10b8d538865af4d28dd6b9861da8f509f883b645209ca1d982","settings":{"quadHash":"KECCAK-256","treeHash":"KECCAK-256","indexHash":"KECCAK-256","lsd":2,"indexType":"object","divisor":"0xa"},"transactionhash":"0xfa24a90074d14526649b00ee6dff0e92012d09860ae9ef315b61bf1757b8b583"}},"metadata":{"@context":{"@vocab":"https://blockchain.open.ac.uk/vocab/"},"merkletrees":{"indexhash":"834c7978fd0e9f10b8d538865af4d28dd6b9861da8f509f883b645209ca1d982","indexhashalg":"KECCAK-256","treesettings":{"quadHash":"KECCAK-256","treeHash":"KECCAK-256","indexHash":"KECCAK-256","lsd":2,"indexType":"object","divisor":"0xa"},"trees":{"@list":[{"merkletreeid":"0","treehashalg":"KECCAK-256","merkleroot":"355f751f83b41b5d4036034bc2cc42d22f1040c5240b0b44793b0b072f556c31","merkleleaves":{"leafhashalg":"KECCAK-256","leaves":{"@list":["0ceeec7bc26c1f2cf6b76340d0d6f363fb7e41afba1dc2e2af8b175d5b01d688","bbda34ddabd9ebfbb5a86fd9e9bf2dcaf1ef195ba085f317828c877aaa694a81"]}}},{"merkletreeid":"1","treehashalg":"KECCAK-256","merkleroot":"d730826eacc20e727e3d7b5a718091c31404601da545b9abf3696e707519d11e","merkleleaves":{"leafhashalg":"KECCAK-256","leaves":{"@list":["c5a64d52cd58d1d3d47b1073d140450b2b17d3a6ff639f97a6f667995d809ecf","442e65804b0fad3605b490046ae7b35aa0cc94732294ce8501c2681b70876983"]}}},{"merkletreeid":"11","treehashalg":"KECCAK-256","merkleroot":"294f0f9a3d9bd23ca743bf866b873e065889b327382cf7cd65800d3322c7809b","merkleleaves":{"leafhashalg":"KECCAK-256","leaves":{"@list":["10215fd4b29a45ad3aab4cf1ff4b3dbdfc0dfe76e7fb3ebed06828a4d69a4e10","d025fb5e0d891669a05c31ae9f5083ea3a858b75a5bc276c3b358c47da75d51e"]}}},{"merkletreeid":"12","treehashalg":"KECCAK-256","merkleroot":"25eefe06c6a61c445da121ea2455971f92028a6cfc230c2369e78af7c30a76cb","merkleleaves":{"leafhashalg":"KECCAK-256","leaves":{"@list":["389348110eb9a32d2ef6b8ba4b05b05d3b2fd6cf7eb43e4cac3b520c94d32096","352f7d50f035417d753217e8f96409ddf4d43e59795075eedc0ba9b9735ef13b","49aa0a6da2aad1b357a2ac8affdfacd450f1239ebc6a1f895851b1dd7f291338"]}}},{"merkletreeid":"13","treehashalg":"KECCAK-256","merkleroot":"59c35bb8ee047b9024bf40477d6fce9512e7761fdc8616fa3918af914b3e9d9c","merkleleaves":{"leafhashalg":"KECCAK-256","leaves":{"@list":["44abce3fcf8aabb527cbcc7d1be97996b1271e13d225ec0799efe506f2b816ba","8cc97c8787d85942c2bb75820accdefddff5fdecb6234f3e5ccea01c7e6e0ddc","030f2eb04818a730c777a343c8b7f98c9de84cb67db819b459cd0f26541aee05","35090082934682c2bbe6c6a1b9522c7ed08b341b51437a0fc3411c86042d4485"]}}},{"merkletreeid":"17","treehashalg":"KECCAK-256","merkleroot":"debe24cc1cec9cae909f8ce98eb4da0ee55165f9b3851c72ef92d0c3f8d7f02a","merkleleaves":{"leafhashalg":"KECCAK-256","leaves":{"@list":["debe24cc1cec9cae909f8ce98eb4da0ee55165f9b3851c72ef92d0c3f8d7f02a"]}}},{"merkletreeid":"18","treehashalg":"KECCAK-256","merkleroot":"46ce2039f4b00415a3d610440d5347b96729e713e5686466e52e2c9747df2bb5","merkleleaves":{"leafhashalg":"KECCAK-256","leaves":{"@list":["653ea51bcaa5d65293ff58be9f95235c87aec76f5377b3f87735978a45ddd50e","999ea398c37e47b09418cf7b948860d2a8af09b08b048c09631601972b7e314d"]}}},{"merkletreeid":"19","treehashalg":"KECCAK-256","merkleroot":"aa67bf2375a1805d7af6b717bf5bb9d0750144c47a7721d3355d289178079977","merkleleaves":{"leafhashalg":"KECCAK-256","leaves":{"@list":["aa67bf2375a1805d7af6b717bf5bb9d0750144c47a7721d3355d289178079977"]}}},{"merkletreeid":"2","treehashalg":"KECCAK-256","merkleroot":"ec181000c1d861fbdc1c56b0369b8a572cfec474aad03ac1c2c40e4489224e79","merkleleaves":{"leafhashalg":"KECCAK-256","leaves":{"@list":["478cacad279899761d245f46c4be8076b8dda6dcda7bf797dcc8db1382bb2aaa","12cd4d310a1f0b8ecf93df19c1dd84e66d527bc904d3c8568a7b443d95e090e7","7a0e521e74412f97d32f0e0641bc35ca215cd11b2aa9ba9f0ba7ea331b3cdee8","c97413f0e2c57c9657e5e59f13782bead1c010f25261f31399a790c3b7984378","b28ca93012ad0d7d0046945449a47c379e41c93991e09b53eec16fa059ad0d27"]}}},{"merkletreeid":"21","treehashalg":"KECCAK-256","merkleroot":"dc29a39aa3f9a88a17b8842268fbfdbdbf040da13bf89d821bad36a4dc8f366f","merkleleaves":{"leafhashalg":"KECCAK-256","leaves":{"@list":["dc29a39aa3f9a88a17b8842268fbfdbdbf040da13bf89d821bad36a4dc8f366f"]}}},{"merkletreeid":"22","treehashalg":"KECCAK-256","merkleroot":"4dd3b24af700600e5dfe9048574bfb84ddfba41bc025f526e53273c0f92b3e23","merkleleaves":{"leafhashalg":"KECCAK-256","leaves":{"@list":["a53b65f29ce10e7fab4e0050213b42ae81a9f7625a3f64c32f166668f478f1ce","6835ae87d18022c4a1150bb7382b16ec16b9d7b6bd2c1a59cc5dc5ca169065e0","a7ad70274200e016d64be1c01f6d86e7174ea45f8cf2e9070de919f256bc9d2b","586294a303a9dacd3a4764f6078c0819f9ec4dc811713ff5da2ba3949be1c99f"]}}},{"merkletreeid":"23","treehashalg":"KECCAK-256","merkleroot":"996f0bb7526bc28f753c1e52dc343865b4a1e929131d59afbb4b1efef2a8470f","merkleleaves":{"leafhashalg":"KECCAK-256","leaves":{"@list":["3bd8e12e6ae0e538c1bcf1fb063d5887ae5119425df8215e36d2c01f72394214","abc68af0b73aced254fd7dc4c0fadeb28e24f2436ebf41f52542bb76c9dfa01d"]}}},{"merkletreeid":"3","treehashalg":"KECCAK-256","merkleroot":"05f3e5827aef48a8a7d3c36c3bee4ac221dddfae056925736fc533d64cb42d6a","merkleleaves":{"leafhashalg":"KECCAK-256","leaves":{"@list":["05f3e5827aef48a8a7d3c36c3bee4ac221dddfae056925736fc533d64cb42d6a"]}}},{"merkletreeid":"4","treehashalg":"KECCAK-256","merkleroot":"f732f16f097c6c0a95a6b444f150584655652067766d8127f4a48771e957b2dc","merkleleaves":{"leafhashalg":"KECCAK-256","leaves":{"@list":["f732f16f097c6c0a95a6b444f150584655652067766d8127f4a48771e957b2dc"]}}},{"merkletreeid":"5","treehashalg":"KECCAK-256","merkleroot":"4301fd5d785286f92c0103dfe132343c1be9bc394bd29bedddc334be700dae93","merkleleaves":{"leafhashalg":"KECCAK-256","leaves":{"@list":["b25e53f76da1dcf7603d0fe95326a15e0479264c47eef424884abd9485ea4afe","391cf413817a81a5bf3779185f198a0c025ac8a0a2e7fe1497bfaa5824215398","eed58ad02f4a5d7af03106a1af664b5a7fc4f3ead2369a6186dd17c7e4574002","db979fa6c74c391fcdf96f3741cf14a4483987fce541f6bafdce3cc459e6095a"]}}},{"merkletreeid":"7","treehashalg":"KECCAK-256","merkleroot":"4c7962682449f46453f0f49a3e9bac38e1604a869302aa85211dbdc6761e8747","merkleleaves":{"leafhashalg":"KECCAK-256","leaves":{"@list":["4c7962682449f46453f0f49a3e9bac38e1604a869302aa85211dbdc6761e8747"]}}},{"merkletreeid":"8","treehashalg":"KECCAK-256","merkleroot":"a8d866c84397d61ced072fd595c24a25afb036d885becda9076e5838c6ace3b6","merkleleaves":{"leafhashalg":"KECCAK-256","leaves":{"@list":["a8d866c84397d61ced072fd595c24a25afb036d885becda9076e5838c6ace3b6"]}}},{"merkletreeid":"9","treehashalg":"KECCAK-256","merkleroot":"89d2229abc20c9500507365f94e986e03b379b6e4287328105e3c3fb181e7d45","merkleleaves":{"leafhashalg":"KECCAK-256","leaves":{"@list":["cd04043476d6963cb7b85bd22efd116e5053600ee0e74e5826a18d75f0b2bdfb","48f49e5cc9dcc2b8e66012d3b7187fec6e433427cbca8024ac8f7545c3832d5b","98ad5096f466856deeacb97f380484942a54f9290e316bdee7bc19cd9c21e25d"]}}}]},"anchor":{"type":"ETHMerQL","address":"0xBEFD92CFefeE5658Ab60478ac28B6b24bA0b0400","account":"0x1cf67BCCD5377aF1a69BadA19D699BCBa805E3f6","indexhash":"834c7978fd0e9f10b8d538865af4d28dd6b9861da8f509f883b645209ca1d982","settings":{"quadHash":"KECCAK-256","treeHash":"KECCAK-256","indexHash":"KECCAK-256","lsd":2,"indexType":"object","divisor":"0xa"},"transactionhash":"0xfa24a90074d14526649b00ee6dff0e92012d09860ae9ef315b61bf1757b8b583"}}}},
          {"badge":{"@context":["https://w3id.org/openbadges/v2",{"@vocab":"https://blockchain.open.ac.uk/vocab/"}],"type":"Assertion","recipient":{"type":"email","hashed":true,"salt":"deadsea","name":"panagiotis panagiotis","email":"example1@gmail.com","identity":"sha256$a663d3d7423df8fcd82563c6b251b1dcc4634a0f3bf6973941acb295e0a2fce1"},"badge":{"type":"BadgeClass","name":"smart badge 3","description":"this is the description for the smart badge 3","image":"https://qualichain-project.eu/quali-data/uploads/2019/04/lightbulb-150x150.png","version":"33","criteria":{"type":"Criteria","narrative":"The holder of this badge has achieved great things in QualiChain","skills":"skills"},"issuer":{"type":"Issuer","name":"professor","description":"this is my desscription","url":"https://qualichain-project.eu/news/","email":"professor@tecnico.ulisboa.pt","image":"https://qualichain-project.eu/quali-data/themes/qualichain/assets/img/qualichain-icon-white.png","telephone":"935558789"}},"issuedOn":1612340099849,"verification":{"type":"MerQLVerification2020"},"signature":{"type":"ETHMerQL","address":"0xF952774372a8F2FaEE96D9b329887beE79D413EB","account":"0x1cf67BCCD5377aF1a69BadA19D699BCBa805E3f6","indexhash":"1aea24d6d18714cc9a35e91dddc80f45e7fcdc586cf7cf77d046d797bf473f0a","settings":{"quadHash":"KECCAK-256","treeHash":"KECCAK-256","indexHash":"KECCAK-256","lsd":2,"indexType":"object","divisor":"0xa"},"transactionhash":"0x75a7129b6ab1af0ee71b5c8f1befd1c9657007c2b661590d056d337bdd386626"}},"metadata":{"@context":{"@vocab":"https://blockchain.open.ac.uk/vocab/"},"merkletrees":{"indexhash":"1aea24d6d18714cc9a35e91dddc80f45e7fcdc586cf7cf77d046d797bf473f0a","indexhashalg":"KECCAK-256","treesettings":{"quadHash":"KECCAK-256","treeHash":"KECCAK-256","indexHash":"KECCAK-256","lsd":2,"indexType":"object","divisor":"0xa"},"trees":{"@list":[{"merkletreeid":"0","treehashalg":"KECCAK-256","merkleroot":"0a0b8ceacb7b7112702232250a7b0ae04d1a271c009ffd1a55b1f9c9c7fd4fce","merkleleaves":{"leafhashalg":"KECCAK-256","leaves":{"@list":["7ba4aa6057542ca81cf5698c88dc308ba92b44c614cca73320b04fd831e96356","44185216ff01555bc395e9521c3d2efbb11fba5fd1fc68f39087cc094919d4f7"]}}},{"merkletreeid":"1","treehashalg":"KECCAK-256","merkleroot":"b394cbb3a61a733b208abceb113d310710e806acbc10ebb5c1ea9a2e520eee6d","merkleleaves":{"leafhashalg":"KECCAK-256","leaves":{"@list":["ce9996c044d81ade6ac770f97930ac01a08436bb530461820ac483748a89f6f5","ad35d09ce61d7935e18822b17f3548a089e694b81190306abd88d373ee06b27d"]}}},{"merkletreeid":"11","treehashalg":"KECCAK-256","merkleroot":"c705a3f38294595899bbb4f0c622e7a51e445c5b9b54863eb1778ea113292118","merkleleaves":{"leafhashalg":"KECCAK-256","leaves":{"@list":["c705a3f38294595899bbb4f0c622e7a51e445c5b9b54863eb1778ea113292118"]}}},{"merkletreeid":"12","treehashalg":"KECCAK-256","merkleroot":"a30d13102bd2b16f828afa211461d1d800832d0e22922593cf5bc74ba3cc1233","merkleleaves":{"leafhashalg":"KECCAK-256","leaves":{"@list":["5110b33c4bd84450c9be8023607106b99785ffd39911e91433e28014ae73e937","352f7d50f035417d753217e8f96409ddf4d43e59795075eedc0ba9b9735ef13b","49aa0a6da2aad1b357a2ac8affdfacd450f1239ebc6a1f895851b1dd7f291338"]}}},{"merkletreeid":"13","treehashalg":"KECCAK-256","merkleroot":"6c04d074392cd57b861a719e2a75ed19b845f9a3fccdcaf43e9b8bd61000a1e4","merkleleaves":{"leafhashalg":"KECCAK-256","leaves":{"@list":["885ad7f2bb026a474731c31f9af862457cbc7bbb66eb2780c5648c9b8b062c2b","ffdfbdcb90930e415dec17e2237e04504433150e9a6d63af4e776a77863250eb","bace959956491538b8d23f602b543c4fe08f2ea002d7610cddb677754fd69014"]}}},{"merkletreeid":"14","treehashalg":"KECCAK-256","merkleroot":"fd059ee9d2707ffd648aa29cfb45de8323d37c3d3f0c08400f324fba5bf1844f","merkleleaves":{"leafhashalg":"KECCAK-256","leaves":{"@list":["fd059ee9d2707ffd648aa29cfb45de8323d37c3d3f0c08400f324fba5bf1844f"]}}},{"merkletreeid":"15","treehashalg":"KECCAK-256","merkleroot":"e038b856882cd97b7fe8e955fb8fa94c141f9de89d34149f4017fcf913980dc7","merkleleaves":{"leafhashalg":"KECCAK-256","leaves":{"@list":["e038b856882cd97b7fe8e955fb8fa94c141f9de89d34149f4017fcf913980dc7"]}}},{"merkletreeid":"16","treehashalg":"KECCAK-256","merkleroot":"283fefaf5ce6aa83d5deda255be2ea625468004d01204ba115a4782e0e60f39a","merkleleaves":{"leafhashalg":"KECCAK-256","leaves":{"@list":["283fefaf5ce6aa83d5deda255be2ea625468004d01204ba115a4782e0e60f39a"]}}},{"merkletreeid":"17","treehashalg":"KECCAK-256","merkleroot":"517114c1836337f5ddd5a947eaa34b2fdcdc033f2f1ecb894f628b5736653314","merkleleaves":{"leafhashalg":"KECCAK-256","leaves":{"@list":["d1fd030192515cf7430238e6bff8465c529412c4084054bf333d17fe5b61f21e","66b3bccc42e94fd5c7afe8f56b139511b517936c702c7d9c9b00840eb6d608fc"]}}},{"merkletreeid":"18","treehashalg":"KECCAK-256","merkleroot":"bae022e4b0a91990fa181d66d1582ec79990af4a2fb9496b9e37d09bd8d0de4e","merkleleaves":{"leafhashalg":"KECCAK-256","leaves":{"@list":["bae022e4b0a91990fa181d66d1582ec79990af4a2fb9496b9e37d09bd8d0de4e"]}}},{"merkletreeid":"19","treehashalg":"KECCAK-256","merkleroot":"cfc8f46954989267615032ff15ebc66474b6e523ca34c109548f3c4a55f1f45c","merkleleaves":{"leafhashalg":"KECCAK-256","leaves":{"@list":["cfc8f46954989267615032ff15ebc66474b6e523ca34c109548f3c4a55f1f45c"]}}},{"merkletreeid":"2","treehashalg":"KECCAK-256","merkleroot":"90198d5411c4c1fdffa77f7382d2bc29604f6de918606af5bb7305650429fb3f","merkleleaves":{"leafhashalg":"KECCAK-256","leaves":{"@list":["2cfa450eef1b47f80db4443d54876b9948d9127f9304d800989a22eddb6cd8fe","825de2fc0c4e6be64cba6151c0c8a367b0af03bdff0643cbc3fe9b7deaf80548","2572995274426b541ab8c1adc0f8f0ab6a7a44134607e9a6383e764fe8e6721d"]}}},{"merkletreeid":"20","treehashalg":"KECCAK-256","merkleroot":"9d7ef2125e63663628df2dc777b42b54fccbde13b3f262033a97e9b6a9a19458","merkleleaves":{"leafhashalg":"KECCAK-256","leaves":{"@list":["f9d9447df6cf8f26f0787fce8cb8dac2880c923c537e3d3174749e886f854c6a","95377f85c9c4a9cc86d8c549e044a33662e15cde6d31529473c525603d23d4b8","c5817b15611313416ab7f9d0db7b0c1b6d01c884975a385d0b8ec334f90bdb9b"]}}},{"merkletreeid":"21","treehashalg":"KECCAK-256","merkleroot":"be2e6f028bf5ce515e40d41c189293ac6a123ba8ab6ee93953a07ebc5e199b48","merkleleaves":{"leafhashalg":"KECCAK-256","leaves":{"@list":["be2e6f028bf5ce515e40d41c189293ac6a123ba8ab6ee93953a07ebc5e199b48"]}}},{"merkletreeid":"22","treehashalg":"KECCAK-256","merkleroot":"3347ac4d3b7e165f3974fbcec2ea315579b1dd2ee276e78e8956ab0d1d52faa8","merkleleaves":{"leafhashalg":"KECCAK-256","leaves":{"@list":["7accc37b4396d50320e032dcb735f909949fe897827caf758e7454bc5b0408c6","b7ed749e2f282a02c7fe817d7a83686512f28a766c33329ffb894b341b207bb6","6835ae87d18022c4a1150bb7382b16ec16b9d7b6bd2c1a59cc5dc5ca169065e0","a7ad70274200e016d64be1c01f6d86e7174ea45f8cf2e9070de919f256bc9d2b","586294a303a9dacd3a4764f6078c0819f9ec4dc811713ff5da2ba3949be1c99f"]}}},{"merkletreeid":"23","treehashalg":"KECCAK-256","merkleroot":"c032a6cf0c3b1292abbf63d7df71fbf426a0e3226edf27f5f8afd33949d28100","merkleleaves":{"leafhashalg":"KECCAK-256","leaves":{"@list":["8fb5c3479c3e92ff23478f72fe2cb5948a608703b91ea9defd0851453ce6ca2f","95ce128981b28a853fdd1be750b3b0ca75a539d12016009e8af18170dd21f29b"]}}},{"merkletreeid":"3","treehashalg":"KECCAK-256","merkleroot":"086da41bf129c04fa534f3fa940b6e00dd97edc2ab2ccb44cb1a80e867c05a3b","merkleleaves":{"leafhashalg":"KECCAK-256","leaves":{"@list":["086da41bf129c04fa534f3fa940b6e00dd97edc2ab2ccb44cb1a80e867c05a3b"]}}},{"merkletreeid":"4","treehashalg":"KECCAK-256","merkleroot":"cff999620170af701e084faccb4c2b39cfd78fabe3c3f79649a9ece8040d3d89","merkleleaves":{"leafhashalg":"KECCAK-256","leaves":{"@list":["cff999620170af701e084faccb4c2b39cfd78fabe3c3f79649a9ece8040d3d89"]}}},{"merkletreeid":"5","treehashalg":"KECCAK-256","merkleroot":"9e137b10296b8ae4766fce0a0736e3b088a87f40c9c40198ede546efa4268564","merkleleaves":{"leafhashalg":"KECCAK-256","leaves":{"@list":["5144a60fee1cc1f4ebe78b76cc6cad32175f8ed0a0659c2fbd14ec23f3077d97","9cfac5d65797ac2b2fb6a2d0b78db63c79e793b2029764a24c22948d527ed561","e237501ba33b4dd99487b82a3c2d5ade29ef822680db44506394b292866e8e4a","6dd7b129a10260f4842f66ca11c7fb5bf77e21bd2f466865f8958b1c4faaf074"]}}},{"merkletreeid":"7","treehashalg":"KECCAK-256","merkleroot":"5a21ae6c834f01ca91b3f78cde45ebfba94c35d8dd17fe2baa58a583b551fa87","merkleleaves":{"leafhashalg":"KECCAK-256","leaves":{"@list":["37e1db0e382df296ef238186d39267a219f2f98671ffd661daeacd36174b0914","486879105440b827f5ba4477451dabb43eb2320acfa3c171d206d12fbe22d3cc"]}}},{"merkletreeid":"9","treehashalg":"KECCAK-256","merkleroot":"259dff5cdfb45d7ba845928349d1015bc0da5444953bc52ce45d79ddcb6311b4","merkleleaves":{"leafhashalg":"KECCAK-256","leaves":{"@list":["48f49e5cc9dcc2b8e66012d3b7187fec6e433427cbca8024ac8f7545c3832d5b","66f8bb0df4d623f8fd4558f58706d6face687e95e43e3e15ae2ca98e11797814"]}}}]},"anchor":{"type":"ETHMerQL","address":"0xF952774372a8F2FaEE96D9b329887beE79D413EB","account":"0x1cf67BCCD5377aF1a69BadA19D699BCBa805E3f6","indexhash":"1aea24d6d18714cc9a35e91dddc80f45e7fcdc586cf7cf77d046d797bf473f0a","settings":{"quadHash":"KECCAK-256","treeHash":"KECCAK-256","indexHash":"KECCAK-256","lsd":2,"indexType":"object","divisor":"0xa"},"transactionhash":"0x75a7129b6ab1af0ee71b5c8f1befd1c9657007c2b661590d056d337bdd386626"}}}}
          ];
          console.log("verifySmartBadge");
  }


  openAwardDialogCourse(courseId: number, element: any) {
    console.log(courseId)
    
    const dialogRef = this.awardDialog.open(awardDialog_modal, {
      disableClose: true,
      width: '550px',
      data: {courseId: courseId, element: element, source: 'award_list', type: 'course'}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
    });
    
  }
  ngOnInit() {
    

    if(!this.currentUser) {
    //if(!this.currentUser.hasOwnProperty('id')){
      this.currentUser={id:0,role:'', userName:'', name:'', surname:'', email:'', gender:''};
    }


    this.userdata= {
      id: 0,
      name: '',
      surname: '',
      email: '',
      userName: '',
      avatar_path: 'assets/img/no_avatar.jpg',
      university: '',
      role: '',
      roles: [],
      gender: ''
  };


    this.dynamicForm = this.formBuilder.group({
      Skills: new FormArray([])
    });
    this.dynamicFormWorks = this.formBuilder.group({
      workHistory: new FormArray([])
    });
    this.dynamicFormEducations = this.formBuilder.group({
      Education: new FormArray([])
    });
    
    let id:any = 0;
    this.route.params.subscribe(params => {
      
      //console.log(params['id']);
 
            
      if(params.hasOwnProperty('id')){
        //id = +params.id;
        id = params.id;
        this.userId = params.id;        
      }
      else {        
        if(this.currentUser.hasOwnProperty('id')) { 
          id = this.currentUser.id.toString();
          this.userId = id;        
        }
      }

      
      let authorizedViewOwnProfile =  this.authservice.checkIfPermissionsExistsByUserRoles(['view_own_profile']);
      let authorizedViewOtherProfile =  this.authservice.checkIfPermissionsExistsByUserRoles(['view_other_profile']);

      if (authorizedViewOtherProfile || (authorizedViewOwnProfile && (id.toString() == this.currentUser.id.toString()))) {

        //recover smart badges of the user
        //if (id>0) {
        if (id) {
          this.getSmartBadgesByUser(id);          
        }

        //load demo data for testing proposes
        //let listOfUsers = [];      
        this.years = [1,2,3,4,5];
        this.currentJustify = 'fill';
        //this.listOfCoursesByUser = listOfCoursesByUser;
        /*
        this.cs
        .getCourses()
        .subscribe((data: Course[]) => {
          //console.log(data);
          data.forEach((element, index) => {         
            if (index<5) {
              this.listOfCoursesByUser.push(element);
            }          
          });
        });
        */     

        if (id>0) {

          //recover current job position
          this.getUserCurrentJobPosition(id.toString());

          //recover list completed courses by user id
          this.cs
          .getCompletedCourseByUserId(id)
          .subscribe((coursesData: Course[]) => {
            this.listOfCompletedCoursesByUser = coursesData;
          },
          error => {            
            console.log("error getting courses by user id")
          }
          );

          //recover teached coursed by user id
          this.cs
          .getTeachingCourseByUserId(id)
          .subscribe((data: any[]) => {
            //console.log(data);
            data.forEach((element, index) => {         
              //if (index<5) {              
                this.listOfCoursesByUser.push(element.course);
                //getSkillsByCourseId
                this.cs
                .getSkillsByCourseId(element.course.courseid)
                .subscribe((dataSkillsByCourse: any[]) => {
                  //console.log(dataSkillsByCourse);
                  this.skillsByCourseInfo[element.course.courseid] = dataSkillsByCourse;
                  
                });
              //}
              
            });
          });
        }


      }
      else {
        this.router.navigate(["/access_denied"]);
      }

       


      
      /*
      this.emptyCourseSelected = {
        courseid: 0, 
        name: '', 
        description: '', 
        related_skills: [], 
        course_badges: []
      };

      this.selectedCourse = {
        courseid: 0, 
        name: '', 
        description: '', 
        related_skills: [], 
        course_badges: []
      };
      */
     this.selectedCourse = null;


      //const id = +params.id;
      if (this.userId) {
        //this.userId=String(id);

        //if ((this.userId.toString()==this.currentUser.id.toString()) || (this.currentUser.role.toLowerCase()=='administrator')) {

        let authorizedEditOwnProfile =  this.authservice.checkIfPermissionsExistsByUserRoles(['edit_own_profile']);
        let authorizedEditOtherProfile =  this.authservice.checkIfPermissionsExistsByUserRoles(['edit_other_profile']);
        let authorizedViewRecruitment =  this.authservice.checkIfPermissionsExistsByUserRoles(['view_recruitment']);

        //if ((this.userId.toString()==this.currentUser.id.toString()) || (this.isAdmin)) {
        if (authorizedEditOtherProfile || (authorizedEditOwnProfile && (id.toString() == this.currentUser.id.toString()))) {
          this.canEditCV = true;
          this.canViewCV = true;
        }
        //else if (this.isRecruiter) {
        else if (authorizedViewRecruitment) {
          this.canViewCV = true;
        }
        
        

        this.us
        .getUser(this.userId).subscribe(
          data => {
            //console.log("user in db");
            this.userdata = data;
            
            //console.log("curent user id:"+this.currentUser.id);
            //console.log("id user rec:"+this.userId);
            //console.log(this.currentUser);
            if (this.userId.toString()==this.currentUser.id.toString()) {
              this.userdata['roles'] = this.currentUser['roles'];
            }

            if ((this.userdata.avatar_path=='') || (!this.userdata.avatar_path)){
              this.userdata.avatar_path = 'assets/img/no_avatar.jpg';
              
            } 

            this.uploads.getUserFiles(data.id).subscribe(
              res => {                
                res.files.forEach(element => {
                  var index = element.filename.indexOf(data.id+"_avatar_" ); 
                  if (index==0) {                
                    this.userdata.avatar_path =  downloadUrl+"/file/"+element.file_id;
                    let finalURL = downloadUrl+"/file/"+element.file_id;
                    //console.log(finalURL);
                    this.uploads.getFileURL(finalURL).subscribe(
                      (response: any) =>{
                        //console.log(response);
                          let dataType = response.type;
                          let binaryData = [];
                          binaryData.push(response);
                          let url = window.URL.createObjectURL(new Blob(binaryData, {type: dataType}));
                          this.profileAvatarImg = url;
                      }
                    )
                  }
                });
                                
              },
              error => {
                console.log("Error recovering files");                
              }
            );

            //Start OU connexion 
            //this.connectToOU();
            //End OU connexion 

          },
          error => {     
            if (this.userId.toString()==this.currentUser.id.toString()){
              this.userdata.id= this.currentUser.id.toString();
            }
            else {
              this.router.navigate(["/not_found"]);
            }
            
          }
        );


      }

    });


  }

  confirmDialog() {
    //console.log("delete own profile");
    const message = this.translate.instant('PROFILES.DELETE_OWN_PROFILE');
    const message2 = this.translate.instant('PROFILES.DELETE_OWN_PROFILE_HELP_MESSAGE');

    const dialogData = new ConfirmDialogModel(this.translate.instant('PROFILES.CONFIRM_ACTION'), message+"<br>"+message2);

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "400px",
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      //this.result = dialogResult;
     

      if (dialogResult) {
        //console.log(dialogResult);
        this.us.deleteUser(+this.userId).subscribe(
          data => {
            //console.log("profile deleted!!");
            //localStorage.removeItem('userdataQC');
            //localStorage.removeItem('currentUserQC');
            //localStorage.removeItem('token');
            this.authservice.logout();
            //this.router.navigate(['/login']);
            window.location.reload();
            
          },
          error => {
            alert("Error deleting own profile");
          }
        );
      }
    });

  }

  getUserCurrentJobPosition(id:string) {
    //console.log("getUserCurrentJobPosition-"+id);
    this.us.getUserProfileInJobEndPoint(+id).subscribe(
      data => {
        if ( data ) {
          if ( data.hasOwnProperty('currentJobURI') ) {
            if (data.currentJobURI) {
              //console.log(data.currentJobURI);
              var splitted = data.currentJobURI.split(":"); 
              //console.log(splitted[splitted.length-1]);
              let jobId = splitted[splitted.length-1];
              
              this.js.getJob(jobId).subscribe(
                (jobData:any) => {
                  //console.log(jobData);
                  this.currentJobPosition = jobData.label;
                },
                error => {
                  console.log("error recovering job data - jid:"+jobId);                  
                }
              );
              
            }
          }
        }
      },
      error => {
        console.log("error recovering user data from job endpoint - uid:"+id);
      }
    );

  }  

connectToOU() {
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
          //console.log(element.email+"--"+this.userdata.email);
          if (element.email.toLowerCase()==this.userdata.email.toLowerCase()) {
            //console.log(element);
            
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
                  dataSBOU.badges.forEach(elementB => {
  //                  console.log(elementB);
                    this.listOfSmartAwardsOU.push(
                      {
                      id: elementB.id,
                      name: elementB.title,
                      description: elementB.description,
                      issuer: elementB.issuerid,
                      imageurl: elementB.imageurl,
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
                    dataAssertions.items.forEach((elementA, index) => {
                      if (elementA.recipientid==element.id) {
                        //console.log(elementA);
                        
                        this.listOfSmartAwardsOU.forEach((elementBadge, indexBadge) => {
                          if (elementBadge.id==elementA.badgeid) {
                            //console.log(indexBadge+"--"+elementBadge.id+"--"+elementA.badgeid+"---"+elementA.status);                            
                            this.smartBadgesByUser.push(
                              {
                                'id': elementBadge.id, 
                                'badge': {
                                  'name': elementBadge.name, 
                                  'description': elementBadge.description, 
                                  'image': elementBadge.imageurl,
                                  'status': elementA.status
                                }
                              })
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

            

          }                
        });

    });

    }
    
    //console.log(this.selectedUserAwards);
  },
  error => {
    console.log("error recovering token");
  }
  );   
}


  ngAfterViewChecked () {
    //this.DrawChart();
  }

  private DrawChart() {
    var elementExists = document.getElementById("sankey");
    if (elementExists) {
      document.getElementById("sankey").innerHTML = "";

      var svg = d3.select("#sankey"),
          width = +svg.attr("width"),
          height = +svg.attr("height");

      var formatNumber = d3.format(",.0f"),
          //format = function (d: any) { return formatNumber(d) + " TWh"; },
          format = function (d: any) { return formatNumber(d) },
          color = d3.scaleOrdinal(d3.schemeCategory10);

      var sankey = d3Sankey.sankey()
          .nodeWidth(15)
          .nodePadding(10)
          .extent([[1, 1], [width - 1, height - 6]]);

      var link = svg.append("g")
          .attr("class", "links")
          .attr("fill", "none")
          .attr("stroke", "#000")
          .attr("stroke-opacity", 0.2)
          .selectAll("path");

      var node = svg.append("g")
          .attr("class", "nodes")
          .attr("font-family", "sans-serif")
          .attr("font-size", 10)
          .selectAll("g");

      //d3.json("./energy.json", function (error, energy: any) {
          //if (error) throw error;

      const jobposition: DAG = {
      //var JOBPOSITIONS = {
          nodes: [{
              nodeId: 0,
              name: "Programmer"
          }, {
              nodeId: 1,
              name: "Senior Developer"
          }, {
              nodeId: 2,
              name: "Lead Developer"
          }, {
              nodeId: 3,
              name: "Software Architect"
          }, {
              nodeId: 4,
              name: "Development Manager"
          }, {
            nodeId: 5,
            name: "Project Manager"
          }, {
            nodeId: 6,
            name: "Product Manager"
          }, {
            nodeId: 7,
            name: "CTO"
          }],
          links: [{
              source: 0,
              target: 1,
              value: 4,
              uom: 'Widget(s)'
          }, {
              source: 1,
              target: 2,
              value: 2,
              uom: 'Widget(s)'
          }, {
              source: 1,
              target: 3,
              value: 2,
              uom: 'Widget(s)'
          }, {
              source: 2,
              target: 4,
              value: 1,
              uom: 'Widget(s)'
          }, {
              source: 3,
              target: 5,
              value: 2,
              uom: 'Widget(s)'
          }, {
              source: 4,
              target: 7,
              value: 1,
              uom: 'Widget(s)'
          }, {
              source: 3,
              target: 6,
              value: 2,
              uom: 'Widget(s)'
          }, {
            source: 5,
            target: 7,
            value: 1,
            uom: 'Widget(s)'
        }
        ]
      };


          sankey(jobposition);

          link = link
              .data(jobposition.links)
              .enter().append("path")
              .attr("d", d3Sankey.sankeyLinkHorizontal())
              .attr("stroke-width", function (d: any) { return Math.max(1, d.width); });

          link.append("title")
              .text(function (d: any) { return d.source.name + " → " + d.target.name + "\n" + format(d.value); });

          node = node
              .data(jobposition.nodes)
              .enter().append("g");

          node.append("rect")
              .attr("x", function (d: any) { return d.x0; })
              .attr("y", function (d: any) { return d.y0; })
              .attr("height", function (d: any) { return d.y1 - d.y0; })
              .attr("width", function (d: any) { return d.x1 - d.x0; })
              .attr("fill", function (d: any) { return color(d.name.replace(/ .*/, "")); })
              .attr("stroke", "#000");

          node.append("text")
              .attr("x", function (d: any) { return d.x0 - 6; })
              .attr("y", function (d: any) { return (d.y1 + d.y0) / 2; })
              .attr("dy", "0.35em")
              .attr("text-anchor", "end")
              .text(function (d: any) { return d.name; })
              .filter(function (d: any) { return d.x0 < width / 2; })
              .attr("x", function (d: any) { return d.x1 + 6; })
              .attr("text-anchor", "start");

          node.append("title")
              .text(function (d: any) { return d.name + "\n" + format(d.value); });
      //});

    }
  }  

  getBase64ImageFromURL(url) {
    if (url=='') {
      url = 'assets/img/no_avatar.jpg';
    }
    
      return new Promise((resolve, reject) => {
        var img = new Image();
        img.setAttribute("crossOrigin", "anonymous");
        img.onload = () => {
          var canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          var ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0);
          var dataURL = canvas.toDataURL("image/png");
          resolve(dataURL);
        };
        img.onerror = error => {
          reject(error);
        };
        img.src = url;
      });
  
  }
  

 
async generatePdf(action = 'open') {
  //console.log(this.userdata.avatar_path);
  if (!this.userdata.avatar_path) {
    this.userdata.avatar_path = 'assets/img/no_avatar.jpg';
  }
  //console.log(this.userdata.avatar_path);
  
  let docDefinition = {
    footer: function(currentPage, pageCount) {
      return {
          margin:10,
          columns: [          
          {
              fontSize: 9,
              text:[
              {
              text: '--------------------------------------------------------------------------' +
              '\n',
              margin: [0, 20]
              },
              {
              text: '© QualiChain. ' + currentPage.toString() + ' of ' + pageCount,
              }
              ],
              alignment: 'center',
              color: '#0e3664'
          }
          ]
      };
  },
    header: {
      margin: 10,
      columns: [
          {
              // usually you would use a dataUri instead of the name for client-side printing
              // sampleImage.jpg however works inside playground so you can play with it
              image: await this.getBase64ImageFromURL(
                '/assets/img/qualichain-icon-white.png'
              ),
              width: 20,
              margin: [40, 0, 0, 0],
          },
          {
              margin: [0, 0, 40, 0],
              text: 'QualiChain',
              color: '#0e3664',
              alignment: 'right',
          }
      ]
  },
    content: [      
      {
        text: this.translate.instant('PROFILES.PROFILE'),
        bold: true,
        fontSize: 20,
        alignment: 'center',
        margin: [0, 0, 0, 20],
        color: '#0e3664'
      },
      {
        canvas: [
            {
                type: 'line',
                lineColor: '#0e3664',
                x1: 0,
                y1: -10,
                x2: 520,
                y2: -10,
                lineWidth: 5,
            }
        ]
    },
      {
        columns: [
          [
            {
              text: " "
           },
          {
            text: this.translate.instant('PROFILES.USERNAME')+' : ' + this.userdata.userName, color: '#0e3664'
          },
          {
            text: this.translate.instant('PROFILES.NAME')+': ' + this.userdata.name, color: '#0e3664'
          },
          {
            text: this.translate.instant('PROFILES.SURNAME')+': ' + this.userdata.surname, color: '#0e3664'
          },      
          {
            text: this.translate.instant('PROFILES.EMAIL')+': ' + this.userdata.email, color: '#0e3664'
          }],
          [ 
            {image: await this.getBase64ImageFromURL(
              this.userdata.avatar_path
            ),
            height: 100
            }]
         ]      
      }      
    ]
  };

  //pdfMake.createPdf(docDefinition).open();
  switch (action) {
    case 'open': pdfMake.createPdf(docDefinition).open();    
    break;
    case 'print': pdfMake.createPdf(docDefinition).print(); 
    break;
    case 'download':     
    pdfMake.createPdf(docDefinition).download(); 
    break;
    default: pdfMake.createPdf(docDefinition).open(); 
    break;
  }
}



}

interface SNodeExtra {
  nodeId: number;
  name: string;
}

interface SLinkExtra {
  source: number;
  target: number;
  value: number;
  uom: string;
}
type SNode = d3Sankey.SankeyNode<SNodeExtra, SLinkExtra>;
type SLink = d3Sankey.SankeyLink<SNodeExtra, SLinkExtra>;

interface DAG {
  nodes: SNode[];
  links: SLink[];
}

/**********/
interface CompetencyLevelValues {
  value: string;
  viewValue: string;
}

/************************/
@Component({
  selector: 'CVDialog',
  templateUrl: './CVDialog.html',
  styleUrls: ['./profiles-view.component.css']
})
export class CVDialog_modal implements OnInit {
  
  loadingSpinner: Boolean= true;
  currentUser: User;
  userdata: User;
  dynamicForm: FormGroup;
  dynamicFormWorks: FormGroup;
  dynamicFormEducations: FormGroup;

  label: string;
  description: string;
  targetSector: string;

  canViewCV: boolean = false;
  canEditCV: boolean = false;
  skillsCV: any = [];
  workHistoryCV: any = [];
  educationHistoryCV: any = [];
  showError: boolean = false;

  competencies: CompetencyLevelValues[] = [
    {value: 'basic', viewValue: 'Basic'},
    {value: 'medium', viewValue: 'Medium'},
    {value: 'advanced', viewValue: 'Advanced'}
  ];

  //private appcomponent: AppComponent,
  constructor(            
    private router: Router,  
    private us: UsersService, private authservice: AuthService,
    private cvs: CVService,
    private formBuilder: FormBuilder,
    public CVDialog: MatDialog,
    public dialogRef: MatDialogRef<CVDialog_modal>,
    @Inject(MAT_DIALOG_DATA) public data: CVDialogData) {

      this.authservice.currentUser.subscribe(x => this.currentUser = x);

    }
    
    isLogged = false;
    isAdmin = false;
    isRecruiter = false;
    isProfessor = false;
    isStudent = false;
    isEmployee = false;
    
    /*
    isLogged = this.appcomponent.isLogged;
    isAdmin = this.appcomponent.isAdmin;
    isRecruiter = this.appcomponent.isRecruiter;
    //isTeacher = this.appcomponent.isTeacher;
    isProfessor = this.appcomponent.isProfessor;
    isStudent = this.appcomponent.isStudent;
    isEmployee = this.appcomponent.isEmployee;
    */
    getUserData(id:string) {
      
      this.us.getUser(id).subscribe(
        data => {
          //console.log("user in db");
          this.userdata = data;
        },
        error => {            
          this.router.navigate(["/not_found"]);            
        }
      );
    }
    

    getUserCV(id:string) {
      this.cvs
      .getCV(id)
      .subscribe((data: any) => {

          this.label = data.label;
          this.description = data.description;
          this.targetSector = data.targetSector;
          this.skillsCV = data.skills;
          this.workHistoryCV = data.workHistory;
          this.educationHistoryCV = data.education;
          if(data.skills){
           data.skills.forEach(element => {
            if (element.proficiencyLevel) {
              this.t.push(this.formBuilder.group({
                label: [element.label, [Validators.required]],
                proficiencyLevel: [element.proficiencyLevel, Validators.required],
                comment: [element.comment, [Validators.required]],      
              }));
            }
            else {
              this.t.push(this.formBuilder.group({
                label: [element.label, [Validators.required]],
                proficiencyLevel: [element.skillLevel, Validators.required],
                comment: [element.comment, [Validators.required]],      
              }));
            }
            });
          }
          if(data.workHistory){
            data.workHistory
            .forEach(element => {
              this.w.push(this.formBuilder.group({
                position: [element.position, Validators.required],
                from: [element.from, [Validators.required]],
                to: [element.to, [Validators.required]],
                employer: [element.employer, [Validators.required]],
              }));
            });
          }
          if(data.education){
            data.education
            .forEach(element => {
              this.e.push(this.formBuilder.group({
                title: [element.title, Validators.required],
                from: [element.from, [Validators.required]],
                to: [element.to, [Validators.required]],
                organisation: [element.organisation, [Validators.required]],
                description: [element.description, [Validators.required]],
              }));
            });  
          }
          this.loadingSpinner = false;
        //}      
      },
      error => {            
        this.loadingSpinner = false;
      });
    }

  ngOnInit() {

    //console.log(this.data.userId);
    this.userdata = {id:0,role:'', userName:'', name:'', surname:'', email:'', gender:''}

    if(!this.currentUser) {
        this.currentUser={id:0,role:'', userName:'', name:'', surname:'', email:'', gender:''};
    }

    this.dynamicForm = this.formBuilder.group({
      Skills: new FormArray([])
    });
    this.dynamicFormWorks = this.formBuilder.group({
      workHistory: new FormArray([])
    });
    this.dynamicFormEducations = this.formBuilder.group({
      Education: new FormArray([])
    });

    this.getUserData(this.data.userId.toString());
    this.getUserCV(this.data.userId.toString());
    

    //console.log(this.data.userId+"----"+this.currentUser.id)
    //if ((this.data.userId.toString()==this.currentUser.id.toString()) || (this.currentUser.role.toLowerCase()=='administrator')) {
    if ((this.data.userId.toString()==this.currentUser.id.toString()) || (this.isAdmin)) {      
      this.canEditCV = true;
      this.canViewCV = true;
    }
    //else if (this.currentUser.role.toLowerCase()=='recruiter') {
    else if (this.isRecruiter) {
      this.canViewCV = true;
    }

  }

  
  
  onSubmitAwardsModal() {
    console.log("bb CV ");
  }

  onNoClick(): void {
    this.dialogRef.close();
  }


// convenience getters for easy access to form fields
get fC() { return this.dynamicForm.controls; }  
get t() { return this.fC.Skills as FormArray; }

get wC() { return this.dynamicFormWorks.controls; }
get w() { return this.wC.workHistory as FormArray; }

get eC() { return this.dynamicFormEducations.controls; }
get e() { return this.eC.Education as FormArray; }

deleteFormGroupItem(e, i, type) {
  if (type=='skillitem') {
    this.t.removeAt(i);    
  } 
  else if (type=='workitem') {
    this.w.removeAt(i);    
  }
  else if (type=='educationitem') {
    this.e.removeAt(i);    
  }
}



openAddNewItem(e, type) {
     
  const dialogRef = this.CVDialog.open(AddItemDialog_modal, {
    disableClose: true,
    width: '550px',
    data: {type: type, isAdmin: this.isAdmin, isRecruiter: this.isRecruiter}
  });

  dialogRef.afterClosed().subscribe(result => {
    //console.log(result);
    if (result!=false) {
      if (type=='skillitem') {
        this.t.push(this.formBuilder.group({
          label: [result.label, [Validators.required]],
          proficiencyLevel: [result.proficiencyLevel, Validators.required],
          comment: [result.comment, [Validators.required]],      
        }));
      }
      else if (type=='workitem') {
        this.w.push(this.formBuilder.group({
          position: [result.position, Validators.required],
          from: [result.from, [Validators.required]],
          to: [result.to, [Validators.required]],
          employer: [result.employer, [Validators.required]],
        }));
      }
      else if (type=='educationitem') {
        this.e.push(this.formBuilder.group({
          title: [result.title, Validators.required],
          from: [result.from, [Validators.required]],
          to: [result.to, [Validators.required]],
          organisation: [result.organisation, [Validators.required]],
          description: [result.description, [Validators.required]],
        }));
      }
    }
  });
  
}

addFormGroupItem(e, type) {
  if (type=='skillitem') {
    this.t.push(this.formBuilder.group({
      label: ['', [Validators.required]],
      proficiencyLevel: ['', Validators.required],
      comment: ['', [Validators.required]],      
    }));
  }
  else if (type=='workitem') {
    this.w.push(this.formBuilder.group({
      position: ['', Validators.required],
      from: ['', [Validators.required]],
      to: ['', [Validators.required]],
      employer: ['', [Validators.required]],
    }));
  }
  else if (type=='educationitem') {
    this.e.push(this.formBuilder.group({
      title: ['', Validators.required],
      from: ['', [Validators.required]],
      to: ['', [Validators.required]],
      organisation: ['', [Validators.required]],
      description: ['', [Validators.required]],
    }));
  }


}  


onSubmit() {
  this.showError = false;
  this.loadingSpinner = true;
  var userId: string = this.data.userId.toString();
  var re = /:/gi;
  var newsUserId: string = userId.replace(re, "");

  var dataToSend = {
    'personURI': ":"+newsUserId,
    'label':this.label,
    'targetSector': this.targetSector,
    'description': this.description,
    'skills': this.dynamicForm.value.Skills,
    'workHistory': this.dynamicFormWorks.value.workHistory,
    'education': this.dynamicFormEducations.value.Education
  };

  //console.log(this.data.userId);

  this.cvs.postCV(this.data.userId, dataToSend).subscribe(
    res => {
      //console.log(res);
      //console.log("CV sended correctly");
      //alert('Success!!');
      this.loadingSpinner = false;
      this.showError = false;
      this.dialogRef.close();
    },
    error => {
      //console.log("error sending CV data");
      //alert('Error sending data!!!');
      this.loadingSpinner = false;
      this.showError = true;
    }
  );


  
}



}

/*******************/ 
@Component({
  selector: 'UPLOAD_CV_KG_Dialog_modal',
  templateUrl: './uploadCVTOKG.html',
  styleUrls: ['./profiles-view.component.css']
})
export class UPLOAD_CV_KG_Dialog_modal implements OnInit {
  
  dobieResult: string = null;
  uploadFinished: boolean = false;
  errorLoadingData: boolean = false;

  constructor(
    private us: UtilsService,
    public dialogRef: MatDialogRef<UPLOAD_CV_KG_Dialog_modal>,
    @Inject(MAT_DIALOG_DATA) public data: CVDialogData) {}
  
    
  
  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
    
    //console.log(this.data.userId);

  }

  myCallbackFunctionKG = (args: any): void => {
    //callback code here 
    //console.log(args);
    this.dobieResult = args.message;
    if (args.status=='ok') {
      this.us.sendTextTriples(args.message).subscribe(
        res => {
          //console.log("Tripleted created");
          //console.log(res);
          this.uploadFinished = true;        
        },
        error => {
          console.log("Error sending triplete!!");
          console.log(error);
          this.uploadFinished = true;
          this.errorLoadingData = true;
        }
      );
    }
    else {
      this.uploadFinished = true;
      this.errorLoadingData = true;
    }


  }

}

export interface CVDialogData {
  userId: number;
}


export interface AddItemDialogData {
  type: string;
}

/************* */
@Component({
  selector: 'AddItemDialog',
  templateUrl: './modalAddItem.html',
  styleUrls: ['./profiles-view.component.css']
})
export class AddItemDialog_modal implements OnInit {
  
  //skill
  skill_label: string = "";
  skill_profiency_level: string = "";
  skill_comment: string = "";
  
  //work
  work_position: string = "";
  work_from: string = "";
  work_to: string = "";
  work_employer: string = "";

  //education
  education_title: string = "";
  education_from: string = "";
  education_to: string = "";
  education_organisation: string = "";
  education_description: string = "";

  competencies: CompetencyLevelValues[] = [
    {value: 'basic', viewValue: 'Basic'},
    {value: 'medium', viewValue: 'Medium'},
    {value: 'advanced', viewValue: 'Advanced'}
  ];

  constructor(
    private us: UtilsService,
    public dialogRef: MatDialogRef<AddItemDialog_modal>,
    @Inject(MAT_DIALOG_DATA) public data: AddItemDialogData) {}

    ngOnInit() {
      //console.log(this.data.type.toString());
    }

    onSubmit() {
      //console.log("submit!!");

      var dataToReturn = {};

      if (this.data.type=='skillitem') {
        dataToReturn = {
          "label": this.skill_label,
          "proficiencyLevel": this.skill_profiency_level,
          "comment": this.skill_comment
        }
      }
      else if (this.data.type=='workitem') {
        dataToReturn = {
          "position": this.work_position,
          "from": this.work_from,
          "to": this.work_to,
          "employer": this.work_employer
        }
      }
      else if (this.data.type=='educationitem') {
        dataToReturn = {
          "title": this.education_title,
          "from": this.education_from,
          "to": this.education_to,
          "organisation": this.education_organisation,
          "description": this.education_description
        }
      }

      this.dialogRef.close(dataToReturn);
      

    }

}