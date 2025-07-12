import { Component } from '@angular/core';
import { HeaderComponent } from '../../../shared/header/header.component';
import { FooterComponent } from '../../../shared/footer/footer.component';

@Component({
  selector: 'app-group-leaderboard',
  standalone: true,
  imports: [HeaderComponent, FooterComponent],
  templateUrl: './group-leaderboard.component.html',
  styleUrl: './group-leaderboard.component.scss'
})
export class GroupLeaderboardComponent {

}
