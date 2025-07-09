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

  constructor(private supabase: SupabaseService) {}


  users: any[] = [];
  servers: any[] = [];

  ngOnInit(): void {
    this.loadLeaderboard();
    this.loadServers();
  }

  loadLeaderboard(): void {
    this.supabase.getLeaderboard().then(({ data }) => {
      if (data) {
        // Attach inputValue field for UI input
        this.users = data.map((entry: any) => ({
          id: entry.server_id,
          name: entry.servers.full_name,
          points: entry.points,
          inputValue: 10
        }));
      }
    });
  }

  loadServers(): void {
    this.supabase.getServers().then(({ data }) => {
      if (data) {
        this.servers = data;
      }
    });
  }
  

  addPoints(index: number) {
    const user = this.users[index];
    const newPoints = user.points + user.inputValue;
    this.supabase.updatePoints(user.id, newPoints).then(() => {
      user.points = newPoints;
    });
  }
  

  subtractPoints(index: number) {
    const user = this.users[index];
    const newPoints = user.points - user.inputValue;
    this.supabase.updatePoints(user.id, newPoints).then(() => {
      user.points = newPoints;
    });
  }
}
