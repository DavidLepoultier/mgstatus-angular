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
export class KongSequenceService {

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

  addSeqConfig(seqconfig: object): Observable<any> {
    return this.http.post(endpoint.api + `sequences`, seqconfig, this.getHeaders()).pipe(
      map(this.extractData));
  }

  getAllSequence(): Observable<any> {
    return this.http.get(endpoint.api + `sequences`, this.getHeaders()).pipe(
      map(this.extractData));
  }

  getSequence(id: any): Observable<any> {
    return this.http.get(endpoint.api + `sequences/${id}`, this.getHeaders()).pipe(
      map(this.extractData));
  }

  deleteSeq(id: any): Observable<any> {
    return this.http.delete(endpoint.api + `sequences/${id}`, this.getHeaders()).pipe(
      map(this.extractData));
  }

  updateSeqConfig(id: any, seqconfig: object): Observable<any> {
    return this.http.put(endpoint.api + `sequences/${id}`, seqconfig, this.getHeaders()).pipe(
      map(this.extractData));
  }
}
