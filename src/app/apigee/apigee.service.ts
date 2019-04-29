import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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
export class ApigeeService {

  constructor(private http: HttpClient) { }

  private extractData(res: Response) {
    let body = res;
    return body || { };
  }

  testAdminConnexion(apigeeConfig: object): Observable<any> {
    return this.http.post(endpoint.api + `apigee/test`, apigeeConfig, httpOptions).pipe(
      map(this.extractData));
  }

  testAdminUser(adminUser: any): Observable<any> {
    return this.http.get(endpoint.api + `user/available/${adminUser.adminLogin}`, httpOptions).pipe(
      map(this.extractData));
  }

  createOrg(apigeeConfig: any): Observable<any> {
    return this.http.post(endpoint.api + 'apigee/org/create', apigeeConfig, httpOptions).pipe(
      map(this.extractData));
  }

  createAdminOrg(adminUser: any): Observable<any> {
    return this.http.post(endpoint.auth + 'register', adminUser, httpOptions).pipe(
      map(this.extractData));
  }

  getDeveloperApps(developer: object): Observable<any> {
    return this.http.post(endpoint.api + `apigee/developer/apps`, developer, httpOptions).pipe(
      map(this.extractData));
  }

  getProducts(): Observable<any> {
    return this.http.get(endpoint.api + `apigee/products`, httpOptions).pipe(
      map(this.extractData));
  }

  actionApp(app: object, action: string): Observable<any> {
    return this.http.post(endpoint.api + `apigee/developer/apps/${action}`, app, httpOptions).pipe(
      map(this.extractData));
  }
}
