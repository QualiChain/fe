import { Component, OnInit } from '@angular/core';
import User from '../../../_models/user';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { MessageService } from '../../../_services/message.service'
import { QCStorageService } from '../../../_services/QC_storage.services';

export interface Specialization {
  name: string;
}

export interface Location {
  name: string;
}

export interface NotificationPreference {  
 id: number,
 locations: string,
 specializations: string,
 user_id: number
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
  addOnBlurSpecialization = true;

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

  constructor(
    private qcStorageService: QCStorageService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private ms : MessageService,
  ) { }

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
                  this.specializations.push({name: element.trim()});
                });
              }

              if ('locations' in this.userPreferences) {
                let initialListOfLocations = this.userPreferences.locations.split(",");

                initialListOfLocations.forEach(element => {
                  //console.log(element);
                  this.locations.push({name: element.trim()});                
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

    // Add the new skill
    if ((value || '').trim()) {
      this.specializations.push({name: value.trim()});
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
      listOfSpecializations = listOfSpecializations+element.name;
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
        console.log(res);
        //alert("Saved!!!");
        this.displayMessage = true;
      },
      error => {        
          //alert("Error saving notification preferences!!");
          this.displayErrorMessage = true;
        }
      );

  }

}
