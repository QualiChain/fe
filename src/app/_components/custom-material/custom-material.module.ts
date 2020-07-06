import { NgModule } from '@angular/core';
//import { MatButtonModule, MatDialogModule, MatIconModule } from '@angular/material';

import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';


import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
  imports: [
    MatButtonModule, MatDialogModule, MatIconModule, DragDropModule
  ],
  exports: [
    MatButtonModule, MatDialogModule, MatIconModule, DragDropModule
  ]
})
export class CustomMaterialModule {
}