import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../interfaces/user';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  loginStatus: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
   
  constructor() { 
    this.loginStatus.next(this.isLoggedIn());
  }

  setToken(token: string) {
    localStorage.setItem('token', token);
    this.loginStatus.next(true);
  }

  setTokenGoogle(token: string) {
    localStorage.setItem('tokenGoogle', token);
    this.loginStatus.next(true);
  }

  setAction(action: string){
    localStorage.setItem('action', action);
  }

  getAction(){
    return localStorage.getItem('action');
  }

  removeAction(){
    localStorage.removeItem('action');
  }

  getToken(): string {
    return localStorage.getItem('token') || '';
  }

  getTokenGoogle(): string {
    return localStorage.getItem('tokenGoogle') || '';
  }

  getUserEmail(): string {
    return localStorage.getItem('userEmail') || '';
  }

  isLoggedIn(): boolean {
    //return this.getToken() ? true : false; 
    //return !(this.getToken() === '');

    //coerción de tipos
    return !!this.getToken() || !!this.getTokenGoogle();
  }

  removeToken(){
    localStorage.removeItem('token');
    localStorage.removeItem('tokenGoogle');
    localStorage.removeItem('action');
    this.loginStatus.next(false);
  }

}
