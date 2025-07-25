import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    );
  }

  getClient() {
    return this.supabase;
  }

  addServer(server: {
    full_name: string;
    grade: string;
    email?: string;
    phone_number?: string;
    parent_email_1?: string;
    parent_email_2?: string;
    parent_number_1?: string;
    parent_number_2?: string;
    // server_since?: string; // e.g., '2025-07-08'
  }) {
    return this.supabase
      .from('servers')
      .insert([server])
      .select();
  }

  getServers() {
    return this.supabase
      .from('servers')
      .select('*');
  }

  deleteServer(serverId: string) {
    return this.supabase
      .from('servers')
      .delete()
      .eq('id', serverId);
  }

  updateServer(serverId: string, server: {
    full_name?: string;
    grade?: string;
    email?: string;
    phone_number?: string;
    parent_email_1?: string;
    parent_email_2?: string;
    parent_number_1?: string;
    parent_number_2?: string;
  }) {
    return this.supabase
      .from('servers')
      .update(server)
      .eq('id', serverId);
  }

  getLeaderboard() {
    return this.supabase
      .from('leaderboard')
      .select('server_id, points, servers (full_name)');
  }

  updatePoints(serverId: string, points: number) {
    return this.supabase
      .from('servers')
      .update({ points })
      .eq('id', serverId);
  }
  
  updateLeaderboardTimestamp() {
    return this.supabase
      .from('leaderboard_updates')
      .upsert({ id: 1, updated_at: new Date().toISOString() })
      .select()
      .then(result => {
        return result;
      });
  }
  
  getLastLeaderboardUpdate() {
    return this.supabase
      .from('leaderboard_updates')
      .select('updated_at')
      .eq('id', 1);
  }

  listenToLeaderboard(callback: Function) {
    return this.supabase
      .channel('custom-leaderboard')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'leaderboard' },
        (payload) => {
          callback(payload);
        }
      )
      .subscribe();
  }

  listenToServers(callback: Function) {
    return this.supabase
      .channel('custom-servers')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'servers' },
        (payload) => {
          callback(payload);
        }
      )
      .subscribe();
  }

  addGroup(group: { name: string; member_ids: string[]; points?: number }) {
    return this.supabase
      .from('groups')
      .insert([{ ...group, points: group.points || 0 }])
      .select();
  }

  getGroups() {
    return this.supabase
      .from('groups')
      .select('*');
  }

  updateGroup(groupId: number, group: { name?: string; member_ids?: string[]; points?: number }) {
    return this.supabase
      .from('groups')
      .update(group)
      .eq('id', groupId);
  }

  deleteGroup(groupId: number) {
    return this.supabase
      .from('groups')
      .delete()
      .eq('id', groupId);
  }

  updateGroupPoints(groupId: number, points: number) {
    return this.supabase
      .from('groups')
      .update({ points })
      .eq('id', groupId);
  }

  getCalendarEntries() {
    return this.supabase
      .from('calendar_entries')
      .select('date_key, custom_text, server_points');
  }

  upsertCalendarEntry(dateKey: string, customText: string, serverPoints?: any) {
    return this.supabase
      .from('calendar_entries')
      .upsert({ 
        date_key: dateKey, 
        custom_text: customText,
        server_points: serverPoints ? JSON.stringify(serverPoints) : null,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'date_key'
      });
  }

  deleteCalendarEntry(dateKey: string) {
    return this.supabase
      .from('calendar_entries')
      .delete()
      .eq('date_key', dateKey);
  }
}
