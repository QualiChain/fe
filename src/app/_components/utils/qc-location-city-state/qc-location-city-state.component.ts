import { Component, Input, Output, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

export interface cities {
  id: number;
  name: string;
  city_code: string;
}

export interface CityStateOption {
  name: string;
  state_code: string;
  cities: cities[];
}

@Component({
  selector: 'app-qc-location-city-state',
  templateUrl: './qc-location-city-state.component.html',
  styleUrls: ['./qc-location-city-state.component.css']
})
export class QcLocationCityStateComponent implements OnInit {

  cityStyateOptions: CityStateOption[] = [
    {"name":"Catalunya","state_code":"Barcelona Province","cities":[{"id":1,"name":"Barcelona","city_code":"Barna"},{"id":2,"name":"Lleida","city_code":"Lleida"},{"id":3,"name":"Girona","city_code":"Girona"},{"id":4,"name":"Tarragona","city_code":"Tarragona"}]},
    {"name":"Madrid","state_code":"Madrid Province","cities":[{"id":3,"name":"Madrid","city_code":"Madrid"}]}
  ];

  filteredListOfCities: cities[];

  @Input() defaultValue: string;
  @Input() requiredValue: boolean;
  @Input() stateValue: string = null;

/**
   * List of options to use for mat-option
   */
  //@Input() options: SimpleOption[];
  /**
   * Parent FormGroup for inputs of this component
   */
  @Input() parentForm: FormGroup;
  /**
   * mat-select control
   */
  @Input() formInnerControlName: string;

  constructor() { }

  ngOnInit(): void {}

  ngOnChanges(): void { 
    let index = this.cityStyateOptions.findIndex(x => x.state_code === this.stateValue);
    if (index>=0) {
      this.filteredListOfCities = this.cityStyateOptions[index].cities;
    }
    else {
      this.filteredListOfCities = [];
    }
  }

}
