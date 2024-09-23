import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Event } from 'src/app/shared/interfaces/event';
import { User } from 'src/app/shared/interfaces/user';
import { EventService } from 'src/app/shared/services/event.service';
import { UserService } from 'src/app/shared/services/user.service';
import { ConfirmDialogComponent } from '../../dialogs/confirm-dialog/confirm-dialog.component';
import { Error } from 'src/app/shared/interfaces/error';
import { NewEventDialogComponent } from '../../dialogs/new-event-dialog/new-event-dialog.component';
import { EditEventDialogComponent } from '../../dialogs/edit-event-dialog/edit-event-dialog.component';
import { cloneDeep } from 'lodash';
import { Observable } from 'rxjs';
import { ChangeDetectorRef, NgZone } from '@angular/core';
import { EventDetailsDialogComponent } from '../../dialogs/event-details-dialog/event-details-dialog.component';
import { SnackBarService } from 'src/app/shared/services/snack-bar.service';


@Component({
  selector: 'app-event-list-org',
  templateUrl: './event-list-org.component.html',
  styleUrls: ['./event-list-org.component.scss']
})
export class EventListOrgComponent {
  events: Event[] = [];
  currentEvent: Event | null = null;
  updatedEvent: Event | null = null;
  error: boolean = false;
  newEvent: Event = {name : '', date : new Date(), photos: ['', '']}; 
  userLogin: User = {userName: '', email: ''};

  createdEventId: string = '';

  selectedFiles: FileList | null = null;

  constructor(
    private eventService: EventService, 
    private userService: UserService,
    private dialog: MatDialog,
    private snackBar: SnackBarService,
    private cdRef: ChangeDetectorRef){
      
      this.userLogin = this.userService.getUser();
    }

  ngOnInit(){
    this.getEvents(this.userLogin._id? this.userLogin._id : '');
  }

  getEvents(idOrganizer: string){
    this.eventService.getEventsByOrganizerRequest(idOrganizer).subscribe({
      next: (response: Event[]) => {
        //console.log(response);
        this.events = response;
        this.events.forEach(event => {
          event.currentImgIndex = 0;
        })
        this.events = [...this.events];
        this.events.sort(function(a, b){
          const ad = new Date(a.date);
          const bd = new Date(b.date);
          return ad.getTime() - bd.getTime()});
        //console.log(this.events);
      },
      error: () => {
        this.error = true;
        this.snackBar.errorSnackBar('Events could not be loaded');
      }
    });
  }

  toggleEdit(event: Event): void {
    if(!event.status){
      this.currentEvent = event;
      //console.log('current event: ', this.currentEvent);
    }
    event.status = !event.status;
  }

  saveEvent(event: Event): void {
    event.status = false;
    this.eventService.updateEventRequest(event).subscribe({
      next: (response: Event) => {
        this.error = false;
        this.snackBar.successSnackBar('Event updated successfully!');
      },
      error: () => {
        this.error = true;
      }
    });
    this.currentEvent = null;
  }

  cancel(event: Event): void {
    if(this.currentEvent){
      const index = this.events.findIndex(x => x._id === this.currentEvent!._id);

      if(index !== -1){
        this.events[index] = this.currentEvent;
        this.events = [...this.events]; //here we would do the listener or subscribed to the user in userService I think
      }
      this.currentEvent = null;
    }
    event.status = false;
  }

  deleteEvent(eventToDelete: Event){
    const dialogRef = this.dialog.open(ConfirmDialogComponent);
    eventToDelete.status = false;

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        //(eventToDelete._id);
        this.eventService.deleteEventRequest(eventToDelete).subscribe({
          next: (response: Event) => {
            this.error = false;
            //console.log('Evento eliminado ', response);
            this.events = this.events.filter(event => event._id !== eventToDelete._id);
            this.snackBar.successSnackBar('Event deleted!');
          },
          error: (response: Error) => {
            this.snackBar.errorSnackBar(response.message);
            //console.log(response.message);
            this.error = true;
          }
          
        });
      }
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(NewEventDialogComponent,{
      data: this.newEvent
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        //console.log('The dialog was closed', result);
        this.newEvent = result.event;
        //console.log('new event', this.newEvent);
        this.selectedFiles = result.selectedImages;
        // console.log(this.selectedFiles![0]);
        this.newEvent.idOrganizer = this.userService.getUser()._id;
        this.addEvent(this.newEvent);
        this.newEvent = {name : '', date : new Date()}
      }
    });
  }

  editEventDialog(event: Event): void {
    const dialogRef = this.dialog.open(EditEventDialogComponent,{
      data: cloneDeep(event)
    });

    dialogRef.afterClosed().subscribe(event => {
      //console.log('The dialog was closed', event);
      if(event){
        this.eventService.updateEventRequest(event).subscribe({
          next: (response: Event) => {
            let index = this.events.findIndex(item => item._id === response._id);
            response.currentImgIndex = 0;
            this.events[index] = response;
            this.error = false;
            this.snackBar.successSnackBar('Event updated successfully!');
          },
          error: () => {
            this.error = true;
          }
        });
      }
    });

  }

  uploadImages(eventId: string, images: FileList): Observable<any>{
    return this.eventService.uploadImagesRequest(eventId, images);
  
  }

  addEvent(event: Event) {
    this.eventService.createEventRequest(event).subscribe({
      next: (response: Event) => {
        //console.log(response);
        this.error = false;
        this.events.push(response);
        this.createdEventId = response._id!;
        
        if(this.selectedFiles){
          this.uploadImages(this.createdEventId, this.selectedFiles)
          .subscribe({
            next: (uploadResponse) => {
              //console.log('Images uploades successfully', uploadResponse);              
              this.getEventImages(this.createdEventId, response);
            },
            error:(err) => {
              this.snackBar.errorSnackBar('Files couldn´t be uploaded '+ err);
            }
          });
        }
      },
      error: () => {
        this.error = true;
        this.snackBar.errorSnackBar('Something happened, please try again.')
      }
    })
  }

  getEventImages(eventId: string, updatedEvent: Event){
    this.eventService.getImagesRequest(eventId).subscribe({
      next: (imageUrls) => {
        updatedEvent.photos = imageUrls;
        //update del evento en bd
        this.eventService.updateEventRequest(updatedEvent).subscribe({
          next: (updatedEventwithPhoto) => {
            //console.log('The event has added its photos', updatedEventwithPhoto);
          },
          error: (err) => {
            this.snackBar.errorSnackBar("The photos couldn´t been added to the event");
          }
        });

        updatedEvent.currentImgIndex = 0;
        const index = this.events.findIndex(event => event._id === updatedEvent._id);
        if(index != -1){
          this.events[index] = updatedEvent;
          this.events = [...this.events];
        }else{
          this.events.push(updatedEvent);
          this.events = [...this.events];
        }
        //console.log(this.events);
      }
    })
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
  }
}
