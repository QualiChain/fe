import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  //uri = 'http://localhost:4000/users';
  private uriUsers = environment.usersUrl;

  constructor(private http: HttpClient) { }

  getUsers() {
    return this
      .http
      .get(`${this.uriUsers}`);
  }

  getUser(userId: Number) {
    return this
      .http
      .get(`${this.uriUsers}/${userId}`);
    }  
  }

