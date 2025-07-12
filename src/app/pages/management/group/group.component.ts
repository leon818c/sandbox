import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface Server {
  id: number;
  full_name: string;
  grade: string;
  selected?: boolean;
}

interface Group {
  name: string;
  members: Server[];
}

@Component({
  selector: 'app-group',
  standalone: true,
  imports: [RouterModule, FormsModule, CommonModule],
  templateUrl: './group.component.html',
  styleUrl: './group.component.scss'
})
export class GroupComponent implements OnInit {
  showAddGroupModal = false;
  newGroupName = '';
  selectedMemberIds: number[] = [];
  groups: Group[] = [];
  availableServers: Server[] = [];

  ngOnInit() {
    this.loadServers();
  }

  loadServers() {
    // Mock data - replace with actual service call
    this.availableServers = [
      { id: 1, full_name: 'John Doe', grade: '10' },
      { id: 2, full_name: 'Jane Smith', grade: '11' },
      { id: 3, full_name: 'Mike Johnson', grade: '9' },
      { id: 4, full_name: 'Sarah Wilson', grade: '12' },
      { id: 5, full_name: 'David Brown', grade: '8' }
    ];
  }

  closeModal() {
    this.showAddGroupModal = false;
    this.newGroupName = '';
    this.selectedMemberIds = [];
  }

  addGroup() {
    if (!this.newGroupName.trim()) return;
    
    const selectedMembers = this.availableServers.filter(server => 
      this.selectedMemberIds.includes(server.id)
    );
    
    const newGroup: Group = {
      name: this.newGroupName,
      members: selectedMembers
    };
    
    this.groups.push(newGroup);
    this.closeModal();
  }
}
