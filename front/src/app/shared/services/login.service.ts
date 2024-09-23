import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Token } from '../interfaces/token';
import { environment } from 'src/environments/environment';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private httpClient: HttpClient) { }

  login(email: string, password: string){
    const url: string = environment.apiUrl + 'login';

    return this.httpClient.post<Token>(url, {email, password});
  }


  createUserRequest(user: User): Observable <Token>{
    const url: string = environment.apiUrl + 'users';

    return this.httpClient.post<Token>(url, {user});
  }

  googleApiLogin(code: string, action: string): Observable<Token>{
    console.log("Entrando a googleApiLogin");
    const url: string = environment.apiUrl + `googleApi/credentials?code=${code}&action=${action}`;

    return this.httpClient.get<Token>(url);
  }


}
