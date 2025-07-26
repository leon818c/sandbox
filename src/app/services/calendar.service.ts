import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SupabaseService } from './supabase.service';

export interface CalendarData {
  [dateKey: string]: string;
}

export interface CalendarEntry {
  customText: string;
  serverPoints?: { name: string; points: number }[];
}

@Injectable({
  providedIn: 'root'
})
export class CalendarService {
  private calendarDataSubject = new BehaviorSubject<CalendarData>({});
  public calendarData$ = this.calendarDataSubject.asObservable();
  private serverPointsData: { [dateKey: string]: { name: string; points: number }[] } = {};

  constructor(private supabase: SupabaseService) {
    this.loadCalendarData();
  }

  private async loadCalendarData() {
    const { data } = await this.supabase.getCalendarEntries();
    
    const calendarData: CalendarData = {};
    this.serverPointsData = {};
    
    if (data) {
      data.forEach(entry => {
        if (entry.custom_text) {
          calendarData[entry.date_key] = entry.custom_text;
        }
        
        if (entry.server_points) {
          try {
            this.serverPointsData[entry.date_key] = JSON.parse(entry.server_points);
          } catch (error) {
            console.error('Error parsing server_points for', entry.date_key, error);
          }
        }
      });
    }
    this.calendarDataSubject.next(calendarData);
  }

  async updateCalendarData(dateKey: string, text: string, serverPoints?: { name: string; points: number }[]) {
    
    if (text.trim()) {
      const result = await this.supabase.upsertCalendarEntry(dateKey, text, serverPoints);
    } else {
      await this.supabase.deleteCalendarEntry(dateKey);
    }
    
    // Reload data to update the subject
    await this.loadCalendarData();
  }

  getCalendarData(): CalendarData {
    return this.calendarDataSubject.value;
  }
  
  getServerPoints(dateKey: string): { name: string; points: number }[] | undefined {
    return this.serverPointsData[dateKey];
  }

  getDateKey(date: Date): string {
    return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
  }
}