import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import {MatTableDataSource} from '@angular/material/table';

import { Component, OnInit, Inject } from '@angular/core';

export interface selectedCities {
  name: string;
}

//const ELEMENT_DATA: selectedCities[] = [];
const ELEMENT_DATA: string[] = [];

@Component({
  selector: 'app-qc-select-city-dialog',
  templateUrl: './qc-select-city-dialog.component.html',
  styleUrls: ['./qc-select-city-dialog.component.css']
})
export class QcSelectCityDialogComponent implements OnInit {

  country: string;
  state: string;
  city: string;
  public profileForm: FormGroup;
  listOfCitiesSelected: string[] = [];

  displayedColumns: string[] = ['$implicit','index'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<QcSelectCityDialogComponent>,
    ) {

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
          this.state = null;
          this.city = null;
        });
      // parent tracks child's input state change  
      this.profileForm.controls.selectCtrlState.valueChanges.subscribe( value =>
      {
        this.state = value;
        this.city = null;
      });
      // parent tracks child's input state change  
      this.profileForm.controls.selectCtrlCity.valueChanges.subscribe( value =>
      {
        this.city = value;
      });  

  }

  ngOnInit(): void {
  }

  onConfirm(): void {
    // Close the dialog, return true
    this.dialogRef.close(true);
  }

  onDismiss(): void {
    // Close the dialog, return false
    this.dialogRef.close(false);
  }

  addCityToTheList(): void {
    if (this.listOfCitiesSelected.indexOf(this.city) > -1) {
      alert("This city is selected");
    }
    else {      
      this.listOfCitiesSelected.push(this.city);

      //let newCity:selectedCities = {name:this.city};
      ELEMENT_DATA.push(this.city);;
      this.dataSource.data = ELEMENT_DATA;

    }
  }

  deleteRow(index): void {
    
    ELEMENT_DATA.splice(index, 1);
    this.dataSource.data = ELEMENT_DATA;
      
  }

  addlistofcities(): void {
    //console.log("addlistofcities");
    this.dialogRef.close(ELEMENT_DATA);
    //this.dialogRef.close(true);
  }
}
