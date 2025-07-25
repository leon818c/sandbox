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
    { name: 'Jacob Alappurathu', image: '/assets/jalla.jpeg' },
    { name: 'Tomy Cherian', image: '/assets/tcher.jpeg' },
    { name: 'Joy Karimpal', image: '/assets/jkar.jpeg' },
    { name: 'Josey Joseph Thalachelloor', image: '/assets/jjth.jpeg' },
    { name: 'Joy C. Varkey', image: '/assets/joyvarkey.jpeg' },
    { name: 'Tom Thekkan', image: '/assets/tthekan.jpeg' },
    { name: 'Santhosh Kurian', image: '/assets/skurian.jpeg' },
    { name: 'Roy Matthew', image: '/assets/placeholder-minister.jpg' }
  ];
}
