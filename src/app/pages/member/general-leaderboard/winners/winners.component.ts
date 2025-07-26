import { Component } from '@angular/core';
import { HeaderComponent } from '../../../../shared/header/header.component';
import { FooterComponent } from '../../../../shared/footer/footer.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-winners',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, CommonModule],
  templateUrl: './winners.component.html',
  styleUrl: './winners.component.scss'
})
export class WinnersComponent {
  quarters = [
    {
      name: 'Q2 2025',
      winners: [
        { name: 'Chriswin Jobi', points: 272, position: 1, prize: 'Undecided' },
        { name: 'Dominic Mathew', points: 153, position: 2, prize: 'Undecided' },
        { name: 'Joshua Joseph', points: 131, position: 3, prize: 'Undecided' },
        { name: 'Nathan Mathoor', points: 99, position: 4, prize: 'Undecided' },
        { name: 'Daniel Varghese', points: 93, position: 5, prize: 'Undecided' }
      ]
    },
    {
      name: 'Q1 2025',
      winners: [
        { name: 'Chriswin Jobi', points: 182, position: 1, prize: 'Fortnite V-Bucks' },
        { name: 'Justin Francis', points: 123, position: 2, prize: 'Panda Express Gift Card' },
        { name: 'Alphons Sajesh', points: 102, position: 3, prize: 'Chic-Fil-A Gift Card' },
        { name: 'Nathan Mathoor', points: 100, position: 4, prize: 'Soccer Ball' },
        { name: 'Dominic John', points: 69, position: 5, prize: 'Chic-Fil-A Gift Card' }
      ]
    },
    {
      name: 'Q4 2024',
      winners: [
        { name: 'Chriswin Joby', points: 67, position: 1, prize: 'Fortnite V-Bucks' },
        { name: 'Ved Thuruthippillil', points: 52, position: 2, prize: 'McDonalds Gift Card' },
        { name: 'Nathan Mathoor', points: 47, position: 3, prize: 'Visa Gift Card' }
      ]
    }
  ];

  getPositionText(position: number): string {
    switch(position) {
      case 1: return 'First Place Winner!';
      case 2: return 'Second Place Winner!';
      case 3: return 'Third Place Winner!';
      case 4: return 'Fourth Place';
      case 5: return 'Fifth Place';
      default: return `${position}th Place`;
    }
  }
}
