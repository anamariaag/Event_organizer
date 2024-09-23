import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Review } from '../interfaces/review';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  constructor(private httpClient: HttpClient,
    private authService: AuthService) { }

  createReviewRequest(review: Review): Observable <Review> {
    const url: string = environment.apiUrl + 'reviews/';
    const token: string = this.authService.getToken();
    const headers = new HttpHeaders().set('x-access-token', token);
    return this.httpClient.post<Review>(url, review, {headers});
  }
  
  getReviewsByEventRequest(idEvent: string): Observable <Review[]>{
    //console.log(idOrganizer);
    const url: string = environment.apiUrl + 'reviews/?id=' + idEvent;
    const token: string = this.authService.getToken();
    const headers = new HttpHeaders().set('x-access-token', token);
    return this.httpClient.get<Review[]>(url, {headers});
  }

  deleteReviewRequest(review: Review): Observable <Review>{
    const url: string = environment.apiUrl + 'reviews/?id=' + review._id;
    const token: string = this.authService.getToken();
    const headers = new HttpHeaders().set('x-access-token', token);
    return this.httpClient.delete<Review>(url, {headers});
  }
  
  updateReviewRequest(review: Review): Observable <Review>{
    const url: string = environment.apiUrl + 'reviews/?id=' + review._id;
    const token: string = this.authService.getToken();
    const headers = new HttpHeaders().set('x-access-token', token);
    return this.httpClient.put<Review>(url, review, {headers});
  }
}
