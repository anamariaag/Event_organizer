import { IfStmt } from '@angular/compiler';
import { Component, Inject } from '@angular/core';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';
import { Event as EventI } from 'src/app/shared/interfaces/event';


@Component({
  selector: 'app-new-event-dialog',
  templateUrl: './new-event-dialog.component.html',
  styleUrls: ['./new-event-dialog.component.scss']
})
export class NewEventDialogComponent {

  selectedImages: FileList | null = null;
  selectedImagesArray : File[] = [];

  hours: number[] = Array.from({length: 23}, (_, i)=> i);
  minutes: number[] = [0, 15, 30, 45, 60];

  constructor(
    public dialogRef: MatDialogRef<NewEventDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public event: EventI,
  ) {}

  cancelar(): void {
    this.dialogRef.close();
  }

  clickFileSelector(input: HTMLInputElement){
    input.click();
  }

  closeDialog(){
    this.dialogRef.close({selectedImages: this.selectedImages})
  }

  onFileSelected(e: Event){
    const input = e.target as HTMLInputElement;
    if(input.files && input.files.length){
      this.selectedImages = input.files;   
      this.selectedImagesArray = Array.from(input.files);  
    }else{
      this.selectedImages = null;
    }
  }

  dateToday(): Date {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const day = now.getDate()+1;
    const hour = now.getHours();
    const minute = now.getMinutes();
    return new Date(year, month, day, hour, minute);
  }
}
