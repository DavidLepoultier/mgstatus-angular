import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

const endpoint = {
  "api": environment.apiUrl,
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

  getDeveloperApps(developer: object): Observable<any> {
    return this.http.post(endpoint.api + `apigee/developer/apps`, developer, httpOptions).pipe(
      map(this.extractData));
  }
}
