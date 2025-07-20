import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DatePipe, NgIf, CommonModule } from '@angular/common';
import { SupabaseService } from '../../../services/supabase.service';

@Component({
  selector: 'app-leaderboard',
  standalone: true,
  imports: [RouterLink, FormsModule, DatePipe, NgIf, CommonModule],
  templateUrl: './leaderboard.component.html',
  styleUrl: './leaderboard.component.scss'
})
export class LeaderboardComponent implements OnInit {
  users: any[] = [];
  showSavedToast = false;
  isToastClosing = false;
  lastUpdated: Date | null = null;
  
  // Quick update properties
  searchQuery = '';
  filteredServers: any[] = [];
  selectedServer: any = null;
  quickInputValue = 2;
  showDropdown = false;
  showQuickToast = false;
  isQuickToastClosing = false;

  constructor(private supabase: SupabaseService) {}

  ngOnInit(): void {
    this.loadLeaderboard();
  }

  loadLeaderboard(): void {
    // First get the last update timestamp
    this.supabase.getLastLeaderboardUpdate().then(({ data: updateData }) => {
      if (updateData && updateData.length > 0) {
        this.lastUpdated = new Date(updateData[0].updated_at);
        console.log('Retrieved timestamp from database:', this.lastUpdated);
      } else {
        this.lastUpdated = null;
        console.log('No timestamp found in database');
      }
    });
    
    // Then load the server data
    this.supabase.getServers().then(({ data }) => {
      if (data) {
        this.users = data.map((server: any) => ({
          id: server.id,
          name: server.full_name,
          points: server.points || 0,
          inputValue: 10
        })).sort((a, b) => b.points - a.points);
        
        // Timestamp is already loaded separately
        
        // Update selected server if it exists
        if (this.selectedServer) {
          const updated = this.users.find(u => u.id === this.selectedServer.id);
          if (updated) {
            this.selectedServer = updated;
          }
        }
      }
    });
  }

  addPoints(index: number) {
    const user = this.users[index];
    const newPoints = user.points + user.inputValue;
    this.supabase.updatePoints(user.id, newPoints).then(() => {
      user.points = newPoints;
      this.lastUpdated = new Date();
      this.supabase.updateLeaderboardTimestamp();
    });
  }

  subtractPoints(index: number) {
    const user = this.users[index];
    const newPoints = Math.max(0, user.points - user.inputValue);
    this.supabase.updatePoints(user.id, newPoints).then(() => {
      user.points = newPoints;
      this.lastUpdated = new Date();
      this.supabase.updateLeaderboardTimestamp();
    });
  }

  saveAllPoints() {
    const updates = this.users.map(user => 
      this.supabase.updatePoints(user.id, user.points)
    );
    
    Promise.all(updates).then(() => {
      this.lastUpdated = new Date();
      this.supabase.updateLeaderboardTimestamp();
      
      this.showSavedToast = true;
      this.isToastClosing = false;
      setTimeout(() => {
        this.isToastClosing = true;
        setTimeout(() => {
          this.showSavedToast = false;
          this.isToastClosing = false;
        }, 300);
      }, 2700);
    });
  }
  
  filterServers() {
    if (this.searchQuery.length < 2) {
      this.filteredServers = [];
      this.showDropdown = false;
      return;
    }
    
    this.filteredServers = this.users.filter(user => 
      user.name.toLowerCase().includes(this.searchQuery.toLowerCase())
    ).slice(0, 5);
    this.showDropdown = true;
  }
  
  selectServer(server: any) {
    this.selectedServer = server;
    this.searchQuery = server.name;
    this.showDropdown = false;
  }
  
  quickAddPoints() {
    if (!this.selectedServer) return;
    
    const newPoints = this.selectedServer.points + this.quickInputValue;
    this.updateQuickPoints(newPoints);
  }
  
  quickSubtractPoints() {
    if (!this.selectedServer) return;
    
    const newPoints = Math.max(0, this.selectedServer.points - this.quickInputValue);
    this.updateQuickPoints(newPoints);
  }
  
  updateQuickPoints(newPoints: number) {
    this.supabase.updatePoints(this.selectedServer.id, newPoints).then(() => {
      // Update in the main list
      const userIndex = this.users.findIndex(u => u.id === this.selectedServer.id);
      if (userIndex !== -1) {
        this.users[userIndex].points = newPoints;
        this.selectedServer.points = newPoints;
        this.lastUpdated = new Date();
        this.supabase.updateLeaderboardTimestamp();
      }
      
      // Show toast
      this.showQuickToast = true;
      this.isQuickToastClosing = false;
      setTimeout(() => {
        this.isQuickToastClosing = true;
        setTimeout(() => {
          this.showQuickToast = false;
          this.isQuickToastClosing = false;
        }, 300);
      }, 2000);
    });
  }
  
  refreshTimestamp() {
    this.lastUpdated = new Date();
    this.supabase.updateLeaderboardTimestamp().then(() => {
      this.showQuickToast = true;
      this.isQuickToastClosing = false;
      setTimeout(() => {
        this.isQuickToastClosing = true;
        setTimeout(() => {
          this.showQuickToast = false;
          this.isQuickToastClosing = false;
        }, 300);
      }, 2000);
    });
  }
}
