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
    { name: 'Jacob Alappurathu', image: '/assets/ministers/jalla.jpeg' },
    { name: 'Tomy Cherian', image: '/assets/ministers/tcher.jpeg' },
    { name: 'Joy Karimpal', image: '/assets/ministers/jkar.jpeg' },
    { name: 'Josey Joseph Thalachelloor', image: '/assets/ministers/jjth.jpeg' },
    { name: 'Joy C. Varkey', image: '/assets/ministers/joyvarkey.jpeg' },
    { name: 'Tom Thekkan', image: '/assets/ministers/tthekan.jpeg' },
    { name: 'Santhosh Kurian', image: '/assets/ministers/skurian.jpeg' },
    { name: 'Roy Matthew', image: '/assets/ministers/roym.jpeg' }
  ];
}
