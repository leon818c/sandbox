import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.scss'
})
export class HomepageComponent implements OnInit {
  heroImageUrl = 'https://via.placeholder.com/400x300/667eea/ffffff?text=Discord+Server';

  constructor(private supabaseService: SupabaseService) {}

  async ngOnInit() {
    await this.loadHeroImage();
  }

  async loadHeroImage() {
    try {
      const imageUrl = await this.supabaseService.getHeroImage();
      if (imageUrl) {
        this.heroImageUrl = imageUrl;
      }
    } catch (error) {
      console.error('Error loading hero image:', error);
    }
  }
}
