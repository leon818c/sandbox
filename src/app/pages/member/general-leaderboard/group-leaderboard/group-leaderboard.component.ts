import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../../../shared/header/header.component';
import { FooterComponent } from '../../../../shared/footer/footer.component';
import { SupabaseService } from '../../../../services/supabase.service';

interface GroupLeaderboard {
  id: number;
  name: string;
  points: number;
  rank: number;
  members: { id: string; name: string; grade: string }[];
}

@Component({
  selector: 'app-group-leaderboard',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, CommonModule],
  templateUrl: './group-leaderboard.component.html',
  styleUrl: './group-leaderboard.component.scss'
})
export class GroupLeaderboardComponent implements OnInit {
  groupLeaderboard: GroupLeaderboard[] = [];
  hoveredGroup: GroupLeaderboard | null = null;
  clickedGroup: GroupLeaderboard | null = null;
  isLoading = true;

  constructor(private supabase: SupabaseService) {}

  ngOnInit() {
    this.loadGroupLeaderboard();
  }

  async loadGroupLeaderboard() {
    const [serversResponse, groupsResponse] = await Promise.all([
      this.supabase.getServers(),
      this.supabase.getGroups()
    ]);

    if (serversResponse.data && groupsResponse.data) {
      const servers = serversResponse.data;
      
      const groupsWithPoints = groupsResponse.data.map((group: any) => {
        const memberPoints = group.member_ids?.reduce((total: number, memberId: string) => {
          const server = servers.find(s => s.id === memberId);
          return total + (server?.points || 0);
        }, 0) || 0;
        
        const groupPoints = group.points || 0;
        const totalPoints = memberPoints + groupPoints;
        
        const members = group.member_ids?.map((memberId: string) => {
          const server = servers.find(s => s.id === memberId);
          return server ? {
            id: server.id,
            name: server.full_name,
            grade: server.grade
          } : null;
        }).filter(Boolean) || [];
        
        return {
          id: group.id,
          name: group.name,
          points: totalPoints,
          members: members
        };
      });
      
      this.groupLeaderboard = groupsWithPoints
        .sort((a, b) => b.points - a.points)
        .map((group, index) => ({
          ...group,
          rank: index + 1
        }));
    }
    setTimeout(() => {
      this.isLoading = false;
    }, 1000);
  }

  showTooltip(group: GroupLeaderboard) {
    if (!this.clickedGroup) {
      this.hoveredGroup = group;
    }
  }

  hideTooltip() {
    if (!this.clickedGroup) {
      this.hoveredGroup = null;
    }
  }

  toggleTooltip(group: GroupLeaderboard) {
    if (this.clickedGroup === group) {
      this.clickedGroup = null;
      this.hoveredGroup = null;
    } else {
      this.clickedGroup = group;
      this.hoveredGroup = group;
    }
  }

  closeTooltip() {
    this.clickedGroup = null;
    this.hoveredGroup = null;
  }
}
