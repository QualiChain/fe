import { Component, OnInit, ViewChild } from '@angular/core';
import { DegreecomparisonService } from '../../_services/degreecomparison.service';
import {MatDialog} from '@angular/material/dialog';

import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';


export interface ResultElement {
  col1: string;
  col2: string;
  col3: number;
}

const ELEMENT_DATA: ResultElement[] = []

@Component({
  selector: 'app-degree-comparison',
  templateUrl: './degree-comparison.component.html',
  styleUrls: ['./degree-comparison.component.css']
})
export class DegreeComparisonComponent implements OnInit {

  searchedTerm: string = null;
  displayedColumns: string[] = ['col1', 'col2', 'col3'];  
  dataSource = new MatTableDataSource(ELEMENT_DATA);


  fileToUpload1: File = null;
  uploaded1: boolean = false;
  fileToUpload2: File = null;
  uploaded2: boolean = false;
  
  resultToPlot = [];
  showError: boolean = false;
  errorMessage: string = null;
  showLoading: boolean = false;
  showResults: boolean = false;

  showErrorFile1 : boolean = false;
  showErrorFile2 : boolean = false;


  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) 
  paginator: MatPaginator; 

  public ChartType = 'pie';
  public chartLabels: Array<any> = ['Match', 'Not Match'];
  public chartOptions: any = {
    responsive: true,
      plugins: {
      datalabels: {
        display: true,
        align: 'top',
        anchor: 'end',
        //color: "#2756B3",
        color: "#222",
        font: {
          family: 'FontAwesome',
          size: 14
        },
      
      },
      deferred: false,
      legend: false
    },

  };

  constructor(
    private degComp: DegreecomparisonService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();   
  }

  openJsonExample(url: string) {
    window.open(url, "_blank");
  }

  handleFileInput(event, file: string, files) {
    if (file=='file1') {
      this.fileToUpload1 = files.item(0);
      this.uploaded1 = false;
      this.showErrorFile1 = false;
      if (this.fileToUpload1.type=='application/json') {
        this.uploaded1 = true;
      }
      else {
        this.showErrorFile1 = true;
      }
      
    }
    else if (file=='file2') {
      this.fileToUpload2 = files.item(0);
      this.uploaded2 = false;
      this.showErrorFile2 = false;
      if (this.fileToUpload2.type=='application/json') {
        this.uploaded2 = true;
      }
      else {
        this.showErrorFile2 = true;
      }
    }
    
    
  }

  degreeComparison(form: any) {

    this.showError = false;
    this.errorMessage = null;
    this.showLoading = true;
    this.showResults = false;
    this.resultToPlot = [];

    const formData: FormData = new FormData();
    formData.append('file1_path', (<HTMLInputElement>document.getElementById('file1_path')).files[0], 'file1.json');
    formData.append('file2_path', (<HTMLInputElement>document.getElementById('file2_path')).files[0], 'file2.json');

    this.dataSource.data = [];
    this.dataSource._updateChangeSubscription();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.degComp.getDegreeComparison(formData).subscribe(data => {
    
       //console.log(data);
       if (data.status==200) {
        this.showLoading = false;
        //console.log(data);
        if (data.hasOwnProperty('body')) {
          this.resultToPlot = data['body'];
          data['body'].forEach((element, index) => {  
            this.dataSource.data.push({'col1': element[0], 'col2': element[1], 'col3': +element[2]});
            this.dataSource._updateChangeSubscription();
           
          });
        }

        

        this.showResults = true;

      }

    }, error => {
      //this.status = 'Error';      
      console.log(error);
      this.showLoading = false;
      this.showError = true;
      this.errorMessage = error;
    });

/*
    this.degComp.getDegreeComparison(formData).subscribe(data => {
      this.showLoading = false;
      console.log(data);
    }, error => {
      console.log(error);
      this.showLoading = false;
      this.showError = true;
      this.errorMessage = error;
    });
*/

  }

  showHelpDialog() {
    const dialogRef = this.dialog.open(DegreeComparisonDialogContent,
      {width: "550px"}
      );

    dialogRef.afterClosed().subscribe(result => {
      //console.log(`Dialog result: ${result}`);
    });
  }



}


@Component({
  selector: 'DegreeComparison-dialog-content',
  templateUrl: 'degreeComparison-dialog-content.html',
})
export class DegreeComparisonDialogContent implements OnInit {
  title: string;
  message: string;
  
  constructor() {
  }

  openJsonExample(url: string) {
    window.open(url, "_blank");
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