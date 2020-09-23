import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import {FormControl} from '@angular/forms';
import { McdssService } from '../../_services/mcdss.service';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';

export interface mcdssOutput {
  Alternative: string;
  Ranking: number;
  Score: number;
}
/*
let ELEMENT_DATA: mcdssOutput[] = [ 
  { Alternative: "alternative 1", Ranking: 1, Score: 1 }, 
  { Alternative: "alternative 2", Ranking: 2, Score: 0.9706 }, 
  { Alternative: "alternative 3", Ranking: 3, Score: 0 } 
];
*/
let ELEMENT_DATA: mcdssOutput[] = [];

@Component({
  selector: 'app-mcdss',
  templateUrl: './mcdss.component.html',
  styleUrls: ['./mcdss.component.css']
})
export class MCDSSComponent implements OnInit {

  displayResults: boolean = false;
  displayError: boolean = false;
  errorMessage: string = "";

  displayedColumns: string[] = ['Alternative', 'Ranking', 'Score'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);

  
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  
  dynamicFormCriterias: FormGroup;
  dynamicForAlternatives: FormGroup;
  criteriaCtrl = new FormControl();
  

 methods: any[] = [
  {id: 'maut', name: 'MAUT'},
  {id: 'topsis', name: 'TOPSIS'},
  {id: 'electreI', name: 'ELECTRE I'}
  ];
  selectedMethod: string = "";
  agreement_threshold: number = 1;
  
  response: any = [];

  constructor(
    private formBuilder: FormBuilder,
    private McdssService: McdssService,
  ) { }

  ngOnInit(): void {
    
    this.dataSource.sort = this.sort;
    
    this.dynamicFormCriterias = this.formBuilder.group({
      Criterias: new FormArray([])
    });

    this.dynamicForAlternatives = this.formBuilder.group({
      Alternatives: new FormArray([])
    });
    
    //init table
    this.addFormGroupItem(null,'criteria');
    this.addFormGroupItem(null,'alternative');
    this.addFormGroupItem(null,'alternative');
  }

  trackByIdx(index: number, obj: any): any {
    return index;
  }


  save() {
    this.errorMessage = "";
    this.displayResults = false;
    this.displayError = false;

    let numAlternatives = this.dynamicForAlternatives.value.Alternatives.length;
    let numCriterias = this.dynamicFormCriterias.value.Criterias.length;

    let criteriasLabels = [];
    let criteriasWeights = [];
    let criteriasTypes = [];
    let criteriasVetos = [];
    for (let index = 0; index < numCriterias; index++) {
      criteriasLabels.push(this.dynamicFormCriterias.value.Criterias[index].label);
      criteriasWeights.push(+this.dynamicFormCriterias.value.Criterias[index].weight);
      criteriasTypes.push(+this.dynamicFormCriterias.value.Criterias[index].type);
      criteriasVetos.push(+this.dynamicFormCriterias.value.Criterias[index].veto_thresholds);      
    }

    let criteriaDetails =
      {
        "Number_of_criteria": numCriterias,
        "Weights": criteriasWeights,
        "Optimization_Type": criteriasTypes,
        
      };

    if (this.selectedMethod=='electreI') {
      let agreement_threshold_number = +this.agreement_threshold;
      criteriaDetails["Agreement_Threshold"] = agreement_threshold_number;
      criteriaDetails["Veto_Thresholds"] = criteriasVetos;        
    }
    
    let alternativesData = [];
    for (let index = 0; index < numAlternatives; index++) {
      
      let arrayValues = [];
      

      for (let indexValues = 0; indexValues < Object.keys(this.dynamicForAlternatives.value.Alternatives[index].Values).length; indexValues++) {
        arrayValues.push(+this.dynamicForAlternatives.value.Alternatives[index].Values[indexValues].value)
      }
 
     let dataToPush ={ 
      Name: this.dynamicForAlternatives.value.Alternatives[index].Name,
      Values: arrayValues
     }

     alternativesData.push(dataToPush);
    }


    let dataToPost = {
      "Decision_Matrix":
        {
            "Number_of_alternatives": numAlternatives,
            "Number_of_criteria": numCriterias,
            "Criteria": criteriasLabels,
            "Alternatives": alternativesData
        },
      "Criteria_Details": criteriaDetails
    };

    this.McdssService.postMCDSS( this.selectedMethod, dataToPost).subscribe(
      res => {
        console.log("McdssServices");
        //console.log(res)        
        //this.response = res;
        //this.response = new MatTableDataSource(res);

        ELEMENT_DATA = res;
        this.dataSource.data = res;
        this.displayResults = true;
  
      },
      error => {
        console.log("Error McdssServices!!");
        this.displayError = true;
        this.errorMessage = error;
        //console.log(error);
        //this.response = error;
      }
    );   

  }
  
  changeVlaue (index_alternative, index_criteria) {
    let newValue= (<HTMLInputElement>document.getElementById("value_"+index_alternative+"_"+index_criteria)).value;
    //console.log(newValue);
    if (!newValue) {
      newValue = '0';
      (<HTMLInputElement>document.getElementById("value_"+index_alternative+"_"+index_criteria)).value=newValue;
    }
    this.dynamicForAlternatives.value.Alternatives[index_alternative].Values[index_criteria].value = newValue;
  }

  // convenience getters for easy access to form fields
  
  get fC() { return this.dynamicFormCriterias.controls; }  
  get t() { return this.fC.Criterias as FormArray; }

  get alternativeControler() { return this.dynamicForAlternatives.controls; }  
  get alternative() { return this.alternativeControler.Alternatives as FormArray; }

  deleteFormGroupItem(e, i, type) {
    if (type=='criteria') {

      this.t.removeAt(i);
    }
    else if (type=='alternativa') {
      this.alternative.removeAt(i);
      //this.arrayValuesAlternative.splice(i,1);
    }
  
  }

  addFormGroupItem(e, type) {
    if (type=='criteria') {
      this.t.push(this.formBuilder.group({
        label: ['', [Validators.required]],
        weight: [1, Validators.required],
        type: [0, [Validators.required]],
        veto_thresholds: [0, [Validators.required]],
      }));

      //this.dynamicForAlternatives.value.Alternatives[index_alternative].Values[index_criteria].value
      if (this.dynamicForAlternatives.value.Alternatives.length>0) {
      
        for (let indexAlt = 0; indexAlt < this.dynamicForAlternatives.value.Alternatives.length; indexAlt++) {
          let indexC = Object.keys(this.dynamicForAlternatives.value.Alternatives[indexAlt].Values).length

          this.dynamicForAlternatives.value.Alternatives[indexAlt].Values[indexC] = {value: 95};
          

        }
      }
    }
    else if (type=='alternative') {
      this.alternative.push(
        this.formBuilder.group({
          Name: ['', Validators.required],                              
          //Values: this.formBuilder.array([this.createAlternativeValuesItem()]),
          Values: this.createAlternativeValuesItem(),
        }));
    }
  }  


  createAlternativeValuesItem(): FormGroup {
    
    let tmpArray = [];
    for (let index = 0; index < this.t.controls.length; index++) {
      //tmpArray.push({'id':index, 'value': index*2});      
      tmpArray.push(
        this.formBuilder.group({
          value: 1
        })
      );
    }
    
    return this.formBuilder.group(tmpArray);
    /*
    return this.formBuilder.group({
      id: '1',
      value: '55'
    });
    */

  }
  
}
