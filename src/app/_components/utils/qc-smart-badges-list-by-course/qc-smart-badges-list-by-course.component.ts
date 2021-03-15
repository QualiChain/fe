import { Component, OnInit, Input } from '@angular/core';
import { BadgesService } from '../../../_services/badges.service';
import { SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-qc-smart-badges-list-by-course',
  templateUrl: './qc-smart-badges-list-by-course.component.html',
  styleUrls: ['./qc-smart-badges-list-by-course.component.css']
})
export class QcSmartBadgesListByCourseComponent implements OnInit {

  @Input() courseId: string;
  @Input() formatOutput: string;

  lodingspinnerid: boolean = true;
  aqcuired_badges_by_course: any[] = [];
  selectedBadge : any = {};

  constructor(
    private bs: BadgesService
  ) { }

  ngOnInit(): void {    
    this.lodingspinnerid = true;
    this.recoverSmartBadgesByCourse();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.lodingspinnerid = true;
    this.recoverSmartBadgesByCourse();
  }

  recoverSmartBadgesByCourse() {
    //console.log(this.courseId);
    if (+this.courseId>0) {
      this.bs.getBadgesByCourseId(+this.courseId).subscribe(
        badgesByCourse => {
          //console.log(badgesByUser);
          this.aqcuired_badges_by_course = badgesByCourse;
          this.lodingspinnerid = false;
        },
        error => {
          console.log("error getting badges per course");
          this.lodingspinnerid = false;
        }
      );
    }
    else {
      this.lodingspinnerid = false;
    }            
  }
  
}