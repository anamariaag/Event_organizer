import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Socket, io } from 'socket.io-client';
import { Event } from 'src/app/shared/interfaces/event';
import { User } from 'src/app/shared/interfaces/user';
import { EventService } from 'src/app/shared/services/event.service';
import { UserService } from 'src/app/shared/services/user.service';
import { environment } from 'src/environments/environment';
import { EventDetailsDialogComponent } from '../dialogs/event-details-dialog/event-details-dialog.component';
import { AuthService } from 'src/app/shared/services/auth.service';

interface dayOfWeek {
  day: string,
  events: Event[]
}
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  events: Event[] = [];
  currentEvent: Event | null = null;
  updatedEvent: Event | null = null;
  error: boolean = false;
  newEvent: Event = {name : '', date : new Date()}; 
  userLogin: User = {userName: '', email: ''};
  role: string = '';
  socket: Socket;
  today: Date =  new Date();
  week: Date = new Date();
  actualWeek: dayOfWeek[] = [];
   

  constructor(
    private userService: UserService,
    private eventService: EventService, 
    private dialog: MatDialog,
    private authService: AuthService){
      this.socket = io(environment.apiUrl);
      this.userService.role.subscribe((role: string) => {
        this.role = role;
      });
      this.week.setDate(this.today.getDate()+8);
      this.userService.user.subscribe((user: User) => {
        this.userLogin = user;
        if(this.userLogin.userType !== undefined){
          this.getEvents();
        }
      })
  }

  getEvents(){
    //console.log(this.userLogin.userType);
    if(this.userLogin.userType == 'USER'){
      this.eventService.getEventsByUserRequest(this.userLogin._id!).subscribe({
        next: (response: Event[]) => {
          //console.log(response);
          this.events = response;
          this.events.forEach(event => {
            event.currentImgIndex = 0;
          });
          this.events = [...this.events];
          //console.log(this.events);
          this.initializeDates();
        },
        error: () => {
          this.error = true;
        }
      });
    }else if( this.userLogin.userType == 'ORG') {
      this.eventService.getEventsByOrganizerRequest(this.userLogin._id!).subscribe({
        next: (response: Event[]) => {
          //console.log(response);
          this.events = response;
          this.events.forEach(event => {
            event.currentImgIndex = 0;
          });
          this.events = [...this.events];
          //console.log(this.events);
          this.initializeDates();
        },
        error: () => {
          this.error = true;
        }
      });
    } else{
      this.eventService.getEventsRequest().subscribe({
      next: (response: Event[]) => {
        //console.log(response);
        this.events = response;
        this.events.forEach(event => {
          event.currentImgIndex = 0;
        });
        this.events = [...this.events];
        //console.log(this.events);
        this.initializeDates();
      },
      error: () => {
        this.error = true;
      }
    });
    }
  }

  attendEvent(event: Event){
    this.eventService.updateUserEventRequest(event, this.userLogin._id!).subscribe({
      next: (response: Event) => {
        this.socket.emit('userAttendEvent', response);
        //console.log(response);
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
      height:'80%',
    });
  }

initializeDates(): void {
  let temp = new Date();
  const a = this.today.getTime();
  const b = this.week.getTime();
  
  for (let i = 0; i < 7; i++){
    let fecha = new Date(temp.setDate(this.today.getDate()+i));
    let dateString = new Date(temp.setDate(this.today.getDate()+i)).toDateString();
    let sd = fecha.setUTCHours(0,0,0,0);
    //console.log(sd);
    let ed = fecha.setUTCHours(23,59,59,999);
    //console.log(ed);
    //console.log(this.events);
    var day = this.events.filter((item) => { 
      var time = new Date(item.date!).getTime();
      //console.log('time', time);
      return (sd < time && ed > time);
    });
    this.actualWeek.push({day: dateString, events: day})
  }
  //console.log(this.actualWeek);
}

}
