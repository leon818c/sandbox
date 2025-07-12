import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-server',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './edit-server.component.html',
  styleUrl: './edit-server.component.scss'
})
export class EditServerComponent {
  @Input() server: any = null;
  @Input() isVisible: boolean = false;
  @Output() save = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  editedServer: any = {};

  ngOnChanges() {
    if (this.server) {
      this.editedServer = { ...this.server };
    }
  }

  onSave() {
    const updatedServer = {
      full_name: this.editedServer.full_name,
      grade: this.editedServer.grade,
      email: this.editedServer.email || null,
      phone_number: this.editedServer.phone_number || null,
      parent_email_1: this.editedServer.parent_email_1 || null,
      parent_email_2: this.editedServer.parent_email_2 || null,
      parent_number_1: this.editedServer.parent_number_1 || null,
      parent_number_2: this.editedServer.parent_number_2 || null
    };
    this.save.emit({ id: this.server.id, data: updatedServer });
  }

  onCancel() {
    this.cancel.emit();
  }

  onBackdropClick(event: Event) {
    if (event.target === event.currentTarget) {
      this.onCancel();
    }
  }
}
