import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Event } from 'src/app/shared/interfaces/event';
import { EventService } from 'src/app/shared/services/event.service';
import { UserService } from 'src/app/shared/services/user.service';
import { io, Socket } from 'socket.io-client';
import { environment } from 'src/environments/environment';
import { User } from 'src/app/shared/interfaces/user';
import { ReviewService } from 'src/app/shared/services/review.service';
import { Review } from 'src/app/shared/interfaces/review';
import { SnackBarService } from 'src/app/shared/services/snack-bar.service';
import { Error } from 'src/app/shared/interfaces/error';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { response } from 'express';
import { AuthService } from 'src/app/shared/services/auth.service';
import { DatePipe } from '@angular/common';
import { switchMap } from 'rxjs/operators';
import { Loader } from "@googlemaps/js-api-loader"

@Component({
  selector: 'app-event-details-dialog',
  templateUrl: './event-details-dialog.component.html',
  styleUrls: ['./event-details-dialog.component.scss']
})
export class EventDetailsDialogComponent implements OnInit{

  reviews: Review[] = [];
  newReview: Review = {};
  socket: Socket;
  eventUsersCalendar: Event | null= null;

  loggedUser: User = {userName: '', email: ''};

  isGoogleAccount: boolean = false;
  lng: number = 1;
  lat: number = 2;
  google: any;


  constructor(
    public dialogRef: MatDialogRef<EventDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {event: Event, user: User},
    private userService: UserService, 
    private eventService: EventService,
    private snackBar: SnackBarService,
    private reviewService: ReviewService,
    private dialog: MatDialog,
    private authService: AuthService,
  ) {
    this.socket = io(environment.apiUrl);
    this.getReviews(data.event._id!);
    this.loggedUser = this.userService.getUser()

    this.isGoogleAccount = this.authService.getTokenGoogle() ? true : false;


    console.log(this.isGoogleAccount);
  }

  ngOnInit(): void {
    // this.geocodeAddress('Anillo Perif. Sur Manuel Gómez Morín 8585, Santa María Tequepexpan, 45604 San Pedro Tlaquepaque, Jal.')
    this.loadMapHard();
  }

  cerrar(): void {
    this.dialogRef.close();
  }

  cerrarData(updatedData: Event): void {
    this.dialogRef.close(updatedData);
  }

  nextImage(event: Event) {
    event.currentImgIndex = (event.currentImgIndex! + 1) % event.photos!.length;
  }

  previousImage(event:Event){
    event.currentImgIndex = (event.currentImgIndex! - 1 + event.photos!.length) % event.photos!.length;
  }

  attendEvent(event: Event){
    this.eventService.updateUserEventRequest(event, this.data.user._id!).subscribe({
      next: (response: Event) => {
        this.socket.emit('userAttendEvent', response);
        this.snackBar.successSnackBar('Event added successfully!')
      },
      error: () => {
        this.snackBar.errorSnackBar('Something happened, please try again.')
      }
    });
  }

  getReviews(eventId: string){
    this.reviewService.getReviewsByEventRequest(eventId).subscribe({
      next: (response: Review[]) => {
        this.reviews = response;
      },
      error: () => {
        this.snackBar.successSnackBar('Something happened, please try again.')
      }
    });
  }

  addReview(){
    //console.log(this.data);
    this.newReview.date = new Date();
    this.newReview.status = false;
    this.newReview.idEvent = this.data.event._id;
    this.newReview.idPerson = this.data.user._id;
    this.newReview.personUserName = this.data.user.userName;
    this.newReview.personPhoto = this.data.user.photo;
    this.reviewService.createReviewRequest(this.newReview).subscribe({
      next: (response: Review) => {
        //console.log(response);
        this.reviews.push(response);
        this.socket.emit('userCommentEvent', this.data.event);
        this.snackBar.successSnackBar('Comment added.');
        this.newReview = {};
      },
      error: (response: Error) => {
        this.snackBar.errorSnackBar('Something happened. ' + response.error);
      }
    })
  }

  deleteComment(reviewToDelete: Review){
    const dialogRef = this.dialog.open(ConfirmDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.reviewService.deleteReviewRequest(reviewToDelete).subscribe({
          next: (response) => {
            this.reviews = this.reviews.filter(review => review._id !== reviewToDelete._id);
            this.snackBar.successSnackBar('Comment deleted!');
          },
          error: (response: Error) => {
            this.snackBar.errorSnackBar(response.error);
          }
        });
      }
    });
  }

  toggleEdit(reviewToEdit: Review){
    let indexToUpdate = this.reviews.findIndex(item => item._id === reviewToEdit._id);
    this.reviews[indexToUpdate].status = this.reviews[indexToUpdate].status? false : true;
  }

  editComment(review: Review){
    this.reviewService.updateReviewRequest(review).subscribe({
      next: (response) => {
        //console.log(response);
        this.toggleEdit(review);
      },
      error: (response: Error) =>{
        this.snackBar.errorSnackBar(response.error);
      }
    })
  }

  addCalendar(event: Event){
    const datePipe = new DatePipe('en-US');
    const tokens = this.authService.getTokenGoogle();
    
    if(tokens){

      const newEventToken = {
        event: {
          id: this.data.event._id,
          name: this.data.event.name,
          date: datePipe.transform(this.data.event.date, 'medium'),
          description: this.data.event.description,
          location: this.data.event.location,  
          durationHour: this.data.event.durationHour,
          durationMinut: this.data.event.durationMinute     
        },
        tokens: tokens
      };


      this.eventService.googleCalendarRequest(newEventToken).pipe(
        switchMap((calendarResponse) => {
          //console.log('Sí agregó al calendario', calendarResponse);
          return this.eventService.updateUserEventCalendarRequest(event, this.loggedUser._id!);
        })
      ).subscribe({
        next:(updateResponse) => {
          this.eventUsersCalendar = updateResponse;
          this.cerrarData(this.eventUsersCalendar);
          this.snackBar.successSnackBar('Event added successfully to your Google calendar.');
        },
        error: (err) => {
          this.snackBar.successSnackBar("Event couldn't been added to your calendar.");
          //console.log('Fue un error de calendario');
        }
      })

    }else{
      this.snackBar.errorSnackBar("You need a Google account.");
      console.log("No estás loggeado con una cuenta de google");
    }
  };


  geocodeAddress(address: string) {
    const loader = new Loader({
      apiKey: environment.API_KEY,
      libraries: ["places"]
    });
  
    loader.load().then(() => {
      const geocoder = new google.maps.Geocoder();
  
      geocoder.geocode({ address: address }, (results, status) => {
        if (status == 'OK') {
          const lat = results![0].geometry.location.lat();
          const lng = results![0].geometry.location.lng();
          this.loadMap(lat, lng);

        } else {
          console.error("Geocode was not successful for the following reason: " + status);
        }
      });
    });
  }


  loadMap(lati: number, long: number): void {
    const loader = new Loader({
      apiKey: environment.API_KEY,
      version: "weekly",
    });

    loader.load().then(() => {
      const map = new google.maps.Map(document.getElementById("map")!, {
        center: { lat: lati, lng: long }, // You can update these coordinates
        zoom: 16,
      });
      // Additional map setup code here if needed
    });
  }

  
  loadMapHard(): void {
    const loader = new Loader({
      apiKey: environment.API_KEY,
      version: "weekly",
    });

    loader.load().then(() => {
      const map = new google.maps.Map(document.getElementById("map")!, {
        center: { lat: this.data.event.coordinates![0], lng: this.data.event.coordinates![1] }, // You can update these coordinates
        zoom: 16,
      });
    });

  }



}
