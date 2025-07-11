import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SupabaseService } from '../../services/supabase.service';
@Component({
  selector: 'app-add-server',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './add-server.component.html',
  styleUrl: './add-server.component.scss'
})
export class AddServerComponent {
  full_name = '';
  grade = '';
  email = '';
  phone_number = '';
  parent_email_1 = '';
  parent_email_2 = '';
  parent_number_1 = '';
  parent_number_2 = '';
  server_since = ''; // optional

  successMessage = '';
  errorMessage = '';

  constructor(private supabase: SupabaseService) {}

  async addServer() {
    const { error } = await this.supabase.addServer({
      full_name: this.full_name,
      grade: this.grade,
      email: this.email,
      phone_number: this.phone_number,
      parent_email_1: this.parent_email_1,
      parent_email_2: this.parent_email_2,
      parent_number_1: this.parent_number_1,
      parent_number_2: this.parent_number_2,
      // server_since: this.server_since || undefined,
    });

    if (error) {
      this.errorMessage = error.message;
      this.successMessage = '';
    } else {
      this.successMessage = 'Server added!';
      this.errorMessage = '';

      // clear the form
      this.full_name = '';
      this.grade = '';
      this.email = '';
      this.phone_number = '';
      this.parent_email_1 = '';
      this.parent_email_2 = '';
      this.server_since = '';
    }
  }
}
