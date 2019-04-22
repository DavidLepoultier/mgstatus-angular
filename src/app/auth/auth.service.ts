import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

const endpoint = {
  "api": environment.apiUrl,
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

  constructor(private http:HttpClient) { }

  private extractData(res: Response) {
    let body = res;
    return body || { };
  }

  login(credentials: any): Observable<any> {
    return this.http.post(endpoint.auth + 'login', credentials).pipe(
      map(this.extractData));
  }

  userIsLoggedIn() {
    return sessionStorage.getItem('jbb-data');
  }

  logout() {
    sessionStorage.removeItem('jbb-data');
  }

  register(credentials: any): Observable<any> {
    // return this.http.post(endpoint.auth + 'register', credentials).pipe(
    //   map(this.extractData));
    console.log(credentials);
    return credentials;
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
