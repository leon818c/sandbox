import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../../shared/header/header.component';
import { FooterComponent } from '../../../shared/footer/footer.component';
import { CalendarService } from '../../../services/calendar.service';
import { Subscription } from 'rxjs';

interface CalendarDate {
  day: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  events: CalendarEvent[];
  actualDate: Date;
  customText?: string;
}

interface CalendarEvent {
  title: string;
  type: 'sunday-mass' | 'weekday-mass' | 'malayalam-mass' | 'special';
  time?: string;
}

@Component({
  selector: 'app-schedule',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, CommonModule],
  templateUrl: './schedule.component.html',
  styleUrl: './schedule.component.scss'
})
export class ScheduleComponent implements OnInit, OnDestroy {
  currentDate = new Date();
  currentMonthYear = '';
  dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  calendarDates: CalendarDate[] = [];
  showEventModal = false;
  selectedDate: CalendarDate | null = null;
  private calendarSubscription: Subscription = new Subscription();

  constructor(private calendarService: CalendarService) {}

  ngOnInit() {
    this.generateCalendar();
    this.calendarSubscription = this.calendarService.calendarData$.subscribe(() => {
      this.generateCalendar();
    });
  }

  ngOnDestroy() {
    this.calendarSubscription.unsubscribe();
  }

  generateCalendar() {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    
    this.currentMonthYear = this.currentDate.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric'
    });

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    this.calendarDates = [];
    const today = new Date();
    
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      
      const isCurrentMonth = date.getMonth() === month;
      const isToday = date.toDateString() === today.toDateString();
      
      const dateKey = this.calendarService.getDateKey(date);
      const calendarData = this.calendarService.getCalendarData();
      this.calendarDates.push({
        day: date.getDate(),
        isCurrentMonth,
        isToday,
        events: this.getEventsForDate(date),
        actualDate: new Date(date),
        customText: calendarData[dateKey]
      });
    }
  }

  getEventsForDate(date: Date): CalendarEvent[] {
    return [];
  }

  previousMonth() {
    this.currentDate.setMonth(this.currentDate.getMonth() - 1);
    this.generateCalendar();
  }

  nextMonth() {
    this.currentDate.setMonth(this.currentDate.getMonth() + 1);
    this.generateCalendar();
  }

  openEventModal(date: CalendarDate) {
    this.selectedDate = date;
    this.showEventModal = true;
  }

  getSelectedDateString(): string {
    if (!this.selectedDate) return '';
    const monthName = this.selectedDate.actualDate.toLocaleDateString('en-US', { month: 'long' });
    return `${monthName} ${this.selectedDate.day}`;
  }

  closeEventModal() {
    this.showEventModal = false;
    this.selectedDate = null;
  }
}
