import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../../services/supabase.service';
import { EditServerComponent } from '../../shared/edit-server/edit-server.component';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [RouterLink, FormsModule, EditServerComponent],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent implements OnInit {
  isAuthenticated = false;
  passwordInput = '';
  private adminPassword = 'admin123'; // Change this to your desired password

  constructor(private supabase: SupabaseService) {}

  users: any[] = [];
  servers: any[] = [];
  groups: any[] = [];
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

  checkPassword(): void {
    if (this.passwordInput === this.adminPassword) {
      this.isAuthenticated = true;
      this.storeAuth();
      this.loadLeaderboard();
      this.loadServers();
      this.loadGroups();
    } else {
      alert('Incorrect password');
      this.passwordInput = '';
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
    console.log('Updating points for user:', user.id, 'to:', newPoints);
    this.supabase.updatePoints(user.id, newPoints).then((result) => {
      console.log('Update result:', result);
      user.points = newPoints;
    })
  }
  

  subtractPoints(index: number) {
    const user = this.users[index];
    const newPoints = Math.max(0, user.points - user.inputValue);
    console.log('Updating points for user:', user.id, 'to:', newPoints);
    this.supabase.updatePoints(user.id, newPoints).then((result) => {
      console.log('Update result:', result);
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
    this.supabase.getGroups().then(({ data }) => {
      if (data) {
        this.groups = data;
      }
    });
  }
}
