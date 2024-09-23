import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { SocialAuthService } from '@abacritt/angularx-social-login';
import { Event } from '../interfaces/event';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor(private httpClient: HttpClient, 
    private authService: AuthService,
    private socialAuthService: SocialAuthService) { }

  private events: Event[] = [];

  createEventRequest(event: Event): Observable <Event> {
    const url: string = environment.apiUrl + 'events/';
    const token: string = this.authService.getToken();
    const headers = new HttpHeaders().set('x-access-token', token);
    return this.httpClient.post<Event>(url, event, {headers});
  }

  getEventsByOrganizerRequest(idOrganizer: string): Observable <Event[]>{
    //console.log(idOrganizer);
    const url: string = environment.apiUrl + 'events/idOrg/?id=' + idOrganizer;
    const token: string = this.authService.getToken();
    const headers = new HttpHeaders().set('x-access-token', token);
    return this.httpClient.get<Event[]>(url, {headers});
  }
  
  getEventsByUserRequest(idUser: string): Observable <Event[]>{
    //console.log(idUser);
    const url: string = environment.apiUrl + 'events/idUser/?id=' + idUser;
    const token: string = this.authService.getToken();
    const headers = new HttpHeaders().set('x-access-token', token);
    return this.httpClient.get<Event[]>(url, {headers});
  }

  getEventsRequest(): Observable <Event[]>{
    const url: string = environment.apiUrl + 'events';
    const token: string = this.authService.getToken();
    const headers = new HttpHeaders().set('x-access-token', token);
    return this.httpClient.get<Event[]>(url, {headers});
  }

  deleteEventRequest(event: Event): Observable <Event>{
    const url: string = environment.apiUrl + 'events/?id=' + event._id;
    const token: string = this.authService.getToken();
    const headers = new HttpHeaders().set('x-access-token', token);
    return this.httpClient.delete<Event>(url, {headers});
  }
  
  updateEventRequest(event: Event): Observable <Event>{
    const url: string = environment.apiUrl + 'events/?id=' + event._id;
    const token: string = this.authService.getToken();
    const headers = new HttpHeaders().set('x-access-token', token);
    return this.httpClient.put<Event>(url, event, {headers});
  }

  updateUserEventRequest(event: Event, userId: string): Observable <Event>{
    const url: string = environment.apiUrl + 'events/users/?id=' + userId;
    const token: string = this.authService.getToken();
    const headers = new HttpHeaders().set('x-access-token', token);
    return this.httpClient.put<Event>(url, event, {headers});
  }

  updateUserEventCalendarRequest(event: Event, userId: string): Observable <Event>{
    const url: string = environment.apiUrl + 'events/usersCalendar/?id=' + userId;
    const token: string = this.authService.getToken();
    const headers = new HttpHeaders().set('x-access-token', token);
    return this.httpClient.put<Event>(url, event, {headers});
  }

  

  deleteUserEventRequest(event: Event, userId: string): Observable <Event>{
    const url: string = environment.apiUrl + 'events/nousers/?id=' + userId;
    const token: string = this.authService.getToken();
    const headers = new HttpHeaders().set('x-access-token', token);
    return this.httpClient.put<Event>(url, event, {headers});
  }

  uploadImagesRequest(eventId: string, input: FileList): Observable <any>{
    const url: string = environment.apiUrl + `events/${eventId}/upload`;
    const token: string = this.authService.getToken();
    const headers = new HttpHeaders().set('x-access-token', token);
    const formData = new FormData()

    if (input){
      for(let i = 0; i < input.length; i++){
        formData.append('files', input[i]);
      }
    }

    return this.httpClient.post<any>(url, formData, {headers});

  }

  getImagesRequest(eventId: string): Observable<Array<string>>{
    const url: string = environment.apiUrl + `events/${eventId}/images`;
    const token: string = this.authService.getToken();
    const headers = new HttpHeaders().set('x-access-token', token);

    return this.httpClient.get<Array<string>>(url, {headers});

  }

  googleApiRequest(): Observable<any>{
    const url: string = environment.apiUrl + 'googleApi';
    
    return this.httpClient.get<any>(url);
  }

  googleCalendarRequest(event: Object): Observable<any>{
    const url: string = environment.apiUrl + "events/scheduleEvent";
    const token: string = this.authService.getToken();
    const headers = new HttpHeaders().set('x-access-token', token);
    return this.httpClient.post<any>(url, event, {headers});
    
  }

  

}
