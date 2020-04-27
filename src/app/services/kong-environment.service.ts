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
export class KongEnvironmentService {

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

  addEnvConfig(envconfig: object): Observable<any> {
    return this.http.post(endpoint.api + `environments`, envconfig, this.getHeaders()).pipe(
      map(this.extractData));
  }

  getAllEnvironment(): Observable<any> {
    return this.http.get(endpoint.api + `environments`, this.getHeaders()).pipe(
      map(this.extractData));
  }

  getEnvironment(id: any): Observable<any> {
    return this.http.get(endpoint.api + `environments/${id}`, this.getHeaders()).pipe(
      map(this.extractData));
  }

  deleteEnv(id: any): Observable<any> {
    return this.http.delete(endpoint.api + `environments/${id}`, this.getHeaders()).pipe(
      map(this.extractData));
  }

  updateEnvConfig(id: any, envconfig: object): Observable<any> {
    return this.http.put(endpoint.api + `environments/${id}`, envconfig, this.getHeaders()).pipe(
      map(this.extractData));
  }

}
