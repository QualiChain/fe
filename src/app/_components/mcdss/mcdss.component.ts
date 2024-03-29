import { Component, OnInit, ViewChild, ViewChildren, QueryList, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import {FormControl} from '@angular/forms';
import { McdssService } from '../../_services/mcdss.service';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {SelectionModel} from '@angular/cdk/collections';
import { ActivatedRoute } from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface mcdssOutput {
  Alternative: string;
  Ranking: number;
  Score: number;
}

export interface mcdssOutputElectre {
  Alternatives: string[];
  "Dominance Table": [][];
}

/*
let ELEMENT_DATA: mcdssOutput[] = [ 
  { Alternative: "alternative 1", Ranking: 1, Score: 1 }, 
  { Alternative: "alternative 2", Ranking: 2, Score: 0.9706 }, 
  { Alternative: "alternative 3", Ranking: 3, Score: 0 } 
];
*/
let ELEMENT_DATA: mcdssOutput[] = [];
let ELEMENT_DATA_ELECTRE: mcdssOutputElectre[] = [];


@Component({
  selector: 'app-mcdss',
  templateUrl: './mcdss.component.html',
  styleUrls: ['./mcdss.component.css']
})
export class MCDSSComponent implements OnInit {

  
  invalidDecisionMatrixFile: boolean = false;
  messageErrorDecissionMatrixFile: string = null;
  invalidCriteriaDetailsFile: boolean = false;
  messageErrorCriteriaDetailsFile: string = null;

  fileToUploadDecisionMatrix: File = null;
  uploadedDecisionMatrix: boolean = false;

  fileToUploadCriteriaDetails: File = null;
  uploadedCriteriaDetails: boolean = false;
  
  selectedMethodFiles: string = null;
  /****************************************** */

  displayResults: boolean = false;
  displayError: boolean = false;
  errorMessage: string = "";

  displayedColumns: string[] = ['checked', 'Alternative', 'Ranking', 'Score'];
  displayedColumnsElectre: string[] = [];

  dataSource = new MatTableDataSource(ELEMENT_DATA);
  selection = new SelectionModel<mcdssOutput>(true, []);

  dataSourceElectre = new MatTableDataSource(ELEMENT_DATA_ELECTRE);

  
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  listOfCriterias: any[] = [];

  dynamicFormCriterias: FormGroup;
  dynamicForAlternatives: FormGroup;
  criteriaCtrl = new FormControl();
  
  criteriasURL: string[];
  alternativesURL: string[];
  valuesURL: string[];
  defaultValue: any[] = [];
  
  //defaultTypeSelected = 0;
  //defaultCriteriaSelected = '';
    
  
 methodsTranslator = {'maut': 'MAUT', 'topsis': 'TOPSIS', 'electreI': 'ELECTRE I', 'prometheeII': 'PROMETHEE II'} 
 methods: any[] = [
  {id: 'maut', name: 'MAUT'},
  {id: 'topsis', name: 'TOPSIS'},
  {id: 'electreI', name: 'ELECTRE I'},
  {id: 'prometheeII', name: 'PROMETHEE II'}
  ];
  selectedMethod: string = "";
  agreement_threshold: number = 1;
  electredSelected: boolean = false;

  response: any = [];

  //dataToPost: {};
  dataToPost: {
    "Decision_Matrix":{
      "Number_of_alternatives": number,
      "Number_of_criteria": number,
      "Criteria": string[],
      "Alternatives": {"Name":string, "Values": number[]}[]
    },
    "Criteria_Details":{
      "Number_of_criteria": number,
      "Weights": number[],
      "Optimization_Type": number[]
      }
  };

  cntCheckBoxesSelected: number = 0;
  maxCheckBoxesSelected = 2;
  viewCompare: boolean = false;
  dataToCompare: any[] = [];
  byFile: boolean = false;


  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private McdssService: McdssService,
    public dialog: MatDialog
  ) { }

  showHelpDialogForField(fieldName: string) {
    const dialogRef = this.dialog.open(MCDSSDialogContentForField,
      {width: "550px", data: {'field':fieldName}}
      );

    dialogRef.afterClosed().subscribe(result => {
      //console.log(`Dialog result: ${result}`);
    });
  }

  showHelpDialog() {
    const dialogRef = this.dialog.open(MCDSSDialogContent,
      {width: "550px"}
      );

    dialogRef.afterClosed().subscribe(result => {
      //console.log(`Dialog result: ${result}`);
    });
  }

  ngAfterViewInit() {
    //console.log("ngAfterViewInit");
    //load default values
    if (this.valuesURL.length>0) {      
      for (let i = 0; i < this.valuesURL.length ; i++) {                
        this.defaultValue[i]=[];
        let valuesAlternative = this.valuesURL[i];
        let arrayValuesAlternative = valuesAlternative.split("|");        
        for (let j = 0; j < arrayValuesAlternative.length ; j++) {          
          this.defaultValue[i].push(arrayValuesAlternative[j]);
          let newValue = arrayValuesAlternative[j];
          (<HTMLInputElement>document.getElementById("value_"+i+"_"+j)).value=newValue;    
          this.dynamicForAlternatives.value.Alternatives[i].Values[j].value = newValue;
        }        
      }
    }

   }


  ngOnInit(): void {
    
    this.route.queryParamMap.subscribe(params => this.criteriasURL = params.getAll('criteria'));
    this.route.queryParamMap.subscribe(params => this.alternativesURL = params.getAll('alternative'));
    this.route.queryParamMap.subscribe(params => this.valuesURL = params.getAll('values'));

    this.dataSource.sort = this.sort;
    this.dataSourceElectre.sort = this.sort;
    
    this.dynamicFormCriterias = this.formBuilder.group({
      Criterias: new FormArray([])
    });

    this.dynamicForAlternatives = this.formBuilder.group({
      Alternatives: new FormArray([])
    });
    
    

    //init table
    if (this.criteriasURL.length==0) {
      this.addFormGroupItem(null,'criteria', "");
    }
    else {
      for (let i = 0; i < this.criteriasURL.length ; i++) {
        //console.log(i);
        this.addFormGroupItem(null,'criteria', this.criteriasURL[i]);        
      }
    }
    
    if (this.alternativesURL.length==0) {
      this.addFormGroupItem(null,'alternative', "");
      this.addFormGroupItem(null,'alternative', "");
    }
    else {
      for (let i = 0; i < this.alternativesURL.length ; i++) {
        this.addFormGroupItem(null,'alternative', this.alternativesURL[i]);
      }
    }

    
    
    

  }

  trackByIdx(index: number, obj: any): any {
    return index;
  }

/** Selects all rows if they are not all selected; otherwise clear selection. */  
masterToggle() {  
 //this.isAllSelected() ? this.selection.clear() : this.dataSource.data.forEach(r => this.selection.select(r));  
}  
/** The label for the checkbox on the passed row */  
checkboxLabel(row: any): string {  
  /*
  if (!row) {  
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;  
  }  
  */
  return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.UserId + 1}`;  
}  
  

  save() {
    this.byFile = false;
    this.errorMessage = "";
    this.displayResults = false;
    this.displayError = false;

    let numAlternatives = this.dynamicForAlternatives.value.Alternatives.length;
    let numCriterias = this.dynamicFormCriterias.value.Criterias.length;

    let criteriasLabels = [];
    let criteriasWeights = [];
    let criteriasTypes = [];
    let criteriasVetos = [];
    let criteriaspreferences = [];
    let criteriasIndifferences = [];
    let criteriaCriterias = [];
    for (let index = 0; index < numCriterias; index++) {
      criteriasLabels.push(this.dynamicFormCriterias.value.Criterias[index].label);
      criteriasWeights.push(+this.dynamicFormCriterias.value.Criterias[index].weight);
      criteriasTypes.push(+this.dynamicFormCriterias.value.Criterias[index].type);
      criteriasVetos.push(+this.dynamicFormCriterias.value.Criterias[index].veto_thresholds);

      criteriaspreferences.push(+this.dynamicFormCriterias.value.Criterias[index].preference_thresholds);
      criteriasIndifferences.push(+this.dynamicFormCriterias.value.Criterias[index].indifference_thresholds);
      criteriaCriterias.push(this.dynamicFormCriterias.value.Criterias[index].criteria_thresholds);
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
    else if (this.selectedMethod=='prometheeII') {
      
      criteriaDetails["Preference_Thresholds"] = criteriaspreferences;
      criteriaDetails["Indifference_Thresholds"] = criteriasIndifferences;
      criteriaDetails["Criteria_Types"] = criteriaCriterias;

    }
    
    let alternativesData = [];
    for (let index = 0; index < numAlternatives; index++) {
      
      let arrayValues = [];
      

      for (let indexValues = 0; indexValues < Object.keys(this.dynamicForAlternatives.value.Alternatives[index].Values).length; indexValues++) {
        arrayValues.push(+this.dynamicForAlternatives.value.Alternatives[index].Values[indexValues].value)
      }
 
     let dataToPush ={ 
      Name: this.dynamicForAlternatives.value.Alternatives[index].Name+"_|_"+index,
      Values: arrayValues
     }

     alternativesData.push(dataToPush);
    }


    this.dataToPost = {
      "Decision_Matrix":
        {
            "Number_of_alternatives": numAlternatives,
            "Number_of_criteria": numCriterias,
            "Criteria": criteriasLabels,
            "Alternatives": alternativesData
        },
      "Criteria_Details": criteriaDetails
    };

    this.electredSelected = false;
    if (this.selectedMethod=='electreI') {
      this.electredSelected = true;
    }
    this.McdssService.postMCDSS( this.selectedMethod, this.dataToPost).subscribe(
      res => {
        //console.log("McdssServices");
        //console.log(res)        
        //this.response = res;
        //this.response = new MatTableDataSource(res);
        if (this.selectedMethod=='electreI') {

          let newRes = [];
          this.displayedColumnsElectre = [];
          
          newRes = this.processResultElectreI(res);
                 
          ELEMENT_DATA_ELECTRE = newRes;
          this.dataSourceElectre.data = newRes;
          this.displayResults = true;
          this.dataSourceElectre.sort = this.sort;

        }
        else {                 
          let newRes = [];
          res.forEach((value, index) => {
            var resSplit = value.Alternative.split("_|_");
            
            let dataItem = {
              "Alternative": resSplit[0],
              "AID": resSplit[1],              
              "Ranking": value.Ranking,
              "Score": value.Score
            }
            newRes.push(dataItem);
          });

          //ELEMENT_DATA = res;
          ELEMENT_DATA = newRes;
          //this.dataSource.data = res;
          this.dataSource.data = newRes;
          this.displayResults = true;
          this.dataSource.sort = this.sort;
        }
      },
      error => {
        //console.log("Error McdssServices!!");
        this.displayError = true;
        this.errorMessage = error;
        //console.log(error);
        //this.response = error;
      }
    );   

  }
  
  @ViewChildren ('checkBox') checkBox:QueryList<any>;
  
  compareSelectionFile() {
    //console.log("compareSelectionFile");
    const checked = this.checkBox.filter(checkbox => checkbox.checked);
    this.dataToCompare = [];
    let criteriasValues = [];
    let maxCriterias = [];
  

    let csvSeparator = ";";
    let readerCriteriaDetails: FileReader = new FileReader();
    readerCriteriaDetails.readAsText(this.fileToUploadCriteriaDetails);
    readerCriteriaDetails.onload = (e) => {
       let csvCriteriaDetails: string = readerCriteriaDetails.result as string;
      // console.log(csvCriteriaDetails);

       const lines = csvCriteriaDetails.split('\n');

       //console.log(lines);
       const col0: string[] = lines[0].split(csvSeparator);
       //console.log(col0);
       var numberOfCriterias = Number(col0[1]);
       for (var j = 0, len = numberOfCriterias; j < len; j++) {
        maxCriterias.push(0);
      }

       //console.log("numberOfCriterias: "+numberOfCriterias);

       var criteriasValuesList = lines[2].split(csvSeparator);
       criteriasValuesList.splice(0, 1);
       //console.log(criteriasValuesList);
       this.listOfCriterias = [];

       for (var ii =0, len = criteriasValuesList.length; ii < len; ii++) {
         //console.log(ii + "·--" + criteriasValuesList[ii]);
        this.listOfCriterias.push(criteriasValuesList[ii]);
       }


        let readerDecisionMatrix: FileReader = new FileReader();
        readerDecisionMatrix.readAsText(this.fileToUploadDecisionMatrix);
        readerDecisionMatrix.onload = (e) => {
          let csvDecisionMatrix: string = readerDecisionMatrix.result as string;
          //console.log(csvDecisionMatrix);
          const linesDecisionMatrix = csvDecisionMatrix.split('\n');

          checked.forEach(data => {
            //console.log(data);
              //console.log(data.checked);
              //console.log(data.value);
              //console.log(data.value.AID);
              if (data.checked) {
                var alternativeName = data.value.Alternative;
                //console.log(alternativeName);

                linesDecisionMatrix.forEach(element => {
                  const cols: string[] = element.split(csvSeparator);
                  //console.log(cols[0])

                  if (cols[0]==alternativeName) {
                    //console.log("values for this alternative");
                    //console.log(cols);
                    criteriasValues = [];
                    for (var j = 1, len = numberOfCriterias; j <= len; j++) {
                      //console.log(j+":"+cols[j]);

                      if (maxCriterias[j-1]<cols[j]) {
                        maxCriterias[j-1] = cols[j];
                      }

                      criteriasValues[j-1] = cols[j];
                    
                    }
                    //console.log("maxCriterias");
                    //console.log(maxCriterias);

                  }
                  //csv.push(cols);
               });


               let itemToCompare = {
                "Score": data.value.Score,
                "Ranking": data.value.Ranking,
                "AlternativeName": alternativeName,
                "Criterias": criteriasValues,
                "maxCriterias": maxCriterias
              }
              //console.log(itemToCompare);
              this.dataToCompare.push(itemToCompare);

              }  
  
            })
  
            this.viewCompare = true;

        }

        
    }   
    
    
  }

  compareSelection() {
    const checked = this.checkBox.filter(checkbox => checkbox.checked);
    this.dataToCompare = [];
    let criteriasValues = [];
    let maxCriterias = [];

    for (var j = 0, len = this.dataToPost.Decision_Matrix.Alternatives[0].Values.length; j < len; j++) {
      maxCriterias.push(0);
    }

    this.listOfCriterias = this.dataToPost?.Decision_Matrix?.Criteria;

    checked.forEach(data => {
      //console.log(data);
        //console.log(data.checked);
        //console.log(data.value);
        //console.log(data.value.AID);
        if (data.checked) {

          var resSplit = data.value.Alternative.split("_|_");

          for (var index = 0, len = this.dataToPost.Decision_Matrix.Alternatives.length; index < len; index++) {
            //console.log(data);
            //console.log("index:"+index+"---data.AID:"+data.value.AID+"<---");
            if(index==+data.value.AID) {
              criteriasValues = this.dataToPost.Decision_Matrix.Alternatives[index].Values;
            }
            
            for (var j = 0, len2 = this.dataToPost.Decision_Matrix.Alternatives[index].Values.length; j < len2; j++) {

              if (this.dataToPost.Decision_Matrix.Alternatives[index].Values[j]>maxCriterias[j]) {
                maxCriterias[j] = this.dataToPost.Decision_Matrix.Alternatives[index].Values[j];
              }
            }


            
          }



          let itemToCompare = {
            "Score": data.value.Score,
            "Ranking": data.value.Ranking,
            "AlternativeName": resSplit[0],
            "Criterias": criteriasValues,
            "maxCriterias": maxCriterias
          }
          //console.log(itemToCompare);
          this.dataToCompare.push(itemToCompare);
        }
    })
    this.viewCompare = true;

  }

  changeVlaue (index_alternative, index_criteria) {
    let newValue= (<HTMLInputElement>document.getElementById("value_"+index_alternative+"_"+index_criteria)).value;
    //console.log(newValue);
    if (!newValue) {
      newValue = '0';
      (<HTMLInputElement>document.getElementById("value_"+index_alternative+"_"+index_criteria)).value=newValue;
    }
    this.dynamicForAlternatives.value.Alternatives[index_alternative].Values[index_criteria].value = newValue;
    //console.log(this.dynamicForAlternatives.value.Alternatives);
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

  addFormGroupItem(e, type, defaultValue) {
    if (type=='criteria') {
      this.t.push(this.formBuilder.group({
        label: [defaultValue, [Validators.required]],
        weight: [1, Validators.required],
        type: ['0', [Validators.required]],
        veto_thresholds: [0, [Validators.required]],
        preference_thresholds: [0, [Validators.required]],
        indifference_thresholds: [0, [Validators.required]],
        criteria_thresholds: ['usual', [Validators.required]],
      }));

      //this.dynamicForAlternatives.value.Alternatives[index_alternative].Values[index_criteria].value
      if (this.dynamicForAlternatives.value.Alternatives.length>0) {
      
        for (let indexAlt = 0; indexAlt < this.dynamicForAlternatives.value.Alternatives.length; indexAlt++) {
          let indexC = Object.keys(this.dynamicForAlternatives.value.Alternatives[indexAlt].Values).length

          //this.dynamicForAlternatives.value.Alternatives[indexAlt].Values[indexC] = {value: 95};
          this.dynamicForAlternatives.value.Alternatives[indexAlt].Values[indexC] = {value: 0};
          

        }
      }
    }
    else if (type=='alternative') {
      this.alternative.push(
        this.formBuilder.group({
          Name: [defaultValue, Validators.required],                              
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
          value: 0
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

//invalidDecisionMatrixFile: boolean = false;
//messageErrorDecissionMatrixFile: string = null;
//invalidCriteriaDetailsFile: boolean = false;
//messageErrorCriteriaDetailsFile: string = null;

  handleFileInputDecisionMatrix(files: FileList) {
    this.invalidDecisionMatrixFile = false;
    this.messageErrorDecissionMatrixFile = null;
    this.uploadedDecisionMatrix = false;
   if (files[0].type=="application/vnd.ms-excel") {     
      this.fileToUploadDecisionMatrix = files.item(0);
      this.uploadedDecisionMatrix = true;      
    }
    else {
      this.invalidDecisionMatrixFile = true;
      //this.messageErrorDecissionMatrixFile = files[0].name + " is not a valid file. Only application/vnd.ms-excel files as valid";
      this.messageErrorDecissionMatrixFile = files[0].name;
      this.fileToUploadDecisionMatrix = null;
    }    
    
  }
 
  handleFileInputCriteriaDetails(files: FileList) {
    this.invalidCriteriaDetailsFile = false;
    this.messageErrorCriteriaDetailsFile = null;
    this.uploadedCriteriaDetails = false;
    if (files[0].type=="application/vnd.ms-excel") {
      this.fileToUploadCriteriaDetails = files.item(0);
      this.uploadedCriteriaDetails = true;
    }
    else {
      this.invalidCriteriaDetailsFile = true;
      //this.messageErrorCriteriaDetailsFile = files[0].name + " is not a valid file. Only application/vnd.ms-excel files as valid";
      this.messageErrorCriteriaDetailsFile = files[0].name;
      this.fileToUploadCriteriaDetails = null;
    }
  }
  
  /**
   * format bytes
   * @param bytes (File size in bytes)
   * @param decimals (Decimals point)
   */
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

  processResultElectreI(res) {
    let newRes = [];
    this.displayedColumnsElectre = [];
    this.displayedColumnsElectre.push('Alternative');
    res[0]['Alternatives'].forEach((value, index) => {
      //console.log("---------");
      //console.log("index:"+index+"---value:"+value);            
      var resSplitName = value.split("_|_");

      //this.displayedColumnsElectre.push(value);
      this.displayedColumnsElectre.push(resSplitName[0]);
      //console.log(this.displayedColumnsElectre);
      //console.log("---------");
      let valuePerItem = {};
      //valuePerItem['Alternative'] = value;
      valuePerItem['Alternative'] = resSplitName[0];
      res[0]['Alternatives'].forEach((value2, index2) => {
        //console.log("index2:"+index2+"---value2:"+value2);
        //console.log(res[0]['Dominance Table'][index]);
        var resSplit = value2.split("_|_");
        //console.log(resSplit);
        //valuePerItem[value2] = res[0]['Dominance Table'][index][index2];
        valuePerItem[resSplit[0]] = res[0]['Dominance Table'][index][index2];
      });
      newRes.push(valuePerItem);

      
    });
    //console.log(newRes);

    return newRes;
  }

  saveFilesForm() {
    this.byFile = true;
    ELEMENT_DATA = null;
    ELEMENT_DATA_ELECTRE = null;

    this.displayResults = false;
    this.displayError = false;

    const formData: FormData = new FormData();
      formData.append('Decision Matrix', (<HTMLInputElement>document.getElementById('decisionMatrix')).files[0]);
      formData.append('Criteria Details', (<HTMLInputElement>document.getElementById('criteriaDetails')).files[0]);

      
      this.electredSelected = false;
      if (this.selectedMethodFiles=='electreI') {
        this.electredSelected = true;
      }

        this.McdssService.postMCDSSFile(this.selectedMethodFiles, formData).subscribe(res => {
        
        if (this.selectedMethodFiles=='electreI') {

          let newRes = [];
          this.displayedColumnsElectre = [];
          
          newRes = this.processResultElectreI(res);
                 
          ELEMENT_DATA_ELECTRE = newRes;
          this.dataSourceElectre.data = newRes;
          this.displayResults = true;
          this.dataSourceElectre.sort = this.sort;
        }
        else {
          ELEMENT_DATA = res;
          this.dataSource.data = res;
          this.displayResults = true;
          this.dataSource.sort = this.sort;
        }

      }, error => {      
        //this.response = error;
        this.displayResults = false;
        this.displayError = true;
        this.errorMessage = error;
        //console.log(error);
      });

  }

}



@Component({
  selector: 'MCDSSS-dialog-content',
  templateUrl: 'MCDSS-dialog-content.html',
})
export class MCDSSDialogContent implements OnInit {
  title: string;
  message: string;
  
  constructor() {
  }

  ngOnInit() {
    
  }

  onConfirm(): void {
    // Close the dialog, return true
    
  }

  onDismiss(): void {
    // Close the dialog, return false    
    
  }

}



@Component({
  selector: 'MCDSSS-dialog-content-for-field',
  templateUrl: 'MCDSS-dialog-content-for-field.html',
})
export class MCDSSDialogContentForField implements OnInit {
  field: string;
  

  constructor(
    public dialogRef: MatDialogRef<MCDSSDialogContentForField>,
    @Inject(MAT_DIALOG_DATA) public data: MCDSSDialogContentForFieldModel) {

      this.field = data.field;
      
  }

  ngOnInit() {
    console.log(this.field);
    
  }

  onConfirm(): void {
    // Close the dialog, return true
    
  }

  onDismiss(): void {
    // Close the dialog, return false    
    
  }
  
}

export class MCDSSDialogContentForFieldModel {

  constructor(public field: string) {
  }
}