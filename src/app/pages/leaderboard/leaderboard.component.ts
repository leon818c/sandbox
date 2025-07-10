import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-leaderboard',
  standalone: true,
  imports: [RouterLink, NgClass],
  templateUrl: './leaderboard.component.html',
  styleUrl: './leaderboard.component.scss'
})
export class LeaderboardComponent implements OnInit, OnDestroy {
  leaderboard: any[] = [];
  paginatedLeaderboard: any[] = [];
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 1;
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
        this.updatePagination();
      }
    });
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.leaderboard.length / this.itemsPerPage);
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedLeaderboard = this.leaderboard.slice(startIndex, endIndex);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.updatePagination();
  }
}
