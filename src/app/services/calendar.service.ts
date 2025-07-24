import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SupabaseService } from './supabase.service';

export interface CalendarData {
  [dateKey: string]: string;
}

@Injectable({
  providedIn: 'root'
})
export class CalendarService {
  private calendarDataSubject = new BehaviorSubject<CalendarData>({});
  public calendarData$ = this.calendarDataSubject.asObservable();

  constructor(private supabase: SupabaseService) {
    this.loadCalendarData();
  }

  private async loadCalendarData() {
    const { data } = await this.supabase.getCalendarEntries();
    
    const calendarData: CalendarData = {};
    if (data) {
      data.forEach(entry => {
        if (entry.custom_text) {
          calendarData[entry.date_key] = entry.custom_text;
        }
      });
    }
    this.calendarDataSubject.next(calendarData);
  }

  async updateCalendarData(dateKey: string, text: string) {
    if (text.trim()) {
      await this.supabase.upsertCalendarEntry(dateKey, text);
    } else {
      await this.supabase.deleteCalendarEntry(dateKey);
    }
    
    // Reload data to update the subject
    await this.loadCalendarData();
  }

  getCalendarData(): CalendarData {
    return this.calendarDataSubject.value;
  }

  getDateKey(date: Date): string {
    return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
  }
}