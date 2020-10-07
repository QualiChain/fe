import { Component, OnInit, Input } from '@angular/core';
import { DomSanitizer, SafeResourceUrl, SafeUrl} from '@angular/platform-browser';
import { environment } from '../../../../environments/environment';

const urlVisualisations:string = environment.visualiserUrl;

@Component({
  selector: 'app-visualisations',
  templateUrl: './visualisations.component.html',
  styleUrls: ['./visualisations.component.css']
})
export class VisualisationsComponent implements OnInit {

  constructor() { }
  
  urlSafe: string = "";

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
  urlSafe: string = ""

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
  urlSafe: string = ""

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
  urlSafe: string = ""

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
  urlSafe: string = ""

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