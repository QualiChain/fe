import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChartDataSets, ChartType, ChartOptions } from 'chart.js';
import { Color, Label } from 'ng2-charts';


@Component({
  selector: 'app-best-career-options',
  templateUrl: './best-career-options.component.html',
  styleUrls: ['./best-career-options.component.css']
})
export class BestCareerOptionsComponent implements OnInit {

  best_career_options: any = [];
  cardToDisplay: number;
  userid: number;

// Pie
public pieChartOptions: ChartOptions = {
  responsive: true,
  legend: {
    position: 'top',
  },
  plugins: {
    datalabels: {
      formatter: (value, ctx) => {
        const label = ctx.chart.data.labels[ctx.dataIndex];
        return label;
      },
    },
  }
};

  

  public pieChartLabels: Label[] = ['Met', 'Not met'];
  public  pieChartData: Array<any> = [];
  /*
  public pieChartData: number[] = [50, 50];
  */
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  //public pieChartPlugins = [pluginDataLabels];
  public pieChartColors = [
    {
      backgroundColor: ['rgba(0,128,0)', 'rgba(255,0,0)'],
    },
  ];

  /**************************** */
  public  lineChartData: Array<any> = [];
  public lineChartLabels: Array<any> = [];
  /*
  public lineChartData: ChartDataSets[] = [
    { data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A' }
  ];
  public lineChartLabels: Label[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  */
  public lineChartOptions: (ChartOptions & { annotation: any }) = {
    responsive: true,
    scales: {
      // We use this empty structure as a placeholder for dynamic theming.
      xAxes: [{}],
      yAxes: [
        {
          id: 'y-axis-0',
          position: 'left',
        }
      ]
    },
    annotation: {
      annotations: [
        {
          type: 'line',
          mode: 'vertical',
          scaleID: 'x-axis-0',
          value: 'March',
          borderColor: 'orange',
          borderWidth: 2,
          label: {
            enabled: true,
            fontColor: 'orange',
            content: 'LineAnno'
          }
        },
      ],
    },
  };
  public lineChartColors: Color[] = [
    { // grey
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
    { // dark grey
      backgroundColor: 'rgba(77,83,96,0.2)',
      borderColor: 'rgba(77,83,96,1)',
      pointBackgroundColor: 'rgba(77,83,96,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(77,83,96,1)'
    },
    { // red
      backgroundColor: 'rgba(255,0,0,0.3)',
      borderColor: 'red',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }
  ];
  public lineChartLegend = true;
  public lineChartType = 'line';
  //public lineChartPlugins = [pluginAnnotations];

  //@ViewChild(BaseChartDirective, { static: true }) chart: BaseChartDirective;  
  public  progress_relation_cv_bar: Array<any> = [];
  public progress_relation_smart_badges_bar: Array<any> = [];

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {

    this.route.params.subscribe(params => {
      
      //console.log(params['id']);
      this.userid=params['id'];
      this.cardToDisplay = 0;
      let options = [
        {id: 1, title:"Front-end Web Developer", description: "A front-end web developer is responsible for implementing visual elements that users see and interact with in a web application. they are usually supported by back-end web developers, who are responsible for server-side applications logic and integration of the work fron-end developers do."},
        {id: 2, title:"Back-end Web Developer", description: "A back-end web developer is responsible for server-side web application logic and integration of the work front-end developers do. Back-end developers are usually write the web services and APIs used by front-end developers and mobile application developers."},
        {id: 3, title:"Web Designer", description: "A web designer develops and creates websites and associated applications. Web designers work in a variety of industries and often as independent contractors. Education requirements can vary, but web designers can get entry-level work with an associate's degree. Bachelor's degrees provide students with an expanded and advanced skill set that can lead to better job prospects or career advancement."}
      ];

      this.best_career_options = options;

      for (let i=0; i<=options.length-1; i++) {
        //progress bar data
        this.progress_relation_cv_bar[i] = 100-((i+1)*10);
        this.progress_relation_smart_badges_bar[i] = 100-((i+1)*20);
        
        //pie bar data
        this.pieChartData[i] = [50-(i*7), 50+(i*7)];
      
        //line char data
        this.lineChartData[i] = [
          { data: [65+(i*2), 59+((i+1)*2), 80-((i+1)*9), 81+((i+1)*4), 56+((i+1)*5), 55-((i+1)*4), 40+((i+1)*5)], label: 'Series A_'+i }
        ];
        this.lineChartLabels[i]= ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

      }
      
    });

  }

}
