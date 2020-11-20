import { Component, OnInit, Input } from '@angular/core';
import { DomSanitizer, SafeResourceUrl, SafeUrl} from '@angular/platform-browser';
import { environment } from '../../../../environments/environment';

const urlVisualisations:string = environment.visualiserUrl;

export interface Specialization {
  title: string;
  id: number;
}

@Component({
  selector: 'app-visualisations',
  templateUrl: './visualisations.component.html',
  styleUrls: ['./visualisations.component.css']
})
export class VisualisationsComponent implements OnInit {

  constructor() { }
  
  urlSafe: string = "";
  extraClass: string = "";
  
  ngOnInit(): void {
  }

}

/** User skills - job skills chart ***************************************/
@Component({
  selector: 'app-visualisations-user-skills-job-skills-chart',
  templateUrl: './visualisations.component.html',
  styleUrls: ['./visualisations.component.css']
})
export class VisualisationsUserSkillsJobSkillsChartComponent implements OnInit {

  @Input() userId: string;
  @Input() jobId: string;

  //urlSafe: SafeUrl;
  urlSafe: string = "";
  extraClass: string = "user_skills_job_skills";

  constructor(
    public sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    
  }
  ngOnChanges(): void {
    //this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(urlVisualisations+"/show_radar_chart?y_var_names[]=skil_level&y_var_titles[]=skill_level&x_axis_name=name&x_axis_title=Name&use_default_colors=false&chart_3d=false&color_list_request[]=red&color_list_request[]=blue&base_query=user_job_skills&user_id="+this.userId+"&job_id="+this.jobId);
    this.urlSafe = urlVisualisations+"/show_radar_chart?y_var_names[]=skil_level&y_var_titles[]=skill_level&x_axis_name=name&x_axis_title=Name&use_default_colors=false&chart_3d=false&color_list_request[]=red&color_list_request[]=blue&base_query=user_job_skills&user_id="+this.userId+"&job_id="+this.jobId;
  }

}

/** User grade chart ***************************************/
@Component({
  selector: 'app-visualisations-user-grades-chart',
  templateUrl: './visualisations.component.html',
  styleUrls: ['./visualisations.component.css']
})
export class VisualisationsUserGradesChartComponent implements OnInit {

  @Input() userId: string;
  
  //urlSafe: SafeUrl;
  urlSafe: string = "";
  extraClass: string = "user_grade";

  constructor(
    public sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    
  }
  ngOnChanges(): void {
    //this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(urlVisualisations+"/show_column_chart?y_var_names[]=grade&y_var_titles[]=Grade&y_var_units[]=&x_axis_type=name&x_axis_name=name&x_axis_title=Course&y_axis_title=Grades&color_list_request[]=blue&color_list_request[]=red&color_list_request[]=green&use_default_colors=false&chart_3d=true&use_default_colors=false&base_query=user_grades&user_id="+this.userId);
    this.urlSafe = urlVisualisations+"/show_column_chart?y_var_names[]=grade&y_var_titles[]=Grade&y_var_units[]=&x_axis_type=name&x_axis_name=name&x_axis_title=Course&y_axis_title=Grades&color_list_request[]=blue&color_list_request[]=red&color_list_request[]=green&use_default_colors=false&chart_3d=true&use_default_colors=false&base_query=user_grades&user_id="+this.userId;
  }

}

/** Average grades in courses chart ***************************************/
@Component({
  selector: 'app-visualisations-average-grades-in-courses-chart',
  templateUrl: './visualisations.component.html',
  styleUrls: ['./visualisations.component.css']
})
export class VisualisationsAverageGradesInCoursesChartComponent implements OnInit {

  @Input() coursesIds: [];
  
  //urlSafe: SafeUrl;
  urlSafe: string = "";
  extraClass: string = "average_grades";

  constructor(
    public sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    
  }
  ngOnChanges(): void {    
    var strCousesIds = "&courses[]="+this.coursesIds.join("&courses[]=");     
    //this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(urlVisualisations+"/show_column_chart?y_var_names[]=grade&y_var_titles[]=%20Average%20Grades&y_var_units[]=&y_var_units[]=%&x_axis_type=name&x_axis_name=name&x_axis_title=Course&y_axis_title=Grades&color_list_request[]=blue&color_list_request[]=red&color_list_request[]=green&use_default_colors=false&chart_3d=true&use_default_colors=false&base_query=courses_avg_grades"+strCousesIds);
    this.urlSafe = urlVisualisations+"/show_column_chart?y_var_names[]=grade&y_var_titles[]=%20Average%20Grades&y_var_units[]=&y_var_units[]=%&x_axis_type=name&x_axis_name=name&x_axis_title=Course&y_axis_title=Grades&color_list_request[]=blue&color_list_request[]=red&color_list_request[]=green&use_default_colors=false&chart_3d=true&use_default_colors=false&base_query=courses_avg_grades"+strCousesIds;
  }

}

/*** Enrolled Courses skills coverage to user’s applied jobs skills * */
@Component({
  selector: 'app-visualisations-enrolled-courses-skills-coverage-to-users-applied-jobs-chart',
  templateUrl: './visualisations.component.html',
  styleUrls: ['./visualisations.component.css']
})
export class VisualisationsEnrolledCoursesSkillsCoverageToUsersAppliedJobsSkillsChartComponent implements OnInit {

  @Input() userId: [];
  
  //urlSafe: SafeUrl;
  urlSafe: string = "";
  extraClass: string = "enrolled_courses_skills_coverage";

  constructor(
    public sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    
  }
  ngOnChanges(): void {    
    
    //this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(urlVisualisations+"/show_circular_gauge_chart?x_axis_name=Strength&x_axis_title=Power&x_axis_unit=W&color_list_request[]=red&color_list_request[]=blue&use_default_colors=false&min_max_y_value[]=0&min_max_y_value[]=200&base_query=skills_courses_skills_coverage&user_id="+this.userId);
    this.urlSafe = urlVisualisations+"/show_circular_gauge_chart?x_axis_name=Strength&x_axis_title=Power&x_axis_unit=W&color_list_request[]=red&color_list_request[]=blue&use_default_colors=false&min_max_y_value[]=0&min_max_y_value[]=200&base_query=skills_courses_skills_coverage&user_id="+this.userId;
  }

}

/*** Career Path Trajectory * */
@Component({
  selector: 'app-visualisations-carerr-path-trajectory-chart',
  templateUrl: './visualisations.component.html',
  styleUrls: ['./visualisations.component.css']
})
export class VisualisationsCarrerPathTrajectoryChartComponent implements OnInit {

  @Input() userId: [];
  
  //urlSafe: SafeUrl;
  urlSafe: string = "";
  extraClass: string = "career_path_trajectory";

  constructor(
    public sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    
  }
  ngOnChanges(): void {    
    
    //this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(urlVisualisations+"/show_sankey_diagram?pass_value=pass_value&use_def_colors=false&chart_title=Career%20Path%20Trajectory&node_list[]=Programmer&node_list[]=senior%20developer&node_list[]=software%20architect&node_list[]=project%20manager&node_list[]=cto&node_list[]=product%20manager&node_list[]=lead%20developer&node_list[]=development%20manager&color_node_list[]=blue&color_node_list[]=violet&color_node_list[]=purple&color_node_list[]=fuchsia&color_node_list[]=red&color_node_list[]=ceramic&color_node_list[]=gold&color_node_list[]=black&color_node_list[]=gray&base_query=career_path_trajectory");
    this.urlSafe = urlVisualisations+"/show_sankey_diagram?pass_value=pass_value&use_def_colors=false&chart_title=Career%20Path%20Trajectory&node_list[]=Programmer&node_list[]=senior%20developer&node_list[]=software%20architect&node_list[]=project%20manager&node_list[]=cto&node_list[]=product%20manager&node_list[]=lead%20developer&node_list[]=development%20manager&color_node_list[]=blue&color_node_list[]=violet&color_node_list[]=purple&color_node_list[]=fuchsia&color_node_list[]=red&color_node_list[]=ceramic&color_node_list[]=gold&color_node_list[]=black&color_node_list[]=gray&base_query=career_path_trajectory";

    
  }

}


/*** User skillset coverage to Applied job skills  * */
@Component({
  selector: 'app-visualisations-user-skillset-coverage-to-applied-job-skills-chart',
  templateUrl: './visualisations.component.html',
  styleUrls: ['./visualisations.component.css']
})
export class VisualisationsUserSkillsetCoverageToAppliedJobSkills implements OnInit {

  @Input() userId: [];
  @Input() jobId: [];

  //urlSafe: SafeUrl;
  urlSafe: string = "";
  extraClass: string = "skill_coverage";

  constructor(
    public sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    
  }
  ngOnChanges(): void {    
    
    this.urlSafe = urlVisualisations+"/show_circular_gauge_chart?x_axis_name=Strength&x_axis_title=Power&x_axis_unit=W&color_list_request%5b%5d=red&color_list_request%5b%5d=blue&use_default_colors=false&min_max_y_value%5b%5d=0&min_max_y_value%5b%5d=200&base_query=skills_coverage&user_id="+this.userId+"&job_id="+this.jobId;
    
  }

}

/*** Market Demand  * */
@Component({
  selector: 'app-visualisations-market-demand-chart',
  templateUrl: './visualisations.component.html',
  styleUrls: ['./visualisations.component.css']
})
export class VisualisationsMarketDemand implements OnInit {

  //urlSafe: SafeUrl;
  urlSafe: string = "";
  extraClass: string = "market_demand";

  constructor(
    public sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.urlSafe = urlVisualisations+"/show_pie_chart?y_var_names%5b%5d=count&y_var_titles%5b%5d=Market%20Demand&y_var_units%5b%5d=Job%20Postings&x_axis_name=specialization_id&x_axis_title=Specialization&use_default_colors=false&chart_3d=false&color_list_request%5b%5d=blue&color_list_request%5b%5d=red&color_list_request%5b%5d=green&color_list_request%5b%5d=gold&color_list_request%5b%5d=ceramic&color_list_request%5b%5d=fuchsia&color_list_request%5b%5d=violet&color_list_request%5b%5d=purple&color_list_request%5b%5d=cyan&base_query=group_jobs";
  }

  ngOnChanges(): void {          
    
  }

}

/*** Skills demand in time per specialization  * */
@Component({
  selector: 'app-visualisations-skills-demand-in-time-per-specialization-chart',
  templateUrl: './visualisations.component.html',
  styleUrls: ['./visualisations.component.css']
})
export class VisualisationsSkillsDemandInTimePerSpecialization implements OnInit {

  @Input() skillId: [];
  @Input() specialization: [];

  //urlSafe: SafeUrl;
  urlSafe: string = "";
  extraClass: string = "demand_in_time_per_specialization";

  constructor(
    public sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    
  }
  ngOnChanges(): void {    
    
    let tmpURL = urlVisualisations+"/show_line_chart?y_var_names%5b%5d=skill_demand&y_var_titles%5b%5d=skill_demand&y_var_units%5b%5d=v1_unit&x_axis_type=time&x_axis_name=time&x_axis_title=Time&x_axis_unit=-&y_axis_title=Skill%20Demand&color_list_request%5b%5d=blue&color_list_request%5b%5d=red&use_default_colors=false&min_max_y_value%5b%5d=0&min_max_y_value%5b%5d=2000&skill_id="+this.skillId
    if (this.specialization) {
      tmpURL = tmpURL +"&specialization="+this.specialization;
    }
    tmpURL = tmpURL +"&base_query=skill_demand_in_time"; 
    //this.urlSafe = urlVisualisations+"/show_line_chart?y_var_names%5b%5d=skill_demand&y_var_titles%5b%5d=skill_demand&y_var_units%5b%5d=v1_unit&x_axis_type=time&x_axis_name=time&x_axis_title=Time&x_axis_unit=-&y_axis_title=Skill%20Demand&color_list_request%5b%5d=blue&color_list_request%5b%5d=red&use_default_colors=false&min_max_y_value%5b%5d=0&min_max_y_value%5b%5d=2000&skill_id="+this.skillId+"&specialization="+this.specialization+"&base_query=skill_demand_in_time"; 
    this.urlSafe = tmpURL;
  }

}

/*** Curriculum Up to Date - Circular Gauge (used in the curriculum designer interface)  * */
@Component({
  selector: 'app-visualisations-curriculum-up-to-date-chart',
  templateUrl: './visualisations.component.html',
  styleUrls: ['./visualisations.component.css']
})
export class VisualisationsCurriculumUpToDate implements OnInit {


  //urlSafe: SafeUrl;
  urlSafe: string = "";
  extraClass: string = "curriculum_up_to_date";

  constructor(
    public sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    let tmpURL = urlVisualisations+"/show_circular_gauge_chart?x_axis_name=up_to_date&x_axis_title=Up%20To%20Date&x_axis_unit=%&color_list_request[]=green&color_list_request[]=red&use_default_colors=false&min_max_y_value[]=0&min_max_y_value[]=100&base_query=curriculum_up_to_date";
    
    this.urlSafe = tmpURL;

  }

  ngOnChanges(): void {       

  }

}

/*** Specialization demand in function of time  * */
@Component({
  selector: 'app-visualisations-specialization-demand-in-function-of-time-chart',
  templateUrl: './visualisations.component.html',
  styleUrls: ['./visualisations.component.css']
})
export class VisualisationsSpecializationDemandInFunctionOfTime implements OnInit {

  @Input() cntSpecializations: number;
  @Input() specializations: Specialization[] = [];

  //urlSafe: SafeUrl;
  urlSafe: string = "";
  
  extraClass: string = "specialization_demand";

  constructor(
    public sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    
  }
  ngOnChanges(): void {    

    let tmpURL = '';
    this.specializations.forEach(element => {
      //console.log(element);
      tmpURL = tmpURL+"&y_var_names[]="+element.title+"&y_var_titles[]="+element.title+"&y_var_units[]=job%20postings";

    });

    tmpURL = urlVisualisations+"/show_line_chart?x_axis_type=time&x_axis_name=time&x_axis_title=Time&x_axis_unit=-&y_axis_title=Specialization%20Demand%20Demand&color_list_request[]=blue&color_list_request[]=red&use_default_colors=true&min_max_y_value[]=0&min_max_y_value[]=2000&base_query=specialization_demand_in_time"+tmpURL;
    
    //console.log(tmpURL);

    this.urlSafe = tmpURL;
  }

}


