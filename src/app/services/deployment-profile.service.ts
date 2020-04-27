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
export class DeploymentProfileService {

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

  addDeploymentConfig(envconfig: object): Observable<any> {
    return this.http.post(endpoint.api + `deployments`, envconfig, this.getHeaders()).pipe(
      map(this.extractData));
  }

  getAllDeployment(): Observable<any> {
    return this.http.get(endpoint.api + `deployments`, this.getHeaders()).pipe(
      map(this.extractData));
  }

  getDeployment(id: any): Observable<any> {
    return this.http.get(endpoint.api + `deployments/${id}`, this.getHeaders()).pipe(
      map(this.extractData));
  }

  deleteDeployment(id: any): Observable<any> {
    return this.http.delete(endpoint.api + `deployments/${id}`, this.getHeaders()).pipe(
      map(this.extractData));
  }

  updateDeploymentConfig(id: any, envconfig: object): Observable<any> {
    return this.http.put(endpoint.api + `deployments/${id}`, envconfig, this.getHeaders()).pipe(
      map(this.extractData));
  }
}
