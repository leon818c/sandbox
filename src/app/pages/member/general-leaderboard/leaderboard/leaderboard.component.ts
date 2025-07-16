import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from '../../../../shared/header/header.component';
import { FooterComponent } from '../../../../shared/footer/footer.component';

@Component({
  selector: 'app-leaderboard',
  standalone: true,
  imports: [RouterLink, HeaderComponent, FooterComponent],
  templateUrl: './leaderboard.component.html',
  styleUrl: './leaderboard.component.scss'
})
export class LeaderboardComponent {

}
