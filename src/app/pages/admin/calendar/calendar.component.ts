import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ServerService, Server } from '../../../services/server.service';

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
  servers?: {id: string, name: string}[];
}

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss'
})
export class CalendarComponent implements OnInit {
  currentDate = new Date();
  currentMonthYear = '';
  dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  calendarDates: CalendarDate[] = [];
  showEventModal = false;
  showServerModal = false;
  selectedDate: CalendarDate | null = null;
  editingEvent: CalendarEvent | null = null;
  editingIndex: number = -1;
  isEditing = false;
  selectedEventForServer: number = -1;
  selectedServer: any = null;
  servers: Server[] = [];
  searchQuery: string = '';
  filteredServers: Server[] = [];
  showDropdown: boolean = false;
  
  eventTypes = [
    { value: 'sunday-mass', label: 'Sunday Mass' },
    { value: 'weekday-mass', label: 'Weekday Mass' },
    { value: 'malayalam-mass', label: 'Malayalam Mass' },
    { value: 'special', label: 'Special Event' }
  ];
  
  constructor(private serverService: ServerService) {}

  ngOnInit() {
    this.generateCalendar();
    this.loadServers();
  }
  
  loadServers() {
    this.serverService.getServers().subscribe(servers => {
      this.servers = servers;
      this.filteredServers = [...this.servers];
    });
  }
  
  filterServers() {
    if (!this.searchQuery.trim()) {
      this.filteredServers = [...this.servers];
      return;
    }
    
    const query = this.searchQuery.toLowerCase().trim();
    this.filteredServers = this.servers.filter(server => 
      server.name.toLowerCase().includes(query)
    );
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
    this.cancelEdit();
  }
  
  startEdit(event: CalendarEvent, index: number) {
    this.editingEvent = { ...event };
    this.editingIndex = index;
    this.isEditing = true;
  }
  
  cancelEdit() {
    this.editingEvent = null;
    this.editingIndex = -1;
    this.isEditing = false;
  }
  
  saveEdit() {
    if (this.editingEvent && this.selectedDate && this.editingIndex >= 0) {
      this.selectedDate.events[this.editingIndex] = { ...this.editingEvent };
      this.cancelEdit();
      
      // Update the calendar dates array to reflect changes
      this.calendarDates = [...this.calendarDates];
    }
  }
  
  addNewEvent() {
    if (this.selectedDate) {
      const newEvent: CalendarEvent = {
        title: '',
        type: 'special',
        time: ''
      };
      
      this.editingEvent = newEvent;
      this.editingIndex = this.selectedDate.events.length;
      this.selectedDate.events.push(newEvent);
      this.isEditing = true;
    }
  }
  
  deleteEvent(index: number) {
    if (this.selectedDate) {
      this.selectedDate.events.splice(index, 1);
      this.cancelEdit();
      
      // Update the calendar dates array to reflect changes
      this.calendarDates = [...this.calendarDates];
    }
  }
  
  removeServer(eventIndex: number, serverIndex: number) {
    if (this.selectedDate && this.selectedDate.events[eventIndex]?.servers) {
      this.selectedDate.events[eventIndex].servers.splice(serverIndex, 1);
      
      // Update the calendar dates array to reflect changes
      this.calendarDates = [...this.calendarDates];
    }
  }
  
  insertServers() {
    // Refresh the server list before showing the modal
    this.loadServers();
    this.showServerModal = true;
  }
  
  openServerSelection(eventIndex: number) {
    this.selectedEventForServer = eventIndex;
    this.selectedServer = '';
  }
  
  assignServer() {
    if (this.selectedDate && this.selectedEventForServer >= 0 && this.selectedServer) {
      const event = this.selectedDate.events[this.selectedEventForServer];
      
      // Initialize servers array if it doesn't exist
      if (!event.servers) {
        event.servers = [];
      }
      
      // Add the server if it's not already assigned
      const serverExists = event.servers.some(s => s.id === this.selectedServer.id);
      if (!serverExists) {
        event.servers.push({
          id: this.selectedServer.id,
          name: this.selectedServer.name
        });
      }
      
      // Update the calendar dates array to reflect changes
      this.calendarDates = [...this.calendarDates];
      
      this.selectedEventForServer = -1;
      this.selectedServer = null;
      this.searchQuery = '';
      this.closeServerModal();
    }
  }
  
  closeServerModal() {
    this.showServerModal = false;
    this.selectedEventForServer = -1;
    this.selectedServer = null;
    this.searchQuery = '';
    this.showDropdown = false;
  }
  
  selectServer(server: Server) {
    this.selectedServer = server;
    this.searchQuery = server.name;
    this.showDropdown = false;
  }
}
