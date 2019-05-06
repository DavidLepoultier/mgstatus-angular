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
export class ApigeeService {
    
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

  testAdminConnexion(apigeeConfig: object): Observable<any> {
    return this.http.post(endpoint.api + `apigee/test`, apigeeConfig, this.getHeaders()).pipe(
      map(this.extractData));
  }

  testAdminUser(adminUser: any): Observable<any> {
    return this.http.get(endpoint.api + `user/available/${adminUser.adminLogin}`, this.getHeaders()).pipe(
      map(this.extractData));
  }

  createOrg(apigeeConfig: any): Observable<any> {
    return this.http.post(endpoint.api + 'apigee/org/create', apigeeConfig, this.getHeaders()).pipe(
      map(this.extractData));
  }

  deleteOrg(org: any): Observable<any> {
    return this.http.delete(endpoint.api + `apigee/org/${org}`, this.getHeaders()).pipe(
      map(this.extractData));
  }

  createAdminOrg(adminUser: any): Observable<any> {
    return this.http.post(endpoint.auth + 'register', adminUser, this.getHeaders()).pipe(
      map(this.extractData));
  }

  deleteAdminOrg(adminUser: any): Observable<any> {
    return this.http.delete(endpoint.api + `user/${adminUser}`, this.getHeaders()).pipe(
      map(this.extractData));
  }

  getDevelopers(): Observable<any> {
    return this.http.get(endpoint.api + `apigee/developers`, this.getHeaders()).pipe(
      map(this.extractData));
  }

  getDevelopersId(id: any): Observable<any> {
    return this.http.get(endpoint.api + `apigee/developers/${id}`, this.getHeaders()).pipe(
      map(this.extractData));
  }

  getDeveloperApps(): Observable<any> {
    return this.http.get(endpoint.api + `apigee/developer/apps`, this.getHeaders()).pipe(
      map(this.extractData));
  }

  getAllApps(): Observable<any> {
    return this.http.get(endpoint.api + `apigee/apps`, this.getHeaders()).pipe(
      map(this.extractData));
  }

  getAllOrgs(): Observable<any> {
    return this.http.get(endpoint.api + `apigee/orgs`, this.getHeaders()).pipe(
      map(this.extractData));
  }

  getProducts(): Observable<any> {
    return this.http.get(endpoint.api + `apigee/products`, this.getHeaders()).pipe(
      map(this.extractData));
  }

  actionApp(app: object, action: string): Observable<any> {
    return this.http.post(endpoint.api + `apigee/developer/apps/${action}`, app, this.getHeaders()).pipe(
      map(this.extractData));
  }
  
}
