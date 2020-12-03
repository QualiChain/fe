import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-qc-evaluation-questionnaire',
  templateUrl: './qc-evaluation-questionnaire.component.html',
  styleUrls: ['./qc-evaluation-questionnaire.component.css']
})
export class QcEvaluationQuestionnaireComponent implements OnInit {
  
  selectedOption: boolean = false;
  satisfiedLevel: number = null;

  constructor(public dialogRef: MatDialogRef<QcEvaluationQuestionnaireComponent>,
    @Inject(MAT_DIALOG_DATA) public data: QcEvaluationQuestionnaireModel) {
    // Update view with given values
  }

  ngOnInit() {
  }

  answerQuestion(answerValue) {
    if (answerValue==this.satisfiedLevel) {
      this.satisfiedLevel = null;
    }
    else {
      this.satisfiedLevel = answerValue;
    }
    
  }

  onSubmit(): void {
    this.selectedOption = true;
  }

  onConfirm(): void {
    // Close the dialog, return true
    this.dialogRef.close(true);
  }
  
  onDismiss(): void {
    // Close the dialog, return false
    this.dialogRef.close(false);
  }

}

/**
 * Class to represent confirm dialog model.
 *
 * It has been kept here to keep it as part of shared component.
 */
export class QcEvaluationQuestionnaireModel {

  constructor(public title: string, public message: string) {
  }
}