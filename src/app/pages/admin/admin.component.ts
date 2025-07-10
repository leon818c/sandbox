import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent {
  isAuthenticated = false;
  passwordInput = '';
  private adminPassword = 'admin123'; // Change this to your desired password

  constructor(private supabase: SupabaseService) {}

  users: any[] = [];
  servers: any[] = [];
  selectAll = false;
  selectedFile: File | null = null;

  ngOnInit(): void {
    this.checkStoredAuth();
    if (this.isAuthenticated) {
      this.loadLeaderboard();
      this.loadServers();
    }
  }

  checkStoredAuth(): void {
    const authData = localStorage.getItem('adminAuth');
    if (authData) {
      const { timestamp } = JSON.parse(authData);
      const now = Date.now();
      const tenMinutes = 10 * 60 * 1000;
      
      if (now - timestamp < tenMinutes) {
        this.isAuthenticated = true;
      } else {
        localStorage.removeItem('adminAuth');
      }
    }
  }

  checkPassword(): void {
    if (this.passwordInput === this.adminPassword) {
      this.isAuthenticated = true;
      localStorage.setItem('adminAuth', JSON.stringify({ timestamp: Date.now() }));
      this.loadLeaderboard();
      this.loadServers();
    } else {
      alert('Incorrect password');
      this.passwordInput = '';
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
        }));
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

  onImageSelect(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  async uploadImage() {
    if (!this.selectedFile) return;
    
    try {
      await this.supabase.uploadHeroImage(this.selectedFile);
      alert('Image uploaded successfully!');
      this.selectedFile = null;
      // Reset file input
      const fileInput = document.querySelector('.file-input') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading image. Please try again.');
    }
  }
}
