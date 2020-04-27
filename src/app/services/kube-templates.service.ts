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
export class KubeTemplatesService {

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

  addTplConfig(tplconfig: object): Observable<any> {
    return this.http.post(endpoint.api + `templates/`, tplconfig, this.getHeaders()).pipe(
      map(this.extractData));
  }

  getAllTemplate(): Observable<any> {
    return this.http.get(endpoint.api + `templates/`, this.getHeaders()).pipe(
      map(this.extractData));
  }

  getTemplateId(id: any): Observable<any> {
    return this.http.get(endpoint.api + `templates/${id}`, this.getHeaders()).pipe(
      map(this.extractData));
  }

  deleteTemplateId(id: any): Observable<any> {
    return this.http.delete(endpoint.api + `templates/${id}`, this.getHeaders()).pipe(
      map(this.extractData));
  }

  updateTplConfig(id: any, tplconfig: object): Observable<any> {
    return this.http.put(endpoint.api + `templates/${id}`, tplconfig, this.getHeaders()).pipe(
      map(this.extractData));
  }
}

