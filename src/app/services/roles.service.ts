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
export class RolesService {

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

  getRoles(): Observable<any> {
    return this.http.get(endpoint.api + `roles`, this.getHeaders()).pipe(
      map(this.extractData));
  }

  createRole(role: any): Observable<any> {
    return this.http.post(endpoint.api + `roles`, role, this.getHeaders()).pipe(
      map(this.extractData));
  }

  deleteRole(id: any): Observable<any> {
    return this.http.delete(endpoint.api + `roles/${id}`, this.getHeaders()).pipe(
      map(this.extractData));
  }

  updateRole(id: any, config: any): Observable<any> {
    return this.http.put(endpoint.api + `roles/${id}`, config, this.getHeaders()).pipe(
      map(this.extractData));
  }

}
