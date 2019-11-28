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

  getProduct(product: any): Observable<any> {
    return this.http.get(endpoint.api + `apigee/product/${product}`, this.getHeaders()).pipe(
      map(this.extractData));
  }

  getProxies(): Observable<any> {
    return this.http.get(endpoint.api + `apigee/proxies`, this.getHeaders()).pipe(
      map(this.extractData));
  }

  getMyProxies(): Observable<any> {
    return this.http.get(endpoint.api + `apigee/my-proxies`, this.getHeaders()).pipe(
      map(this.extractData));
  }

  getEnvironments(): Observable<any> {
    return this.http.get(endpoint.api + `apigee/environments`, this.getHeaders()).pipe(
      map(this.extractData));
  }

  getProxie(id: any): Observable<any> {
    return this.http.get(endpoint.api + `apigee/proxie/${id}`, this.getHeaders()).pipe(
      map(this.extractData));
  }
  
  getDeploymentStatus(id: any): Observable<any> {
    return this.http.get(endpoint.api + `apigee/proxies/deployment/status/${id}`, this.getHeaders()).pipe(
      map(this.extractData));
  }

  getProxieRevision(id: any, rev: any): Observable<any> {
    return this.http.get(endpoint.api + `apigee/proxie/${id}/${rev}`, this.getHeaders()).pipe(
      map(this.extractData));
  }

  getProxieTarget(id: any, rev: any): Observable<any> {
    return this.http.get(endpoint.api + `apigee/proxie/target/${id}/${rev}`, this.getHeaders()).pipe(
      map(this.extractData));
  }

  actionApp(app: object, action: string): Observable<any> {
    return this.http.post(endpoint.api + `apigee/developer/apps/${action}`, app, this.getHeaders()).pipe(
      map(this.extractData));
  }
  
  createProxie(proxie: object): Observable<any> {
    return this.http.post(endpoint.api + `apigee/proxie/create`, proxie, this.getHeaders()).pipe(
      map(this.extractData));
  }

  updateMyProxie(proxie: object): Observable<any> {
    return this.http.put(endpoint.api + `apigee/my-proxies/update`, proxie, this.getHeaders()).pipe(
      map(this.extractData));
  }

  autoCreateProduct(proxie: object): Observable<any> {
    return this.http.post(endpoint.api + `apigee/product/autocreate`, proxie, this.getHeaders()).pipe(
      map(this.extractData));
  }

  updateProxie(proxie: object): Observable<any> {
    return this.http.post(endpoint.api + `apigee/proxie/update`, proxie, this.getHeaders()).pipe(
      map(this.extractData));
  }

  hideProduct(product: object): Observable<any> {
    return this.http.put(endpoint.api + `apigee/product/hidden`, product, this.getHeaders()).pipe(
      map(this.extractData));
  }

  deleteProxie(proxie: string): Observable<any> {
    return this.http.delete(endpoint.api + `apigee/proxie/${proxie}`, this.getHeaders()).pipe(
      map(this.extractData));
  }

  deleteProduct(product: string): Observable<any> {
    return this.http.delete(endpoint.api + `apigee/product/${product}`, this.getHeaders()).pipe(
      map(this.extractData));
  }

  deployProxie(proxie: string, revision: string, env: string, status: boolean): Observable<any> {
    let deployProxie = {
      name: proxie,
      revision: revision,
      env: env
    }
    if(status) {
      return this.http.post(endpoint.api + `apigee/proxie/deploy`, deployProxie, this.getHeaders()).pipe(
        map(this.extractData));
    } else {
      return this.http.post(endpoint.api + `apigee/proxie/undeploy`, deployProxie, this.getHeaders()).pipe(
        map(this.extractData));
    }
  }

}
