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
    
    if (confirm(`Delete ${selectedServers.length} selected server(s)?`)) {
      const deletePromises = selectedServers.map(server => 
        this.supabase.deleteServer(server.id)
      );
      
      Promise.all(deletePromises).then(() => {
        alert('Selected servers deleted successfully!');
        this.loadServers();
      });
    }
  }

  editServer(server: any) {
    this.selectedServer = server;
    this.showEditModal = true;
  }

  onSaveServer(event: any) {
    this.supabase.updateServer(event.id, event.data).then(() => {
      alert('Server updated successfully!');
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
