import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import * as jwtDecode from 'jwt-decode'; 

const endpoint = {
  "auth": environment.authUrl
}

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http:HttpClient, private router:Router) { }

  private extractData(res: Response) {
    let body = res;
    return body || { };
  }

  getAllOrgs(): Observable<any> {
    return this.http.get(endpoint.auth + `orgs`).pipe(
      map(this.extractData));
  }

  login(credentials: any): Observable<any> {
    return this.http.post(endpoint.auth + 'login', credentials, httpOptions).pipe(
      map(this.extractData));
  }

  userIsLoggedIn() {
    return sessionStorage.getItem('jbb-data');
  }

  userOrgPreference() {
    if(localStorage.getItem('orgName')) {
      return localStorage.getItem('orgName');
    } else {
      return '{"name":"unset"}';
    }
  }

  logout() {
    sessionStorage.removeItem('jbb-data');
    this.router.navigate(['/']);
  }

  register(credentials: any): Observable<any> {
    return this.http.post(endpoint.auth + 'register', credentials, httpOptions).pipe(
      map(this.extractData));
  }

  registerApigee(credentials: any): Observable<any> {
    return this.http.post(endpoint.auth + 'registerApigee', credentials, httpOptions).pipe(
      map(this.extractData));
  }

  jwtTokenDecode() {
    let data: object = JSON.parse(sessionStorage.getItem('jbb-data'));
    return jwtDecode(data['token']);
  }

  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
