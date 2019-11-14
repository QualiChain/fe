import { Component, OnInit } from '@angular/core';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { JobsService } from '../_services/jobs.service';
import { ConfirmDialogModel, ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-jobs-edit',
  templateUrl: './jobs-edit.component.html',
  styleUrls: ['./jobs-edit.component.css']
})
export class JobsEditComponent implements OnInit {

  angForm: FormGroup;
  job: any = {};
  result: string = '';

  //constructor() { }
  constructor(private route: ActivatedRoute, private router: Router, private js: JobsService, private fb: FormBuilder, public dialog: MatDialog) {
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

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.job = {'id': params['id'], 'JobName':"tesjob name item "+params['id'], 'JobDescription':"Job Description item "+params['id'], 'JobPrice':params['id']};
      /*
      this.js.editJob(params['id']).subscribe(res => {
        this.job = res;
    });
    */
  });
  }

}
