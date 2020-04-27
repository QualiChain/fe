import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';

@Component({
  selector: 'app-cvs',
  templateUrl: './cvs.component.html',
  styleUrls: ['./cvs.component.css']
})
/*
export class CvsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
}
*/

export class CvsComponent implements OnInit {

  public SystemName: string = "MF1";
  firstCopy = false;

  // data
  public chartData: Array<number> = [ 1,8,49];
  public labelMFL: Array<any> = [
      { data: this.chartData,
        label: this.SystemName
      }
  ];

  public chartDataList: Array<number> = [];
  public labelList: Array<any> = [];  
  // labels
  public chartLabels: Array<any> = ["Option 1", "Option 2", "Option 3"];

  
  constructor(  ) { }

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

   _chartColors:Array<any> = [{
       backgroundColor: 'red',
        borderColor: 'red',
        pointBackgroundColor: 'red',
        pointBorderColor: 'red',
        pointHoverBackgroundColor: 'red',
        pointHoverBorderColor: 'red' 
      }];


      //public ChartType = 'bar';
  public ChartType = 'pie';
  

  displayedColumns: string[] = ['id', 'name', 'role_applied', 'available', 'expected_salary', 'maching_score', 'cv'];
  //dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  dataSource = new MatTableDataSource(ELEMENT_DATA);


  @ViewChild(MatPaginator, {static: true}) 
  paginator: MatPaginator;  
  
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  
  ngOnInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;


    ELEMENT_DATA.forEach(element =>{
      //console.log(element)
      this.chartDataList = [ element.id, 2*(element.id*element.id), 3*element.id];

      this.labelList[element.id] = [
        { data: this.chartDataList,
          label: this.SystemName
        }
    ];
    })

  }
}

export interface CvsData {
  id: number,
  name: string;
  role_applied: string;
  available: string;
  expected_salary: number;
  maching_score: number;
  cv: string;  
}

const ELEMENT_DATA: CvsData[] = [
  {id: 1, name: 'Candidate01', role_applied: 'Data Scientist', available: '2019/04/13', expected_salary: 32, maching_score: 1, cv:''},
  {id: 2, name: 'Candidate02', role_applied: 'Data Scientist', available: '2019/04/25', expected_salary: 30, maching_score: 1, cv:''},
  {id: 3, name: 'Candidate03', role_applied: 'Data Scientist', available: '2019/11/01', expected_salary: 40, maching_score: 1, cv:''},
  {id: 4, name: 'Candidate04', role_applied: 'Data Scientist', available: '2019/12/01', expected_salary: 305, maching_score: 1, cv:''},
  {id: 5, name: 'Candidate05', role_applied: 'Data Scientist', available: '2019/07/01', expected_salary: 28, maching_score: 1, cv:''},
  {id: 6, name: 'Candidate06', role_applied: 'Data Scientist', available: '2019/08/01', expected_salary: 31, maching_score: 1, cv:''},
  {id: 7, name: 'Candidate07', role_applied: 'Data Scientist', available: '2019/05/25', expected_salary: 34, maching_score: 1, cv:''},
  {id: 8, name: 'Candidate08', role_applied: 'Data Scientist', available: '2019/05/21', expected_salary: 43, maching_score: 1, cv:''},  
];
