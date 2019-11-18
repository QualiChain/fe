import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  uri = 'http://localhost:4000/auth';

  constructor(private http: HttpClient) { }

  login(username, password) {

    const obj = { username, password};
    //console.log(obj);

    /*    
    this.http.post(`${this.uri}/athentication`, obj)
        .subscribe(res => console.log('Done'));
    */
        if ((username=='user') && (password=='user')) {
            return ({ authenticated: true, description: 'Valid credentials', id:1, name: 'Dilbert', surname: 'Adams', email: 'dilbert.adams@qualichain-project.eu', username: 'dilbert.adams', 'avatar_path': 'assets/img/dilbert.jpg'});
        }
        else {
            return({authenticated: false, description: 'Invalid credentials', data: {}});
        }

    }

    
}
