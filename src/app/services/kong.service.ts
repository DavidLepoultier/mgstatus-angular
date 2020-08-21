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
export class KongService {

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

  getKongAdminStatus(id: any): Observable<any> {
    return this.http.get(endpoint.api + `kong/${id}/status`, this.getHeaders()).pipe(
      map(this.extractData));
  }

  getKongServices(id: any): Observable<any> {
    return this.http.get(endpoint.api + `kong/${id}/services`, this.getHeaders()).pipe(
      map(this.extractData));
  }

  getKongServicesEnterprise(id: any, worksapce: any): Observable<any> {
    return this.http.get(endpoint.api + `kong/${id}/${worksapce}/services`, this.getHeaders()).pipe(
      map(this.extractData));
  }

  getKongRoutes(id: any): Observable<any> {
    return this.http.get(endpoint.api + `kong/${id}/routes`, this.getHeaders()).pipe(
      map(this.extractData));
  }

  getKongRoutesEnterprise(id: any, workspace: any): Observable<any> {
    return this.http.get(endpoint.api + `kong/${id}/${workspace}/routes`, this.getHeaders()).pipe(
      map(this.extractData));
  }

  getKongConsumers(id: any): Observable<any> {
    return this.http.get(endpoint.api + `kong/${id}/consumers`, this.getHeaders()).pipe(
      map(this.extractData));
  }

  getKongConsumersEnterprise(id: any, workspace: any): Observable<any> {
    return this.http.get(endpoint.api + `kong/${id}/${workspace}/consumers`, this.getHeaders()).pipe(
      map(this.extractData));
  }

  getKongPluginsEnabled(id: any): Observable<any> {
    return this.http.get(endpoint.api + `kong/${id}/plugins/enabled`, this.getHeaders()).pipe(
      map(this.extractData));
  }

  getKongPlugins(id: any): Observable<any> {
    return this.http.get(endpoint.api + `kong/${id}/plugins`, this.getHeaders()).pipe(
      map(this.extractData));
  }

  getKongPluginsEnterprise(id: any, workspace: any): Observable<any> {
    return this.http.get(endpoint.api + `kong/${id}/${workspace}/plugins`, this.getHeaders()).pipe(
      map(this.extractData));
  }

  getWorkspaces(id: any): Observable<any> {
    return this.http.get(endpoint.api + `kong/${id}/workspaces`, this.getHeaders()).pipe(
      map(this.extractData));
  }

  getAdminUsers(id: any, workspace: any): Observable<any> {
    return this.http.get(endpoint.api + `kong/${id}/${workspace}/admins`, this.getHeaders()).pipe(
      map(this.extractData));
  }

  getCLusterStatus(id: any): Observable<any> {
    return this.http.get(endpoint.api + `kong/${id}/cluster/status`, this.getHeaders()).pipe(
      map(this.extractData));
  }
}
