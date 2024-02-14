import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

import { environment } from '../../../environments/environment.development';
import { Login } from '../models/account/login.model';
import { Register } from '../models/account/register.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private router: Router) { }
  isLoggedIn: boolean = false;
  

  private loginUrl: string = 'api/Authentication/login';
  private registerUrl: string = 'api/Authentication/register';

  login(model: Login) {
    return this.http.post(`${environment.apiUrl}login`, model, {withCredentials: true});
  }

  register(model: Register){
    return this.http.post(`${environment.apiUrl}register`, model, {withCredentials: true});
  }

  logout(){
    return this.http.post(`${environment.apiUrl}logout`, '', {withCredentials: true});
  }
}
