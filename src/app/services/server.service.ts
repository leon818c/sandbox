import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Server {
  id: string;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class ServerService {
  private apiUrl = '/api/servers';

  constructor(private http: HttpClient) { }

  getServers(): Observable<Server[]> {
    return this.http.get<Server[]>(this.apiUrl);
  }
}