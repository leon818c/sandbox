import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../../../services/supabase.service';
import { EditServerComponent } from '../../../shared/edit-server/edit-server.component';

@Component({
  selector: 'app-admin-landing-page',
  standalone: true,
  imports: [RouterLink, FormsModule, CommonModule, EditServerComponent],
  templateUrl: './admin-landing-page.component.html',
  styleUrl: './admin-landing-page.component.scss'
})
export class AdminLandingPageComponent implements OnInit {
  isAuthenticated = false;
  usernameInput = '';
  passwordInput = '';
  hasPasswordError = false;
  isLoggingIn = false;
  isLoggingOut = false;
  showSuccessAnimation = false;
  private adminUsername = 'adm1n';
  private adminPassword = 'H0lySp1ritDev3l0ps#'; // Change this to your desired password

  constructor(private supabase: SupabaseService) {}

  users: any[] = [];
  servers: any[] = [];
  groups: any[] = [];
  attendanceRecords: number = 0;
  selectAll = false;
  showEditModal = false;
  selectedServer: any = null;
  showHighSchool = true;
  showMiddleSchool = true;
  showCollege = true;
  showWorking = true;

  ngOnInit(): void {
    this.checkStoredAuth();
    if (this.isAuthenticated) {
      this.loadLeaderboard();
      this.loadServers();
      this.loadGroups();
    }
  }

  checkCredentials(): void {
    if (this.usernameInput === this.adminUsername && this.passwordInput === this.adminPassword) {
      this.showSuccessAnimation = true;
      this.hasPasswordError = false;
      
      setTimeout(() => {
        this.isLoggingIn = true;
        this.showSuccessAnimation = false;
        
        setTimeout(() => {
          this.isAuthenticated = true;
          this.isLoggingIn = false;
          this.storeAuth();
          this.loadLeaderboard();
          this.loadServers();
          this.loadGroups();
        }, 800);
      }, 1000);
    } else {
      this.usernameInput = '';
      this.passwordInput = '';
      setTimeout(() => {
        this.hasPasswordError = true;
      }, 0);
    }
  }

  private storeAuth(): void {
    const expiry = new Date().getTime() + (10 * 60 * 1000); // 10 minutes
    localStorage.setItem('adminAuth', expiry.toString());
  }

  private checkStoredAuth(): void {
    const stored = localStorage.getItem('adminAuth');
    if (stored) {
      const expiry = parseInt(stored);
      if (new Date().getTime() < expiry) {
        this.isAuthenticated = true;
      } else {
        localStorage.removeItem('adminAuth');
      }
    }
  }

  loadLeaderboard(): void {
    this.supabase.getServers().then(({ data }) => {
      if (data) {
        this.users = data.map((server: any) => ({
          id: server.id,
          name: server.full_name,
          points: server.points || 0,
          inputValue: 10
        })).sort((a, b) => b.points - a.points);
      }
    });
  }

  loadServers(): void {
    this.supabase.getServers().then(({ data }) => {
      if (data) {
        this.servers = data.map(server => ({ ...server, selected: false }));
      }
    });
  }
  

  addPoints(index: number) {
    const user = this.users[index];
    const newPoints = user.points + user.inputValue;
    this.supabase.updatePoints(user.id, newPoints).then((result) => {
      user.points = newPoints;
    })
  }
  

  subtractPoints(index: number) {
    const user = this.users[index];
    const newPoints = Math.max(0, user.points - user.inputValue);
    this.supabase.updatePoints(user.id, newPoints).then((result) => {
      user.points = newPoints;
    })
  }

  saveAllPoints() {
    const updates = this.users.map(user => 
      this.supabase.updatePoints(user.id, user.points)
    );
    
    Promise.all(updates).then(() => {
      alert('All points saved successfully!');
    }).catch(error => {
      console.error('Error saving points:', error);
      alert('Error saving points. Please try again.');
    });
  }

  toggleSelectAll() {
    this.servers.forEach(server => server.selected = this.selectAll);
  }

  deleteSelectedServers() {
    const selectedServers = this.servers.filter(server => server.selected);
    if (selectedServers.length === 0) {
      alert('Please select servers to delete');
      return;
    }
    
    if (confirm(`Delete ${selectedServers.length} selected server(s)?`)) {
      const deletePromises = selectedServers.map(server => 
        this.supabase.deleteServer(server.id)
      );
      
      Promise.all(deletePromises).then(() => {
        alert('Selected servers deleted successfully!');
        this.loadServers();
        this.loadLeaderboard();
      }).catch(error => {
        console.error('Error deleting servers:', error);
        alert('Error deleting servers. Please try again.');
      });
    }
  }

  editServer(server: any) {
    this.selectedServer = server;
    this.showEditModal = true;
  }

  onSaveServer(event: any) {
    this.supabase.updateServer(event.id, event.data).then(() => {
      alert('Server updated successfully!');
      this.loadServers();
      this.loadLeaderboard();
      this.showEditModal = false;
      this.selectedServer = null;
    })
  }

  onCancelEdit() {
    this.showEditModal = false;
    this.selectedServer = null;
  }

  toggleHighSchool() {
    this.showHighSchool = !this.showHighSchool;
  }

  toggleMiddleSchool() {
    this.showMiddleSchool = !this.showMiddleSchool;
  }

  toggleCollege() {
    this.showCollege = !this.showCollege;
  }

  toggleWorking() {
    this.showWorking = !this.showWorking;
  }

  getHighSchoolServers() {
    return this.servers.filter(server => 
      ['9', '10', '11', '12'].includes(server.grade?.toString())
    );
  }

  getMiddleSchoolServers() {
    return this.servers.filter(server => 
      ['6', '7', '8'].includes(server.grade?.toString())
    );
  }

  getCollegeServers() {
    return this.servers.filter(server => 
      server.grade?.toLowerCase() === 'college'
    );
  }

  getWorkingServers() {
    return this.servers.filter(server => 
      server.grade?.toLowerCase() === 'working'
    );
  }

  loadGroups(): void {
    this.supabase.getGroups().then(({ data }: { data: any }) => {
      if (data) {
        this.groups = data;
      }
    });
  }
  
  logout(): void {
    this.isLoggingOut = true;
    
    setTimeout(() => {
      this.isAuthenticated = false;
      this.isLoggingOut = false;
      this.usernameInput = '';
      this.passwordInput = '';
      localStorage.removeItem('adminAuth');
    }, 800);
  }
}
