import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Event } from 'src/app/shared/interfaces/event';
import { User } from 'src/app/shared/interfaces/user';
import { EventService } from 'src/app/shared/services/event.service';
import { UserService } from 'src/app/shared/services/user.service';
import { EventDetailsDialogComponent } from '../../dialogs/event-details-dialog/event-details-dialog.component';
import { SnackBarService } from 'src/app/shared/services/snack-bar.service';

@Component({
  selector: 'app-event-list-user',
  templateUrl: './event-list-user.component.html',
  styleUrls: ['./event-list-user.component.scss']
})
export class EventListUserComponent {
  events: Event[] = [];
  currentEvent: Event | null = null;
  updatedEvent: Event | null = null;
  error: boolean = false;
  newEvent: Event = {name : '', date : new Date()}; 
  userLogin: User = {userName: '', email: ''};

  constructor(
    private eventService: EventService, 
    private userService: UserService,
    private dialog: MatDialog,
    private snackBar: SnackBarService){
      this.userLogin = this.userService.getUser();
    }

  ngOnInit(){
    this.getEventsByUser(this.userLogin._id ? this.userLogin._id :'');
  }

  getEventsByUser(idUser: string){
    this.eventService.getEventsByUserRequest(idUser).subscribe({
      next: (response: Event[]) => {
        // console.log(response);
        this.events = response;
        this.events.forEach(event => {
          event.currentImgIndex = 0;
        })
        this.events = [...this.events];
        this.events.sort(function(a, b){
          const ad = new Date(a.date);
          const bd = new Date(b.date);
          return ad.getTime() - bd.getTime()});
      },
      error: () => {
        this.error = true;
      }
    });
  }
  
  desattendEvent(event: Event){
    this.eventService.deleteUserEventRequest(event, this.userLogin._id!).subscribe({
      next: (response: Event) => {
        //console.log(response);
        this.getEventsByUser(this.userLogin._id ? this.userLogin._id :'');
        this.snackBar.errorSnackBar('You will no longer be attending this event');
      },
      error: () => {
        this.error = true;
      }
    });
  }

  nextImage(event: Event) {
    event.currentImgIndex = (event.currentImgIndex! + 1) % event.photos!.length;
  }

  previousImage(event:Event){
    event.currentImgIndex = (event.currentImgIndex! - 1 + event.photos!.length) % event.photos!.length;
  }

  eventDetails(event: Event, user: User): void {
    const dialogRef = this.dialog.open(EventDetailsDialogComponent,{
      data: {event, user},
      width:'75%',   
      height:'90%',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if(result){

        let index = this.events.findIndex(evento => evento._id === event._id); 
        this.events[index].idUsersCalendar = result.idUsersCalendar;
        this.events = [...this.events];

      }
    })
  }

}
