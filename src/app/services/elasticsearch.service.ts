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
export class ElasticsearchService {

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

  addEsConfig(esConfig: object): Observable<any> {
    return this.http.post(endpoint.api + `es/config`, esConfig, this.getHeaders()).pipe(
      map(this.extractData));
  }

  getEsConfig(): Observable<any> {
    return this.http.get(endpoint.api + `es/config`, this.getHeaders()).pipe(
      map(this.extractData));
  }

  testEsAccess(esConfig: object): Observable<any> {
    return this.http.post(endpoint.api + `es/checkconfig`, esConfig, this.getHeaders()).pipe(
      map(this.extractData));
  }

  getEsTrafficStatus(esTraffic: object): Observable<any> {
    return this.http.get(endpoint.api + `es/traffic/status?${esTraffic}`, this.getHeaders()).pipe(
      map(this.extractData));
  }
}
