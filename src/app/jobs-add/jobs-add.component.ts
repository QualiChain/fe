import { Component, OnInit } from '@angular/core';
import { FormGroup,  FormBuilder,  Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { JobsService } from '../_services/jobs.service';
import { ConfirmDialogModel, ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-jobs-add',
  templateUrl: './jobs-add.component.html',
  styleUrls: ['./jobs-add.component.css']
})
export class JobsAddComponent implements OnInit {

    angForm: FormGroup;
    result: string = '';

    constructor(private route: ActivatedRoute, private router: Router, private fb: FormBuilder, private js: JobsService, public dialog: MatDialog) {
      this.createForm();
    }

    confirmDialog(): void {
      const message = `Are you sure you want to do this?`;
  
      const dialogData = new ConfirmDialogModel("Confirm Action", message);
  
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        maxWidth: "400px",
        data: dialogData
      });
  
      dialogRef.afterClosed().subscribe(dialogResult => {
        this.result = dialogResult;
  
        if (dialogResult) {
          //window.location.href="/jobs";
          this.router.navigate(['/jobs']);
        }
      });
    }

    createForm() {
      this.angForm = this.fb.group({
        JobName: ['', Validators.required ],
        JobDescription: ['', Validators.required ],
        JobPrice: ['', Validators.required ]
      });
    }

    addJob(JobName, JobDescription, JobPrice) {
      this.js.addJob(JobName, JobDescription, JobPrice);
    }

  ngOnInit() {
  }

}
