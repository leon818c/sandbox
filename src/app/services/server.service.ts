import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface Server {
  id: string;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class ServerService {
  private apiUrl = '/api/servers'; // Replace with your actual API endpoint

  constructor() { }

  getServers(): Observable<Server[]> {
    // In a real app, uncomment this to fetch from your API
    // return this.http.get<Server[]>(this.apiUrl);
    
    // For now, return mock data
    return of([
      { id: '1', name: 'John Smith' },
      { id: '2', name: 'Maria Garcia' },
      { id: '3', name: 'David Johnson' },
      { id: '4', name: 'Sarah Williams' },
      { id: '5', name: 'Michael Brown' },
      { id: '6', name: 'Jennifer Davis' }
    ]);
  }
}