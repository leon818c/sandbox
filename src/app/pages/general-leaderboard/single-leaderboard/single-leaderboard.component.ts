import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SupabaseService } from '../../../services/supabase.service';
import { HeaderComponent } from '../../../shared/header/header.component';
import { FooterComponent } from '../../../shared/footer/footer.component';

@Component({
  selector: 'app-single-leaderboard',
  standalone: true,
  imports: [HeaderComponent, FooterComponent],
  templateUrl: './single-leaderboard.component.html',
  styleUrl: './single-leaderboard.component.scss'
})
export class SingleLeaderboardComponent implements OnInit, OnDestroy {
  leaderboard: any[] = [];
  private subscription: any;

  constructor(private supabase: SupabaseService) {}

  ngOnInit(): void {
    this.loadLeaderboard();
    this.subscription = this.supabase.listenToServers(() => {
      console.log('Servers update received');
      this.loadLeaderboard();
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  loadLeaderboard(): void {
    this.supabase.getServers().then(({ data }) => {
      if (data) {
        this.leaderboard = data
          .map((server: any) => ({
            name: server.full_name,
            points: server.points || 0
          }))
          .sort((a: any, b: any) => b.points - a.points);
      }
    });
  }
}
