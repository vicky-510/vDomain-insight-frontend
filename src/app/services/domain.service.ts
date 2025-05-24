import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DomainService {
  private BASE_URL = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getDomainDetails(domain: string): Observable<any> {
    return this.http.get<any>(`${this.BASE_URL}?searchedDomain=${domain}`);
  }

  
}
