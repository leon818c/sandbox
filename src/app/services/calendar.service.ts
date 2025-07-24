import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface CalendarData {
  [dateKey: string]: string;
}

@Injectable({
  providedIn: 'root'
})
export class CalendarService {
  private calendarDataSubject = new BehaviorSubject<CalendarData>({});
  public calendarData$ = this.calendarDataSubject.asObservable();

  constructor() {
    this.loadCalendarData();
  }

  private loadCalendarData() {
    const saved = localStorage.getItem('calendarCustomText');
    const data = saved ? JSON.parse(saved) : {};
    this.calendarDataSubject.next(data);
  }

  updateCalendarData(dateKey: string, text: string) {
    const currentData = this.calendarDataSubject.value;
    if (text.trim()) {
      currentData[dateKey] = text;
    } else {
      delete currentData[dateKey];
    }
    localStorage.setItem('calendarCustomText', JSON.stringify(currentData));
    this.calendarDataSubject.next({ ...currentData });
  }

  getCalendarData(): CalendarData {
    return this.calendarDataSubject.value;
  }

  getDateKey(date: Date): string {
    return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
  }
}