import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../../../services/supabase.service';

interface Server {
  id: string;
  full_name: string;
  grade: string;
  points?: number;
  selected?: boolean;
}

interface Group {
  id?: number;
  name: string;
  member_ids?: string[];
  members: Server[];
  memberPoints?: number;
  groupPoints?: number;
  totalPoints?: number;
  inputValue?: number;
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
  showEditGroupModal = false;
  newGroupName = '';
  editGroupName = '';
  selectedMemberIds: string[] = [];
  editSelectedMemberIds: string[] = [];
  searchQuery = '';
  editSearchQuery = '';
  filteredServers: Server[] = [];
  editFilteredServers: Server[] = [];
  showSavedToast = false;
  isSavedToastClosing = false;
  showDeletedToast = false;
  isDeletedToastClosing = false;
  showDeleteConfirm = false;
  groupToDelete: Group | null = null;
  validationError = '';
  isValidationErrorClosing = false;
  isModalClosing = false;
  groups: Group[] = [];
  availableServers: Server[] = [];
  editingGroup: Group | null = null;

  constructor(private supabase: SupabaseService) {}

  ngOnInit() {
    this.loadServers().then(() => {
      this.loadGroups();
    });
  }

  async loadServers() {
    const { data } = await this.supabase.getServers();
    if (data) {
      this.availableServers = data.map(server => ({
        id: server.id.toString(),
        full_name: server.full_name,
        grade: server.grade,
        points: server.points || 0
      })).sort((a, b) => a.full_name.localeCompare(b.full_name));
    }
  }

  loadGroups() {
    this.supabase.getGroups().then((response) => {
      console.log('Load groups response:', response);
      if (response.data) {
        this.groups = response.data.map((group: any) => {
          const members = this.availableServers.filter(server => 
            group.member_ids?.includes(server.id)
          );
          const memberPoints = members.reduce((sum, member) => sum + (member.points || 0), 0);
          const groupPoints = group.points || 0;
          
          return {
            id: group.id,
            name: group.name,
            member_ids: group.member_ids,
            memberPoints: memberPoints,
            groupPoints: groupPoints,
            totalPoints: memberPoints + groupPoints,
            members: members,
            inputValue: 10
          };
        });
        console.log('Loaded groups:', this.groups);
        console.log('Groups count:', this.groups.length);
      }
    })
  }

  closeModal() {
    this.isModalClosing = true;
    setTimeout(() => {
      this.showAddGroupModal = false;
      this.showEditGroupModal = false;
      this.newGroupName = '';
      this.editGroupName = '';
      this.selectedMemberIds = [];
      this.editSelectedMemberIds = [];
      this.editingGroup = null;
      this.searchQuery = '';
      this.editSearchQuery = '';
      this.filteredServers = [];
      this.editFilteredServers = [];
      this.validationError = '';
      this.isValidationErrorClosing = false;
      this.isModalClosing = false;
    }, 300);
  }

  filterServers() {
    if (!this.searchQuery.trim()) {
      this.filteredServers = [];
      return;
    }
    this.filteredServers = this.availableServers.filter(server => 
      server.full_name.toLowerCase().includes(this.searchQuery.toLowerCase()) &&
      !this.selectedMemberIds.includes(server.id)
    ).slice(0, 5);
  }

  filterEditServers() {
    if (!this.editSearchQuery.trim()) {
      this.editFilteredServers = [];
      return;
    }
    this.editFilteredServers = this.availableServers.filter(server => 
      server.full_name.toLowerCase().includes(this.editSearchQuery.toLowerCase()) &&
      !this.editSelectedMemberIds.includes(server.id)
    ).slice(0, 5);
  }

  addMember(serverId: string) {
    this.selectedMemberIds.push(serverId);
    this.searchQuery = '';
    this.filteredServers = [];
  }

  removeMember(serverId: string) {
    this.selectedMemberIds = this.selectedMemberIds.filter(id => id !== serverId);
  }

  addEditMember(serverId: string) {
    this.editSelectedMemberIds.push(serverId);
    this.editSearchQuery = '';
    this.editFilteredServers = [];
  }

  removeEditMember(serverId: string) {
    this.editSelectedMemberIds = this.editSelectedMemberIds.filter(id => id !== serverId);
  }

  getServerName(serverId: string): string {
    const server = this.availableServers.find(s => s.id === serverId);
    return server ? server.full_name : 'Unknown';
  }

  addGroup() {
    this.validationError = '';
    
    if (!this.newGroupName.trim()) {
      this.validationError = 'Please enter a group name.';
      this.isValidationErrorClosing = false;
      setTimeout(() => {
        this.isValidationErrorClosing = true;
        setTimeout(() => {
          this.validationError = '';
          this.isValidationErrorClosing = false;
        }, 300);
      }, 2700);
      return;
    }
    
    if (this.selectedMemberIds.length < 2) {
      this.validationError = 'Please add at least 2 members';
      this.isValidationErrorClosing = false;
      setTimeout(() => {
        this.isValidationErrorClosing = true;
        setTimeout(() => {
          this.validationError = '';
          this.isValidationErrorClosing = false;
        }, 300);
      }, 2700);
      return;
    }
    
    console.log('Adding group with data:', {
      name: this.newGroupName,
      member_ids: this.selectedMemberIds
    });
    
    const groupData = {
      name: this.newGroupName,
      member_ids: this.selectedMemberIds
    };
    
    this.supabase.addGroup(groupData).then((response: any) => {
      console.log('Add group response:', response);
      if (response.error) {
        console.error('Error adding group:', response.error);
        alert('Error adding group: ' + response.error.message);
        return;
      }
      console.log('Group added successfully, reloading groups...');
      this.loadGroups();
      this.closeModal();
    })
  }

  editGroup(group: Group) {
    this.editingGroup = group;
    this.editGroupName = group.name;
    this.editSelectedMemberIds = [...(group.member_ids || [])];
    this.showEditGroupModal = true;
  }

  updateGroup() {
    if (!this.editGroupName.trim() || !this.editingGroup?.id) return;
    
    const groupData = {
      name: this.editGroupName,
      member_ids: this.editSelectedMemberIds
    };
    
    this.supabase.updateGroup(this.editingGroup.id, groupData).then((response: any) => {
      if (response.error) {
        alert('Error updating group: ' + response.error.message);
        return;
      }
      this.showSavedToast = true;
      this.isSavedToastClosing = false;
      setTimeout(() => {
        this.isSavedToastClosing = true;
        setTimeout(() => {
          this.showSavedToast = false;
          this.isSavedToastClosing = false;
        }, 300);
      }, 2700);
      this.loadGroups();
      this.closeModal();
    });
  }

  deleteGroup(group: Group) {
    if (!group.id) return;
    this.groupToDelete = group;
    this.showDeleteConfirm = true;
  }

  confirmDelete() {
    if (!this.groupToDelete?.id) return;
    
    this.supabase.deleteGroup(this.groupToDelete.id).then((response: any) => {
      if (response.error) {
        alert('Error deleting group: ' + response.error.message);
        return;
      }
      this.showDeletedToast = true;
      this.isDeletedToastClosing = false;
      setTimeout(() => {
        this.isDeletedToastClosing = true;
        setTimeout(() => {
          this.showDeletedToast = false;
          this.isDeletedToastClosing = false;
        }, 300);
      }, 2700);
      this.loadGroups();
    });
    
    this.showDeleteConfirm = false;
    this.groupToDelete = null;
  }

  cancelDelete() {
    this.showDeleteConfirm = false;
    this.groupToDelete = null;
  }

  addGroupPoints(group: Group) {
    if (!group.id) return;
    
    const newPoints = (group.groupPoints || 0) + (group.inputValue || 10);
    this.supabase.updateGroupPoints(group.id, newPoints).then((response: any) => {
      if (response.error) {
        alert('Error updating group points: ' + response.error.message);
        return;
      }
      this.loadGroups();
    });
  }

  subtractGroupPoints(group: Group) {
    if (!group.id) return;
    
    const newPoints = Math.max(0, (group.groupPoints || 0) - (group.inputValue || 10));
    this.supabase.updateGroupPoints(group.id, newPoints).then((response: any) => {
      if (response.error) {
        alert('Error updating group points: ' + response.error.message);
        return;
      }
      this.loadGroups();
    });
  }
}
