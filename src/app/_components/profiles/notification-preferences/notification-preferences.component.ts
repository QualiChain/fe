import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import User from '../../../_models/user';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { MessageService } from '../../../_services/message.service'
import { QCStorageService } from '../../../_services/QC_storage.services';
import {Observable} from 'rxjs';
import {FormControl} from '@angular/forms'
import {map, startWith} from 'rxjs/operators';
import { SpecializationsService } from '../../../_services/specializations.service'

import { MatDialog } from '@angular/material/dialog';
//import { MatDialogRef } from '@angular/material/dialog';
//import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { QcSelectCityDialogComponent } from '../../../_components/utils/qc-select-city-dialog/qc-select-city-dialog.component';

export interface Location {
  name: string;
}

export interface NotificationPreference {  
 id: number,
 locations: string,
 specializations: string,
 user_id: number
}
/*
export interface Specialization {
  name: string;
}
*/

export interface Specialization {
  title: string;
  id: number;
}

@Component({
  selector: 'app-notification-preferences',
  templateUrl: './notification-preferences.component.html',
  styleUrls: ['./notification-preferences.component.css']
})
export class NotificationPreferencesComponent implements OnInit {

  currentUser: User;
  specializations: Specialization[] = [];
  selectableSpecialization = true;
  removableSpecialization = true;  
  //addOnBlurSpecialization = true;
  addOnBlurSpecialization = false;

  locations: Location[] = [];
  selectableLocation = true;
  removableLocation = true;  
  addOnBlurLocation = true;
  userId = null;

  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  //userPreferences: NotificationPreference;
  userPreferences: any = {};

  displayErrorMessage: boolean = false;
  //errorMessage: string = "";
  displayMessage: boolean = false;
  //message: string = "";

  //skillCtrl = new FormControl();
  allSpecializations: Specialization[] = [];
  specializationCtrl = new FormControl();
  filteredSpecializations: Observable<string[]>;

  @ViewChild('specializationsInput', {static: false}) specializationsInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto', {static: false}) matAutocomplete: MatAutocomplete;

  selected(event: MatAutocompleteSelectedEvent): void {
    //console.log(event);
    this.specializations.push(event.option.value);
    this.specializationsInput.nativeElement.value = '';
    this.specializationCtrl.setValue(null); 
  }

  private _filter(value: any): any[] {
    if ( value.hasOwnProperty('title') ) {
      return this.allSpecializations;
    }
    else {
      //filter by text
      let filteredSpecializations: Specialization[] = this.allSpecializations.filter(specialisation => specialisation.title.toLowerCase().includes(value.toLowerCase()));

      //filter specializations we have in the selectd list of specializations
      let activeIds = [];
      this.specializations.forEach(element => {
        activeIds.push(element.title.toLowerCase());
      });

      let arr = filteredSpecializations;

      if (activeIds.length>0) {
        arr = arr.filter(function(item){
          return activeIds.indexOf(item.title.toLowerCase()) === -1;
        });
      }
      
      
      return arr;
    }

  }

  constructor(
    private qcStorageService: QCStorageService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private ms : MessageService,
    private ss: SpecializationsService,
    public matDialog: MatDialog
  ) { 

    this.filteredSpecializations = this.specializationCtrl.valueChanges.pipe(
      startWith(null),
      map((specialization: string | null) => specialization ? this._filter(specialization) : this.allSpecializations.slice())
      );


  }

  ngOnInit(): void {

    if(!this.currentUser) {      
      this.currentUser={id:0,role:'', userName:'', name:'', surname:'', email:'', pilotId: null};
    }

    this.route.params.subscribe(params => {

      const id = +params.id;
      
      if (id && id > 0) {
        //let userdata = JSON.parse(localStorage.getItem('userdata'));
        let userdata = JSON.parse(this.qcStorageService.QCDecryptData(localStorage.getItem('userdataQC')));
        //console.log(userdata.role.toLowerCase());
        if ((String(userdata.id) == String(id)) || (userdata.role.toLowerCase() =='administrator')) {

          this.userId = id;

          //ms.getUserNotificationsPreferences
          this.ms.getUserNotificationsPreferences(+id).subscribe(
            res => {
              //console.log("Request OK");
              //console.log(res);
              this.userPreferences = res;
              
              if ('specializations' in this.userPreferences) {
                let initialListOfSpecializations = this.userPreferences.specializations.split(",");

                initialListOfSpecializations.forEach(element => {
                  //console.log(element);
                  if (element.trim().length>0) {
                    this.specializations.push({id: null, title: element.trim()});
                  }
                });
              }

              if ('locations' in this.userPreferences) {
                let initialListOfLocations = this.userPreferences.locations.split(",");

                initialListOfLocations.forEach(element => {
                  //console.log(element);
                  if (element.trim().length>0) {
                    this.locations.push({name: element.trim()});
                  }                  
                });
              }

            },
            error => {
              console.log("Error getting data");                            
            }
          );               
        }
        else {
          this.router.navigate(["/access_denied"]);
        }


        this.allSpecializations = [];
        this.ss.getSpecializations().subscribe(
        resSpecializations => {
          //console.log("Request OK");
          //console.log(resSpecializations); 
        
          resSpecializations.forEach(element => {
            //console.log(element.title);
            let data: Specialization = {title:element.title, id:element.id};
            this.allSpecializations.push(data)          
          });       
        
        },
        error => {
            console.log("Error getting data");            
        });

      }
      else {
        this.router.navigate(["/access_denied"]);
      }

    });


  }


  addLocation(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add the new skill
    if ((value || '').trim()) {
      this.locations.push({name: value.trim()});
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }  

  removeLocation(location: Location): void {
    const index = this.locations.indexOf(location);

    if (index >= 0) {
      this.locations.splice(index, 1);
    }
  }

  addSpecialization(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add the new specialization
    if ((value || '').trim()) {
      this.specializations.push({id: null, title: value.trim()});
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }  

  removeSpecialization(specialization: Specialization): void {
    const index = this.specializations.indexOf(specialization);

    if (index >= 0) {
      this.specializations.splice(index, 1);
    }
  }

  processForm() {
    //console.log(this);
    //console.log(this.userPreferences.id);
    this.displayErrorMessage = false;
    this.displayMessage = false;

    let listOfLocations = "";    
    this.locations.forEach(element => {
      if (listOfLocations!="") {
        listOfLocations = listOfLocations+",";
      }
      listOfLocations = listOfLocations+element.name;
    });

    let listOfSpecializations = "";    
    this.specializations.forEach(element => {
      if (listOfSpecializations!="") {
        listOfSpecializations = listOfSpecializations+",";
      }
      listOfSpecializations = listOfSpecializations+element.title;
    });

    let dataToPost = {
      "user_id": this.userId,
      "locations": listOfLocations,
      "specializations": listOfSpecializations
      };
      //console.log(dataToPost);      
      this.saveData(dataToPost);

      /*      
      if (this.userPreferences.id>0) {
        //console.log("deleting old preferences");
        this.ms.deleteUserNotificationsPreferences(this.userPreferences.id).subscribe(
          res => {
            this.saveData(dataToPost);
          },
          error => {        
              console.log("Error deleting notification preferences!!");
              //alert("Error saving notification preferences!!"); 
              this.displayErrorMessage = true;
            }
          );        
      }
      else {
        this.saveData(dataToPost);
      }
      */
      

  }


  saveData(dataToPost) {

    this.ms.addUserNotificationsPreferences(dataToPost).subscribe(
      res => {
        //console.log(res);
        //alert("Saved!!!");
        this.displayMessage = true;
      },
      error => {        
          //alert("Error saving notification preferences!!");
          this.displayErrorMessage = true;
        }
      );

  }

  openAddLocation() {


    const dialogRef = this.matDialog.open(QcSelectCityDialogComponent, {
      disableClose: true,
      width: '650px'
    });

    dialogRef.afterClosed().subscribe(result => {
     
      if (result.length>0) {
        for (let i = 0; i < result.length; i++) {
          let customEvent:MatChipInputEvent = {value:result[i], input: null};
          this.addLocation(customEvent);
        }
      }

    });

  }

}
