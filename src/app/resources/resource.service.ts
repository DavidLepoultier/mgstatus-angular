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
export class ResourceService {
  constructor(private http: HttpClient, private auth:AuthService) { }

  private getHeaders() {
    let token: object = JSON.parse(this.auth.userIsLoggedIn());
    let orgPref: object = JSON.parse(this.auth.userOrgPreference());
    let orgSet = '';
    if(orgPref['name'] != 'unset')
      orgSet = orgPref['name'];
    
    let httpOptions = {
      headers: new HttpHeaders({
        'x-access-token': token['token'],
        'x-org-pref': orgSet,
        'Content-Type':  'application/json'
      })
    };
    return httpOptions;
  }

  private extractData(res: Response) {
    let body = res;
    return body || { };
  }

  getResources(): Observable<any> {
    return this.http.get(endpoint.api + `rgates/tenant`, this.getHeaders()).pipe(
      map(this.extractData));
  }
  
  getResource(id: any): Observable<any> {
    return this.http.get(endpoint.api + `rgates/${id}`, this.getHeaders()).pipe(
      map(this.extractData));
  }

  addProject (project: any): Observable<any> {
    console.log(project);
    return this.http.post(endpoint.api + 'rgates', JSON.stringify(project), this.getHeaders()).pipe(
      tap((project) => console.log(`added project w/ id=${project['id']}`)),
      catchError(this.handleError<any>('addProject'))
    );
  }

  // updateProduct (id: any, product: any): Observable<any> {
  //   return this.http.put(endpoint.api + 'products/' + id, JSON.stringify(product), this.getHeaders()).pipe(
  //     tap(_ => console.log(`updated product id=${id}`)),
  //     catchError(this.handleError<any>('updateProduct'))
  //   );
  // }

  deleteProject (id: any): Observable<any> {
    return this.http.delete(endpoint.api + `rgates/${id}`, this.getHeaders()).pipe(
      map(this.extractData));
  }

  deleteContainer (project: any, container: any): Observable<any> {
    return this.http.delete(endpoint.api + `rgates/${project}/${container}`, this.getHeaders()).pipe(
      map(this.extractData));
  }

  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
