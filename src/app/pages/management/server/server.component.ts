import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../../../services/supabase.service';
import { EditServerComponent } from '../../../shared/edit-server/edit-server.component';

@Component({
  selector: 'app-server',
  standalone: true,
  imports: [RouterLink, FormsModule, EditServerComponent],
  templateUrl: './server.component.html',
  styleUrl: './server.component.scss'
})
export class ServerComponent implements OnInit {
  servers: any[] = [];
  selectAll = false;
  showEditModal = false;
  selectedServer: any = null;
  showHighSchool = true;
  showMiddleSchool = true;
  showCollege = true;
  showWorking = true;
  showDeletedToast = false;
  isToastClosing = false;
  showDeleteConfirm = false;
  serversToDelete: any[] = [];
  showSavedToast = false;
  isSavedToastClosing = false;

  constructor(private supabase: SupabaseService) {}

  ngOnInit(): void {
    this.loadServers();
  }

  loadServers(): void {
    this.supabase.getServers().then(({ data }) => {
      if (data) {
        this.servers = data.map(server => ({ ...server, selected: false }));
      }
    });
  }

  toggleSelectAll() {
    this.servers.forEach(server => server.selected = this.selectAll);
  }

  deleteSelectedServers() {
    const selectedServers = this.servers.filter(server => server.selected);
    if (selectedServers.length === 0) {
      alert('Please select servers to delete');
      return;
    }
    
    this.serversToDelete = selectedServers;
    this.showDeleteConfirm = true;
  }

  confirmDelete() {
    const deletePromises = this.serversToDelete.map(server => 
      this.supabase.deleteServer(server.id)
    );
    
    Promise.all(deletePromises).then(() => {
      this.showDeletedToast = true;
      this.isToastClosing = false;
      setTimeout(() => {
        this.isToastClosing = true;
        setTimeout(() => {
          this.showDeletedToast = false;
          this.isToastClosing = false;
        }, 300);
      }, 2700);
      this.loadServers();
    });
    
    this.showDeleteConfirm = false;
    this.serversToDelete = [];
  }

  cancelDelete() {
    this.showDeleteConfirm = false;
    this.serversToDelete = [];
  }

  editServer(server: any) {
    this.selectedServer = server;
    this.showEditModal = true;
  }

  onSaveServer(event: any) {
    this.supabase.updateServer(event.id, event.data).then(() => {
      this.showSavedToast = true;
      this.isSavedToastClosing = false;
      setTimeout(() => {
        this.isSavedToastClosing = true;
        setTimeout(() => {
          this.showSavedToast = false;
          this.isSavedToastClosing = false;
        }, 300);
      }, 2700);
      this.loadServers();
      this.showEditModal = false;
      this.selectedServer = null;
    });
  }

  onCancelEdit() {
    this.showEditModal = false;
    this.selectedServer = null;
  }

  toggleHighSchool() {
    this.showHighSchool = !this.showHighSchool;
  }

  toggleMiddleSchool() {
    this.showMiddleSchool = !this.showMiddleSchool;
  }

  toggleCollege() {
    this.showCollege = !this.showCollege;
  }

  toggleWorking() {
    this.showWorking = !this.showWorking;
  }

  getHighSchoolServers() {
    return this.servers.filter(server => 
      ['9', '10', '11', '12'].includes(server.grade?.toString())
    );
  }

  getMiddleSchoolServers() {
    return this.servers.filter(server => 
      ['6', '7', '8'].includes(server.grade?.toString())
    );
  }

  getCollegeServers() {
    return this.servers.filter(server => 
      server.grade?.toLowerCase() === 'college'
    );
  }

  getWorkingServers() {
    return this.servers.filter(server => 
      server.grade?.toLowerCase() === 'working'
    );
  }
}
