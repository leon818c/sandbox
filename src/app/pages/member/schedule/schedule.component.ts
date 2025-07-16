import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../../shared/header/header.component';
import { FooterComponent } from '../../../shared/footer/footer.component';

interface CalendarDate {
  day: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  events: CalendarEvent[];
  actualDate: Date;
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
export class ScheduleComponent implements OnInit {
  currentDate = new Date();
  currentMonthYear = '';
  dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  calendarDates: CalendarDate[] = [];
  showEventModal = false;
  selectedDate: CalendarDate | null = null;

  ngOnInit() {
    this.generateCalendar();
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
      
      this.calendarDates.push({
        day: date.getDate(),
        isCurrentMonth,
        isToday,
        events: this.getEventsForDate(date),
        actualDate: new Date(date)
      });
    }
  }

  getEventsForDate(date: Date): CalendarEvent[] {
    const events: CalendarEvent[] = [];
    
    // Sunday Masses
    if (date.getDay() === 0) {
      events.push({ title: '7:00 AM Mass (Mal)', type: 'malayalam-mass' });
      events.push({ title: '9:00 AM Mass (Mal)', type: 'malayalam-mass' });
      events.push({ title: '11:00 AM Mass (Eng)', type: 'sunday-mass' });
    }
    
    // Monday - Thursday 7pm English Mass
    if ([1, 2, 3, 4].includes(date.getDay())) {
      events.push({ title: '8:30 AM Mass (Mal)', type: 'malayalam-mass' });
      events.push({ title: '7:00 PM Mass (Eng)', type: 'weekday-mass' });
    }
    
    // Friday
    if (date.getDay() === 5) {
      events.push({ title: '8:30 AM Mass (Mal)', type: 'malayalam-mass' });
      
      // Every second Friday 7pm English Mass
      const firstFriday = new Date(date.getFullYear(), date.getMonth(), 1);
      while (firstFriday.getDay() !== 5) {
        firstFriday.setDate(firstFriday.getDate() + 1);
      }
      const secondFriday = new Date(firstFriday);
      secondFriday.setDate(firstFriday.getDate() + 7);
      
      if (date.getDate() === secondFriday.getDate()) {
        events.push({ title: '7:00 PM Mass (Eng)', type: 'weekday-mass' });
      }
    }
    
    // Saturday
    if (date.getDay() === 6) {
      events.push({ title: '8:30 AM Mass (Mal)', type: 'malayalam-mass' });
    }
    
    return events;
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
