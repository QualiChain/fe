import { Component, OnInit, Input } from '@angular/core';
import { UsersService } from '../../../_services/users.service';

@Component({
  selector: 'app-qc-user-name',
  templateUrl: './qc-user-name.component.html',
  styleUrls: ['./qc-user-name.component.css']
})
export class QcUserNameComponent implements OnInit {
 

  @Input() userId: string;

  userName: string = null;

  constructor(
    private us: UsersService
  ) { }

  ngOnInit(): void {


    this.us
    .getUser(this.userId).subscribe(
      data => {
        //console.log("user in db");
        //console.log(data);
        //this.userName = data.userName;
        this.userName = data.surname+", "+data.name;
      },
      error => {     
        console.log("error recovering user data")        
      }
    );
    
    
  }



}
