import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DomainService {
  private BASE_URL = environment.apiUrl;
  private _loading = new BehaviorSubject<boolean>(true);
  public loading$ = this._loading.asObservable();

  constructor(private http: HttpClient) { }

  getDomainDetails(domain: string): Observable<any> {
    return this.http.get<any>(`${this.BASE_URL}/vwaran/v2/domain?searchedDomain=${domain}`);
  }

  show() {
    this._loading.next(true);
  }

  hide() {
    this._loading.next(false);
  }

  
}
