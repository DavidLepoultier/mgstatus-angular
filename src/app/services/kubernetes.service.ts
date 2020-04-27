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
export class KubernetesService {

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

  testKubeAccess(kubeconfig: object): Observable<any> {
    return this.http.post(endpoint.api + `kube/checkconfig`, kubeconfig, this.getHeaders()).pipe(
      map(this.extractData));
  }

  addKubeConfig(kubeconfig: object): Observable<any> {
    return this.http.post(endpoint.api + `kube/addconfig`, kubeconfig, this.getHeaders()).pipe(
      map(this.extractData));
  }

  getKubeConfig(): Observable<any> {
    return this.http.get(endpoint.api + `kube/config`, this.getHeaders()).pipe(
      map(this.extractData));
  }

}
