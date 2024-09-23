import { Component, Inject, LOCALE_ID } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Event } from 'src/app/shared/interfaces/event';
import { User } from 'src/app/shared/interfaces/user';
import { EventService } from 'src/app/shared/services/event.service';
import { UserService } from 'src/app/shared/services/user.service';
import { io, Socket } from 'socket.io-client';
import { environment } from 'src/environments/environment';
import { EventDetailsDialogComponent } from '../dialogs/event-details-dialog/event-details-dialog.component';
import { cloneDeep, includes } from 'lodash';
import { SnackBarService } from 'src/app/shared/services/snack-bar.service';


@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss']
})
export class EventComponent {
  allEvents: Event[] = [];
  events: Event[] = [];
  currentEvent: Event | null = null;
  updatedEvent: Event | null = null;
  error: boolean = false;
  newEvent: Event = {name : '', date : new Date()}; 
  userLogin: User = {userName: '', email: ''};
  role: string = '';
  socket: Socket; 
  categoryFilter: string = '';
  programsFilter: string[] = [];
  searchFilter: string = '';


  constructor(
    private eventService: EventService, 
    private userService: UserService,
    private dialog: MatDialog,
    private snackBar: SnackBarService
    ){
      this.userLogin = this.userService.getUser();
      this.socket = io(environment.apiUrl);
      this.userService.role.subscribe((role: string) => {
        this.role = role;
      })
    }

  ngOnInit(){

    this.getEvents();

  }

  getEvents(){
    this.eventService.getEventsRequest().subscribe({
      next: (response: Event[]) => {
        this.events = response;
        this.events.forEach(event => {
          event.currentImgIndex = 0;
        })
        this.events = [...this.events];
        this.events.sort(function(a, b){
          const ad = new Date(a.date);
          const bd = new Date(b.date);
          return ad.getTime() - bd.getTime()});
        this.allEvents = cloneDeep(this.events);
      },
      error: () => {
        this.error = true;
      }
    });
  }

  attendEvent(event: Event){
    this.eventService.updateUserEventRequest(event, this.userLogin._id!).subscribe({
      next: (response: Event) => {
        this.socket.emit('userAttendEvent', response);
        this.snackBar.successSnackBar(' You will attend to this event. You can find it now on "My Events" tab');
        let index = this.events.findIndex(evento => evento._id === event._id);
        this.events[index].idUsers = response.idUsers;    
        this.events = [...this.events];
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

  deselectCategory(){
    this.categoryFilter = '';
    this.events = cloneDeep(this.allEvents);
  }

  onFilterChange(){
    //console.log('category filter ', this.categoryFilter, 'programs filter ', this.programsFilter, 'search ', this.searchFilter);
    if(this.categoryFilter!== '' && this.programsFilter.length == 0 && this.searchFilter === ''){ //solo category
      this.events = cloneDeep(this.allEvents);
      this.events = this.events.filter(event => event.category === this.categoryFilter);

    } else if(this.programsFilter.length != 0 && this.categoryFilter== '' && this.searchFilter === ''){ //solo programs
      this.events = cloneDeep(this.allEvents);
      this.events = this.events.filter(event =>this.programsFilter.some(value => event.programs?.includes(value)));

    }else if (this.programsFilter.length == 0 && this.categoryFilter== '' && this.searchFilter !== ''){// solo searchbar
      this.events = cloneDeep(this.allEvents);
      this.events = this.events.filter(event => event.name.toLowerCase().includes(this.searchFilter.toLowerCase()));

    } else if(this.categoryFilter !== '' && this.programsFilter.length != 0 && this.searchFilter === ''){ //category y programs, searchbar no
      this.events = cloneDeep(this.allEvents);
      this.events = this.events.filter(event => this.programsFilter.some(value => event.programs?.includes(value)));
      this.events = this.events.filter(event => event.category === this.categoryFilter);

    } else if(this.categoryFilter !== '' && this.searchFilter !== '' && this.programsFilter.length == 0) { // category y searchbar, programs no
      this.events = cloneDeep(this.allEvents);
      this.events = this.events.filter(event => event.category === this.categoryFilter);
      this.events = this.events.filter(event => event.name.toLowerCase().includes(this.searchFilter.toLowerCase()));

    } else if(this.programsFilter.length != 0 && this.searchFilter !== '' && this.categoryFilter== '') { // programs y searchbar, category no
      this.events = cloneDeep(this.allEvents);
      this.events = this.events.filter(event =>this.programsFilter.some(value => event.programs?.includes(value)));
      this.events = this.events.filter(event => event.name.toLowerCase().includes(this.searchFilter.toLowerCase()));

    }else if(this.categoryFilter!== '' && this.programsFilter.length != 0 && this.searchFilter !== '') { // todos
      console.log('todos');
      this.events = this.events.filter(event => this.programsFilter.some(value => event.programs?.includes(value)));
      this.events = this.events.filter(event => event.category === this.categoryFilter);
      this.events = this.events.filter(event => event.name.toLowerCase().includes(this.searchFilter.toLowerCase()));

    } else { //ninguno
      this.events = cloneDeep(this.allEvents);
    }
  }

}
