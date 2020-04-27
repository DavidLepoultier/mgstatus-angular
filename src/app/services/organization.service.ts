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
export class OrganizationService {

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

  createOrg(organization: object): Observable<any> {
    return this.http.post(endpoint.api + `orgs`, organization, this.getHeaders()).pipe(
      map(this.extractData));
  }

  changeProfileOrg(id: any, newDeployId: any): Observable<any> {
    return this.http.put(endpoint.api + `orgs/${id}/update/profile`, newDeployId, this.getHeaders()).pipe(
      map(this.extractData));
  }

  getOrganizations(): Observable<any> {
    return this.http.get(endpoint.api + `orgs`, this.getHeaders()).pipe(
      map(this.extractData));
  }

  getOrgId(id: any): Observable<any> {
    return this.http.get(endpoint.api + `orgs/${id}`, this.getHeaders()).pipe(
      map(this.extractData));
  }

  deleteOrgId(id: any): Observable<any> {
    return this.http.delete(endpoint.api + `orgs/${id}`, this.getHeaders()).pipe(
      map(this.extractData));
  }

}
