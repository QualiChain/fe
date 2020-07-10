import { Component, OnInit, Input  } from '@angular/core';


@Component({
  selector: 'app-job-applications-by-user',
  templateUrl: './job-applications-by-user.component.html',
  styleUrls: ['./job-applications-by-user.component.css']
})
export class JobApplicationsByUserComponent implements OnInit {

  @Input() userId: number = null;

  constructor() { }

  ngOnInit(): void {
  }

}
