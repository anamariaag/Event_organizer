import { HttpClient, HttpHandler, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../interfaces/user';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
import { SocialAuthService } from '@abacritt/angularx-social-login';
import { Token } from '@angular/compiler';
import { File } from '../interfaces/file';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  
  userType: BehaviorSubject<String> = new BehaviorSubject<String>('');
  role: BehaviorSubject<string> = new BehaviorSubject<string>('');
  userId: BehaviorSubject<string> = new BehaviorSubject<string>('');
  user: BehaviorSubject<User> = new BehaviorSubject<User>({ userName: '', email: ''}); 

  constructor(private httpClient: HttpClient, 
    private authService: AuthService,
    private socialAuthService: SocialAuthService) { 
      this.userType.next(this.getRole())
    }

  
  setUser(user: User): void {
    this.role.next(user.userType!);
    this.userId.next(user._id!);
    this.user.next(user!); 
    this.userType.next(user.userType!);
  }

  getUser(): User{
    return this.user.getValue();
  }

  getRole(): string{
    return this.user.getValue().userType!;
  }

  removeUser(): void{
    this.user.next({ userName: '', email: ''});
    this.userType.next('');
    this.socialAuthService.signOut();
  }

  getUserRequest(email: string):Observable<User> {
    const url: string = environment.apiUrl + 'users/?email=' + email;
    const token: string = this.authService.getToken();
    const headers = new HttpHeaders().set('x-access-token', token);

    return this.httpClient.get<User>(url, {headers});
  }

  getUsersRequest(): Observable<User[]> {
    const url: string = environment.apiUrl + 'users/users';
    const token: string = this.authService.getToken();
    const headers = new HttpHeaders().set('x-access-token', token);
    return this.httpClient.get<User[]>(url, {headers});
  }

  updateUsersRequest(updateUser: User): Observable<User>{
    const url: string = environment.apiUrl + `users/?id=${updateUser._id}`;
    const token : string = this.authService.getToken();
    const headers = new HttpHeaders().set('x-access-token', token);
    return this.httpClient.put<User>(url, updateUser ,{headers});
  }

  deleteUsersRequest(user: User): Observable<User>{
    const url: string = environment.apiUrl + `users/?id=${user._id}`;
    const token : string = this.authService.getToken();
    const headers = new HttpHeaders().set('x-access-token', token);
    return this.httpClient.delete<User>(url, {headers});
  }

  upload(id: string, input: HTMLInputElement): Observable<User> {
    const url: string = environment.apiUrl + `users/${id}/upload`;
    const token : string = this.authService.getToken();
    const headers = new HttpHeaders().set('x-access-token', token);
    const formData = new FormData();
    formData.append('file', input.files![0]); //es un formData porque no solo queremos un json, sino parámetros, uno de ellos, un archivo. 
    return this.httpClient.post<File>(url, formData, {headers});
  }

}
