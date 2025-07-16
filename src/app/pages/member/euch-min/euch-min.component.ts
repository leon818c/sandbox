import { Component } from '@angular/core';
import { HeaderComponent } from '../../../shared/header/header.component';
import { FooterComponent } from '../../../shared/footer/footer.component';

@Component({
  selector: 'app-euch-min',
  standalone: true,
  imports: [HeaderComponent, FooterComponent],
  templateUrl: './euch-min.component.html',
  styleUrl: './euch-min.component.scss'
})
export class EuchMinComponent {
  ministers = [
    { name: 'John Smith', image: '/assets/placeholder-minister.jpg' },
    { name: 'Mary Johnson', image: '/assets/placeholder-minister.jpg' },
    { name: 'David Wilson', image: '/assets/placeholder-minister.jpg' },
    { name: 'Sarah Davis', image: '/assets/placeholder-minister.jpg' },
    { name: 'Michael Brown', image: '/assets/placeholder-minister.jpg' },
    { name: 'Lisa Garcia', image: '/assets/placeholder-minister.jpg' }
  ];
}
