import { Component } from '@angular/core';
import { HeaderComponent } from '../../shared/header/header.component';
import { FooterComponent } from '../../shared/footer/footer.component';

@Component({
  selector: 'app-information',
  standalone: true,
  imports: [HeaderComponent, FooterComponent],
  templateUrl: './information.component.html',
  styleUrl: './information.component.scss'
})
export class InformationComponent {

}
