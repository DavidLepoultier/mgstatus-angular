import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { AuthService } from '../auth/auth.service'

const endpoint = {
  "api": environment.apiUrl,
  "auth": environment.authUrl
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient, private auth:AuthService) { }

  private getHeaders() {
    let token: object = JSON.parse(this.auth.userIsLoggedIn());    
    let httpOptions = {
      headers: new HttpHeaders({
        'x-access-token': token['token'],
        'Content-Type':  'application/json'
      })
    };
    return httpOptions;
  }
  
  private extractData(res: Response) {
    let body = res;
    return body || { };
  }

  getUsers(): Observable<any> {
    return this.http.get(endpoint.api + `users`, this.getHeaders()).pipe(
      map(this.extractData));
  }

  getUsersEmails(): Observable<any> {
    return this.http.get(endpoint.api + `users/emails`, this.getHeaders()).pipe(
      map(this.extractData));
  }

  updateUser(id: any, config: any): Observable<any> {
    return this.http.put(endpoint.api + `users/${id}`, config, this.getHeaders()).pipe(
      map(this.extractData));
  }

  createUser(config: any): Observable<any> {
    return this.http.post(endpoint.api + `users`, config, this.getHeaders()).pipe(
      map(this.extractData));
  }

  deleteUser(id: any){
    return this.http.delete(endpoint.api + `users/${id}`, this.getHeaders()).pipe(
      map(this.extractData));
  }

}
