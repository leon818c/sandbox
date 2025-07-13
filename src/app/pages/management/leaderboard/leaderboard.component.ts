import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../../../services/supabase.service';

@Component({
  selector: 'app-leaderboard',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './leaderboard.component.html',
  styleUrl: './leaderboard.component.scss'
})
export class LeaderboardComponent implements OnInit {
  users: any[] = [];
  showSavedToast = false;
  isToastClosing = false;

  constructor(private supabase: SupabaseService) {}

  ngOnInit(): void {
    this.loadLeaderboard();
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

  addPoints(index: number) {
    const user = this.users[index];
    const newPoints = user.points + user.inputValue;
    this.supabase.updatePoints(user.id, newPoints).then(() => {
      user.points = newPoints;
    });
  }

  subtractPoints(index: number) {
    const user = this.users[index];
    const newPoints = Math.max(0, user.points - user.inputValue);
    this.supabase.updatePoints(user.id, newPoints).then(() => {
      user.points = newPoints;
    });
  }

  saveAllPoints() {
    const updates = this.users.map(user => 
      this.supabase.updatePoints(user.id, user.points)
    );
    
    Promise.all(updates).then(() => {
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
}
