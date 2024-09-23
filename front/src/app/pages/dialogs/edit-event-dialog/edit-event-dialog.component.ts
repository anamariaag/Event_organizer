import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Event } from 'src/app/shared/interfaces/event';

@Component({
  selector: 'app-edit-event-dialog',
  templateUrl: './edit-event-dialog.component.html',
  styleUrls: ['./edit-event-dialog.component.scss']
})
export class EditEventDialogComponent {

  hours: number[] = Array.from({length: 23}, (_, i)=> i);
  minutes: number[] = [15, 30, 45, 60];

  constructor(
    public dialogRef: MatDialogRef<EditEventDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public event: Event,
  ) {}

  cancelar(): void {
    this.dialogRef.close();
  }

  dateToday(): Date {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    const hour = now.getHours();
    const minute = now.getMinutes();
    return new Date(year, month, day, hour, minute);
  }
}
