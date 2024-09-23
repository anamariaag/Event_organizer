import { Component, OnInit } from '@angular/core';
import { io,Socket } from 'socket.io-client';
import { Event } from 'src/app/shared/interfaces/event';
import { SnackBarService } from 'src/app/shared/services/snack-bar.service';
import { UserService } from 'src/app/shared/services/user.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit{
  userId: string | undefined;
  socket: Socket;

  constructor(private snackBar: SnackBarService,
    userService: UserService){

      this.socket = io(environment.apiUrl);

      userService.userId.subscribe((userId: string) => {
        this.userId = userId;
      });
  }

  ngOnInit(): void {
    this.socket.on('notifUser', (event: Event) => {
      if(event.idOrganizer === this.userId){
        this.snackBar.notificationSnackBar('A new user will attend your event - ' + event.name);
      }
    });

    this.socket.on('notifComment', (event: Event) => {
      if(event.idOrganizer === this.userId){
        this.snackBar.notificationSnackBar('A user commented on your event - ' + event.name);
      }
    });
  }

}
