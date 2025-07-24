import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SupabaseService } from '../../../services/supabase.service';
import { CalendarService } from '../../../services/calendar.service';

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
  servers: any[] = [];
  searchQuery: string = '';
  filteredServers: any[] = [];
  showDropdown: boolean = false;
  highlightedIndex: number = -1;
  serverPointsList: { name: string; points: number }[] = [];
  
  eventTypes = [
    { value: 'sunday-mass', label: 'Sunday Mass' },
    { value: 'weekday-mass', label: 'Weekday Mass' },
    { value: 'malayalam-mass', label: 'Malayalam Mass' },
    { value: 'special', label: 'Special Event' }
  ];
  
  constructor(private supabase: SupabaseService, private calendarService: CalendarService) {}

  ngOnInit() {
    this.generateCalendar();
    this.loadServers();
  }
  
  loadServers() {
    this.supabase.getServers().then(({ data }) => {
      if (data) {
        this.servers = data.map((server: any) => ({
          id: server.id,
          name: server.full_name
        }));
        this.filteredServers = [...this.servers];
      }
    });
  }
  
  filterServers() {
    if (!this.searchQuery.trim()) {
      this.filteredServers = [...this.servers];
      this.highlightedIndex = -1;
      this.showDropdown = this.servers.length > 0;
      return;
    }
    
    const query = this.searchQuery.toLowerCase().trim();
    this.filteredServers = this.servers.filter(server => 
      server.name.toLowerCase().includes(query)
    );
    this.highlightedIndex = -1;
    this.showDropdown = this.filteredServers.length > 0;
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
    this.searchQuery = '';
    this.showDropdown = false;
    this.highlightedIndex = -1;
    this.filteredServers = [...this.servers];
    
    // Initialize serverPointsList from existing custom text
    this.serverPointsList = [];
    if (date.customText) {
      const names = date.customText.split('\n').filter(name => name.trim());
      names.forEach(name => {
        this.serverPointsList.push({ name: name.trim(), points: 2 });
      });
    } else {
      this.serverPointsList.push({ name: '', points: 2 });
    }
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
  
  selectServer(server: any) {
    this.selectedServer = server;
    this.searchQuery = server.name;
    this.showDropdown = false;
  }
  
  addServerToText(server: any) {
    if (this.selectedDate) {
      const currentText = this.selectedDate.customText || '';
      const newText = currentText ? currentText + '\n' + server.name : server.name;
      this.selectedDate.customText = newText;
    }
    this.searchQuery = '';
    this.showDropdown = false;
    this.highlightedIndex = -1;
    this.filteredServers = [...this.servers];
  }
  
  onInputFocus() {
    this.showDropdown = true;
    if (!this.searchQuery.trim()) {
      this.filteredServers = [...this.servers];
    }
  }
  
  onInputBlur() {
    // Delay hiding dropdown to allow click events on dropdown items
    setTimeout(() => {
      this.showDropdown = false;
      this.highlightedIndex = -1;
    }, 200);
  }
  
  onKeyDown(event: KeyboardEvent) {
    if (!this.showDropdown || this.filteredServers.length === 0) return;
    
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.highlightedIndex = Math.min(this.highlightedIndex + 1, this.filteredServers.length - 1);
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.highlightedIndex = Math.max(this.highlightedIndex - 1, 0);
        break;
      case 'Enter':
        event.preventDefault();
        if (this.highlightedIndex >= 0 && this.highlightedIndex < this.filteredServers.length) {
          this.addServerToText(this.filteredServers[this.highlightedIndex]);
        }
        break;
      case 'Escape':
        this.showDropdown = false;
        this.highlightedIndex = -1;
        break;
    }
  }
  
  async saveCustomText() {
    if (this.selectedDate) {
      // Convert serverPointsList to custom text format
      const customText = this.serverPointsList
        .filter(item => item.name.trim())
        .map(item => item.name.trim())
        .join('\n');
      
      this.selectedDate.customText = customText;
      const dateKey = this.calendarService.getDateKey(this.selectedDate.actualDate);
      await this.calendarService.updateCalendarData(dateKey, customText);
      
      // Award individual points
      await this.awardIndividualPoints();
    }
    // Update the calendar dates array to reflect changes
    this.calendarDates = [...this.calendarDates];
    this.closeEventModal();
  }
  
  private async awardIndividualPoints() {
    for (const item of this.serverPointsList) {
      if (item.name.trim() && item.points > 0) {
        const server = this.servers.find(s => s.name === item.name.trim());
        if (server) {
          const newPoints = (server.points || 0) + item.points;
          await this.supabase.updatePoints(server.id, newPoints);
        }
      }
    }
  }
  
  addServerPoint() {
    this.serverPointsList.push({ name: '', points: 2 });
  }
  
  removeServerPoint(index: number) {
    this.serverPointsList.splice(index, 1);
  }
  

}
