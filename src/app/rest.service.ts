import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { environment } from './../environments/environment';


const endpoint = environment.apiUrl;
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class RestService {
  constructor(private http: HttpClient) { }

  private extractData(res: Response) {
    let body = res;
    return body || { };
  }

  getResources(): Observable<any> {
    return this.http.get(endpoint + 'resources').pipe(
      map(this.extractData));
  }

  getResource(id: any): Observable<any> {
    return this.http.get(endpoint + `resources/${id}`).pipe(
      map(this.extractData));
  }

  addProject (project: any): Observable<any> {
    console.log(project);
    return this.http.post<any>(endpoint + 'resources', JSON.stringify(project), httpOptions).pipe(
      tap((project) => console.log(`added project w/ id=${project.id}`)),
      catchError(this.handleError<any>('addProject'))
    );
  }

  updateProduct (id: any, product: any): Observable<any> {
    return this.http.put(endpoint + 'products/' + id, JSON.stringify(product), httpOptions).pipe(
      tap(_ => console.log(`updated product id=${id}`)),
      catchError(this.handleError<any>('updateProduct'))
    );
  }

  deleteProject (id: any): Observable<any> {
    return this.http.delete<any>(endpoint + `resources/${id}`, httpOptions).pipe(
      tap(_ => console.log(`deleted project id=${id}`)),
      catchError(this.handleError<any>('deleteProject'))
    );
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
