import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-leaderboard',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './leaderboard.component.html',
  styleUrl: './leaderboard.component.scss'
})
export class LeaderboardComponent implements OnInit {
  leaderboard: any[] = [];

  constructor(private supabase: SupabaseService) {}

  ngOnInit(): void {
    this.loadLeaderboard();
  }

  loadLeaderboard(): void {
    this.supabase.getLeaderboard().then(({ data }) => {
      if (data) {
        this.leaderboard = data
          .map((entry: any) => ({
            name: entry.servers.full_name,
            points: entry.points
          }))
          .sort((a: any, b: any) => b.points - a.points);
      }
    });
  }
}
